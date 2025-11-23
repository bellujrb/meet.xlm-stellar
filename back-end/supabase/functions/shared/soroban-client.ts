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
  
  // Extract Transaction class from StellarSDK
  // Transaction might be in different locations depending on SDK version
  let Transaction: any = null
  if (StellarSDK.Transaction) {
    Transaction = StellarSDK.Transaction
  } else if ((StellarSDK as any).default?.Transaction) {
    Transaction = (StellarSDK as any).default.Transaction
  } else if ((StellarSDK as any).xdr?.Transaction) {
    Transaction = (StellarSDK as any).xdr.Transaction
  } else if (StellarSDK.xdr && (StellarSDK.xdr as any).Transaction) {
    Transaction = (StellarSDK.xdr as any).Transaction
  }
  
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
      // The SDK may pass the transaction as XDR string or as an object
      // We need to handle both cases
      
      let transaction: any = null
      
      // If tx is a string (XDR), decode it to a Transaction object
      if (typeof tx === 'string') {
        try {
          // Try multiple ways to access Transaction.fromXDR
          let transactionFromXDR: any = null
          
          // Method 1: Direct access
          if (StellarSDK.Transaction && typeof StellarSDK.Transaction.fromXDR === 'function') {
            transactionFromXDR = StellarSDK.Transaction.fromXDR
          }
          // Method 2: Through default export
          else if ((StellarSDK as any).default?.Transaction?.fromXDR) {
            transactionFromXDR = (StellarSDK as any).default.Transaction.fromXDR
          }
          // Method 3: Try to construct Transaction and use static method
          else if (Transaction) {
            // Check if it's a class with static fromXDR
            if (typeof (Transaction as any).fromXDR === 'function') {
              transactionFromXDR = (Transaction as any).fromXDR
            }
            // Or try to create instance and use instance method
            else if (Transaction.prototype && typeof Transaction.prototype.fromXDR === 'function') {
              // This won't work, but let's try
            }
          }
          
          if (transactionFromXDR) {
            transaction = transactionFromXDR(tx, networkPassphrase)
          } else {
            // Last resort: try using xdr module directly
            const xdrModule = StellarSDK.xdr || (StellarSDK as any).default?.xdr
            if (xdrModule) {
              // Decode the XDR envelope
              const envelope = xdrModule.TransactionEnvelope.fromXDR(tx)
              // Get the transaction from the envelope
              const txV1 = envelope.v1()
              if (txV1) {
                const innerTx = txV1.tx()
                // Create a new Transaction object - this is complex, let's try a different approach
                // Actually, we might need to use TransactionBuilder or construct it manually
                await logger.warn("Using XDR envelope workaround - may not work correctly").catch(() => {})
                throw new Error('XDR decoding requires Transaction.fromXDR which is not available. Please check Stellar SDK version.')
              }
            }
            throw new Error('Transaction.fromXDR is not available in StellarSDK. Available methods: ' + (Transaction ? Object.keys(Transaction).join(', ') : 'none'))
          }
        } catch (decodeError) {
          await logger.error("Failed to decode XDR transaction", {
            error: decodeError instanceof Error ? decodeError.message : String(decodeError),
            hasTransaction: !!Transaction,
            transactionType: typeof Transaction,
            transactionMethods: Transaction ? Object.keys(Transaction).slice(0, 20).join(', ') : 'none',
            stellarSDKKeys: Object.keys(StellarSDK).slice(0, 20).join(', '),
          }).catch(() => {})
          throw new Error(`Failed to decode transaction XDR: ${decodeError instanceof Error ? decodeError.message : String(decodeError)}`)
        }
      }
      // If tx is an object, check for common properties
      else if (tx && typeof tx === 'object') {
        // Check if it's an AssembledTransaction with .tx property
        if (tx.tx && typeof tx.tx.sign === 'function') {
          transaction = tx.tx
        }
        // Check if it has .transaction property
        else if (tx.transaction && typeof tx.transaction.sign === 'function') {
          transaction = tx.transaction
        }
        // Check if tx itself is a Transaction
        else if (typeof tx.sign === 'function') {
          transaction = tx
        }
        // Try to get XDR and decode it
        else if (tx.toXDR && typeof tx.toXDR === 'function') {
          const xdr = tx.toXDR()
          if (Transaction) {
            transaction = Transaction.fromXDR(xdr, networkPassphrase)
          }
        }
      }
      
      // Sign the transaction
      if (transaction && typeof transaction.sign === 'function') {
        transaction.sign(keypair)
        await logger.info("Transaction signed successfully").catch(() => {})
        
        // Return the signed transaction (convert back to XDR if needed)
        if (typeof tx === 'string') {
          // Return XDR string
          return transaction.toXDR()
        } else if (tx && typeof tx === 'object' && tx.tx) {
          // Update the tx property with signed transaction
          tx.tx = transaction
          return tx
        } else {
          // Return the signed transaction
          return transaction
        }
      } else {
        await logger.error("Unable to sign transaction", {
          txType: typeof tx,
          isString: typeof tx === 'string',
          isObject: tx && typeof tx === 'object',
          hasTransaction: !!transaction,
        }).catch(() => {})
        throw new Error('Unable to sign transaction: could not create or access Transaction object')
      }
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

