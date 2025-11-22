import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface UserMenuProps {
  onLogout: () => void;
  stellarAddress?: string;
}

export default function UserMenu({ onLogout, stellarAddress }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const [stellarBalance, setStellarBalance] = useState<string>('—');
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  // Mock user data
  const email = 'user@example.com';
  const displayName = 'User';
  const walletAddress = stellarAddress ? `${stellarAddress.slice(0, 6)}…${stellarAddress.slice(-4)}` : 'Carteira';

  React.useEffect(() => {
    let cancelled = false;
    const fetchBalance = async () => {
      if (!stellarAddress) {
        setStellarBalance('—');
        return;
      }
      try {
        setIsLoadingBalance(true);
        const res = await fetch(`https://horizon.stellar.org/accounts/${stellarAddress}`);
        if (!res.ok) {
          if (res.status === 404) {
            if (!cancelled) setStellarBalance('0.00');
            return;
          }
          if (!cancelled) setStellarBalance('—');
          return;
        }
        const data = await res.json();
        const native = data.balances?.find((b: any) => b.asset_type === 'native');
        if (!cancelled) {
          if (native?.balance) {
            const formatted = parseFloat(native.balance).toFixed(2);
            setStellarBalance(formatted);
          } else {
            setStellarBalance('—');
          }
        }
      } catch (err) {
        console.warn('Stellar balance fetch failed', err);
        if (!cancelled) setStellarBalance('—');
      } finally {
        if (!cancelled) setIsLoadingBalance(false);
      }
    };
    fetchBalance();
    return () => {
      cancelled = true;
    };
  }, [stellarAddress]);

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => setOpen((v) => !v)}
        activeOpacity={0.85}
      >
        <Ionicons name="person-circle" size={24} color="#18181B" />
      </TouchableOpacity>

      {open && (
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.dropdown}>
                <View style={styles.headerRow}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>✨</Text>
                  </View>
                  <View style={styles.identity}>
                    <Text style={styles.name} numberOfLines={1}>{displayName}</Text>
                    <Text style={styles.meta}>{walletAddress}</Text>
                  </View>
                  <TouchableOpacity onPress={onLogout} style={styles.logoutButton} activeOpacity={0.8}>
                    <Ionicons name="log-out-outline" size={18} color="#18181B" />
                  </TouchableOpacity>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Carteira</Text>
                  <View style={styles.badgesRow}>
                    <View style={[styles.badge, styles.badgeYellow]}>
                      <Ionicons name="planet" size={14} color="#18181B" />
                      {isLoadingBalance ? (
                        <ActivityIndicator size="small" color="#18181B" />
                      ) : (
                        <Text style={styles.badgeText} numberOfLines={1}>
                          XLM {stellarBalance}
                        </Text>
                      )}
                    </View>
                    <View style={[styles.badge, styles.badgePurple]}>
                      <Ionicons name="shield-checkmark" size={14} color="#18181B" />
                      <Text style={styles.badgeText}>Wallet On</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#18181B',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#18181B',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  overlay: {
    position: 'absolute',
    top: 48,
    right: 0,
    minWidth: 240,
    maxWidth: 280,
    paddingHorizontal: 6,
    zIndex: 50,
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#18181B',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#18181B',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FBBF24',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  avatarText: {
    fontSize: 20,
  },
  identity: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: '900',
    color: '#18181B',
    letterSpacing: -0.5,
  },
  meta: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3F3F46',
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#18181B',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  badgeYellow: { backgroundColor: '#FBBF24' },
  badgePurple: { backgroundColor: '#A78BFA' },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#18181B',
  },
  logoutButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#18181B',
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#18181B',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
});
