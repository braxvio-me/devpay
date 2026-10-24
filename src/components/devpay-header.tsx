import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

interface DevPayHeaderProps {
  userName?: string;
  location?: string;
  unreadCount?: number;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

export function DevPayHeader({
  location = 'Accra, Ghana',
  unreadCount = 1,
  onNotificationPress,
  onProfilePress,
}: DevPayHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Left: Avatar + Location */}
      <TouchableOpacity
        style={styles.profileSection}
        onPress={onProfilePress}
        activeOpacity={0.8}>
        <View style={styles.avatarWrapper}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            }}
            style={styles.avatar}
          />
          <View style={styles.onlineBadge} />
        </View>

        <View style={styles.locationContainer}>
          <View style={styles.locationTitleRow}>
            <Text style={styles.locationLabel}>My Location</Text>
            <Ionicons name="chevron-down" size={14} color={Colors.light.textSecondary} />
          </View>
          <View style={styles.locationValueRow}>
            <Ionicons name="location-sharp" size={13} color={Colors.light.text} />
            <Text style={styles.locationText} numberOfLines={1}>
              {location}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Right: Circular Notification Bell (45px diameter matching reference cheat sheet) */}
      <TouchableOpacity
        style={styles.notificationButton}
        onPress={onNotificationPress}
        activeOpacity={0.8}>
        <Ionicons name="notifications-outline" size={20} color={Colors.light.text} />
        {unreadCount > 0 && <View style={styles.notificationDot} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 8,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E2E8F0',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: Colors.light.accentGreen,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  locationContainer: {
    justifyContent: 'center',
  },
  locationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  locationValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  notificationButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.accentCoral,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
});
