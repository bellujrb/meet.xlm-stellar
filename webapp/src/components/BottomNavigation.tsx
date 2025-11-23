import React from 'react';
import { 
  IoHome, 
  IoHomeOutline, 
  IoSearch, 
  IoSearchOutline, 
  IoAddCircle, 
  IoAddCircleOutline,
  IoNotifications,
  IoNotificationsOutline,
  IoSettings,
  IoSettingsOutline
} from 'react-icons/io5';
import { TabName } from '../types';
import styles from './BottomNavigation.module.css';

interface BottomNavigationProps {
  activeTab?: TabName;
  onTabPress?: (tab: TabName) => void;
}

export default function BottomNavigation({
  activeTab = 'home',
  onTabPress,
}: BottomNavigationProps) {
  const tabs: { name: TabName; icon: React.ReactNode; iconOutline: React.ReactNode }[] = [
    { 
      name: 'home', 
      icon: <IoHome size={24} />, 
      iconOutline: <IoHomeOutline size={24} /> 
    },
    { 
      name: 'search', 
      icon: <IoSearch size={24} />, 
      iconOutline: <IoSearchOutline size={24} /> 
    },
    { 
      name: 'add', 
      icon: <IoAddCircle size={28} />, 
      iconOutline: <IoAddCircleOutline size={28} /> 
    },
    { 
      name: 'notifications', 
      icon: <IoNotifications size={24} />, 
      iconOutline: <IoNotificationsOutline size={24} /> 
    },
    { 
      name: 'settings', 
      icon: <IoSettings size={24} />, 
      iconOutline: <IoSettingsOutline size={24} /> 
    },
  ];

  return (
    <nav className={styles.bottomNav}>
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.name;
        return (
          <button
            key={tab.name}
            className={`${styles.navItem} ${isActive ? styles.navItemActive : ''} ${index === 2 ? styles.navItemCenter : ''}`}
            onClick={() => onTabPress?.(tab.name)}
            aria-label={tab.name}
          >
            {isActive ? tab.icon : tab.iconOutline}
          </button>
        );
      })}
    </nav>
  );
}

