import React, { useEffect } from 'react';
import { IoClose, IoCheckmarkCircle, IoTime, IoArrowForward } from 'react-icons/io5';
import styles from './SuccessModal.module.css';

interface SuccessModalProps {
  visible: boolean;
  eventName: string;
  eventDate: string;
  onClose: () => void;
}

export default function SuccessModal({
  visible,
  eventName,
  eventDate,
  onClose,
}: SuccessModalProps) {
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
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          <IoClose size={28} />
        </button>

        <div className={styles.content}>
          <div className={styles.checkCircle}>
            <IoCheckmarkCircle size={120} color="#4ADE80" />
          </div>

          <div className={styles.textContainer}>
            <h2 className={styles.successTitle}>Evento Criado! 🎉</h2>
            <div className={styles.eventNameCard}>
              <span className={styles.eventName}>{eventName}</span>
            </div>
          </div>

          <div className={styles.detailsCard}>
            <div className={styles.detailRow}>
              <div className={styles.iconCircle}>
                <IoTime size={24} />
              </div>
              <span className={styles.detailText}>{eventDate}</span>
            </div>
          </div>

          <button className={styles.viewButton} onClick={onClose}>
            <span className={styles.viewButtonText}>Ver Página do Evento</span>
            <IoArrowForward size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

