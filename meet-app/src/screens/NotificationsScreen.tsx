import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NotificationsScreenProps {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function NotificationsScreen({
  visible,
  onClose,
  onLogout,
}: NotificationsScreenProps) {
  if (!visible) return null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <Ionicons name="notifications" size={24} color="#18181B" />
          </View>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        <TouchableOpacity onPress={onLogout} style={styles.closeButton}>
          <Ionicons name="log-out-outline" size={24} color="#18181B" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Empty State */}
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="notifications-off" size={80} color="#A78BFA" />
            </View>
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptySubtitle}>
              You will receive notifications about your events here
            </Text>

            {/* Info Cards */}
            <View style={styles.infoCards}>
              <View style={styles.infoCard}>
                <View style={styles.infoCardIcon}>
                  <Text style={styles.infoCardEmoji}>🎉</Text>
                </View>
                <Text style={styles.infoCardTitle}>Events</Text>
                <Text style={styles.infoCardText}>
                  Upcoming event reminders
                </Text>
              </View>

              <View style={styles.infoCard}>
                <View style={styles.infoCardIcon}>
                  <Text style={styles.infoCardEmoji}>💎</Text>
                </View>
                <Text style={styles.infoCardTitle}>POAPs</Text>
                <Text style={styles.infoCardText}>
                  New POAPs available
                </Text>
              </View>

              <View style={styles.infoCard}>
                <View style={styles.infoCardIcon}>
                  <Text style={styles.infoCardEmoji}>✨</Text>
                </View>
                <Text style={styles.infoCardTitle}>Updates</Text>
                <Text style={styles.infoCardText}>
                  Changes to your events
                </Text>
              </View>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FBBF24',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    transform: [{ rotate: '-5deg' }],
  },
  headerTitle: {
    fontSize: 24,
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
    flex: 1,
    padding: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyIconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    marginBottom: 32,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#18181B',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  emptySubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#71717A',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  infoCards: {
    width: '100%',
    gap: 16,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    alignItems: 'center',
  },
  infoCardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#A78BFA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#18181B',
    marginBottom: 12,
  },
  infoCardEmoji: {
    fontSize: 28,
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#18181B',
    marginBottom: 8,
  },
  infoCardText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#71717A',
    textAlign: 'center',
  },
});

