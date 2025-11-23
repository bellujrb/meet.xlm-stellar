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
import { mnemonicToSeedSync } from "https://esm.sh/bip39@3.1.0"
// @ts-ignore - Deno import
import { derivePath } from "https://esm.sh/ed25519-hd-key@1.3.0"
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
const CONTRACT_ID = "CDDCZS36ZERM7L2C4H6CC3PYYQPLWR357BOEJROMTL4X5WLVDNO4GSLI"

// Network configuration - defaults to futurenet
const getNetworkConfig = () => {
  const network = Deno.env.get("SOROBAN_NETWORK") || "futurenet"
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

/**
 * Converts a seed phrase to a Stellar secret key
 * Uses BIP39 mnemonic to seed, then derives Stellar key using ed25519
 */
function seedPhraseToSecretKey(seedPhrase: string): string {
  try {
    // Convert mnemonic to seed (returns Buffer)
    const seed = mnemonicToSeedSync(seedPhrase)
    
    // Stellar uses derivation path m/44'/148'/0'
    // This is the standard path for Stellar accounts
    const derivationPath = "m/44'/148'/0'"
    
    // derivePath expects hex string for seed
    const seedHex = seed instanceof Buffer ? seed.toString("hex") : seed
    const derived = derivePath(derivationPath, seedHex)
    
    // derived.key is a Buffer or hex string
    const keyBuffer = derived.key instanceof Buffer 
      ? derived.key 
      : Buffer.from(derived.key, "hex")
    
    // Create keypair from the derived seed (32 bytes for ed25519)
    const keypair = Keypair.fromRawEd25519Seed(keyBuffer)
    
    return keypair.secret()
  } catch (error) {
    throw new Error(`Failed to convert seed phrase to secret key: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Gets the secret key from environment (supports both seed phrase and direct secret key)
 */
function getSecretKey(): string {
  // First, try to get seed phrase
  const seedPhrase = Deno.env.get("SOROBAN_SEED_PHRASE")
  if (seedPhrase) {
    return seedPhraseToSecretKey(seedPhrase)
  }
  
  // Fallback to direct secret key
  const secretKey = Deno.env.get("SOROBAN_SECRET_KEY")
  if (secretKey) {
    return secretKey
  }
  
  throw new Error("Either SOROBAN_SEED_PHRASE or SOROBAN_SECRET_KEY environment variable is required")
}

/**
 * Creates a Soroban contract client
 */
function createSorobanClient(): Client {
  const { rpcUrl, networkPassphrase } = getNetworkConfig()
  
  return new Client({
    contractId: CONTRACT_ID,
    networkPassphrase,
    rpcUrl,
  })
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

    // Create client
    const client = createSorobanClient()

    // Get secret key from environment (supports seed phrase or direct secret key)
    const secretKey = getSecretKey()

    // Create keypair from secret key
    const keypair = Keypair.fromSecret(secretKey)

    // Prepare the transaction
    const transaction = await client.add_hash({
      event_id: eventIdBuffer,
      hash: hashBuffer,
    }, {
      simulate: true,
    })

    // Sign and send the transaction
    // The signAndSend method returns a result with the transaction hash
    const result = await transaction.signAndSend(keypair)

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

