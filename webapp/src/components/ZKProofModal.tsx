import React, { useState, useEffect } from 'react';
import { IoClose, IoShieldCheckmark, IoLockClosed, IoFlash, IoKey, IoCheckmark, IoArrowForward } from 'react-icons/io5';
import styles from './ZKProofModal.module.css';

interface ZKProofModalProps {
  visible: boolean;
  xlmRequired: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ZKProofModal({
  visible,
  xlmRequired,
  onClose,
  onSuccess,
}: ZKProofModalProps) {
  const [stage, setStage] = useState<'intro' | 'generating' | 'success'>('intro');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (visible) {
      setStage('intro');
      setProgress(0);
    }
  }, [visible]);

  useEffect(() => {
    if (stage === 'generating') {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setStage('success');
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [stage]);

  const handleStartProof = () => {
    setStage('generating');
  };

  const handleComplete = () => {
    onSuccess();
    setTimeout(() => {
      onClose();
      setStage('intro');
      setProgress(0);
    }, 300);
  };

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
    <div className={styles.overlay} onClick={stage === 'intro' ? onClose : undefined}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {stage === 'intro' && (
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <IoClose size={28} />
          </button>
        )}

        {stage === 'intro' && (
          <div className={styles.content}>
            <div className={styles.lockIcon}>
              <IoShieldCheckmark size={80} color="#A78BFA" />
            </div>

            <h2 className={styles.title}>Zero-Knowledge Proof 🔐</h2>
            <p className={styles.subtitle}>XLM Balance Verification</p>

            <div className={styles.infoCard}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Minimum Required:</span>
                <div className={styles.xlmBadge}>
                  <span className={styles.xlmAmount}>{xlmRequired} XLM</span>
                </div>
              </div>
            </div>

            <div className={styles.featuresList}>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <IoLockClosed size={24} />
                </div>
                <div className={styles.featureText}>
                  <div className={styles.featureTitle}>Total Privacy</div>
                  <div className={styles.featureDescription}>Your balance is not revealed</div>
                </div>
              </div>

              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <IoFlash size={24} />
                </div>
                <div className={styles.featureText}>
                  <div className={styles.featureTitle}>Instant Verification</div>
                  <div className={styles.featureDescription}>Mathematical proof guaranteed</div>
                </div>
              </div>

              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <IoShieldCheckmark size={24} />
                </div>
                <div className={styles.featureText}>
                  <div className={styles.featureTitle}>Zero Knowledge</div>
                  <div className={styles.featureDescription}>Only proves you have the minimum</div>
                </div>
              </div>
            </div>

            <button className={styles.generateButton} onClick={handleStartProof}>
              <IoKey size={24} />
              <span className={styles.generateButtonText}>Generate ZK Proof</span>
            </button>
          </div>
        )}

        {stage === 'generating' && (
          <div className={styles.content}>
            <div className={styles.generatingIcon}>
              <IoKey size={80} color="#A78BFA" />
            </div>

            <h2 className={styles.generatingTitle}>Generating ZK Proof...</h2>
            <p className={styles.generatingSubtitle}>Computing cryptographic proof</p>

            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
              </div>
              <span className={styles.progressText}>{Math.round(progress)}%</span>
            </div>

            <div className={styles.stepsList}>
              {[
                { label: 'Connecting to wallet', threshold: 20 },
                { label: 'Verifying balance', threshold: 40 },
                { label: 'Generating commitment', threshold: 60 },
                { label: 'Calculating proof', threshold: 80 },
              ].map((step, index) => (
                <div
                  key={index}
                  className={`${styles.stepItem} ${progress > step.threshold ? styles.stepItemComplete : ''}`}
                >
                  <div className={styles.stepIcon}>
                    {progress > step.threshold ? (
                      <IoCheckmark size={16} color="#4ADE80" />
                    ) : (
                      <div className={styles.stepDot} />
                    )}
                  </div>
                  <span className={styles.stepText}>{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {stage === 'success' && (
          <div className={styles.content}>
            <div className={styles.successIcon}>
              <IoCheckmarkCircle size={120} color="#4ADE80" />
            </div>

            <h2 className={styles.successTitle}>Proof Generated! ✨</h2>
            <p className={styles.successSubtitle}>Verification completed successfully</p>

            <div className={styles.proofCard}>
              <div className={styles.proofLabel}>ZK Proof</div>
              <div className={styles.proofHash}>zk_0x4a7b...9f3c</div>
              <div className={styles.proofDetails}>
                Valid until: {new Date(Date.now() + 3600000).toLocaleString('en-US')}
              </div>
            </div>

            <button className={styles.completeButton} onClick={handleComplete}>
              <span className={styles.completeButtonText}>Continue Registration</span>
              <IoArrowForward size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

