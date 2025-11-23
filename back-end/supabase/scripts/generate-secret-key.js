#!/usr/bin/env node

/**
 * Script para gerar Secret Key do Stellar a partir de uma Seed Phrase
 * 
 * Uso:
 *   node scripts/generate-secret-key.js "sua seed phrase aqui"
 * 
 * Ou exporte a variável:
 *   export SOROBAN_SEED_PHRASE="sua seed phrase aqui"
 *   node scripts/generate-secret-key.js
 */

const { mnemonicToSeedSync } = require('bip39');
const { derivePath } = require('ed25519-hd-key');
const StellarSDK = require('@stellar/stellar-sdk');

function seedPhraseToSecretKey(seedPhrase) {
  try {
    // Convert mnemonic to seed
    const seed = mnemonicToSeedSync(seedPhrase);
    
    // Stellar uses derivation path m/44'/148'/0'
    const derivationPath = "m/44'/148'/0'";
    
    // derivePath expects hex string for seed
    const seedHex = Buffer.isBuffer(seed) ? seed.toString("hex") : seed;
    const derived = derivePath(derivationPath, seedHex);
    
    // derived.key is a Buffer or hex string
    const keyBuffer = Buffer.isBuffer(derived.key) 
      ? derived.key 
      : Buffer.from(derived.key, "hex");
    
    // Create keypair from the derived seed (32 bytes for ed25519)
    const keypair = StellarSDK.Keypair.fromRawEd25519Seed(keyBuffer);
    
    return keypair.secret();
  } catch (error) {
    throw new Error(`Failed to convert seed phrase to secret key: ${error.message}`);
  }
}

// Get seed phrase from command line argument or environment variable
const seedPhrase = process.argv[2] || process.env.SOROBAN_SEED_PHRASE;

if (!seedPhrase) {
  console.error("❌ Erro: Seed phrase não fornecida");
  console.log("\nUso:");
  console.log("  node scripts/generate-secret-key.js \"sua seed phrase aqui\"");
  console.log("\nOu exporte a variável:");
  console.log("  export SOROBAN_SEED_PHRASE=\"sua seed phrase aqui\"");
  console.log("  node scripts/generate-secret-key.js");
  process.exit(1);
}

try {
  console.log("🔄 Convertendo seed phrase para secret key...");
  console.log(`📝 Seed phrase: ${seedPhrase.split(' ').slice(0, 3).join(' ')}... (${seedPhrase.split(' ').length} palavras)`);
  
  const secretKey = seedPhraseToSecretKey(seedPhrase);
  const keypair = StellarSDK.Keypair.fromSecret(secretKey);
  const publicKey = keypair.publicKey();
  
  console.log("\n✅ Secret Key gerada com sucesso!\n");
  console.log("=".repeat(60));
  console.log("SECRET KEY (PRIVADA - NÃO COMPARTILHE!):");
  console.log(secretKey);
  console.log("=".repeat(60));
  console.log("\nPUBLIC KEY (PÚBLICA - Pode compartilhar):");
  console.log(publicKey);
  console.log("=".repeat(60));
  console.log("\n💡 Use a SECRET KEY como valor da variável SOROBAN_SECRET_KEY");
  console.log("   no Supabase Dashboard > Edge Functions > Secrets");
  
} catch (error) {
  console.error("\n❌ Erro ao gerar secret key:");
  console.error(error.message);
  process.exit(1);
}

