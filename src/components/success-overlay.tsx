/**
 * SuccessOverlay — completion moment for finished tasks (payments, proposals, verification…).
 *
 * <SuccessOverlay visible title="Proposal sent" subtitle="…" onDismiss={…} />
 * type: success | verified | pending | error
 */
import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Modal, AccessibilityInfo } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Text } from '@/components/ui-text';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ds';
import { Radius } from '@/constants/theme';

type OverlayType = 'success' | 'error' | 'pending' | 'verified';

interface SuccessOverlayProps {
  visible: boolean;
  type?: OverlayType;
  title: string;
  subtitle?: string;
  onDismiss?: () => void;
  dismissLabel?: string;
  /** Optional second action under the main button, e.g. "View receipt". */
  secondaryLabel?: string;
  onSecondary?: () => void;
  autoClose?: number; // ms — 0 = no auto-close
}

const ICON: Record<OverlayType, keyof typeof Ionicons.glyphMap> = {
  success: 'checkmark',
  verified: 'shield-checkmark',
  pending: 'time',
  error: 'close',
};

/** Logo teal + orange with the app's sky and green. */
const CONFETTI = ['#13C3A3', '#F5A524', '#3AA6DB', '#1FAE7A', '#13C3A3', '#F5A524'];
const ICON_SIZE = 88;

function Particle({ angle, distance, color, delay, size, round }: { angle: number; distance: number; color: string; delay: number; size: number; round: boolean }) {
  const t = useSharedValue(0);
  const fall = useSharedValue(0);
  useEffect(() => {
    t.set(withDelay(delay, withTiming(1, { duration: 620, easing: Easing.out(Easing.cubic) })));
    fall.set(withDelay(delay + 380, withTiming(1, { duration: 700, easing: Easing.in(Easing.quad) })));
  }, [delay, fall, t]);
  const style = useAnimatedStyle(() => {
    const p = t.get();
    return {
      opacity: p === 0 ? 0 : 1 - fall.get(),
      transform: [
        { translateX: Math.cos(angle) * distance * p },
        { translateY: Math.sin(angle) * distance * p + fall.get() * 60 },
        { rotate: `${p * 280}deg` },
        { scale: 0.6 + p * 0.4 },
      ],
    };
  });
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.particle,
        { backgroundColor: color, width: size, height: round ? size : size * 0.45, borderRadius: round ? size / 2 : 2 },
        style,
      ]}
    />
  );
}

function Ripple({ color, delay }: { color: string; delay: number }) {
  const s = useSharedValue(0);
  useEffect(() => {
    s.set(withDelay(delay, withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) })));
  }, [delay, s]);
  const style = useAnimatedStyle(() => ({ opacity: (1 - s.get()) * 0.5, transform: [{ scale: 1 + s.get() * 0.9 }] }));
  return <Animated.View pointerEvents="none" style={[styles.ripple, { borderColor: color }, style]} />;
}

export function SuccessOverlay({
  visible,
  type = 'success',
  title,
  subtitle,
  onDismiss,
  dismissLabel = 'Continue',
  secondaryLabel,
  onSecondary,
  autoClose = 0,
}: SuccessOverlayProps) {
  const { colors } = useTheme();
  const [reduceMotion, setReduceMotion] = useState(false);
  const tone = {
    success: colors.accentGreen,
    verified: colors.action,
    pending: colors.accentAmber,
    error: colors.accentCoral,
  }[type];
  const celebrate = (type === 'success' || type === 'verified') && !reduceMotion;

  const cardY = useSharedValue(40);
  const cardOpacity = useSharedValue(0);
  const iconScale = useSharedValue(0);
  const checkScale = useSharedValue(0);

  // One burst layout per opening.
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        angle: (i / 20) * Math.PI * 2 + (i % 2 ? 0.15 : -0.1),
        distance: 90 + ((i * 37) % 70),
        color: CONFETTI[i % CONFETTI.length],
        delay: 180 + (i % 5) * 25,
        size: 7 + (i % 3) * 2,
        round: i % 3 === 0,
      })),
    []
  );

  useEffect(() => {
    if (!visible) return;
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => {});
    cardOpacity.set(0);
    cardY.set(40);
    iconScale.set(0);
    checkScale.set(0);
    cardOpacity.set(withTiming(1, { duration: 220 }));
    cardY.set(withSpring(0, { duration: 480, dampingRatio: 0.8 }));
    iconScale.set(withDelay(120, withSequence(withSpring(1.12, { duration: 260, dampingRatio: 0.55 }), withSpring(1, { duration: 220 }))));
    checkScale.set(withDelay(260, withSpring(1, { duration: 320, dampingRatio: 0.6 })));
    Haptics.notificationAsync(
      type === 'error' ? Haptics.NotificationFeedbackType.Error : type === 'pending' ? Haptics.NotificationFeedbackType.Warning : Haptics.NotificationFeedbackType.Success
    ).catch(() => {});
    if (autoClose > 0 && onDismiss) {
      const t = setTimeout(onDismiss, autoClose);
      return () => clearTimeout(t);
    }
  }, [autoClose, cardOpacity, cardY, checkScale, iconScale, onDismiss, type, visible]);

  const cardStyle = useAnimatedStyle(() => ({ opacity: cardOpacity.get(), transform: [{ translateY: cardY.get() }] }));
  const iconStyle = useAnimatedStyle(() => ({ transform: [{ scale: iconScale.get() }] }));
  const checkStyle = useAnimatedStyle(() => ({ transform: [{ scale: checkScale.get() }], opacity: checkScale.get() }));

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss} statusBarTranslucent>
      <View style={styles.backdrop}>
        <Animated.View style={[styles.card, { backgroundColor: colors.surface }, cardStyle]} accessibilityRole="alert" accessibilityLiveRegion="polite">
          <View style={styles.iconArea}>
            {visible && celebrate && (
              <>
                <Ripple color={tone} delay={200} />
                <Ripple color={tone} delay={420} />
                {particles.map((p, i) => (
                  <Particle key={i} {...p} />
                ))}
              </>
            )}
            <Animated.View style={[styles.icon, { backgroundColor: tone }, iconStyle]}>
              <Animated.View style={checkStyle}>
                <Ionicons name={ICON[type]} size={44} color="#FFFFFF" />
              </Animated.View>
            </Animated.View>
          </View>

          <Text style={[styles.title, { color: colors.text }]} accessibilityRole="header">
            {title}
          </Text>
          {subtitle ? <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text> : null}

          {onDismiss && <Button label={dismissLabel} onPress={onDismiss} style={styles.button} />}
          {secondaryLabel && onSecondary && (
            <Button
              label={secondaryLabel}
              variant="soft"
              icon={<Ionicons name="receipt-outline" size={17} color={colors.primaryText} />}
              onPress={onSecondary}
              style={styles.secondary}
            />
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(12, 22, 28, 0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  card: {
    width: '100%',
    maxWidth: 380,
    borderRadius: Radius.xxl,
    paddingHorizontal: 26,
    paddingTop: 34,
    paddingBottom: 24,
    alignItems: 'center',
    boxShadow: '0px 20px 40px rgba(15, 30, 39, 0.22)',
  },
  iconArea: { width: ICON_SIZE, height: ICON_SIZE, alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  icon: { width: ICON_SIZE, height: ICON_SIZE, borderRadius: ICON_SIZE / 2, alignItems: 'center', justifyContent: 'center' },
  ripple: { position: 'absolute', width: ICON_SIZE, height: ICON_SIZE, borderRadius: ICON_SIZE / 2, borderWidth: 3 },
  particle: { position: 'absolute' },
  secondary: { alignSelf: 'stretch', marginTop: 10 },
  title: { fontSize: 22, fontWeight: '700', letterSpacing: -0.5, textAlign: 'center' },
  subtitle: { fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 8 },
  button: { alignSelf: 'stretch', marginTop: 24 },
});
