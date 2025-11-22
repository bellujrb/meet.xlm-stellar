import { useCallback, useEffect, useState } from 'react';
import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
  XBULL_ID,
} from '@creit.tech/stellar-wallets-kit';

// Initialize the kit once
let kitInstance: StellarWalletsKit | null = null;

function getKit(): StellarWalletsKit {
  if (!kitInstance) {
    kitInstance = new StellarWalletsKit({
      network: WalletNetwork.PUBLIC,
      selectedWalletId: XBULL_ID,
      modules: allowAllModules(),
    });
  }
  return kitInstance;
}

export function useStellarWallet(enabled: boolean) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(async () => {
    if (!enabled) return;
    setIsLoading(true);
    setError(null);
    try {
      const kit = getKit();
      // Open modal to let user select wallet
      await kit.openModal({
        onWalletSelected: async (option) => {
          kit.setWallet(option.id);
          const { address } = await kit.getAddress();
          setPublicKey(address);
          setIsConnected(true);
        },
      });
    } catch (err) {
      const e = err instanceof Error ? err : new Error('Error connecting to Stellar wallet');
      setError(e);
      setIsConnected(false);
      setPublicKey(null);
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  const disconnect = useCallback(async () => {
    try {
      const kit = getKit();
      await kit.disconnect();
      setPublicKey(null);
      setIsConnected(false);
    } catch (err) {
      const e = err instanceof Error ? err : new Error('Error disconnecting wallet');
      setError(e);
    }
  }, []);

  const signTransaction = useCallback(async (xdr: string, networkPassphrase: string) => {
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }
    try {
      const kit = getKit();
      const { signedTxXdr } = await kit.signTransaction(xdr, {
        networkPassphrase,
        address: publicKey,
      });
      return signedTxXdr;
    } catch (err) {
      const e = err instanceof Error ? err : new Error('Error signing transaction');
      setError(e);
      throw e;
    }
  }, [publicKey]);

  // Check if already connected on mount
  useEffect(() => {
    if (enabled && !publicKey) {
      // Try to get address if already connected
      const kit = getKit();
      kit.getAddress()
        .then(({ address }: { address: string }) => {
          setPublicKey(address);
          setIsConnected(true);
        })
        .catch(() => {
          // Not connected, that's okay
        });
    }
  }, [enabled, publicKey]);

  return {
    publicKey,
    isLoading,
    error,
    isConnected,
    connect,
    disconnect,
    signTransaction,
    kit: getKit(),
  };
}

