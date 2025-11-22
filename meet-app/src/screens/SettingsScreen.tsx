import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Clipboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SettingsScreenProps {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const WALLET_ADDRESS = 'GD7X...4AE6';
const FULL_WALLET_ADDRESS = 'GD7XKQJ9Z8VHWN2MXPQ4R5T6Y8U9I0O1P2A3S4D5F6G7H8J9K4AE6';
const USER_NICKNAME = 'bellu.xlm';
const APP_VERSION = '1.0.0 (1)';
const UUID = 'c90e3ae4-5be1-41e9-9375-737674bc34e1';

export default function SettingsScreen({
  visible,
  onClose,
  onLogout,
}: SettingsScreenProps) {
  const [nickname, setNickname] = useState(USER_NICKNAME);

  const handleCopyAddress = () => {
    Clipboard.setString(FULL_WALLET_ADDRESS);
    Alert.alert('Copied! 📋', 'Address copied to clipboard');
  };

  const handleGenerateQR = () => {
    Alert.alert('QR Code 📱', 'Generating your wallet QR Code...');
  };

  const handleSetENS = () => {
    Alert.alert('ENS 🌟', 'Configure your ENS name');
  };


  if (!visible) return null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity onPress={onLogout} style={styles.closeButton}>
          <Ionicons name="log-out-outline" size={24} color="#18181B" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          {/* Wallet Card */}
          <View style={styles.walletCard}>
            <View style={styles.walletHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarEmoji}>🤖</Text>
              </View>
              <Text style={styles.walletAddress}>{WALLET_ADDRESS}</Text>
            </View>

            <View style={styles.walletActions}>
              <TouchableOpacity
                style={styles.walletActionButton}
                onPress={handleCopyAddress}
                activeOpacity={0.8}
              >
                <Ionicons name="copy-outline" size={20} color="#7C3AED" />
                <Text style={styles.walletActionText}>Copy address</Text>
              </TouchableOpacity>

              <View style={styles.actionDivider} />

              <TouchableOpacity
                style={styles.walletActionButton}
                onPress={handleGenerateQR}
                activeOpacity={0.8}
              >
                <Ionicons name="qr-code-outline" size={20} color="#7C3AED" />
                <Text style={styles.walletActionText}>Generate QR</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={onLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>

          {/* Menu Items */}
          <View style={styles.menuSection}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => Alert.alert('FAQ', 'Frequently asked questions')}
              activeOpacity={0.8}
            >
              <Text style={styles.menuItemText}>FAQ</Text>
              <Ionicons name="chevron-forward" size={24} color="#18181B" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => Alert.alert('Notifications', 'Configure push notifications')}
              activeOpacity={0.8}
            >
              <Text style={styles.menuItemText}>Push Notifications</Text>
              <Ionicons name="chevron-forward" size={24} color="#18181B" />
            </TouchableOpacity>
          </View>

          {/* Feedback Card */}
          <View style={styles.feedbackCard}>
            <View style={styles.feedbackContent}>
              <TouchableOpacity
                style={styles.feedbackButton}
                onPress={() => Alert.alert('Feedback', 'Send us your feedback!')}
                activeOpacity={0.8}
              >
                <Text style={styles.feedbackButtonText}>Send your feedback</Text>
                <Ionicons name="chevron-forward" size={20} color="#18181B" />
              </TouchableOpacity>
            </View>
          </View>

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={styles.appInfoTitle}>Meet.XLM</Text>
            <Text style={styles.appInfoVersion}>Version: {APP_VERSION}</Text>
            <View style={styles.uuidRow}>
              <Text style={styles.appInfoUUID}>UUID: {UUID}</Text>
              <TouchableOpacity
                onPress={() => {
                  Clipboard.setString(UUID);
                  Alert.alert('Copied!', 'UUID copied');
                }}
              >
                <Ionicons name="copy-outline" size={16} color="#71717A" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1E8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 3,
    borderBottomColor: '#18181B',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#18181B',
    letterSpacing: -0.5,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  nicknameSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  nicknameLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nicknameEmoji: {
    fontSize: 24,
  },
  nicknameLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#18181B',
  },
  ensButton: {
    backgroundColor: '#A78BFA',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  ensButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  walletCard: {
    backgroundColor: '#E9D5FF',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#18181B',
    padding: 20,
    marginBottom: 16,
    shadowColor: '#18181B',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#A78BFA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#18181B',
  },
  avatarEmoji: {
    fontSize: 24,
  },
  walletAddress: {
    fontSize: 16,
    fontWeight: '700',
    color: '#18181B',
    fontFamily: 'monospace',
  },
  walletActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  walletActionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#7C3AED',
  },
  actionDivider: {
    width: 2,
    height: 24,
    backgroundColor: '#18181B',
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#18181B',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#18181B',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#7C3AED',
  },
  decorativeElements: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
    paddingVertical: 20,
  },
  decorativeEmoji: {
    fontSize: 32,
    opacity: 0.3,
  },
  menuSection: {
    gap: 12,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  menuItemText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#18181B',
  },
  feedbackCard: {
    backgroundColor: '#E9D5FF',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#18181B',
    padding: 20,
    marginBottom: 32,
    shadowColor: '#18181B',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  feedbackContent: {
    gap: 16,
  },
  feedbackIllustration: {
    alignItems: 'center',
    marginBottom: 8,
  },
  feedbackEmoji: {
    fontSize: 80,
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  feedbackButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#18181B',
    flex: 1,
  },
  feedbackIcon: {
    marginRight: 8,
  },
  feedbackIconText: {
    fontSize: 24,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  appInfoTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#18181B',
    marginBottom: 4,
  },
  appInfoVersion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#71717A',
  },
  uuidRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appInfoUUID: {
    fontSize: 12,
    fontWeight: '600',
    color: '#71717A',
    fontFamily: 'monospace',
  },
});

