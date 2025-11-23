import { useState } from 'react';
import { IoCopyOutline, IoQrCodeOutline, IoChevronForward } from 'react-icons/io5';
import UserMenu from '../components/UserMenu';
import QRCodeModal from '../components/QRCodeModal';
import NotificationModal from '../components/NotificationModal';
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
  const [notification, setNotification] = useState<{ visible: boolean; type: 'success' | 'error' | 'info'; title: string; message: string }>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  // Format wallet address for display
  const displayAddress = stellarAddress 
    ? `${stellarAddress.slice(0, 6)}…${stellarAddress.slice(-4)}`
    : 'Not connected';

  const handleCopyAddress = () => {
    if (stellarAddress) {
      navigator.clipboard.writeText(stellarAddress);
      setNotification({
        visible: true,
        type: 'success',
        title: 'Copied!',
        message: 'Address copied to clipboard 📋',
      });
    } else {
      setNotification({
        visible: true,
        type: 'error',
        title: 'Wallet Not Connected',
        message: 'Please connect your wallet first',
      });
    }
  };

  const handleGenerateQR = () => {
    if (stellarAddress) {
      setShowQRCode(true);
    } else {
      setNotification({
        visible: true,
        type: 'error',
        title: 'Wallet Not Connected',
        message: 'Please connect your wallet first',
      });
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
              onClick={() => setNotification({
                visible: true,
                type: 'info',
                title: 'FAQ',
                message: 'Frequently asked questions - Coming soon!',
              })}
            >
              <span className={styles.menuItemText}>FAQ</span>
              <IoChevronForward size={24} />
            </button>

            <button
              className={styles.menuItem}
              onClick={() => setNotification({
                visible: true,
                type: 'info',
                title: 'Push Notifications',
                message: 'Configure push notifications - Coming soon!',
              })}
            >
              <span className={styles.menuItemText}>Push Notifications</span>
              <IoChevronForward size={24} />
            </button>
          </div>

          <div className={styles.feedbackCard}>
            <button
              className={styles.feedbackButton}
              onClick={() => setNotification({
                visible: true,
                type: 'info',
                title: 'Feedback',
                message: 'Send us your feedback - Coming soon!',
              })}
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

      <NotificationModal
        visible={notification.visible}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification({ ...notification, visible: false })}
      />
    </div>
  );
}

