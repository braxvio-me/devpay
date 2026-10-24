import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useRole } from '@/contexts/RoleContext';

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
  const { isDark, colors } = useTheme();
  const { role, toggleRole } = useRole();

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
            <Text style={[styles.locationLabel, { color: colors.textSecondary }]}>
              Location
            </Text>
            <Ionicons name="chevron-down" size={13} color={colors.textSecondary} />
          </View>
          <View style={styles.locationValueRow}>
            <Ionicons name="location-sharp" size={13} color={colors.primary} />
            <Text style={[styles.locationText, { color: colors.text }]} numberOfLines={1}>
              {location}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Right controls: Role Toggle pill + Notification bell */}
      <View style={styles.rightSection}>
        {/* Role Switcher Pill */}
        <TouchableOpacity
          style={[
            styles.rolePill,
            {
              backgroundColor: role === 'client' ? (isDark ? '#2E1065' : '#F3E8FF') : (isDark ? '#1E293B' : '#EFF6FF'),
              borderColor: role === 'client' ? '#9333EA' : colors.primary,
            },
          ]}
          onPress={toggleRole}
          activeOpacity={0.8}>
          <Ionicons
            name={role === 'client' ? 'briefcase' : 'laptop'}
            size={12}
            color={role === 'client' ? '#9333EA' : colors.primary}
          />
          <Text
            style={[
              styles.rolePillText,
              { color: role === 'client' ? '#9333EA' : colors.primary },
            ]}>
            {role === 'client' ? 'Client' : 'Dev'}
          </Text>
          <Ionicons
            name="swap-horizontal"
            size={11}
            color={role === 'client' ? '#9333EA' : colors.primary}
          />
        </TouchableOpacity>

        {/* Circular Notification Bell */}
        <TouchableOpacity
          style={[
            styles.notificationButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          onPress={onNotificationPress}
          activeOpacity={0.8}>
          <Ionicons name="notifications-outline" size={20} color={colors.text} />
          {unreadCount > 0 && <View style={styles.notificationDot} />}
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#10B981',
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
    fontSize: 11,
    fontWeight: '500',
  },
  locationValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  locationText: {
    fontSize: 13,
    fontWeight: '700',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  rolePillText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
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
    top: 7,
    right: 7,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
});
