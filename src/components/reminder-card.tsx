import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

interface ReminderCardProps {
  title?: string;
  subtitle?: string;
  countdown?: string;
  onPress?: () => void;
}

export function ReminderCard({
  title = 'Reminder',
  subtitle = 'Milestone deliverable due in 2 hours',
  countdown = '9 : 4 5',
  onPress,
}: ReminderCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.85}>
      {/* Icon */}
      <View style={styles.iconCircle}>
        <Ionicons name="stopwatch" size={18} color={Colors.light.primary} />
      </View>

      {/* Text Info */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>

      {/* Countdown Badge */}
      <View style={styles.countdownBadge}>
        <Text style={styles.countdownText}>{countdown}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 14,
    backgroundColor: '#EBF4FE',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D4E6FC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  countdownBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#D4E6FC',
  },
  countdownText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.light.primary,
    letterSpacing: 1.5,
  },
});
