/**
 * Ultra-Premium Liquid Glassmorphic Notification Banner for DevPay
 * Inspired by iPhone Dynamic Island & Samsung OneUI morphism.
 * Also schedules native phone notifications for the device notification center.
 */
import React, { useRef, useCallback, forwardRef, useImperativeHandle, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastConfig {
  title: string;
  message?: string;
  type?: ToastType;
  duration?: number; // ms — default 4000
  category?: string; // e.g. "DEVPAY ESCROW", "MILESTONE", "MESSAGE"
  important?: boolean;
}

export interface ToastHandle {
  show: (config: ToastConfig) => void;
  hide: () => void;
}

const ICON_MAP: Record<ToastType, keyof typeof Ionicons.glyphMap> = {
  success: 'shield-checkmark',
  error: 'alert-circle',
  info: 'information-circle',
  warning: 'warning',
};

const ACCENT_COLORS: Record<ToastType, { badge: string; icon: string; glow: string }> = {
  success: { badge: '#10B981', icon: '#FFFFFF', glow: 'rgba(16, 185, 129, 0.35)' },
  error:   { badge: '#EF4444', icon: '#FFFFFF', glow: 'rgba(239, 68, 68, 0.35)' },
  info:    { badge: '#E11D48', icon: '#FFFFFF', glow: 'rgba(225, 29, 72, 0.35)' },
  warning: { badge: '#F59E0B', icon: '#FFFFFF', glow: 'rgba(245, 158, 11, 0.35)' },
};

export const Toast = forwardRef<ToastHandle>((_, ref) => {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-160);
  const scale = useSharedValue(0.92);
  const opacity = useSharedValue(0);
  const [config, setConfig] = useState<ToastConfig | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    translateY.set(withTiming(-160, { duration: 260, easing: Easing.bezier(0.77, 0, 0.175, 1) }));
    scale.set(withTiming(0.92, { duration: 240 }));
    opacity.set(withTiming(0, { duration: 220 }));
  }, []);

  const show = useCallback(
    (newConfig: ToastConfig) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setConfig(newConfig);

      // Trigger tactile haptics
      Haptics.notificationAsync(
        newConfig.type === 'error'
          ? Haptics.NotificationFeedbackType.Error
          : Haptics.NotificationFeedbackType.Success
      );

      // Animate liquid glass notification drop
      translateY.set(withSpring(0, { damping: 18, mass: 0.8, stiffness: 190 }));
      scale.set(withSpring(1, { dampingRatio: 0.72 }));
      opacity.set(withTiming(1, { duration: 180 }));

      timerRef.current = setTimeout(() => {
        hide();
      }, newConfig.duration ?? 4200);
    },
    [hide]
  );

  useImperativeHandle(ref, () => ({ show, hide }));

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.get() }, { scale: scale.get() }],
    opacity: opacity.get(),
  }));

  if (!config) return null;

  const type = config.type ?? 'info';
  const colors = ACCENT_COLORS[type];
  const category = config.category ?? 'DEVPAY ESCROW';

  return (
    <Animated.View
      style={[
        styles.outerContainer,
        { top: Math.max(14, insets.top + 6) },
        animStyle,
      ]}>
      {/* Liquid Glassmorphism Body */}
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={hide}
        style={styles.cardTouchWrap}>
        <LinearGradient
          colors={[
            'rgba(255, 255, 255, 0.88)',
            'rgba(255, 255, 255, 0.65)',
            'rgba(248, 250, 252, 0.82)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.glassBody}>
          {/* Top Specular Sheen line */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.specularTopLine}
          />

          <View style={styles.cardContent}>
            {/* App / Category Squircle Badge */}
            <View style={[styles.badgeSquircle, { backgroundColor: colors.badge }]}>
              <Ionicons name={ICON_MAP[type]} size={18} color={colors.icon} />
            </View>

            {/* Notification Text Column */}
            <View style={styles.textColumn}>
              {/* Top Meta Tag Row: "DEVPAY ESCROW • now" */}
              <View style={styles.metaRow}>
                <Text style={styles.categoryTag}>{category}</Text>
                <View style={styles.metaDot} />
                <Text style={styles.metaTime}>now</Text>
              </View>

              {/* Title */}
              <Text style={styles.titleText} numberOfLines={1}>
                {config.title}
              </Text>

              {/* Message */}
              {config.message ? (
                <Text style={styles.messageText} numberOfLines={2}>
                  {config.message}
                </Text>
              ) : null}
            </View>

            {/* Dismiss Cross */}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={hide}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={16} color="#64748B" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
});

Toast.displayName = 'Toast';

export function useToast() {
  const toastRef = useRef<ToastHandle>(null);

  const show = useCallback((config: ToastConfig) => {
    toastRef.current?.show(config);
  }, []);

  const hide = useCallback(() => {
    toastRef.current?.hide();
  }, []);

  return { ref: toastRef, toastRef, show, hide };
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 99999,
    alignItems: 'center',
  },
  cardTouchWrap: {
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 26,
    elevation: 16,
  },
  glassBody: {
    borderRadius: 26,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.65)',
    overflow: 'hidden',
    position: 'relative',
  },
  specularTopLine: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1.5,
    borderRadius: 1,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeSquircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  textColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    gap: 5,
  },
  categoryTag: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: '#64748B',
    textTransform: 'uppercase',
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#94A3B8',
  },
  metaTime: {
    fontSize: 10,
    fontWeight: '500',
    color: '#94A3B8',
  },
  titleText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  messageText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#334155',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
