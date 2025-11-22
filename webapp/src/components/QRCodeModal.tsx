import { useEffect } from 'react';
import { IoClose, IoQrCodeOutline } from 'react-icons/io5';
import { QRCodeSVG } from 'qrcode.react';
import styles from './QRCodeModal.module.css';

interface QRCodeModalProps {
  visible: boolean;
  onClose: () => void;
  address: string;
}

export default function QRCodeModal({ visible, onClose, address }: QRCodeModalProps) {
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
              <IoQrCodeOutline size={24} />
            </div>
            <h2 className={styles.title}>Wallet QR Code</h2>
          </div>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close">
            <IoClose size={28} />
          </button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.qrContainer}>
            <QRCodeSVG
              value={address}
              size={256}
              level="H"
              includeMargin={true}
              fgColor="#18181B"
              bgColor="#FFFFFF"
            />
          </div>
          
          <div className={styles.addressContainer}>
            <div className={styles.addressLabel}>Wallet Address</div>
            <div className={styles.address}>{address}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

