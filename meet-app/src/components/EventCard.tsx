import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Event } from '../types';
import { styles } from '../styles/components/EventCard.styles';

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

