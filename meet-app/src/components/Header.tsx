import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  onSettingsPress?: () => void;
}

export default function Header({ onSettingsPress }: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>✨</Text>
          </View>
        </View>
        <Text style={styles.logo}>Meet.XLM</Text>
      </View>
      <TouchableOpacity 
        style={styles.settingsButton}
        onPress={onSettingsPress}
      >
        <View style={styles.settingsIconContainer}>
          <Ionicons name="settings-sharp" size={20} color="#18181B" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F5F1E8',
    borderBottomWidth: 3,
    borderBottomColor: '#18181B',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    transform: [{ rotate: '-5deg' }],
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FBBF24',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  avatarEmoji: {
    fontSize: 24,
  },
  logo: {
    fontSize: 26,
    fontWeight: '700',
    color: '#18181B',
    letterSpacing: -0.5,
    transform: [{ rotate: '-1deg' }],
  },
  logoStar: {
    fontSize: 16,
    marginTop: -8,
  },
  settingsButton: {
    padding: 4,
  },
  settingsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
});

