import React, { useEffect } from 'react';
import { IoClose, IoCheckmarkCircle, IoShieldCheckmark, IoArrowForward } from 'react-icons/io5';
import styles from './RegisterSuccessModal.module.css';

interface RegisterSuccessModalProps {
  visible: boolean;
  eventName: string;
  onClose: () => void;
  hadZKProof?: boolean;
}

export default function RegisterSuccessModal({
  visible,
  eventName,
  onClose,
  hadZKProof = false,
}: RegisterSuccessModalProps) {
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
            <h2 className={styles.successTitle}>Registrado! 🎉</h2>
            <div className={styles.eventNameCard}>
              <span className={styles.eventName}>{eventName}</span>
            </div>
          </div>

          {hadZKProof && (
            <div className={styles.infoCard}>
              <div className={styles.infoRow}>
                <div className={styles.iconCircle}>
                  <IoShieldCheckmark size={24} />
                </div>
                <span className={styles.infoText}>Prova ZK verificada com sucesso</span>
              </div>
            </div>
          )}

          <button className={styles.viewButton} onClick={onClose}>
            <span className={styles.viewButtonText}>Ver Evento</span>
            <IoArrowForward size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

