#!/usr/bin/env node

/**
 * Script para gerar um keypair para zkVerify
 * 
 * Uso:
 *   node generate-zkverify-seed.js
 * 
 * Isso gerará um keypair usando zkverifyjs e mostrará:
 * - Seed (para usar como ZKVERIFY_SEED)
 * - Address (endereço da conta)
 * 
 * Pré-requisito:
 *   npm install zkverifyjs
 */

async function generateKeypair() {
  try {
    console.log('\n🔐 zkVerify Keypair Generator\n');
    console.log('='.repeat(60));
    console.log('\n⏳ Gerando keypair...\n');

    // Import zkverifyjs
    const { zkVerifySession } = require('zkverifyjs');
    const bip39 = require('bip39');

    // Gerar mnemonic phrase (12 palavras)
    const mnemonic = bip39.generateMnemonic(128); // 128 bits = 12 palavras

    // Inicializar sessão com a mnemonic
    const session = await zkVerifySession.start().Volta().withAccount(mnemonic);
    const accountInfo = await session.getAccountInfo();

    console.log('✅ Keypair gerado com sucesso!\n');
    console.log('📋 Informações da conta:');
    console.log('─'.repeat(60));
    console.log('Mnemonic (ZKVERIFY_SEED):');
    console.log('  ' + mnemonic);
    console.log('\nAddress:');
    console.log('  ' + accountInfo[0].address);
    console.log('\nNonce:');
    console.log('  ' + accountInfo[0].nonce);
    console.log('\nBalance:');
    console.log('  ' + accountInfo[0].freeBalance + ' ACME');
    console.log('─'.repeat(60));

    console.log('\n📝 Próximos passos:\n');
    console.log('1. Copie a SEED acima');
    console.log('2. Vá para o Supabase Dashboard');
    console.log('3. Navegue até: Project Settings > Edge Functions > Secrets');
    console.log('4. Adicione uma nova secret:');
    console.log('   - Nome: ZKVERIFY_SEED');
    console.log('   - Valor: ' + mnemonic);
    console.log('\n⚠️  IMPORTANTE:');
    console.log('   - Guarde esta mnemonic phrase em local seguro');
    console.log('   - Não compartilhe publicamente');
    console.log('   - Você precisará desta mnemonic para recuperar a conta');
    console.log('   - A conta precisa ter balance (ACME) para funcionar');
    console.log('\n💡 Para verificar a conta novamente:');
    console.log('   const { zkVerifySession } = require("zkverifyjs");');
    console.log('   const session = await zkVerifySession.start().Volta().withAccount("' + mnemonic + '");');
    console.log('   const accountInfo = await session.getAccountInfo();');
    console.log('   console.log("Address:", accountInfo[0].address);');
    console.log('\n' + '='.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ Erro ao gerar keypair:', error.message);
    console.log('\n💡 Certifique-se de que as dependências estão instaladas:');
    console.log('   npm install zkverifyjs bip39');
    console.log('\n');
    process.exit(1);
  }
}

// Executar
generateKeypair();

