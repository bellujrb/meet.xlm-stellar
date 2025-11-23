// Função para obter o saldo XLM do usuário na rede Stellar
// Usando fetch direto para consultar o Horizon API

// Servidor Horizon da rede testnet Stellar
const HORIZON_SERVER = 'https://horizon-testnet.stellar.org';

/**
 * Obtém o saldo XLM de um endereço na rede Stellar
 * @param address Endereço da carteira Stellar (public key)
 * @returns Saldo em XLM (número decimal)
 */
export async function getXlmBalance(address: string): Promise<number> {
  try {
    // Use the exact same method as UserMenu (which is working)
    const res = await fetch(`${HORIZON_SERVER}/accounts/${address}`);
    
    if (!res.ok) {
      if (res.status === 404) {
        console.log('Account not found:', address);
        return 0;
      }
      console.error('Horizon API error:', res.status, res.statusText);
      return 0;
    }
    
    const data = await res.json();
    
    // Find native XLM balance (exact same logic as UserMenu)
    const native = data.balances?.find((b: any) => b.asset_type === 'native');
    
    if (!native || !native.balance) {
      console.log('No native balance found for account:', address);
      return 0;
    }
    
    // Convert balance string to number (exact same as UserMenu)
    const balanceInXlm = parseFloat(native.balance);
    
    console.log('✅ XLM Balance fetched successfully:', {
      address,
      rawBalance: native.balance,
      balanceInXlm,
    });
    
    return balanceInXlm;
  } catch (err) {
    console.warn('Stellar balance fetch failed', err);
    return 0;
  }
}

