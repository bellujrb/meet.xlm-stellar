import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Event } from '../types';

type EventCardProps = Omit<Event, 'id' | 'description' | 'attendees'> & {
  onPress?: () => void;
  confirmed?: boolean;
};

export default function EventCard({
  title,
  organizer,
  organizerIcon,
  time,
  location,
  image,
  status,
  statusTime,
  onPress,
  confirmed = false,
}: EventCardProps) {
  return (
    <TouchableOpacity 
      style={styles.eventCard} 
      activeOpacity={0.95}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.eventImage} />
        {confirmed && (
          <View style={styles.confirmBadge}>
            <Text style={styles.confirmBadgeText}>Confir...</Text>
          </View>
        )}
      </View>
      <View style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <View style={styles.organizerContainer}>
            <Text style={styles.organizerIcon}>{organizerIcon}</Text>
            <Text style={styles.organizer} numberOfLines={1}>
              {organizer}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              status === 'LIVE' && styles.statusBadgeLive,
            ]}
          >
            <Text 
              style={[
                styles.statusText,
                status === 'LIVE' && styles.statusTextLive,
              ]}
            >
              {status === 'LIVE' ? 'LIVE' : statusTime}
            </Text>
          </View>
        </View>

        <Text style={styles.eventTitle}>{title}</Text>

        <View style={styles.eventDetails}>
          <View style={styles.eventDetailRow}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.eventDetailText}>{time}</Text>
          </View>
          <View style={styles.eventDetailRow}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.eventDetailText}>{location}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  eventCard: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  imageContainer: {
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#E5E7EB',
    borderBottomWidth: 3,
    borderBottomColor: '#18181B',
  },
  confirmBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: '#4ADE80',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    transform: [{ rotate: '-3deg' }],
  },
  confirmBadgeText: {
    color: '#18181B',
    fontSize: 13,
    fontWeight: '800',
  },
  eventContent: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  organizerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    backgroundColor: '#F5F1E8',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#18181B',
  },
  organizerIcon: {
    fontSize: 16,
  },
  organizer: {
    fontSize: 13,
    color: '#18181B',
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    borderWidth: 2,
    borderColor: '#18181B',
    transform: [{ rotate: '3deg' }],
  },
  statusBadgeLive: {
    backgroundColor: '#EF4444',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#18181B',
  },
  statusTextLive: {
    color: '#FFFFFF',
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#18181B',
    marginBottom: 14,
    lineHeight: 28,
    letterSpacing: -0.5,
  },
  eventDetails: {
    gap: 8,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#18181B',
  },
  eventDetailText: {
    fontSize: 14,
    color: '#18181B',
    fontWeight: '600',
  },
});

