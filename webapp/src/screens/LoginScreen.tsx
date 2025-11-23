import { useState, useEffect } from 'react';
import { IoSparkles } from 'react-icons/io5';
import { useStellarWallet } from '../hooks/useStellarWallet';
import styles from './LoginScreen.module.css';

interface LoginScreenProps {
  onLogin: () => void;
  onLogout?: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { connect, isLoading, error, publicKey, isConnected } = useStellarWallet(true);

  // Auto-login if already connected
  useEffect(() => {
    if (isConnected && publicKey) {
      onLogin();
    }
  }, [isConnected, publicKey, onLogin]);

  const handleLogin = async () => {
    setErrorMessage(null);
    try {
      await connect();
      // onLogin will be called automatically via useEffect when publicKey is set
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not connect to wallet.';
      setErrorMessage(message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.decorTop} />
      <div className={styles.decorBottom} />

      <div className={styles.content}>
        <div className={styles.logoContainer}>
          <h1 className={styles.logoText}>Meet.XLM</h1>
          <div className={styles.welcomePill}>
            <span className={styles.welcomePillText}>Welcome</span>
          </div>
        </div>

        <div className={styles.heroSection}>
          <h2 className={styles.heroTitle}>Organize and participate in Stellar events</h2>
          <p className={styles.heroSubtitle}>
            Connect your Stellar wallet to access events.
          </p>
        </div>

        {(errorMessage || error) && (
          <div className={styles.alertBox}>
            <span className={styles.alertText}>{errorMessage || error?.message || 'Connection error'}</span>
          </div>
        )}

        <button
          className={`${styles.connectButton} ${isLoading ? styles.connectButtonDisabled : ''}`}
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className={styles.loader}>...</span>
          ) : (
            <IoSparkles size={24} />
          )}
          <span className={styles.connectButtonText}>
            {isLoading ? 'Connecting...' : 'Connect Wallet'}
          </span>
        </button>

        <div className={styles.statusCard}>
          <div className={styles.statusLabel}>Status</div>
          <div className={`${styles.statusValue} ${publicKey ? styles.successText : ''}`}>
            {publicKey ? 'Connected' : 'Ready to connect'}
          </div>
          <div className={styles.statusHelper}>
            {publicKey 
              ? `Connected: ${publicKey.slice(0, 8)}...${publicKey.slice(-8)}`
              : 'Click the button above to connect your Stellar wallet.'}
          </div>
        </div>
      </div>
    </div>
  );
}

