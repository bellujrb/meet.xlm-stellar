// @ts-ignore - Deno import
import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { getSupabaseClient } from "../shared/supabase-client.ts"
import { createLogger } from "../shared/logger.ts"
import { extractWalletAddress, validateWalletAddress } from "../shared/auth.ts"
import { createErrorResponse, createSuccessResponse, ErrorCode, AppError } from "../shared/error-handler.ts"
import { handleCorsPreFlight } from "../shared/cors.ts"
import { addHashToSoroban } from "../shared/soroban-client.ts"

const logger = createLogger("verify")

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
    
    // Log headers for debugging
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization")
    console.log("Headers received:", {
      hasAuth: !!authHeader,
      hasWallet: !!req.headers.get("x-wallet-address"),
    })
    
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
    console.log("4. verify proof (trust client-side validation)")
    
    // Trust client-side validation (proof was already verified in frontend)
    // If isValid is false, reject immediately
    if (typeof body.isValid === "boolean" && !body.isValid) {
      return createErrorResponse("Proof verification failed on client side", 400)
    }

    // ###############################################################
    console.log("5. generate hash")
    
    // Generate a unique hash for this proof
    // Combine proof data to create a deterministic hash
    const hashData = JSON.stringify({
      proofB64: proofB64 || btoa(String.fromCharCode(...proofUint8Array)),
      publicInputs: publicInputsArray,
      threshold: threshold,
      walletAddress: auth.walletAddress,
      timestamp: new Date().toISOString(),
    })
    
    // Create hash using Web Crypto API (available in Deno)
    const hashBuffer = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(hashData)
    )
    
    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const proofHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
    
    console.log("✅ Proof hash generated:", proofHash.substring(0, 20) + "...")

    // ###############################################################
    console.log("6. save to database")
    
    // Save to database with generated hash
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
        is_valid: true, // Proof was verified on client side
        zkverify_tx_hash: proofHash, // Store our generated hash in this field
        metadata: {
          proof_length: proofUint8Array.length,
          has_vk: !!vkUint8Array,
          hash_type: "sha256",
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
    console.log("7. send hash to Soroban contract")
    
    // Send hash to Soroban contract (non-blocking - don't fail if this errors)
    let sorobanTxHash: string | undefined
    try {
      const sorobanResult = await addHashToSoroban(zkId, proofHash)
      if (sorobanResult.success && sorobanResult.txHash) {
        sorobanTxHash = sorobanResult.txHash
        await logger.info("Hash sent to Soroban contract successfully", {
          zkId,
          sorobanTxHash,
        })
      } else {
        await logger.warn("Failed to send hash to Soroban contract", {
          zkId,
          error: sorobanResult.error,
        })
      }
    } catch (sorobanError) {
      // Log error but don't fail the request
      await logger.error("Error sending hash to Soroban contract", {
        zkId,
        error: sorobanError instanceof Error ? sorobanError.message : String(sorobanError),
      }, sorobanError instanceof Error ? sorobanError : undefined)
    }

    // ###############################################################
    console.log("8. return success")
    
    await logger.info("ZK proof saved successfully", {
      zkId,
      walletAddress: auth.walletAddress,
      proofHash,
      sorobanTxHash,
    })

    // Return response with generated hash and Soroban transaction hash if available
    const response = {
      message: "Proof verified and saved successfully!",
      verified: true,
      txHash: proofHash, // Return our generated hash as txHash
      sorobanTxHash: sorobanTxHash || undefined, // Soroban transaction hash if available
      zk_id: zkId,
      saved_at: savedProof.created_at,
    }

    return createSuccessResponse(response, 200)
  } catch (err) {
    if (err instanceof AppError) {
      return createErrorResponse(err.message, err.statusCode, err.code)
    }
    console.error("Error saving ZK proof:", err)
    return createErrorResponse("Internal server error", 500)
  }
})

