import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PrivyProvider, useEmbeddedWallet, usePrivy, isConnected } from '@privy-io/expo';
import { PrivyElements } from '@privy-io/expo/ui';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';

const PRIVY_APP_ID = process.env.EXPO_PUBLIC_PRIVY_APP_ID ?? '';
const PRIVY_CLIENT_ID = process.env.EXPO_PUBLIC_PRIVY_CLIENT_ID ?? '';

function FullscreenMessage({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.fallbackContainer}>
      <StatusBar style="dark" />
      <Text style={styles.fallbackTitle}>{title}</Text>
      {subtitle ? <Text style={styles.fallbackSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

function AuthGate() {
  const { user, isReady, logout } = usePrivy();
  const wallet = useEmbeddedWallet();

  if (!isReady) {
    return (
      <FullscreenMessage
        title="Carregando..."
        subtitle="Inicializando login abstrato com a Privy."
      />
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  if (!isConnected(wallet)) {
    return <LoginScreen onLogout={logout} />;
  }

  return (
    <View style={styles.appSurface}>
      <StatusBar style="dark" />
      <HomeScreen onLogout={logout} />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      {!PRIVY_APP_ID ? (
        <FullscreenMessage
          title="Adicione o PRIVY_APP_ID"
          subtitle="Defina EXPO_PUBLIC_PRIVY_APP_ID (App ID das Basics no dashboard) para habilitar o login."
        />
      ) : !PRIVY_CLIENT_ID ? (
        <FullscreenMessage
          title="Adicione o PRIVY_CLIENT_ID"
          subtitle="Defina EXPO_PUBLIC_PRIVY_CLIENT_ID (Client ID da aba Clients)."
        />
      ) : (
        <PrivyProvider appId={PRIVY_APP_ID} clientId={PRIVY_CLIENT_ID || undefined}>
          <PrivyElements />
          <AuthGate />
        </PrivyProvider>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appSurface: {
    flex: 1,
    backgroundColor: '#F5F1E8',
  },
  fallbackContainer: {
    flex: 1,
    backgroundColor: '#F5F1E8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  fallbackTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#18181B',
    textAlign: 'center',
  },
  fallbackSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#52525B',
    textAlign: 'center',
    lineHeight: 20,
  },
});
