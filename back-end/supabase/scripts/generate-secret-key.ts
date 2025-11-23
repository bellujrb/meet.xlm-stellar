#!/usr/bin/env -S deno run --allow-env --allow-net

/**
 * Script para gerar Secret Key do Stellar a partir de uma Seed Phrase
 * 
 * Uso:
 *   deno run --allow-env --allow-net scripts/generate-secret-key.ts "sua seed phrase aqui"
 * 
 * Ou exporte a variável:
 *   export SOROBAN_SEED_PHRASE="sua seed phrase aqui"
 *   deno run --allow-env --allow-net scripts/generate-secret-key.ts
 */

// @ts-ignore - Deno import
import { mnemonicToSeedSync } from "https://esm.sh/bip39@3.1.0"
// @ts-ignore - Deno import
import { derivePath } from "https://esm.sh/ed25519-hd-key@1.3.0"
// @ts-ignore - Deno import
import * as StellarSDK from "https://esm.sh/@stellar/stellar-sdk@14.1.1"
// @ts-ignore - Deno import
import { Buffer } from "https://esm.sh/buffer@6.0.3"

const Keypair = StellarSDK.Keypair || (StellarSDK as any).default?.Keypair || (StellarSDK as any).Keypair

if (!Keypair) {
  console.error("❌ Erro: Não foi possível carregar Keypair do Stellar SDK")
  Deno.exit(1)
}

function seedPhraseToSecretKey(seedPhrase: string): string {
  try {
    // Convert mnemonic to seed
    const seed = mnemonicToSeedSync(seedPhrase)
    
    // Stellar uses derivation path m/44'/148'/0'
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

// Get seed phrase from command line argument or environment variable
const seedPhrase = Deno.args[0] || Deno.env.get("SOROBAN_SEED_PHRASE")

if (!seedPhrase) {
  console.error("❌ Erro: Seed phrase não fornecida")
  console.log("\nUso:")
  console.log("  deno run --allow-env --allow-net scripts/generate-secret-key.ts \"sua seed phrase aqui\"")
  console.log("\nOu exporte a variável:")
  console.log("  export SOROBAN_SEED_PHRASE=\"sua seed phrase aqui\"")
  console.log("  deno run --allow-env --allow-net scripts/generate-secret-key.ts")
  Deno.exit(1)
}

try {
  console.log("🔄 Convertendo seed phrase para secret key...")
  console.log(`📝 Seed phrase: ${seedPhrase.split(' ').slice(0, 3).join(' ')}... (${seedPhrase.split(' ').length} palavras)`)
  
  const secretKey = seedPhraseToSecretKey(seedPhrase)
  const keypair = Keypair.fromSecret(secretKey)
  const publicKey = keypair.publicKey()
  
  console.log("\n✅ Secret Key gerada com sucesso!\n")
  console.log("=" .repeat(60))
  console.log("SECRET KEY (PRIVADA - NÃO COMPARTILHE!):")
  console.log(secretKey)
  console.log("=" .repeat(60))
  console.log("\nPUBLIC KEY (PÚBLICA - Pode compartilhar):")
  console.log(publicKey)
  console.log("=" .repeat(60))
  console.log("\n💡 Use a SECRET KEY como valor da variável SOROBAN_SECRET_KEY")
  console.log("   no Supabase Dashboard > Edge Functions > Secrets")
  
} catch (error) {
  console.error("\n❌ Erro ao gerar secret key:")
  console.error(error instanceof Error ? error.message : String(error))
  Deno.exit(1)
}

