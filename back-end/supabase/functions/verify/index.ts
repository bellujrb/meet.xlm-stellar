// @ts-ignore - Deno import
import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { getSupabaseClient } from "../shared/supabase-client.ts"
import { createLogger } from "../shared/logger.ts"
import { extractWalletAddress, validateWalletAddress } from "../shared/auth.ts"
import { createErrorResponse, createSuccessResponse, ErrorCode, AppError } from "../shared/error-handler.ts"
import { handleCorsPreFlight } from "../shared/cors.ts"

const logger = createLogger("save-zk-proof")

serve(async (req: Request) => {
  // Handle CORS preflight
  const corsResponse = handleCorsPreFlight(req)
  if (corsResponse) return corsResponse

  if (req.method !== "POST") {
    return createErrorResponse("Method not allowed", 405)
  }

  try {
    // ###############################################################
    console.log("1. receive request")
    
    // Extract and validate wallet address
    const walletAddress = extractWalletAddress(req)
    const auth = validateWalletAddress(walletAddress)
    if (!auth.valid || !auth.walletAddress) {
      return createErrorResponse("Missing or invalid x-wallet-address header", 401, ErrorCode.UNAUTHORIZED)
    }

    // Parse request body
    let body: Record<string, unknown>
    try {
      body = await req.json()
    } catch {
      return createErrorResponse("Invalid JSON body", 400)
    }

    const { proof, publicInputs, vk, threshold, proofB64 } = body

    // ###############################################################
    console.log("2. validate input")
    
    if (!publicInputs || (!proof && !proofB64) || !threshold) {
      return createErrorResponse("Invalid proof data. Missing proof, publicInputs, or threshold", 400)
    }

    // ###############################################################
    console.log("3. convert data to array")
    
    let proofUint8Array: Uint8Array
    let vkUint8Array: Uint8Array | null = null

    // Convert proof from base64 or array
    if (proofB64 && typeof proofB64 === "string") {
      // Convert from base64
      const binaryString = atob(proofB64)
      proofUint8Array = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        proofUint8Array[i] = binaryString.charCodeAt(i)
      }
    } else if (proof && Array.isArray(proof)) {
      // Convert from array
      proofUint8Array = new Uint8Array(Object.values(proof))
    } else if (proof && typeof proof === "object") {
      // Convert from object with numeric keys
      proofUint8Array = new Uint8Array(Object.values(proof))
    } else {
      return createErrorResponse("Invalid proof format. Expected base64 string or array", 400)
    }

    // Convert vk if provided
    if (vk) {
      if (Array.isArray(vk)) {
        vkUint8Array = new Uint8Array(Object.values(vk))
      } else if (typeof vk === "object") {
        vkUint8Array = new Uint8Array(Object.values(vk))
      }
    }

    // Ensure publicInputs is an array
    const publicInputsArray = Array.isArray(publicInputs) 
      ? publicInputs.map(Number)
      : [Number(publicInputs)]

    // ###############################################################
    console.log("4. load circuit")
    
    // Load circuit from environment or fetch from a known location
    // For now, we'll try to load from a URL or use a circuit stored in the function
    let circuit: { bytecode: string } | null = null
    
    try {
      // @ts-ignore - Deno global
      const circuitBase64 = Deno.env.get("CIRCUIT_BYTECODE_B64")
      if (circuitBase64) {
        const circuitJson = atob(circuitBase64)
        circuit = JSON.parse(circuitJson)
      } else {
        // Try to fetch from a public URL (you can configure this)
        // @ts-ignore - Deno global
        const circuitUrl = Deno.env.get("CIRCUIT_URL") || "https://your-domain.com/zk_noir_circuit.json"
        const circuitRes = await fetch(circuitUrl)
        if (circuitRes.ok) {
          circuit = await circuitRes.json()
        }
      }
    } catch (error) {
      console.warn("Could not load circuit for verification:", error)
      // Continue without verification - we'll still save the proof
    }

    // ###############################################################
    console.log("5. verify proof")
    
    let verificationResult = false
    let verificationError: string | null = null

    // Verify proof locally if circuit is available
    if (circuit && circuit.bytecode) {
      try {
        // @ts-ignore - Dynamic import
        const { UltraHonkBackend } = await import("https://esm.sh/@aztec/bb.js@0.87.0")
        const backend = new UltraHonkBackend(circuit.bytecode)
        verificationResult = await backend.verifyProof({
          proof: proofUint8Array,
          publicInputs: publicInputsArray,
        })
        
        if (!verificationResult) {
          verificationError = "Proof verification failed"
          console.warn("Proof verification failed")
          return createErrorResponse("Proof verification failed", 400)
        } else {
          console.log("✅ Proof verified successfully")
        }
      } catch (verifyError) {
        console.warn("Proof verification error:", verifyError)
        verificationError = verifyError instanceof Error ? verifyError.message : "Verification error"
        // Continue - we'll still try to submit to zkVerify
      }
    } else {
      // Use isValid from request if circuit not available
      if (typeof body.isValid === "boolean") {
        verificationResult = body.isValid
        if (!verificationResult) {
          verificationError = "Client-side verification failed"
          return createErrorResponse("Proof verification failed", 400)
        }
      } else {
        console.warn("⚠️ Circuit not available and no isValid flag, skipping verification")
      }
    }

    // Require vk for zkVerify submission
    if (!vkUint8Array) {
      return createErrorResponse("Verification key (vk) is required for zkVerify submission", 400)
    }

    // ###############################################################
    console.log("6. convert proof and vk to hex")
    
    // Import conversion functions
    // @ts-ignore - Dynamic import
    const { convertProof, convertVerificationKey } = await import("https://esm.sh/olivmath-ultraplonk-zk-verify@latest")
    
    const proofHex = convertProof(proofUint8Array)
    const vkHex = convertVerificationKey(vkUint8Array)

    // ###############################################################
    console.log("7. submit to zkVerify")
    
    // Variables for zkVerify result
    let zkVerifyTxHash: string | null = null
    let zkVerifySuccess = false
    let zkVerifyError: string | null = null
    
    // @ts-ignore - Deno global
    const seed = Deno.env.get("ZKVERIFY_SEED")
    if (seed) {
      try {
        // Import zkverifyjs
        // @ts-ignore - Dynamic import
        const { zkVerifySession } = await import("https://esm.sh/zkverifyjs@latest")
        
        // Initialize session
        const session = await zkVerifySession.start().Volta().withAccount(seed)
        const accountInfo = await session.getAccountInfo()
        
        console.log(`✅ zkVerify session initialized:`, {
          address: accountInfo[0].address,
          nonce: accountInfo[0].nonce,
          balance: accountInfo[0].freeBalance,
        })

        // Submit to zkVerify
        const { events } = await session
          .verify()
          .ultraplonk({ numberOfPublicInputs: publicInputsArray.length })
          .execute({
            proofData: {
              vk: vkHex,
              proof: proofHex,
              publicSignals: publicInputsArray,
            },
          })

        // ###############################################################
        console.log("8. wait for zkVerify response")
        
        // Wait for zkVerify response
        const zkVerifyResult = await new Promise<{ txHash: string; success: boolean; error?: string }>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error("zkVerify timeout after 60 seconds"))
          }, 60000)

          events.once("includedInBlock", (info: unknown) => {
            console.log("Transaction included in block:", info)
          })

          events.once("error", (err: Error) => {
            clearTimeout(timeout)
            console.error("Error in zkVerify transaction:", err)
            resolve({
              txHash: "",
              success: false,
              error: err.message,
            })
          })

          events.once("finalized", (data: { txHash: string }) => {
            clearTimeout(timeout)
            console.log("9. proof finalized on zkVerify")
            resolve({
              txHash: data.txHash,
              success: true,
            })
          })
        })

        if (!zkVerifyResult.success) {
          await logger.warn("zkVerify submission failed", { error: zkVerifyResult.error })
          zkVerifyError = zkVerifyResult.error || "zkVerify submission failed"
          zkVerifySuccess = false
        } else {
          console.log("✅ zkVerify finalized:", zkVerifyResult.txHash)
          zkVerifyTxHash = zkVerifyResult.txHash
          zkVerifySuccess = true
        }
      } catch (zkVerifyError) {
        console.error("zkVerify error:", zkVerifyError)
        await logger.error("zkVerify submission failed", { error: zkVerifyError instanceof Error ? zkVerifyError.message : String(zkVerifyError) })
        zkVerifyError = zkVerifyError instanceof Error ? zkVerifyError.message : "zkVerify error"
        zkVerifySuccess = false
      }
    } else {
      await logger.warn("ZKVERIFY_SEED not configured, skipping zkVerify submission")
    }

    // ###############################################################
    console.log("10. save to database (after zkVerify)")
    
    // Now save to database after zkVerify (whether it succeeded or not)
    const supabase = getSupabaseClient()
    const zkId = crypto.randomUUID()

    // Convert threshold from stroops to XLM if needed (assuming it's in stroops)
    // 1 XLM = 10,000,000 stroops
    const thresholdXlm = typeof threshold === "number" 
      ? threshold / 10000000 
      : parseFloat(threshold as string) / 10000000

    // Prepare proof_b64 if not already provided
    const proofB64ToSave = proofB64 || btoa(String.fromCharCode(...proofUint8Array))

    // Insert into zk_proofs table
    const { data: savedProof, error: insertError } = await supabase
      .from("zk_proofs")
      .insert({
        zk_id: zkId,
        user_wallet: auth.walletAddress,
        proof_b64: proofB64ToSave,
        public_inputs: publicInputsArray,
        threshold: thresholdXlm,
        is_valid: verificationResult && zkVerifySuccess,
        zkverify_tx_hash: zkVerifyTxHash,
        metadata: {
          verification_error: verificationError,
          proof_length: proofUint8Array.length,
          has_vk: !!vkUint8Array,
          zkverify_success: zkVerifySuccess,
          zkverify_error: zkVerifyError,
        },
      })
      .select()
      .single()

    if (insertError) {
      await logger.error("Database insert failed", { error: insertError.message })
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        "Failed to save ZK proof",
        500
      )
    }

    // ###############################################################
    console.log("11. return success")
    
    await logger.info("ZK proof saved successfully", {
      zkId,
      walletAddress: auth.walletAddress,
      verified: verificationResult,
      zkverifySuccess: zkVerifySuccess,
      zkverifyTxHash: zkVerifyTxHash,
    })

    const response = {
      message: zkVerifySuccess 
        ? "ZK proof verified on zkVerify and saved successfully"
        : "ZK proof saved successfully",
      zk_id: zkId,
      verified: verificationResult && zkVerifySuccess,
      zkverify_tx_hash: zkVerifyTxHash,
      saved_at: savedProof.created_at,
    }

    return createSuccessResponse(response, 201)
  } catch (err) {
    if (err instanceof AppError) {
      return createErrorResponse(err.message, err.statusCode, err.code)
    }
    console.error("Error saving ZK proof:", err)
    return createErrorResponse("Internal server error", 500)
  }
})

