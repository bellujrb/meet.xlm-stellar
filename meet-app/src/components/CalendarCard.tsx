import React from 'react';
import { TouchableOpacity, Image, View, Text } from 'react-native';
import { Calendar } from '../types';
import { styles } from '../styles/components/CalendarCard.styles';

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

