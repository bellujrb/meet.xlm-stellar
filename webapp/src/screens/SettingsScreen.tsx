import { IoCopyOutline, IoQrCodeOutline, IoChevronForward } from 'react-icons/io5';
import UserMenu from '../components/UserMenu';
import { useStellarWallet } from '../hooks/useStellarWallet';
import styles from './SettingsScreen.module.css';

interface SettingsScreenProps {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const WALLET_ADDRESS = 'GD7X...4AE6';
const FULL_WALLET_ADDRESS = 'GD7XKQJ9Z8VHWN2MXPQ4R5T6Y8U9I0O1P2A3S4D5F6G7H8J9K4AE6';
const APP_VERSION = '1.0.0 (1)';
const UUID = 'c90e3ae4-5be1-41e9-9375-737674bc34e1';

export default function SettingsScreen({
  visible,
  onLogout,
}: SettingsScreenProps) {
  const { publicKey: stellarAddress } = useStellarWallet(true);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(FULL_WALLET_ADDRESS);
    alert('Copied! 📋 Address copied to clipboard');
  };

  const handleGenerateQR = () => {
    alert('QR Code 📱 Generating your wallet QR Code...');
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
                <span className={styles.avatarEmoji}>🤖</span>
              </div>
              <div className={styles.walletAddress}>{WALLET_ADDRESS}</div>
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
            <div className={styles.uuidRow}>
              <span className={styles.appInfoUUID}>UUID: {UUID}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(UUID);
                  alert('Copied! UUID copied');
                }}
                className={styles.copyButton}
              >
                <IoCopyOutline size={16} color="#71717A" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

