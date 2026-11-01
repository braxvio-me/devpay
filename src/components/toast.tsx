/**
 * In-app toast: short confirmation shown at the top of the screen.
 * Solid, theme-aware card; slides down, auto-hides, tap to dismiss.
 */
import React, { useRef, useCallback, forwardRef, useImperativeHandle, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Text } from '@/components/ui-text';
import { useTheme } from '@/contexts/ThemeContext';
import { Radius } from '@/constants/theme';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastConfig {
  title: string;
  message?: string;
  type?: ToastType;
  duration?: number; // ms — default 4000
  category?: string;
  important?: boolean;
}

export interface ToastHandle {
  show: (config: ToastConfig) => void;
  hide: () => void;
}

const ICON: Record<ToastType, keyof typeof Ionicons.glyphMap> = {
  success: 'checkmark',
  error: 'alert',
  info: 'information',
  warning: 'warning',
};

export const Toast = forwardRef<ToastHandle>((_, ref) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const y = useSharedValue(-140);
  const opacity = useSharedValue(0);
  const [config, setConfig] = useState<ToastConfig | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    y.set(withTiming(-140, { duration: 240, easing: Easing.in(Easing.cubic) }));
    opacity.set(withTiming(0, { duration: 200 }));
  }, [opacity, y]);

  const show = useCallback(
    (next: ToastConfig) => {
      if (timer.current) clearTimeout(timer.current);
      setConfig(next);
      Haptics.notificationAsync(next.type === 'error' ? Haptics.NotificationFeedbackType.Error : Haptics.NotificationFeedbackType.Success).catch(() => {});
      y.set(withSpring(0, { duration: 420, dampingRatio: 0.8 }));
      opacity.set(withTiming(1, { duration: 160 }));
      timer.current = setTimeout(hide, next.duration ?? 4000);
    },
    [hide, opacity, y]
  );

  useImperativeHandle(ref, () => ({ show, hide }));

  const anim = useAnimatedStyle(() => ({ transform: [{ translateY: y.get() }], opacity: opacity.get() }));

  if (!config) return null;
  const type = config.type ?? 'info';
  const tone = { success: colors.accentGreen, error: colors.accentCoral, info: colors.action, warning: colors.accentAmber }[type];

  return (
    <Animated.View style={[styles.wrap, { top: Math.max(14, insets.top + 6) }, anim]} accessibilityLiveRegion="polite" accessibilityRole="alert">
      <Pressable onPress={hide} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]} accessibilityHint="Dismiss">
        <View style={[styles.icon, { backgroundColor: tone }]}>
          <Ionicons name={ICON[type]} size={16} color="#FFFFFF" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {config.title}
          </Text>
          {config.message ? (
            <Text style={[styles.message, { color: colors.textSecondary }]} numberOfLines={2}>
              {config.message}
            </Text>
          ) : null}
        </View>
        <Ionicons name="close" size={16} color={colors.textMuted} />
      </Pressable>
    </Animated.View>
  );
});

Toast.displayName = 'Toast';

export function useToast() {
  const toastRef = useRef<ToastHandle>(null);
  const show = useCallback((config: ToastConfig) => toastRef.current?.show(config), []);
  const hide = useCallback(() => toastRef.current?.hide(), []);
  return { ref: toastRef, toastRef, show, hide };
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 16, right: 16, zIndex: 99999, alignItems: 'center' },
  card: {
    width: '100%',
    maxWidth: 520,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: Radius.lg,
    borderWidth: 1,
    boxShadow: '0px 10px 24px rgba(15, 30, 39, 0.14)',
  },
  icon: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 14, fontWeight: '600' },
  message: { fontSize: 13, lineHeight: 18, marginTop: 2 },
});
