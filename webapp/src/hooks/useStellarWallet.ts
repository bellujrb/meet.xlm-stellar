import { useCallback, useEffect, useState } from 'react';
import { Keypair } from 'stellar-sdk';

const PUB_KEY_KEY = 'stellar_public_key';
const SECRET_KEY_KEY = 'stellar_secret_key';

export function useStellarWallet(enabled: boolean) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [secretKey, setSecretKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadOrCreate = useCallback(async () => {
    if (!enabled) return;
    setIsLoading(true);
    setError(null);
    try {
      const existingPub = localStorage.getItem(PUB_KEY_KEY);
      const existingSecret = localStorage.getItem(SECRET_KEY_KEY);
      if (existingPub && existingSecret) {
        setPublicKey(existingPub);
        setSecretKey(existingSecret);
        return;
      }
      const keypair = Keypair.random();
      localStorage.setItem(PUB_KEY_KEY, keypair.publicKey());
      localStorage.setItem(SECRET_KEY_KEY, keypair.secret());
      setPublicKey(keypair.publicKey());
      setSecretKey(keypair.secret());
    } catch (err) {
      const e = err instanceof Error ? err : new Error('Erro ao criar carteira Stellar');
      setError(e);
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    loadOrCreate();
  }, [loadOrCreate]);

  return {
    publicKey,
    secretKey,
    isLoading,
    error,
    regenerate: loadOrCreate,
  };
}

