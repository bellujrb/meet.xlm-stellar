import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EventCard from '../components/EventCard';
import CalendarCard from '../components/CalendarCard';
import Header from '../components/Header';
import UserMenu from '../components/UserMenu';
import { useStellarWallet } from '../hooks/useStellarWallet';
import BottomNavigation from '../components/BottomNavigation';
import EventDetailsScreen from './EventDetailsScreen';
import CreateEventScreen from './CreateEventScreen';
import SearchScreen from './SearchScreen';
import NotificationsScreen from './NotificationsScreen';
import SettingsScreen from './SettingsScreen';
import SuccessModal from '../components/SuccessModal';
import ZKProofModal from '../components/ZKProofModal';
import RegisterSuccessModal from '../components/RegisterSuccessModal';
import { MOCK_EVENTS, MOCK_CALENDARS, AVAILABLE_EVENTS } from '../data/mockData';
import { TabName, Event } from '../types';

interface HomeScreenProps {
  onLogout: () => void;
}

export default function HomeScreen({ onLogout }: HomeScreenProps) {
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [currentScreen, setCurrentScreen] = useState<'home' | 'search' | 'notifications' | 'settings'>('home');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdEventName, setCreatedEventName] = useState('');
  const [createdEventDate, setCreatedEventDate] = useState('');
  const [showZKProof, setShowZKProof] = useState(false);
  const [showRegisterSuccess, setShowRegisterSuccess] = useState(false);
  const [selectedEventForRegister, setSelectedEventForRegister] = useState<Event | null>(null);
  const { publicKey: stellarAddress } = useStellarWallet(true);

  // Filter only confirmed events for home
  const confirmedEvents = MOCK_EVENTS.filter(
    (event) => event.id === '1' || event.id === '2'
  );

  const handleEventPress = (eventId: string) => {
    const event = MOCK_EVENTS.find((e) => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setShowEventDetails(true);
    }
  };

  const handleCalendarPress = (calendarId: string) => {
    Alert.alert('Calendar', `You clicked on calendar ${calendarId}`);
  };

  const handleLogoutPress = () => {
    Alert.alert(
      'Disconnect',
      'Are you sure you want to disconnect your wallet?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: onLogout,
        },
      ]
    );
  };

  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);
    if (tab === 'add') {
      setShowCreateEvent(true);
    } else if (tab === 'search') {
      setCurrentScreen('search');
    } else if (tab === 'home') {
      setCurrentScreen('home');
    } else if (tab === 'notifications') {
      setCurrentScreen('notifications');
    } else if (tab === 'settings') {
      setCurrentScreen('settings');
    }
  };

  const handleEventCreated = (eventName: string, eventDate: string) => {
    setCreatedEventName(eventName);
    setCreatedEventDate(eventDate);
    setShowSuccess(true);
  };

  const handleSearchEventPress = (event: Event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const [hadZKProof, setHadZKProof] = useState(false);

  const handleRegister = (event: Event) => {
    setSelectedEventForRegister(event);
    if (event.requiresXLM && event.xlmMinimum) {
      setHadZKProof(true);
      setShowZKProof(true);
    } else {
      // Registro direto sem ZK
      setHadZKProof(false);
      setShowRegisterSuccess(true);
    }
  };

  const handleZKProofSuccess = () => {
    setShowZKProof(false);
    setShowRegisterSuccess(true);
  };

  const handleRegisterComplete = () => {
    setShowRegisterSuccess(false);
    // Marcar evento como registrado
    if (selectedEventForRegister) {
      selectedEventForRegister.isRegistered = true;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Conditional Screen Rendering */}
      {currentScreen === 'home' ? (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <Header 
            onSettingsPress={handleLogoutPress}
            rightComponent={
              <UserMenu
                onLogout={handleLogoutPress}
                stellarAddress={stellarAddress || undefined}
              />
            }
          />

        {/* Your Events Section */}
        <View style={[styles.section, styles.firstSection]}>
          <View style={styles.sectionHeader}>
            <View style={styles.titleWithEmoji}>
              <Text style={styles.sectionTitle}>Your Events</Text>
              <Text style={styles.decorativeEmoji}>🎉</Text>
            </View>
            <TouchableOpacity 
              onPress={() => Alert.alert('See All', 'Loading all events...')}
              style={styles.seeAllBadge}
              activeOpacity={0.7}
            >
              <Text style={styles.seeAllButton}>See All ›</Text>
            </TouchableOpacity>
          </View>

          {confirmedEvents.length > 0 ? (
            confirmedEvents.map((event) => (
              <EventCard
                key={event.id}
                title={event.title}
                organizer={event.organizer}
                organizerIcon={event.organizerIcon}
                time={event.time}
                location={event.location}
                image={event.image}
                status={event.status}
                statusTime={event.statusTime}
                onPress={() => handleEventPress(event.id)}
                confirmed={true}
              />
            ))
          ) : (
            <View style={styles.emptyEventsState}>
              <Text style={styles.emptyEventsEmoji}>🎫</Text>
              <Text style={styles.emptyEventsText}>
                You haven't confirmed attendance at any events yet
              </Text>
              <TouchableOpacity
                style={styles.exploreButton}
                onPress={() => setCurrentScreen('search')}
                activeOpacity={0.8}
              >
                <Ionicons name="search" size={20} color="#18181B" />
                <Text style={styles.exploreButtonText}>Explore Events</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Your Collections Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.titleWithEmoji}>
              <Text style={styles.sectionTitle}>Your Collections</Text>
              <Text style={styles.decorativeEmoji}>📅</Text>
            </View>
            <TouchableOpacity 
              onPress={() => Alert.alert('See All', 'Loading all collections...')}
              style={styles.seeAllBadge}
            >
              <Text style={styles.seeAllButton}>See All ›</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.calendarsScrollView}
            contentContainerStyle={styles.calendarsContainer}
          >
            {MOCK_CALENDARS.map((calendar) => (
              <CalendarCard
                key={calendar.id}
                name={calendar.name}
                image={calendar.image}
                onPress={() => handleCalendarPress(calendar.id)}
              />
            ))}
          </ScrollView>
        </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      ) : currentScreen === 'search' ? (
        <SearchScreen
          visible={true}
          onClose={() => {
            setCurrentScreen('home');
            setActiveTab('home');
          }}
          onEventPress={handleSearchEventPress}
          availableEvents={AVAILABLE_EVENTS}
          onLogout={handleLogoutPress}
        />
      ) : currentScreen === 'notifications' ? (
        <NotificationsScreen
          visible={true}
          onClose={() => {
            setCurrentScreen('home');
            setActiveTab('home');
          }}
          onLogout={handleLogoutPress}
        />
      ) : currentScreen === 'settings' ? (
        <SettingsScreen
          visible={true}
          onClose={() => {
            setCurrentScreen('home');
            setActiveTab('home');
          }}
          onLogout={handleLogoutPress}
        />
      ) : null}

      <BottomNavigation 
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />

      {/* Create Event Modal */}
      <CreateEventScreen
        visible={showCreateEvent}
        onClose={() => setShowCreateEvent(false)}
        onSuccess={handleEventCreated}
      />

      {/* Success Modal with Confetti */}
      <SuccessModal
        visible={showSuccess}
        eventName={createdEventName}
        eventDate={createdEventDate}
        onClose={() => setShowSuccess(false)}
      />

      {/* ZK Proof Modal */}
      <ZKProofModal
        visible={showZKProof}
        xlmRequired={selectedEventForRegister?.xlmMinimum || 0}
        onClose={() => setShowZKProof(false)}
        onSuccess={handleZKProofSuccess}
      />

      {/* Register Success Modal */}
      <RegisterSuccessModal
        visible={showRegisterSuccess}
        eventName={selectedEventForRegister?.title || ''}
        onClose={handleRegisterComplete}
        hadZKProof={hadZKProof}
      />

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetailsScreen
          visible={showEventDetails}
          onClose={() => setShowEventDetails(false)}
          event={selectedEvent}
          isMinted={selectedEvent.id === '1' || selectedEvent.id === '2'}
          isRegistered={selectedEvent.isRegistered || false}
          requiresXLM={selectedEvent.requiresXLM || false}
          xlmMinimum={selectedEvent.xlmMinimum}
          onRegister={() => handleRegister(selectedEvent)}
          mintInfo={
            selectedEvent.id === '1'
              ? {
                  collector: 'bellu.xlm',
                  walletAddress: '0x1146dda2581e43802c201155bd6d4ae6bc59eea0',
                  mintedDate: '16 hours ago',
                  blockchain: 'Stellar',
                }
              : selectedEvent.id === '2'
              ? {
                  collector: 'crypto.stars',
                  walletAddress: '0xabcd1234ef5678901234567890abcdef12345678',
                  mintedDate: '2 days ago',
                  blockchain: 'Stellar',
                }
              : undefined
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1E8',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 36,
  },
  firstSection: {
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleWithEmoji: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#18181B',
    letterSpacing: -1,
  },
  decorativeEmoji: {
    fontSize: 28,
    transform: [{ rotate: '12deg' }],
  },
  seeAllBadge: {
    backgroundColor: '#A78BFA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    transform: [{ rotate: '2deg' }],
  },
  seeAllButton: {
    fontSize: 14,
    color: '#18181B',
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  calendarsScrollView: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  calendarsContainer: {
    flexDirection: 'row',
    gap: 16,
    paddingRight: 20,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginTop: 12,
    borderWidth: 3,
    borderColor: '#18181B',
    borderStyle: 'dashed',
    shadowColor: '#18181B',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#71717A',
    fontWeight: '700',
  },
  emptyEventsState: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#18181B',
    borderStyle: 'dashed',
    shadowColor: '#18181B',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  emptyEventsEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyEventsText: {
    fontSize: 16,
    color: '#71717A',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#A78BFA',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#18181B',
  },
});
