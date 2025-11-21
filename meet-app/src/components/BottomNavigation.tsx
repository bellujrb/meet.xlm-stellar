import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabName } from '../types';

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
    { name: 'favorites', icon: 'heart-outline' },
    { name: 'messages', icon: 'chatbubble-outline' },
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

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingBottom: 20,
    backgroundColor: '#F5F1E8',
    borderTopWidth: 3,
    borderTopColor: '#18181B',
  },
  navItem: {
    padding: 10,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  navItemActive: {
    backgroundColor: '#FBBF24',
    borderWidth: 2,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  navItemCenter: {
    padding: 12,
  },
});

