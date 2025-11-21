import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/components/Header.styles';

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
          <Ionicons name="log-out-outline" size={22} color="#18181B" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

