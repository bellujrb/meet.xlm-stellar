import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <SafeAreaProvider>
      <View style={styles.appSurface}>
        <StatusBar style="dark" />
        {isLoggedIn ? (
          <HomeScreen onLogout={handleLogout} />
        ) : (
          <LoginScreen onLogin={handleLogin} onLogout={handleLogout} />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appSurface: {
    flex: 1,
    backgroundColor: '#F5F1E8',
  },
});
