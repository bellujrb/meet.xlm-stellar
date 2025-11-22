import { IoNotifications, IoNotificationsOff } from 'react-icons/io5';
import UserMenu from '../components/UserMenu';
import { useStellarWallet } from '../hooks/useStellarWallet';
import styles from './NotificationsScreen.module.css';

interface NotificationsScreenProps {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function NotificationsScreen({
  visible,
  onLogout,
}: NotificationsScreenProps) {
  const { publicKey: stellarAddress } = useStellarWallet(true);

  if (!visible) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>
            <IoNotifications size={24} />
          </div>
          <h2 className={styles.headerTitle}>Notifications</h2>
        </div>
        <UserMenu
          onLogout={onLogout}
          stellarAddress={stellarAddress || undefined}
        />
      </div>

      <div className={styles.scrollView}>
        <div className={styles.content}>
          <div className={styles.emptyState}>
            <div className={styles.emptyIconContainer}>
              <IoNotificationsOff size={80} color="#A78BFA" />
            </div>
            <h3 className={styles.emptyTitle}>No notifications</h3>
            <p className={styles.emptySubtitle}>
              You will receive notifications about your events here
              </p>
            </div>
            <div className={styles.infoCards}>
              <div className={styles.infoCard}>
                <div className={styles.infoCardIcon}>
                  <span className={styles.infoCardEmoji}>🎉</span>
                </div>
                <div className={styles.infoCardTitle}>Events</div>
                <div className={styles.infoCardText}>
                  Upcoming event reminders
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoCardIcon}>
                  <span className={styles.infoCardEmoji}>💎</span>
                </div>
                <div className={styles.infoCardTitle}>POAPs</div>
                <div className={styles.infoCardText}>
                  New POAPs available
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoCardIcon}>
                  <span className={styles.infoCardEmoji}>✨</span>
                </div>
                <div className={styles.infoCardTitle}>Updates</div>
                <div className={styles.infoCardText}>
                  Changes to your events
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

