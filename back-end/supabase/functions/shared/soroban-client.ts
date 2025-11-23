// @ts-ignore - Deno import
import { Client, networks } from "./verifier-lib.ts"
// @ts-ignore - Deno import - import entire module and extract Keypair
import * as StellarSDK from "https://esm.sh/@stellar/stellar-sdk@14.1.1"

// Extract Keypair from StellarSDK (esm.sh may export differently)
const Keypair = StellarSDK.Keypair || (StellarSDK as any).default?.Keypair || (StellarSDK as any).Keypair
if (!Keypair) {
  throw new Error('Failed to load Keypair from Stellar SDK')
}
// @ts-ignore - Deno import
import { Buffer } from "https://esm.sh/buffer@6.0.3"
import { createLogger } from "./logger.ts"

// @ts-ignore - Deno global
declare const Deno: {
  env: {
    get(key: string): string | undefined
  }
}

const logger = createLogger("soroban-client")

// Contract configuration
const CONTRACT_ID = "CCBMKHFNQNZGDO7UYWURJ3GE3TK566QCW7QXFP46JYX4IUVVDWLQNF57"

// Network configuration - defaults to testnet
const getNetworkConfig = () => {
  const network = Deno.env.get("SOROBAN_NETWORK") || "testnet"
  const rpcUrl = Deno.env.get("SOROBAN_RPC_URL") || 
    (network === "testnet" 
      ? "https://soroban-testnet.stellar.org:443"
      : "https://soroban-futurenet.stellar.org:443")
  
  const networkPassphrase = Deno.env.get("SOROBAN_NETWORK_PASSPHRASE") ||
    (network === "testnet"
      ? "Test SDF Network ; September 2015"
      : networks.futurenet.networkPassphrase)

  return { rpcUrl, networkPassphrase, network }
}

/**
 * Converts a hex string to a 32-byte Buffer
 */
function hexToBuffer32(hex: string): Buffer {
  // Remove '0x' prefix if present
  const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex
  
  if (cleanHex.length !== 64) {
    throw new Error(`Invalid hash length: expected 64 hex characters (32 bytes), got ${cleanHex.length}`)
  }

  const buffer = Buffer.from(cleanHex, "hex")
  if (buffer.length !== 32) {
    throw new Error(`Buffer conversion failed: expected 32 bytes, got ${buffer.length}`)
  }

  return buffer
}

// Default secret key (hardcoded for this project)
// SECRET KEY: SAKQJK2HXSU5CZAWUGCHLT55GK6BUEBS4DCWVW3MSS7QGKLGGFOJK74F
// PUBLIC KEY: GC5VQVELE3LG2CJW4YBXT4KLIV5YNF3YFTXXU5IWYVGF3GJVNCIH6FAY
const DEFAULT_SECRET_KEY = "SAKQJK2HXSU5CZAWUGCHLT55GK6BUEBS4DCWVW3MSS7QGKLGGFOJK74F"

/**
 * Gets the secret key from environment or uses the default
 */
function getSecretKey(): string {
  // Try to get secret key from environment first
  const secretKey = Deno.env.get("SOROBAN_SECRET_KEY")
  if (secretKey) {
    return secretKey
  }
  
  // Use default secret key
  return DEFAULT_SECRET_KEY
}

/**
 * Creates a Soroban contract client
 * @param keypair - Optional keypair for signing transactions. Required for write operations.
 */
function createSorobanClient(keypair?: any): Client {
  const { rpcUrl, networkPassphrase, network } = getNetworkConfig()
  
  logger.info("Creating Soroban client", {
    contractId: CONTRACT_ID,
    rpcUrl,
    network,
    networkPassphrase: networkPassphrase.substring(0, 20) + "...",
    hasKeypair: !!keypair,
  }).catch(() => {}) // Fire and forget
  
  const clientOptions: any = {
    contractId: CONTRACT_ID,
    networkPassphrase,
    rpcUrl,
  }
  
  // Add signTransaction function if keypair is provided
  if (keypair) {
    const signTransaction = async (tx: any) => {
      tx.sign(keypair)
      return tx
    }
    clientOptions.signTransaction = signTransaction
  }
  
  return new Client(clientOptions)
}

/**
 * Adds a hash to the Soroban contract for a given event
 * 
 * @param eventId - The event identifier (can be event ID or zk_id)
 * @param hashHex - The hash as a hex string (64 characters, 32 bytes)
 * @returns The transaction hash if successful
 */
export async function addHashToSoroban(
  eventId: string,
  hashHex: string
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    await logger.info("Adding hash to Soroban contract", {
      eventId,
      hashPrefix: hashHex.substring(0, 16) + "...",
    })

    // Validate inputs
    if (!eventId || !hashHex) {
      throw new Error("eventId and hashHex are required")
    }

    // Convert hash to 32-byte Buffer
    const hashBuffer = hexToBuffer32(hashHex)
    
    // Convert eventId to Buffer
    const eventIdBuffer = Buffer.from(eventId, "utf-8")

    // Get secret key (from environment or use default hardcoded key)
    const secretKey = getSecretKey()

    // Create keypair from secret key
    const keypair = Keypair.fromSecret(secretKey)

    // Create client with signTransaction function
    const client = createSorobanClient(keypair)

    // Prepare the transaction
    await logger.info("Preparing transaction", {
      eventId,
      hashLength: hashBuffer.length,
      contractId: CONTRACT_ID,
      publicKey: keypair.publicKey(),
    })

    const transaction = await client.add_hash({
      event_id: eventIdBuffer,
      hash: hashBuffer,
    }, {
      simulate: true,
    })

    await logger.info("Transaction prepared, signing and sending", {
      eventId,
      hasTransaction: !!transaction,
    })

    // Sign and send the transaction
    // Since signTransaction is provided in Client initialization, we can use signAndSend directly
    await logger.info("Calling signAndSend", {
      eventId,
      keypairPublicKey: keypair.publicKey(),
    })

    let result: any
    try {
      // Use signAndSend - it will use the signTransaction function from Client initialization
      result = await transaction.signAndSend()
    } catch (signAndSendError) {
      await logger.warn("signAndSend failed, trying alternative method", {
        eventId,
        error: signAndSendError instanceof Error ? signAndSendError.message : String(signAndSendError),
      })
      
      // Fallback: try to sign and send manually
      try {
        // Get the underlying transaction and sign it
        const tx = transaction as any
        if (tx.tx && typeof tx.tx.sign === 'function') {
          tx.tx.sign(keypair)
          result = await tx.send()
        } else {
          throw new Error("Unable to access transaction for manual signing")
        }
      } catch (manualSignError) {
        throw new Error(`Both signAndSend and manual signing failed: ${signAndSendError instanceof Error ? signAndSendError.message : String(signAndSendError)}`)
      }
    }

    await logger.info("Transaction sent successfully", {
      eventId,
      resultHash: result?.hash,
      resultStatus: result?.status,
      resultKeys: Object.keys(result || {}),
    })

    await logger.info("Hash added to Soroban contract successfully", {
      eventId,
      txHash: result.hash,
    })

    return {
      success: true,
      txHash: result.hash,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    await logger.error("Failed to add hash to Soroban contract", {
      eventId,
      error: errorMessage,
    }, error instanceof Error ? error : undefined)

    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Gets all hashes for an event from the Soroban contract
 * 
 * @param eventId - The event identifier
 * @returns Array of hash buffers
 */
export async function getHashesFromSoroban(
  eventId: string
): Promise<{ success: boolean; hashes?: Buffer[]; error?: string }> {
  try {
    await logger.info("Getting hashes from Soroban contract", { eventId })

    // Convert eventId to Buffer
    const eventIdBuffer = Buffer.from(eventId, "utf-8")

    // Create client
    const client = createSorobanClient()

    // Call get_hashes (read-only, no signing needed)
    const transaction = await client.get_hashes({
      event_id: eventIdBuffer,
    }, {
      simulate: true,
    })

    const result = await transaction.simulate()

    await logger.info("Retrieved hashes from Soroban contract", {
      eventId,
      hashCount: result?.result?.length || 0,
    })

    return {
      success: true,
      hashes: result?.result || [],
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    await logger.error("Failed to get hashes from Soroban contract", {
      eventId,
      error: errorMessage,
    }, error instanceof Error ? error : undefined)

    return {
      success: false,
      error: errorMessage,
    }
  }
}

