import React, { useState } from 'react';
import { IoSparkles } from 'react-icons/io5';
import styles from './LoginScreen.module.css';

interface LoginScreenProps {
  onLogin: () => void;
  onLogout?: () => void;
}

export default function LoginScreen({ onLogin, onLogout }: LoginScreenProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onLogin();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not login.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
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
            Login with mock authentication to access events.
          </p>
        </div>

        {errorMessage && (
          <div className={styles.alertBox}>
            <span className={styles.alertText}>{errorMessage}</span>
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
            {isLoading ? 'Logging in...' : 'Login (Mocked)'}
          </span>
        </button>

        {onLogout && (
          <button className={styles.secondaryButton} onClick={onLogout}>
            <span className={styles.secondaryButtonText}>Switch account</span>
          </button>
        )}

        <div className={styles.statusCard}>
          <div className={styles.statusLabel}>Status</div>
          <div className={`${styles.statusValue} ${styles.successText}`}>Ready to login</div>
          <div className={styles.statusHelper}>
            Click the button above to login with mock authentication.
          </div>
        </div>
      </div>
    </div>
  );
}

