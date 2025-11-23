import { useState, useEffect } from 'react';
import { IoClose, IoShieldCheckmark, IoLockClosed, IoFlash, IoKey, IoCheckmark, IoArrowForward, IoCheckmarkCircle } from 'react-icons/io5';
import { useStellarWallet } from '../hooks/useStellarWallet';
import { getXlmBalance } from '../lib/xlmBalance';
import { generateProof, generateRandomNonce } from '../lib/zkProof';
import { apiClient } from '../services/api';
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
  const [stage, setStage] = useState<'intro' | 'generating' | 'success' | 'error'>('intro');
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [verifyResponse, setVerifyResponse] = useState<{ zk_id: string; verified: boolean; zkverify_tx_hash?: string; saved_at: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { publicKey: stellarAddress } = useStellarWallet(true);

  useEffect(() => {
    if (visible) {
      setStage('intro');
      setProgress(0);
      setProgressText('');
      setVerifyResponse(null);
      setErrorMessage('');
    }
  }, [visible]);

  const handleStartProof = async () => {
    if (!stellarAddress) {
      setErrorMessage('Please connect your wallet first');
      setStage('error');
      return;
    }

    setStage('generating');
    setProgress(0);
    setProgressText('Starting...');

    try {
      // Step 1: Get XLM balance
      setProgress(10);
      setProgressText('Connecting to wallet...');
      
      console.log('🔍 ZKProofModal - Fetching balance for:', stellarAddress);
      const balance = await getXlmBalance(stellarAddress);
      console.log('💰 ZKProofModal - Balance received:', balance, 'XLM');
      
      if (balance < xlmRequired) {
        throw new Error(`Insufficient balance. Required: ${xlmRequired} XLM, You have: ${balance.toFixed(2)} XLM`);
      }

      // Step 2: Generate nonce
      setProgress(20);
      setProgressText('Verifying balance...');
      const nonce = generateRandomNonce();

      // Step 3: Generate proof
      setProgress(30);
      setProgressText('Generating commitment...');
      const proof = await generateProof(
        {
          threshold: Math.floor(xlmRequired * 10000000), // Convert to stroops (1 XLM = 10,000,000 stroops)
          nonce: nonce,
          balance: Math.floor(balance * 10000000), // Convert to stroops
          secret_nonce: nonce,
        },
        (progressValue, text) => {
          setProgress(30 + (progressValue * 0.7)); // Map 0-100 to 30-100
          setProgressText(text);
        }
      );

      // Step 4: Send proof to backend for verification and zkVerify submission
      setProgress(95);
      setProgressText('Submitting proof to zkVerify...');
      
      const verifyResponse = await apiClient.verifyZkProof(
        proof.proofB64,
        proof.publicInputs,
        proof.verificationKey,
        Math.floor(xlmRequired * 10000000), // threshold in stroops
        proof.isValid,
        stellarAddress
      );
      
      console.log('✅ Proof verified and saved:', verifyResponse);
      setVerifyResponse(verifyResponse);
      
      setProgress(100);
      setProgressText('Proof verified and saved successfully!');
      setStage('success');
    } catch (error) {
      console.error('Error generating proof:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to generate proof');
      setStage('error');
    }
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
            <p className={styles.generatingSubtitle}>{progressText || 'Computing cryptographic proof'}</p>

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

            {verifyResponse && (
              <div className={styles.proofCard}>
                <div className={styles.proofLabel}>ZK Proof ID</div>
                <div className={styles.proofHash}>
                  {verifyResponse.zk_id}
                </div>
                <div className={styles.proofDetails}>
                  {verifyResponse.verified ? '✓ Verified on zkVerify' : '⚠ Verification pending'}
                </div>
                {verifyResponse.zkverify_tx_hash && (
                  <div className={styles.proofDetails}>
                    <div className={styles.proofLabel} style={{ fontSize: '12px', marginTop: '8px' }}>zkVerify TX Hash:</div>
                    <div className={styles.proofHash} style={{ fontSize: '11px', wordBreak: 'break-all' }}>
                      {verifyResponse.zkverify_tx_hash}
                    </div>
                  </div>
                )}
                <div className={styles.proofDetails}>
                  Saved at: {new Date(verifyResponse.saved_at).toLocaleString('en-US')}
                </div>
              </div>
            )}

            <button className={styles.completeButton} onClick={handleComplete}>
              <span className={styles.completeButtonText}>Continue Registration</span>
              <IoArrowForward size={24} />
            </button>
          </div>
        )}

        {stage === 'error' && (
          <div className={styles.content}>
            <div className={styles.errorIcon}>
              <IoShieldCheckmark size={80} color="#EF4444" />
            </div>

            <h2 className={styles.errorTitle}>Proof Generation Failed</h2>
            <p className={styles.errorSubtitle}>{errorMessage || 'An error occurred while generating the proof'}</p>

            <button className={styles.generateButton} onClick={() => {
              setStage('intro');
              setErrorMessage('');
            }}>
              <IoKey size={24} />
              <span className={styles.generateButtonText}>Try Again</span>
            </button>

            <button className={styles.closeButton} onClick={onClose} style={{ marginTop: '16px' }}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


