import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import EventCard from '../components/EventCard';
import CalendarCard from '../components/CalendarCard';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import EventDetailsScreen from './EventDetailsScreen';
import CreateEventScreen from './CreateEventScreen';
import { MOCK_EVENTS, MOCK_CALENDARS } from '../data/mockData';
import { TabName } from '../types';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [selectedEvent, setSelectedEvent] = useState<typeof MOCK_EVENTS[0] | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  const handleEventPress = (eventId: string) => {
    const event = MOCK_EVENTS.find((e) => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setShowEventDetails(true);
    }
  };

  const handleCalendarPress = (calendarId: string) => {
    Alert.alert('Calendário', `Você clicou no calendário ${calendarId}`);
  };

  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);
    if (tab === 'add') {
      setShowCreateEvent(true);
    } else {
      Alert.alert('Navegação', `Você clicou em ${tab}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Header 
          onSettingsPress={() => Alert.alert('Configurações', 'Em desenvolvimento...')}
        />

        {/* Seus Eventos Section */}
        <View style={[styles.section, styles.firstSection]}>
          <View style={styles.sectionHeader}>
            <View style={styles.titleWithEmoji}>
              <Text style={styles.sectionTitle}>Seus Eventos</Text>
              <Text style={styles.decorativeEmoji}>🎉</Text>
            </View>
            <TouchableOpacity 
              onPress={() => Alert.alert('Ver Todos', 'Carregando todos os eventos...')}
              style={styles.seeAllBadge}
              activeOpacity={0.7}
            >
              <Text style={styles.seeAllButton}>Ver Todos ›</Text>
            </TouchableOpacity>
          </View>

          {MOCK_EVENTS.map((event) => (
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
              confirmed={event.id === '1' || event.id === '2'}
            />
          ))}
        </View>

        {/* Seus Calendários Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.titleWithEmoji}>
              <Text style={styles.sectionTitle}>Suas Colleções</Text>
              <Text style={styles.decorativeEmoji}>📅</Text>
            </View>
            <TouchableOpacity 
              onPress={() => Alert.alert('Ver Todos', 'Carregando todas as coleções...')}
              style={styles.seeAllBadge}
            >
              <Text style={styles.seeAllButton}>Ver Todos ›</Text>
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

      <BottomNavigation 
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />

      {/* Create Event Modal */}
      <CreateEventScreen
        visible={showCreateEvent}
        onClose={() => setShowCreateEvent(false)}
      />

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetailsScreen
          visible={showEventDetails}
          onClose={() => setShowEventDetails(false)}
          event={selectedEvent}
          isMinted={selectedEvent.id === '1' || selectedEvent.id === '2'}
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
});

