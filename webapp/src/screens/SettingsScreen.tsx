import { useState } from 'react';
import { IoCopyOutline, IoQrCodeOutline, IoChevronForward } from 'react-icons/io5';
import UserMenu from '../components/UserMenu';
import QRCodeModal from '../components/QRCodeModal';
import { useStellarWallet } from '../hooks/useStellarWallet';
import styles from './SettingsScreen.module.css';

interface SettingsScreenProps {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const APP_VERSION = '1.0.0 (1)';

export default function SettingsScreen({
  visible,
  onLogout,
}: SettingsScreenProps) {
  const { publicKey: stellarAddress } = useStellarWallet(true);
  const [showQRCode, setShowQRCode] = useState(false);

  // Format wallet address for display
  const displayAddress = stellarAddress 
    ? `${stellarAddress.slice(0, 6)}…${stellarAddress.slice(-4)}`
    : 'Not connected';

  const handleCopyAddress = () => {
    if (stellarAddress) {
      navigator.clipboard.writeText(stellarAddress);
      alert('Copied! 📋 Address copied to clipboard');
    } else {
      alert('Wallet not connected');
    }
  };

  const handleGenerateQR = () => {
    if (stellarAddress) {
      setShowQRCode(true);
    } else {
      alert('Wallet not connected');
    }
  };

  if (!visible) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Settings</h2>
        <UserMenu
          onLogout={onLogout}
          stellarAddress={stellarAddress || undefined}
        />
      </div>

      <div className={styles.scrollView}>
        <div className={styles.content}>
          <div className={styles.walletCard}>
            <div className={styles.walletHeader}>
              <div className={styles.avatar}>
                <span className={styles.avatarEmoji}>✨</span>
              </div>
              <div className={styles.walletAddress}>{displayAddress}</div>
            </div>

            <div className={styles.walletActions}>
              <button
                className={styles.walletActionButton}
                onClick={handleCopyAddress}
              >
                <IoCopyOutline size={20} color="#7C3AED" />
                <span className={styles.walletActionText}>Copy address</span>
              </button>

              <div className={styles.actionDivider} />

              <button
                className={styles.walletActionButton}
                onClick={handleGenerateQR}
              >
                <IoQrCodeOutline size={20} color="#7C3AED" />
                <span className={styles.walletActionText}>Generate QR</span>
              </button>
            </div>
          </div>

          <button
            className={styles.logoutButton}
            onClick={onLogout}
          >
            <span className={styles.logoutButtonText}>Logout</span>
          </button>

          <div className={styles.menuSection}>
            <button
              className={styles.menuItem}
              onClick={() => alert('FAQ - Frequently asked questions')}
            >
              <span className={styles.menuItemText}>FAQ</span>
              <IoChevronForward size={24} />
            </button>

            <button
              className={styles.menuItem}
              onClick={() => alert('Notifications - Configure push notifications')}
            >
              <span className={styles.menuItemText}>Push Notifications</span>
              <IoChevronForward size={24} />
            </button>
          </div>

          <div className={styles.feedbackCard}>
            <button
              className={styles.feedbackButton}
              onClick={() => alert('Feedback - Send us your feedback!')}
            >
              <span className={styles.feedbackButtonText}>Send your feedback</span>
              <IoChevronForward size={20} />
            </button>
          </div>

          <div className={styles.appInfo}>
            <div className={styles.appInfoTitle}>Meet.XLM</div>
            <div className={styles.appInfoVersion}>Version: {APP_VERSION}</div>
          </div>
        </div>
      </div>

      {stellarAddress && (
        <QRCodeModal
          visible={showQRCode}
          onClose={() => setShowQRCode(false)}
          address={stellarAddress}
        />
      )}
    </div>
  );
}

