/**
 * SuccessOverlay — animated full-screen success/error state.
 *
 * Usage:
 *   <SuccessOverlay
 *     visible={showSuccess}
 *     type="success"
 *     title="Application Sent!"
 *     subtitle="Volta Pay will review your proposal within 48 hours."
 *     onDismiss={() => router.push('/contracts')}
 *     dismissLabel="View My Applications"
 *   />
 */
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: W } = Dimensions.get('window');

type OverlayType = 'success' | 'error' | 'pending' | 'verified';

interface SuccessOverlayProps {
  visible: boolean;
  type?: OverlayType;
  title: string;
  subtitle?: string;
  onDismiss?: () => void;
  dismissLabel?: string;
  autoClose?: number; // ms — 0 = no auto-close
}

const CONFIG: Record<
  OverlayType,
  { icon: keyof typeof Ionicons.glyphMap; colors: [string, string]; bg: string }
> = {
  success: {
    icon: 'checkmark-circle',
    colors: ['#1FAE7A', '#178F64'],
    bg: '#E5F6EF',
  },
  error: {
    icon: 'close-circle',
    colors: ['#E5484D', '#D93E43'],
    bg: '#FEF2F2',
  },
  pending: {
    icon: 'time',
    colors: ['#E9A23B', '#C27A0E'],
    bg: '#FFFBEB',
  },
  verified: {
    icon: 'shield-checkmark',
    colors: ['#6CC7F1', '#2C88B4'],
    bg: '#E3F2FA',
  },
};

// ─── Confetti dot ──────────────────────────────────────────────────────────
function ConfettiDot({
  color,
  startX,
  startY,
  delay,
}: {
  color: string;
  startX: number;
  startY: number;
  delay: number;
}) {
  const y = useSharedValue(0);
  const x = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    y.set(withDelay(delay, withTiming(-120 - Math.random() * 80, { duration: 900, easing: Easing.out(Easing.quad) })));
    x.set(withDelay(delay, withTiming((Math.random() - 0.5) * 180, { duration: 900 })));
    opacity.set(withDelay(delay, withSequence(
      withTiming(1, { duration: 200 }),
      withDelay(500, withTiming(0, { duration: 300 }))
    )));
    scale.set(withDelay(delay, withSpring(1, { duration: 300, dampingRatio: 0.6 })));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.get() },
      { translateY: y.get() },
      { scale: scale.get() },
    ],
    opacity: opacity.get(),
  }));

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          backgroundColor: color,
          left: startX,
          top: startY,
          width: 10,
          height: 10,
          borderRadius: 5,
        },
        style,
      ]}
    />
  );
}

export function SuccessOverlay({
  visible,
  type = 'success',
  title,
  subtitle,
  onDismiss,
  dismissLabel = 'Continue',
  autoClose = 0,
}: SuccessOverlayProps) {
  const cfg = CONFIG[type];

  // Icon entrance
  const iconScale = useSharedValue(0.3);
  const iconOpacity = useSharedValue(0);
  const cardY = useSharedValue(60);
  const cardOpacity = useSharedValue(0);
  const checkScale = useSharedValue(0);

  useEffect(() => {
    if (!visible) return;

    // Backdrop fade
    cardOpacity.set(withTiming(1, { duration: 300 }));
    cardY.set(withSpring(0, { duration: 500, dampingRatio: 0.75 }));

    // Icon bounce in
    iconOpacity.set(withDelay(150, withTiming(1, { duration: 200 })));
    iconScale.set(
      withDelay(
        150,
        withSequence(
          withSpring(1.2, { duration: 280, dampingRatio: 0.5 }),
          withSpring(1, { duration: 200, dampingRatio: 0.8 })
        )
      )
    );

    // Checkmark "draw" scale
    checkScale.set(withDelay(300, withSpring(1, { duration: 350, dampingRatio: 0.6 })));

    if (autoClose > 0 && onDismiss) {
      setTimeout(onDismiss, autoClose);
    }
  }, [visible]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.get() }],
    opacity: iconOpacity.get(),
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardY.get() }],
    opacity: cardOpacity.get(),
  }));

  const confettiColors = ['#1FAE7A', '#2C88B4', '#E9A23B', '#E5484D', '#8B5CF6', '#6CC7F1'];

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onDismiss}>
      <View style={styles.backdrop}>
        {/* Confetti dots — only for success/verified */}
        {(type === 'success' || type === 'verified') &&
          Array.from({ length: 14 }).map((_, i) => (
            <ConfettiDot
              key={i}
              color={confettiColors[i % confettiColors.length]}
              startX={W / 2 - 6}
              startY={300}
              delay={i * 40}
            />
          ))}

        <Animated.View style={[styles.card, cardStyle]}>
          {/* Icon circle */}
          <Animated.View style={[styles.iconWrap, { backgroundColor: cfg.bg }, iconStyle]}>
            <LinearGradient
              colors={cfg.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconGradient}>
              <Ionicons name={cfg.icon} size={44} color="#FFFFFF" />
            </LinearGradient>
          </Animated.View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Subtitle */}
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

          {/* Dismiss button */}
          {onDismiss && (
            <TouchableOpacity
              style={styles.dismissBtn}
              onPress={onDismiss}
              activeOpacity={0.88}>
              <LinearGradient
                colors={cfg.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.dismissGradient}>
                <Text style={styles.dismissLabel}>{dismissLabel}</Text>
                <Ionicons name="chevron-forward" size={18} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.22,
    shadowRadius: 40,
    elevation: 12,
  },
  iconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    padding: 6,
  },
  iconGradient: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#17191C',
    textAlign: 'center',
    letterSpacing: -0.4,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7378',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  dismissBtn: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  dismissGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dismissLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dot: {
    position: 'absolute',
  },
});
