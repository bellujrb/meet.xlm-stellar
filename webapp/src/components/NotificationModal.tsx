import { useEffect } from 'react';
import { IoClose, IoCheckmarkCircle, IoAlertCircle, IoInformationCircle } from 'react-icons/io5';
import styles from './NotificationModal.module.css';

type NotificationType = 'success' | 'error' | 'info';

interface NotificationModalProps {
  visible: boolean;
  type: NotificationType;
  title: string;
  message: string;
  onClose: () => void;
  duration?: number; // Auto-close duration in ms (0 = no auto-close)
}

export default function NotificationModal({
  visible,
  type,
  title,
  message,
  onClose,
  duration = 3000,
}: NotificationModalProps) {
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
      if (duration > 0) {
        const timer = setTimeout(() => {
          onClose();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [visible, duration, onClose]);

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <IoCheckmarkCircle size={48} color="#4ADE80" />;
      case 'error':
        return <IoAlertCircle size={48} color="#EF4444" />;
      case 'info':
        return <IoInformationCircle size={48} color="#3B82F6" />;
    }
  };

  const getIconBg = () => {
    switch (type) {
      case 'success':
        return '#4ADE80';
      case 'error':
        return '#EF4444';
      case 'info':
        return '#3B82F6';
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className={styles.closeButton} aria-label="Close">
          <IoClose size={24} />
        </button>

        <div className={styles.content}>
          <div className={styles.iconContainer} style={{ backgroundColor: `${getIconBg()}20` }}>
            {getIcon()}
          </div>

          <h2 className={styles.title}>{title}</h2>
          <p className={styles.message}>{message}</p>

          <button className={styles.okButton} onClick={onClose}>
            <span className={styles.okButtonText}>OK</span>
          </button>
        </div>
      </div>
    </div>
  );
}

