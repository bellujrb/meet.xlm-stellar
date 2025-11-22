import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  hasError,
  isConnected,
  isConnecting,
  isCreating,
  isNotCreated,
  needsRecovery,
  useEmbeddedWallet,
  usePrivy,
} from '@privy-io/expo';
import { useLogin } from '@privy-io/expo/ui';

interface LoginScreenProps {
  onLogout?: () => void;
}

export default function LoginScreen({ onLogout }: LoginScreenProps) {
  const { user, isReady } = usePrivy();
  const wallet = useEmbeddedWallet();
  const { login } = useLogin();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isReady && user && isNotCreated(wallet)) {
      wallet.create();
    }
  }, [isReady, user, wallet]);

  const walletStatus = useMemo(() => {
    if (!user) {
      return { label: 'Login pending', helper: 'Use the button to sign in with email.', tone: 'muted' as const };
    }
    if (isConnected(wallet)) {
      return {
        label: 'Wallet ready',
        helper: 'Wallet connected, ready to sign and participate.',
        tone: 'success' as const,
      };
    }
    if (isCreating(wallet) || isConnecting(wallet)) {
      return {
        label: 'Connecting wallet',
        helper: 'Creating and syncing your embedded wallet.',
        tone: 'info' as const,
      };
    }
    if (isNotCreated(wallet)) {
      return {
        label: 'Create wallet',
        helper: "We'll generate a secure wallet once you sign in.",
        tone: 'warning' as const,
      };
    }
    if (needsRecovery(wallet)) {
      return {
        label: 'Recover wallet',
        helper: 'Complete recovery to continue.',
        tone: 'danger' as const,
      };
    }
    if (hasError(wallet)) {
      return {
        label: 'Error connecting',
        helper: wallet.error,
        tone: 'danger' as const,
      };
    }
    return {
      label: 'Wallet',
      helper: 'Waiting for status...',
      tone: 'muted' as const,
    };
  }, [user, wallet]);

  const handleLogin = useCallback(async () => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      await login({
        loginMethods: ['email'],
        appearance: {
          logo: undefined,
        },
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Could not open login.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, [login]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.decorTop} />
      <View style={styles.decorBottom} />

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Meet.XLM</Text>
          <View style={styles.welcomePill}>
            <Text style={styles.welcomePillText}>Welcome</Text>
          </View>
        </View>

        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Organize and participate in Stellar events</Text>
          <Text style={styles.heroSubtitle}>
            Connect with email, choose in modal and go straight to events.
          </Text>
        </View>

        {errorMessage ? (
          <View style={styles.alertBox}>
            <Ionicons name="alert-circle" size={18} color="#18181B" />
            <Text style={styles.alertText}>{errorMessage}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.connectButton, isLoading && styles.connectButtonDisabled]}
          onPress={handleLogin}
          activeOpacity={0.85}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#18181B" size="small" />
          ) : (
            <Ionicons name="sparkles" size={24} color="#18181B" />
          )}
          <Text style={styles.connectButtonText}>
            {isLoading ? 'Opening login...' : 'Connect with email'}
          </Text>
        </TouchableOpacity>

        {onLogout && user ? (
          <TouchableOpacity style={styles.secondaryButton} onPress={onLogout} activeOpacity={0.85}>
            <Text style={styles.secondaryButtonText}>Switch account</Text>
          </TouchableOpacity>
        ) : null}

        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Status</Text>
          <Text style={[styles.statusValue, styles[`${walletStatus.tone}Text`]]}>{walletStatus.label}</Text>
          <Text style={styles.statusHelper}>{walletStatus.helper}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1E8',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'center',
    gap: 32,
  },
  decorTop: {
    position: 'absolute',
    right: -60,
    top: -40,
    width: 180,
    height: 180,
    backgroundColor: '#FBBF24',
    borderRadius: 90,
    opacity: 0.25,
    transform: [{ rotate: '12deg' }],
  },
  decorBottom: {
    position: 'absolute',
    left: -40,
    bottom: -60,
    width: 160,
    height: 160,
    backgroundColor: '#A78BFA',
    borderRadius: 80,
    opacity: 0.15,
    transform: [{ rotate: '-8deg' }],
  },
  logoContainer: {
    alignItems: 'center',
    gap: 16,
  },
  logoText: {
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1,
    color: '#18181B',
    transform: [{ rotate: '-2deg' }],
  },
  welcomePill: {
    backgroundColor: '#FBBF24',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    transform: [{ rotate: '4deg' }],
  },
  welcomePillText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#18181B',
  },
  heroSection: {
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 8,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#18181B',
    letterSpacing: -1,
    textAlign: 'center',
    lineHeight: 40,
  },
  heroSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3F3F46',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#18181B',
    backgroundColor: '#FECACA',
    shadowColor: '#18181B',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  alertText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#18181B',
    flex: 1,
    lineHeight: 20,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#A78BFA',
    borderWidth: 4,
    borderColor: '#18181B',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 24,
    shadowColor: '#18181B',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    marginTop: 8,
  },
  connectButtonDisabled: {
    opacity: 0.8,
  },
  connectButtonText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#18181B',
    letterSpacing: -0.5,
  },
  secondaryButton: {
    marginTop: 8,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#18181B',
    borderRadius: 16,
    backgroundColor: '#F4F4F5',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#18181B',
  },
  statusCard: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#18181B',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#18181B',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    gap: 6,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#18181B',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#18181B',
  },
  statusHelper: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3F3F46',
    lineHeight: 20,
  },
  successText: { color: '#15803D' },
  infoText: { color: '#0EA5E9' },
  warningText: { color: '#B45309' },
  dangerText: { color: '#B91C1C' },
  mutedText: { color: '#27272A' },
});
