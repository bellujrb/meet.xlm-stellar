// Função para obter o saldo XLM do usuário na rede Stellar
// Usando Stellar SDK para consultar o Horizon API

import StellarSdk from 'stellar-sdk';

// Servidor Horizon da rede testnet Stellar
const HORIZON_SERVER = 'https://horizon-testnet.stellar.org';

/**
 * Obtém o saldo XLM de um endereço na rede Stellar
 * @param address Endereço da carteira Stellar (public key)
 * @returns Saldo em XLM (número decimal)
 */
export async function getXlmBalance(address: string): Promise<number> {
  try {
    const server = new StellarSdk.Horizon.Server(HORIZON_SERVER);
    
    // Carrega a conta do Stellar
    const account = await server.loadAccount(address);
    
    // Encontra o saldo XLM nativo
    const xlmBalance = account.balances.find(
      (balance: any) => balance.asset_type === 'native'
    );
    
    if (!xlmBalance) {
      return 0;
    }
    
    // Converte para número decimal
    const balanceInXlm = parseFloat(xlmBalance.balance);
    
    return balanceInXlm;
  } catch (error) {
    console.error('Error getting XLM balance:', error);
    
    // Se a conta não existe (404), retorna 0
    if (error instanceof Error && error.message.includes('404')) {
      return 0;
    }
    
    // Em caso de erro, retorna 0 (conta pode não existir ainda)
    console.warn('Failed to fetch XLM balance, returning 0');
    return 0;
  }
}

