import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabName } from '../types';
import { styles } from '../styles/components/BottomNavigation.styles';

interface BottomNavigationProps {
  activeTab?: TabName;
  onTabPress?: (tab: TabName) => void;
}

export default function BottomNavigation({
  activeTab = 'home',
  onTabPress,
}: BottomNavigationProps) {
  const tabs: { name: TabName; icon: keyof typeof Ionicons.glyphMap }[] = [
    { name: 'home', icon: 'home' },
    { name: 'search', icon: 'search-outline' },
    { name: 'add', icon: 'add-circle-outline' },
    { name: 'notifications', icon: 'notifications-outline' },
    { name: 'settings', icon: 'settings-outline' },
  ];

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={[
              styles.navItem,
              isActive && styles.navItemActive,
              index === 2 && styles.navItemCenter,
            ]}
            onPress={() => onTabPress?.(tab.name)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isActive ? tab.icon.replace('-outline', '') as any : tab.icon}
              size={index === 2 ? 28 : 24}
              color={isActive ? '#18181B' : '#71717A'}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

