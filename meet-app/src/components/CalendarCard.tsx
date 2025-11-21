import React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { Calendar } from '../types';

type CalendarCardProps = Omit<Calendar, 'id' | 'color' | 'eventCount'> & {
  onPress?: () => void;
};

export default function CalendarCard({
  name,
  image,
  onPress,
}: CalendarCardProps) {
  return (
    <TouchableOpacity 
      style={styles.calendarCard} 
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Image source={image} style={styles.calendarImage} resizeMode="cover" />
      <View style={styles.overlay}>
        <Text style={styles.calendarName}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  calendarCard: {
    width: 150,
    height: 150,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  calendarImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#18181B',
    padding: 12,
    borderTopWidth: 3,
    borderTopColor: '#18181B',
  },
  calendarName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
});

