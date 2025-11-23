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
      network: WalletNetwork.TESTNET,
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
  const [isDisconnecting, setIsDisconnecting] = useState(false);

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
      setIsDisconnecting(true);
      
      // Clear state immediately to prevent any reconnection attempts
      // This prevents the useEffect from trying to reconnect
      setPublicKey(null);
      setIsConnected(false);
      setError(null);
      
      // Reset kit instance - this prevents the kit from trying to open modals
      // We don't call kit.disconnect() because it may try to open xBull wallet
      kitInstance = null;
    } catch (err) {
      // Still clear state even if something fails
      setPublicKey(null);
      setIsConnected(false);
      setError(null);
      kitInstance = null;
    } finally {
      setIsDisconnecting(false);
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
    // Don't check if we're currently disconnecting
    if (isDisconnecting) return;
    
    if (enabled && !publicKey) {
      // Try to get address if already connected
      const kit = getKit();
      kit.getAddress()
        .then(({ address }: { address: string }) => {
          // Only set if we're not disconnecting
          if (!isDisconnecting) {
            setPublicKey(address);
            setIsConnected(true);
          }
        })
        .catch(() => {
          // Not connected, that's okay
        });
    }
  }, [enabled, publicKey, isDisconnecting]);

  return {
    publicKey,
    isLoading,
    error,
    isConnected,
    connect,
    disconnect,
    signTransaction,
    kit: getKit(),
    network: WalletNetwork.TESTNET, // Current network
  };
}

