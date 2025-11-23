import { useState, useEffect } from 'react';
import { IoSearch, IoCloseCircle } from 'react-icons/io5';
import EventCard from '../components/EventCard';
import EventCardSkeleton from '../components/EventCardSkeleton';
import UserMenu from '../components/UserMenu';
import { apiClient } from '../services/api';
import { useStellarWallet } from '../hooks/useStellarWallet';
import { Event } from '../types';
import styles from './SearchScreen.module.css';

interface SearchScreenProps {
  visible: boolean;
  onClose: () => void;
  onEventPress: (event: Event) => void;
  availableEvents: Event[];
  onLogout: () => void;
}

export default function SearchScreen({
  visible,
  onEventPress,
  availableEvents: _availableEvents,
  onLogout,
}: SearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [availableEvents, setAvailableEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { publicKey: stellarAddress } = useStellarWallet(true);

  const cities = ['All', 'Buenos Aires', 'São Paulo', 'Online'];

  // Fetch events from API - only non-registered events
  const fetchEvents = async () => {
    if (!visible) return;

    setLoading(true);
    try {
      const response = await apiClient.listEvents({
        walletAddress: stellarAddress || undefined,
        registered: false, // Only fetch non-registered events
        limit: 100,
      });
      const events = response.events.map(apiEvent => apiClient.convertApiEventToEvent(apiEvent));
      // Backend already filters, but we ensure no duplicates here
      const uniqueEvents = events.filter((event, index, self) =>
        index === self.findIndex((e) => e.id === event.id)
      );
      setAvailableEvents(uniqueEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      setAvailableEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [visible, stellarAddress, refreshTrigger]);

  // Expose refresh function to parent via window (for cross-component communication)
  useEffect(() => {
    const refreshCallback = () => {
      setRefreshTrigger(prev => prev + 1);
    };
    (window as any).__refreshSearchEvents = refreshCallback;
    return () => {
      delete (window as any).__refreshSearchEvents;
    };
  }, []);

  // Filter events by search query and city
  // Note: registered events are already filtered out by backend when fetching
  const filteredEvents = availableEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity =
      !selectedCity ||
      selectedCity === 'All' ||
      event.location.toLowerCase().includes(selectedCity.toLowerCase());

    return matchesSearch && matchesCity;
  });

  if (!visible) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>
            <IoSearch size={24} />
          </div>
          <h2 className={styles.headerTitle}>Popular Events</h2>
        </div>
        <UserMenu
          onLogout={onLogout}
          stellarAddress={stellarAddress || undefined}
        />
      </div>

      <div className={styles.scrollView}>
        <div className={styles.searchSection}>
          <div className={styles.searchBar}>
            <IoSearch size={20} color="#71717A" />
            <input
              className={styles.searchInput}
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery.length > 0 && (
              <button onClick={() => setSearchQuery('')} className={styles.clearButton}>
                <IoCloseCircle size={20} color="#71717A" />
              </button>
            )}
          </div>
        </div>

        <div className={styles.filterSection}>
          <div className={styles.filterLabel}>Location 📍</div>
          <div className={styles.filterScroll}>
            {cities.map((city) => (
              <button
                key={city}
                className={`${styles.cityChip} ${selectedCity === city ? styles.cityChipActive : ''}`}
                onClick={() => setSelectedCity(city)}
              >
                <span className={styles.cityChipText}>{city}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.eventsSection}>
          <h3 className={styles.sectionTitle}>
            {loading ? 'Loading...' : `${filteredEvents.length} Event${filteredEvents.length !== 1 ? 's' : ''} ${searchQuery ? `for "${searchQuery}"` : 'Available'}`}
          </h3>

          {loading ? (
            <>
              <EventCardSkeleton />
              <EventCardSkeleton />
              <EventCardSkeleton />
              <EventCardSkeleton />
            </>
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
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
                onPress={() => onEventPress(event)}
                confirmed={false}
              />
            ))
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyEmoji}>🔍</div>
              <div className={styles.emptyText}>No events found</div>
              <div className={styles.emptySubtext}>
                Try searching for another term
              </div>
            </div>
          )}
        </div>

        <div style={{ height: 100 }} />
      </div>
    </div>
  );
}

