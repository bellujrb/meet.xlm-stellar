import { useState, useEffect } from 'react';
import { IoPersonCircle, IoLogOutOutline, IoPlanet, IoShieldCheckmark } from 'react-icons/io5';
import styles from './UserMenu.module.css';

interface UserMenuProps {
  onLogout: () => void;
  stellarAddress?: string;
}

export default function UserMenu({ onLogout, stellarAddress }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const [stellarBalance, setStellarBalance] = useState<string>('—');
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  const displayName = 'User';
  const walletAddress = stellarAddress ? `${stellarAddress.slice(0, 6)}…${stellarAddress.slice(-4)}` : 'Carteira';

  useEffect(() => {
    let cancelled = false;
    const fetchBalance = async () => {
      if (!stellarAddress) {
        setStellarBalance('—');
        return;
      }
      try {
        setIsLoadingBalance(true);
        const res = await fetch(`https://horizon.stellar.org/accounts/${stellarAddress}`);
        if (!res.ok) {
          if (res.status === 404) {
            if (!cancelled) setStellarBalance('0.00');
            return;
          }
          if (!cancelled) setStellarBalance('—');
          return;
        }
        const data = await res.json();
        const native = data.balances?.find((b: any) => b.asset_type === 'native');
        if (!cancelled) {
          if (native?.balance) {
            const formatted = parseFloat(native.balance).toFixed(2);
            setStellarBalance(formatted);
          } else {
            setStellarBalance('—');
          }
        }
      } catch (err) {
        console.warn('Stellar balance fetch failed', err);
        if (!cancelled) setStellarBalance('—');
      } finally {
        if (!cancelled) setIsLoadingBalance(false);
      }
    };
    fetchBalance();
    return () => {
      cancelled = true;
    };
  }, [stellarAddress]);

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.iconButton}
        onClick={() => setOpen((v) => !v)}
        aria-label="User menu"
      >
        <IoPersonCircle size={24} />
      </button>

      {open && (
        <>
          <div className={styles.overlay} onClick={() => setOpen(false)} />
          <div className={styles.dropdown}>
            <div className={styles.headerRow}>
              <div className={styles.avatar}>
                <span className={styles.avatarText}>✨</span>
              </div>
              <div className={styles.identity}>
                <div className={styles.name}>{displayName}</div>
                <div className={styles.meta}>{walletAddress}</div>
              </div>
              <button onClick={onLogout} className={styles.logoutButton} aria-label="Logout">
                <IoLogOutOutline size={18} />
              </button>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionLabel}>Carteira</div>
              <div className={styles.badgesRow}>
                <div className={`${styles.badge} ${styles.badgeYellow}`}>
                  <IoPlanet size={14} />
                  {isLoadingBalance ? (
                    <span className={styles.loader}>...</span>
                  ) : (
                    <span className={styles.badgeText}>
                      XLM {stellarBalance}
                    </span>
                  )}
                </div>
                <div className={`${styles.badge} ${styles.badgePurple}`}>
                  <IoShieldCheckmark size={14} />
                  <span className={styles.badgeText}>Wallet On</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

