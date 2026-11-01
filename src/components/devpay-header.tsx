import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components/ui-text';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Avatar, IconButton } from '@/components/ds';
import { useCurrentUser } from '@/contexts/AuthContext';
import { Layout } from '@/constants/theme';

interface DevPayHeaderProps {
  userName?: string;
  location?: string;
  unreadCount?: number;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
  onLocationPress?: () => void;
}

export function DevPayHeader({
  location,
  unreadCount = 0,
  onNotificationPress,
  onProfilePress,
  onLocationPress,
}: DevPayHeaderProps) {
  const { colors } = useTheme();
  const me = useCurrentUser();
  const place = location ?? me.location;

  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <Pressable onPress={onProfilePress} accessibilityRole="button" accessibilityLabel="Open profile" hitSlop={6}>
          <Avatar uri={me.avatar} size={48} />
        </Pressable>
        <Pressable onPress={onLocationPress} accessibilityRole="button" accessibilityLabel={`Location: ${place}`} style={{ gap: 3 }}>
          <View style={styles.row}>
            <Text style={[styles.caption, { color: colors.textSecondary }]}>My Location</Text>
            <Ionicons name="chevron-down" size={13} color={colors.textSecondary} />
          </View>
          <View style={styles.row}>
            <Ionicons name="location-sharp" size={15} color={colors.text} />
            <Text style={[styles.location, { color: colors.text }]} numberOfLines={1}>
              {place}
            </Text>
          </View>
        </Pressable>
      </View>

      <IconButton
        icon="notifications-outline"
        size={45}
        badge={unreadCount > 0}
        onPress={onNotificationPress}
        accessibilityLabel={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: Layout.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.margin,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 12, flexShrink: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  caption: { fontSize: 12 },
  location: { fontSize: 14, fontWeight: '600', letterSpacing: -0.1 },
});
