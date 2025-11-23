import { useEffect } from 'react';
import { IoClose, IoLogOutOutline, IoWarning } from 'react-icons/io5';
import styles from './LogoutModal.module.css';

interface LogoutModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ visible, onClose, onConfirm }: LogoutModalProps) {
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>
              <IoWarning size={24} />
            </div>
            <h2 className={styles.title}>Disconnect Wallet</h2>
          </div>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close">
            <IoClose size={28} />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.iconContainer}>
            <IoLogOutOutline size={80} color="#EF4444" />
          </div>

          <p className={styles.message}>
            Are you sure you want to disconnect your wallet?
          </p>
          <p className={styles.submessage}>
            You'll need to connect again to access your events and create new ones.
          </p>

          <div className={styles.actions}>
            <button className={styles.cancelButton} onClick={onClose}>
              <span className={styles.cancelButtonText}>Cancel</span>
            </button>
            <button className={styles.confirmButton} onClick={onConfirm}>
              <IoLogOutOutline size={20} />
              <span className={styles.confirmButtonText}>Disconnect</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

