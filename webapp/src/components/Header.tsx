import React from 'react';
import { IoMdLogOut } from 'react-icons/io';
import styles from './Header.module.css';

interface HeaderProps {
  onSettingsPress?: () => void;
  rightComponent?: React.ReactNode;
}

export default function Header({ onSettingsPress, rightComponent }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}>
            <span className={styles.avatarEmoji}>✨</span>
          </div>
        </div>
        <h1 className={styles.logo}>Meet.XLM</h1>
      </div>
      {rightComponent ? (
        rightComponent
      ) : (
        <button 
          className={styles.settingsButton}
          onClick={onSettingsPress}
          aria-label="Settings"
        >
          <div className={styles.settingsIconContainer}>
            <IoMdLogOut size={22} />
          </div>
        </button>
      )}
    </header>
  );
}

