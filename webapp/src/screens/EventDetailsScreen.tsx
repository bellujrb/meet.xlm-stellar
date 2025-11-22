import { useState, useEffect } from 'react';
import { IoClose, IoTime, IoLocation, IoCheckmarkCircle, IoPersonAdd, IoCube, IoMail, IoShareSocial, IoEllipsisHorizontal, IoShieldCheckmark } from 'react-icons/io5';
import { DEFAULT_EVENT_IMAGE } from '../config/constants';
import styles from './EventDetailsScreen.module.css';

interface EventDetailsScreenProps {
  visible: boolean;
  onClose: () => void;
  event: {
    title: string;
    organizer: string;
    organizerIcon: string;
    time: string;
    location: string;
    image: string;
    status: 'LIVE' | 'UPCOMING';
    statusTime?: string;
    description?: string;
  };
  isMinted?: boolean;
  isRegistered?: boolean;
  requiresXLM?: boolean;
  xlmMinimum?: number;
  onRegister?: () => void;
  mintInfo?: {
    collector: string;
    walletAddress: string;
    mintedDate: string;
    blockchain: string;
  };
}

const MINT_OPTIONS = [
  { id: 'location', label: 'Location', icon: 'location' },
  { id: 'nfc', label: 'NFC', icon: 'wifi' },
  { id: 'secret', label: 'Secret Word', icon: 'key' },
  { id: 'qrcode', label: 'Scan QRCode', icon: 'qr-code' },
  { id: 'code', label: 'Enter Code', icon: 'keypad' },
];

export default function EventDetailsScreen({
  visible,
  onClose,
  event,
  isMinted = false,
  isRegistered = false,
  requiresXLM = false,
  xlmMinimum,
  onRegister,
  mintInfo,
}: EventDetailsScreenProps) {
  const [showMintOptions, setShowMintOptions] = useState(false);

  const handleMintOption = (option: string) => {
    setShowMintOptions(false);
    alert(`You selected: ${option}`);
  };

  const handlePrimaryAction = () => {
    if (isMinted) {
      alert('Already Collected - You have already minted this POAP! ✨');
    } else if (!isRegistered) {
      onRegister?.();
      onClose();
    } else {
      setShowMintOptions(true);
    }
  };

  const getPrimaryButtonText = () => {
    if (isMinted) return 'Already Collected ✨';
    if (!isRegistered) return 'Register';
    return 'Mint';
  };

  const getPrimaryButtonIcon = () => {
    if (isMinted) return <IoCheckmarkCircle size={24} />;
    if (!isRegistered) return <IoPersonAdd size={24} />;
    return <IoCube size={24} />;
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
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <IoClose size={28} />
          </button>
        </div>

        <div className={styles.scrollView}>
          <div className={styles.imageContainer}>
            <img src={event.image || DEFAULT_EVENT_IMAGE} alt={event.title} className={styles.eventImage} />
            <div className={`${styles.statusBadge} ${event.status === 'LIVE' ? styles.statusBadgeLive : ''}`}>
              <span className={`${styles.statusText} ${event.status === 'LIVE' ? styles.statusTextLive : ''}`}>
                {event.status === 'LIVE' ? 'LIVE' : event.statusTime}
              </span>
            </div>
          </div>

          <div className={styles.content}>
            {isMinted && mintInfo && (
              <div className={styles.mintedCard}>
                <div className={styles.mintedHeader}>
                  <span className={styles.mintedEmoji}>💎</span>
                  <span className={styles.mintedTitle}>Collected by</span>
                </div>
                <div className={styles.collectorName}>{mintInfo.collector}</div>
                <div className={styles.walletAddress}>{mintInfo.walletAddress}</div>
                <div className={styles.mintedDivider} />
                <div className={styles.mintedDetailsRow}>
                  <span className={styles.mintedEmoji}>🕐</span>
                  <span className={styles.mintedDetailsText}>Minted {mintInfo.mintedDate} on</span>
                  <div className={styles.blockchainBadge}>
                    <div className={styles.blockchainDot} />
                    <span className={styles.blockchainText}>{mintInfo.blockchain}</span>
                  </div>
                </div>
              </div>
            )}

            <div className={styles.organizerBadge}>
              <span className={styles.organizerIcon}>{event.organizerIcon}</span>
              <span className={styles.organizer}>{event.organizer}</span>
            </div>

            <h1 className={styles.title}>{event.title}</h1>

            <div className={styles.details}>
              <div className={styles.detailRow}>
                <div className={styles.detailIcon}>
                  <IoTime size={20} />
                </div>
                <span className={styles.detailText}>{event.time}</span>
              </div>

              <div className={styles.detailRow}>
                <div className={styles.detailIcon}>
                  <IoLocation size={20} />
                </div>
                <span className={styles.detailText}>{event.location}</span>
              </div>
            </div>

            {event.description && (
              <div className={styles.descriptionContainer}>
                <h3 className={styles.descriptionTitle}>About the Event ✨</h3>
                <p className={styles.description}>{event.description}</p>
              </div>
            )}

            {isRegistered && (
              <div className={styles.attendingBadge}>
                <IoCheckmarkCircle size={24} color="#4ADE80" />
                <span className={styles.attendingText}>You're Going</span>
              </div>
            )}

            {requiresXLM && xlmMinimum && !isRegistered && (
              <div className={styles.xlmRequiredBadge}>
                <div className={styles.xlmIconSmall}>
                  <span className={styles.xlmIconText}>$</span>
                </div>
                <span className={styles.xlmRequiredText}>
                  Requires {xlmMinimum} XLM minimum
                </span>
                <div className={styles.zkBadge}>
                  <IoShieldCheckmark size={16} />
                  <span className={styles.zkBadgeText}>ZK</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.actionsContainer}>
          <button
            className={`${styles.actionButton} ${!isRegistered ? styles.registerButton : styles.mintButton} ${isMinted ? styles.mintButtonDisabled : ''}`}
            onClick={handlePrimaryAction}
            disabled={isMinted}
          >
            {getPrimaryButtonIcon()}
            <span className={styles.actionButtonText}>{getPrimaryButtonText()}</span>
          </button>

          <div className={styles.secondaryActions}>
            <button className={styles.secondaryButton} onClick={() => alert('Contact')}>
              <IoMail size={20} />
              <span className={styles.secondaryButtonText}>Contact</span>
            </button>

            <button className={styles.secondaryButton} onClick={() => alert('Share')}>
              <IoShareSocial size={20} />
              <span className={styles.secondaryButtonText}>Share</span>
            </button>

            <button className={styles.secondaryButton} onClick={() => alert('More')}>
              <IoEllipsisHorizontal size={20} />
              <span className={styles.secondaryButtonText}>More</span>
            </button>
          </div>
        </div>

        {showMintOptions && (
          <div className={styles.mintModalOverlay} onClick={() => setShowMintOptions(false)}>
            <div className={styles.mintModalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.mintModalHeader}>
                <h3 className={styles.mintModalTitle}>Choose Method 🎯</h3>
                <button
                  onClick={() => setShowMintOptions(false)}
                  className={styles.mintCloseButton}
                >
                  <IoClose size={24} />
                </button>
              </div>

              <div className={styles.mintOptionsGrid}>
                {MINT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    className={styles.mintOptionCard}
                    onClick={() => handleMintOption(option.label)}
                  >
                    <div className={styles.mintOptionIcon}>
                      <span>{option.icon}</span>
                    </div>
                    <span className={styles.mintOptionLabel}>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

