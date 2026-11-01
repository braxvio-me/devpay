import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from '@/components/ui-text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';
import { useOnline } from '@/hooks/use-online';
import { Radius } from '@/constants/theme';

/** Slim banner above the bottom nav on every screen while the device is offline. */
export function OfflineBanner() {
  const online = useOnline();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  if (online) return null;
  return (
    <Animated.View
      entering={FadeInDown.duration(260)}
      exiting={FadeOutDown.duration(200)}
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={[styles.banner, { bottom: Math.max(insets.bottom, 12) + 76, backgroundColor: colors.ink }]}>
      <Ionicons name="cloud-offline-outline" size={16} color={colors.onInk} />
      <Text style={[styles.text, { color: colors.onInk }]} maxFontSizeMultiplier={1.3}>
        You’re offline. Payments and messages are paused.
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    height: 36,
    borderRadius: Radius.pill,
  },
  text: { fontSize: 13, fontWeight: '500' },
});
