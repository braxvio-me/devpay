/**
 * Skeleton — shimmer loading placeholder.
 *
 * Usage:
 *   <Skeleton width={200} height={16} radius={8} />
 *   <Skeleton width="100%" height={120} radius={16} style={{ marginBottom: 12 }} />
 */
import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';

interface SkeletonProps {
  width?: number | `${number}%`;
  height: number;
  radius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = '100%', height, radius = 10, style }: SkeletonProps) {
  const { isDark } = useTheme();
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.set(
      withRepeat(
        withSequence(
          withTiming(1, { duration: 900, easing: Easing.bezier(0.23, 1, 0.32, 1) }),
          withTiming(0, { duration: 900, easing: Easing.bezier(0.23, 1, 0.32, 1) })
        ),
        -1,
        false
      )
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.get(), [0, 1], [0.35, 0.8]),
  }));

  const baseBg = isDark ? '#1A252C' : '#E4EAEE';
  const shimmerStart = isDark ? '#1A252C' : '#E4EAEE';
  const shimmerMid = isDark ? '#24323A' : '#F0F3F5';
  const shimmerEnd = isDark ? '#1A252C' : '#E4EAEE';

  return (
    <View
      style={[
        styles.container,
        {
          width: width as any,
          height,
          borderRadius: radius,
          backgroundColor: baseBg,
          overflow: 'hidden',
        },
        style,
      ]}>
      <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle]}>
        <LinearGradient
          colors={[shimmerStart, shimmerMid, shimmerEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

// ─── Pre-built skeleton layouts ────────────────────────────────────────────

export function JobCardSkeleton() {
  return (
    <View style={skStyles.card}>
      <View style={skStyles.topRow}>
        <Skeleton width={40} height={40} radius={20} />
        <View style={{ flex: 1, gap: 6 }}>
          <Skeleton width="60%" height={12} radius={6} />
          <Skeleton width="40%" height={10} radius={5} />
        </View>
        <Skeleton width={20} height={20} radius={4} />
      </View>
      <Skeleton width="80%" height={14} radius={7} style={{ marginTop: 12 }} />
      <Skeleton width="55%" height={12} radius={6} style={{ marginTop: 6 }} />
      <View style={skStyles.tagsRow}>
        <Skeleton width={60} height={24} radius={8} />
        <Skeleton width={70} height={24} radius={8} />
        <Skeleton width={50} height={24} radius={8} />
      </View>
    </View>
  );
}

export function NotificationSkeleton() {
  return (
    <View style={skStyles.notifCard}>
      <Skeleton width={44} height={44} radius={22} />
      <View style={{ flex: 1, gap: 6 }}>
        <Skeleton width="75%" height={13} radius={6} />
        <Skeleton width="90%" height={11} radius={5} />
        <Skeleton width="50%" height={10} radius={5} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: 'hidden' },
});

const skStyles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EAEEF1',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
  },
});
