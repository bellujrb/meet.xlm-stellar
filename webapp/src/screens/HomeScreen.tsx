import { useState, useEffect } from 'react';
import { IoSearch } from 'react-icons/io5';
import EventCard from '../components/EventCard';
import Header from '../components/Header';
import UserMenu from '../components/UserMenu';
import { useStellarWallet } from '../hooks/useStellarWallet';
import BottomNavigation from '../components/BottomNavigation';
import SuccessModal from '../components/SuccessModal';
import ZKProofModal from '../components/ZKProofModal';
import RegisterSuccessModal from '../components/RegisterSuccessModal';
import { apiClient } from '../services/api';
import { TabName, Event } from '../types';
import styles from './HomeScreen.module.css';
import SearchScreen from './SearchScreen';
import NotificationsScreen from './NotificationsScreen';
import SettingsScreen from './SettingsScreen';
import EventDetailsScreen from './EventDetailsScreen';
import CreateEventScreen from './CreateEventScreen';

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
  const { publicKey: stellarAddress, disconnect } = useStellarWallet(true);
  const [confirmedEvents, setConfirmedEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  // Fetch user's events
  useEffect(() => {
    const fetchUserEvents = async () => {
      if (!stellarAddress) {
        setConfirmedEvents([]);
        return;
      }

      setLoadingEvents(true);
      try {
        const response = await apiClient.listUserEvents(stellarAddress);
        const events = response.events.map(apiEvent => apiClient.convertApiEventToEvent(apiEvent));
        setConfirmedEvents(events);
      } catch (error) {
        console.error('Error fetching user events:', error);
        setConfirmedEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchUserEvents();
  }, [stellarAddress]);

  const handleEventPress = (event: Event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };


  const handleLogoutPress = async () => {
    if (confirm('Are you sure you want to disconnect your wallet?')) {
      await disconnect();
      onLogout();
    }
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
      setHadZKProof(false);
      setShowRegisterSuccess(true);
    }
  };

  const handleZKProofSuccess = () => {
    setShowZKProof(false);
    setShowRegisterSuccess(true);
  };

  const handleRegisterComplete = async () => {
    setShowRegisterSuccess(false);
    if (selectedEventForRegister && stellarAddress) {
      try {
        await apiClient.registerAttendance(selectedEventForRegister.id, stellarAddress);
        // Refresh user events
        const response = await apiClient.listUserEvents(stellarAddress);
        const events = response.events.map(apiEvent => apiClient.convertApiEventToEvent(apiEvent));
        setConfirmedEvents(events);
        // Update selected event
        const updatedEvent = events.find(e => e.id === selectedEventForRegister.id);
        if (updatedEvent) {
          setSelectedEvent(updatedEvent);
          setSelectedEventForRegister(updatedEvent);
        } else {
          selectedEventForRegister.isRegistered = true;
        }
      } catch (error) {
        console.error('Error registering attendance:', error);
        alert(error instanceof Error ? error.message : 'Failed to register attendance. Please try again.');
      }
    }
  };

  return (
    <div className={styles.container}>
      {currentScreen === 'home' ? (
        <div className={styles.scrollView}>
          <Header 
            onSettingsPress={handleLogoutPress}
            rightComponent={
              <UserMenu
                onLogout={handleLogoutPress}
                stellarAddress={stellarAddress || undefined}
              />
            }
          />

          <div className={`${styles.section} ${styles.firstSection}`}>
            <div className={styles.sectionHeader}>
              <div className={styles.titleWithEmoji}>
                <h2 className={styles.sectionTitle}>Your Events</h2>
                <span className={styles.decorativeEmoji}>🎉</span>
              </div>
              <button 
                onClick={() => alert('See All - Loading all events...')}
                className={styles.seeAllBadge}
              >
                <span className={styles.seeAllButton}>See All ›</span>
              </button>
            </div>

            {loadingEvents ? (
              <div className={styles.emptyEventsState}>
                <div className={styles.emptyEventsEmoji}>⏳</div>
                <p className={styles.emptyEventsText}>Loading your events...</p>
              </div>
            ) : confirmedEvents.length > 0 ? (
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
                  onPress={() => handleEventPress(event)}
                  confirmed={true}
                />
              ))
            ) : (
              <div className={styles.emptyEventsState}>
                <div className={styles.emptyEventsEmoji}>🎫</div>
                <p className={styles.emptyEventsText}>
                  You haven't confirmed attendance at any events yet
                </p>
                <button
                  className={styles.exploreButton}
                  onClick={() => setCurrentScreen('search')}
                >
                  <IoSearch size={20} />
                  <span className={styles.exploreButtonText}>Explore Events</span>
                </button>
              </div>
            )}
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.titleWithEmoji}>
                <h2 className={styles.sectionTitle}>Your Collections</h2>
                <span className={styles.decorativeEmoji}>📅</span>
              </div>
              <button 
                onClick={() => alert('See All - Loading all collections...')}
                className={styles.seeAllBadge}
              >
                <span className={styles.seeAllButton}>See All ›</span>
              </button>
            </div>

            <div className={styles.calendarsScrollView}>
              {/* TODO: Replace with API call to fetch user's calendars */}
              {confirmedEvents.length === 0 && (
                <div className={styles.emptyEventsState}>
                  <div className={styles.emptyEventsEmoji}>📅</div>
                  <p className={styles.emptyEventsText}>
                    No collections yet
                  </p>
                </div>
              )}
            </div>
          </div>

          <div style={{ height: 100 }} />
        </div>
      ) : currentScreen === 'search' ? (
        <SearchScreen
          visible={true}
          onClose={() => {
            setCurrentScreen('home');
            setActiveTab('home');
          }}
          onEventPress={handleSearchEventPress}
          availableEvents={[]}
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

      <CreateEventScreen
        visible={showCreateEvent}
        onClose={() => setShowCreateEvent(false)}
        onSuccess={handleEventCreated}
      />

      <SuccessModal
        visible={showSuccess}
        eventName={createdEventName}
        eventDate={createdEventDate}
        onClose={() => setShowSuccess(false)}
      />

      <ZKProofModal
        visible={showZKProof}
        xlmRequired={selectedEventForRegister?.xlmMinimum || 0}
        onClose={() => setShowZKProof(false)}
        onSuccess={handleZKProofSuccess}
      />

      <RegisterSuccessModal
        visible={showRegisterSuccess}
        eventName={selectedEventForRegister?.title || ''}
        onClose={handleRegisterComplete}
        hadZKProof={hadZKProof}
      />

      {selectedEvent && (
        <EventDetailsScreen
          visible={showEventDetails}
          onClose={() => setShowEventDetails(false)}
          event={selectedEvent}
          isMinted={false}
          isRegistered={selectedEvent.isRegistered || false}
          requiresXLM={selectedEvent.requiresXLM || false}
          xlmMinimum={selectedEvent.xlmMinimum}
          onRegister={() => handleRegister(selectedEvent)}
          mintInfo={undefined}
        />
      )}
    </div>
  );
}

