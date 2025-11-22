import React, { useState } from 'react';
import { IoSearch, IoCloseCircle, IoLogOutOutline } from 'react-icons/io5';
import EventCard from '../components/EventCard';
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
  onClose,
  onEventPress,
  availableEvents,
  onLogout,
}: SearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const cities = ['All', 'Buenos Aires', 'São Paulo', 'Online'];

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
        <button onClick={onLogout} className={styles.closeButton} aria-label="Logout">
          <IoLogOutOutline size={24} />
        </button>
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
            {filteredEvents.length} Event{filteredEvents.length !== 1 ? 's' : ''}{' '}
            {searchQuery ? `for "${searchQuery}"` : 'Available'}  
          </h3>

          {filteredEvents.length > 0 ? (
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

