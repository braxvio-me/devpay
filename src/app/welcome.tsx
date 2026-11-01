import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, useWindowDimensions, AccessibilityInfo } from 'react-native';
import { Text } from '@/components/ui-text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  Easing,
  FadeIn,
  FadeInDown,
  ZoomIn,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ds';
import { DevPayMark } from '@/components/devpay-mark';
import { OnboardingShots } from '@/constants/media';
import { Layout } from '@/constants/theme';

const SLIDES = [
  { title: 'Welcome to DevPay', body: 'Find verified work and hire trusted talent across Ghana, all in one place.' },
  { title: 'Paid safely, every milestone', body: 'Clients fund escrow before work starts. Payouts land straight on your Mobile Money.' },
  { title: 'Built on trust', body: 'Ghana Card verification, real reviews and clear contracts on every job.' },
];

/** One endlessly scrolling column of photo tiles (the list is doubled so the loop is seamless). */
function ReelColumn({ shots, tile, gap, duration, reverse, still }: { shots: readonly string[]; tile: number; gap: number; duration: number; reverse: boolean; still: boolean }) {
  const { colors } = useTheme();
  const loop = shots.length * (tile + gap);
  const y = useSharedValue(reverse ? -loop : 0);

  useEffect(() => {
    if (still) return;
    y.set(reverse ? -loop : 0);
    y.set(withRepeat(withTiming(reverse ? 0 : -loop, { duration, easing: Easing.linear }), -1, false));
    return () => cancelAnimation(y);
  }, [duration, loop, reverse, still, y]);

  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.get() }] }));

  return (
    <Animated.View style={[{ gap }, style]}>
      {[...shots, ...shots].map((uri, i) => (
        <Image key={`${uri}-${i}`} source={{ uri }} contentFit="cover" transition={300} style={[styles.tile, { width: tile, height: tile, backgroundColor: colors.backgroundElement }]} />
      ))}
    </Animated.View>
  );
}

/** Tilted wall of three photo reels moving like a video; shifts a little between slides. */
function Collage({ width, height, index }: { width: number; height: number; index: number }) {
  const { colors } = useTheme();
  const [still, setStill] = useState(false);
  const tile = width * 0.46;
  const gap = 14;
  const shift = useSharedValue(0);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setStill).catch(() => {});
  }, []);

  useEffect(() => {
    shift.set(withSpring(index, { duration: 700, dampingRatio: 0.9 }));
  }, [index, shift]);

  const drift = useAnimatedStyle(() => ({
    transform: [{ translateX: -shift.get() * tile * 0.25 }, { rotate: '-28deg' }],
  }));

  const columns = [OnboardingShots.slice(0, 3), OnboardingShots.slice(3, 6), OnboardingShots.slice(6, 9)];
  const wallW = tile * 3 + gap * 2;

  return (
    <View style={{ width, height, overflow: 'hidden' }} accessible accessibilityLabel="Freelancers at work and mobile payments">
      <Animated.View
        entering={FadeIn.duration(600)}
        style={[styles.wall, { width: wallW, gap, left: (width - wallW) / 2 + tile * 0.2, top: -tile * 1.1 }, drift]}>
        {columns.map((shots, i) => (
          <ReelColumn key={i} shots={shots} tile={tile} gap={gap} duration={[26000, 21000, 30000][i]} reverse={i === 1} still={still} />
        ))}
      </Animated.View>
      <LinearGradient
        pointerEvents="none"
        colors={[`${colors.surface}00`, colors.surface]}
        style={[StyleSheet.absoluteFill, { top: height * 0.55 }]}
      />
    </View>
  );
}

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const last = index === SLIDES.length - 1;
  const slide = SLIDES[index];

  const go = (next: number) => {
    const clamped = Math.max(0, Math.min(SLIDES.length - 1, next));
    if (clamped === index) return;
    Haptics.selectionAsync().catch(() => {});
    setIndex(clamped);
  };

  const swipe = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .onEnd((e) => {
      if (e.translationX < -50 || e.velocityX < -600) runOnJS(go)(index + 1);
      else if (e.translationX > 50 || e.velocityX > 600) runOnJS(go)(index - 1);
    });

  const collageH = Math.min(height * 0.56, width * 1.25);

  return (
    <GestureDetector gesture={swipe}>
      <View style={[styles.screen, { backgroundColor: colors.surface }]}>
        <Collage width={width} height={collageH} index={index} />

        <SafeAreaView edges={['top']} style={styles.top} pointerEvents="box-none">
          {!last && (
            <Pressable
              onPress={() => go(SLIDES.length - 1)}
              accessibilityRole="button"
              accessibilityLabel="Skip introduction"
              hitSlop={10}
              style={[styles.skip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.skipText, { color: colors.text }]}>Skip</Text>
            </Pressable>
          )}
        </SafeAreaView>

        <SafeAreaView edges={['bottom']} style={styles.bottom}>
          <Animated.View key={index} entering={FadeInDown.duration(320)} style={styles.copy}>
            {index === 0 && (
              <View style={styles.brand}>
                <Animated.View entering={ZoomIn.springify().damping(12)}>
                  <DevPayMark size={22} />
                </Animated.View>
                <Text style={[styles.brandText, { color: colors.textSecondary }]}>DevPay</Text>
              </View>
            )}
            <Text style={[styles.title, { color: colors.text }]} accessibilityRole="header">
              {slide.title}
            </Text>
            <Text style={[styles.body, { color: colors.textSecondary }]}>{slide.body}</Text>
          </Animated.View>

          <View style={styles.dots} accessibilityLabel={`Page ${index + 1} of ${SLIDES.length}`}>
            {SLIDES.map((_, i) => (
              <Dot key={i} active={i === index} />
            ))}
          </View>

          <Button
            label={last ? 'Get Started' : 'Next'}
            variant="dark"
            onPress={() => (last ? router.push('/choose-role') : go(index + 1))}
          />
          <Pressable onPress={() => router.push('/login')} accessibilityRole="link" style={styles.signin} hitSlop={8}>
            <Text style={[styles.signinText, { color: colors.textSecondary }]}>
              Already have an account? <Text style={{ color: colors.text, fontWeight: '600' }}>Sign In</Text>
            </Text>
          </Pressable>
        </SafeAreaView>
      </View>
    </GestureDetector>
  );
}

function Dot({ active }: { active: boolean }) {
  const { colors } = useTheme();
  const w = useSharedValue(active ? 22 : 7);
  useEffect(() => {
    w.set(withTiming(active ? 22 : 7, { duration: 220 }));
  }, [active, w]);
  const style = useAnimatedStyle(() => ({ width: w.get() }));
  return <Animated.View style={[styles.dot, { backgroundColor: active ? colors.ink : colors.backgroundSelected }, style]} />;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  wall: { position: 'absolute', flexDirection: 'row' },
  tile: { borderRadius: 32 },
  top: { position: 'absolute', top: 0, left: 0, right: 0, alignItems: 'flex-end', paddingHorizontal: Layout.margin, paddingTop: 8 },
  skip: { height: 36, paddingHorizontal: 16, borderRadius: 18, borderWidth: 1, justifyContent: 'center', marginTop: 8 },
  skipText: { fontSize: 14, fontWeight: '500' },
  bottom: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: Layout.margin + 4, paddingBottom: 4 },
  copy: { alignItems: 'center' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  brandText: { fontSize: 14, fontWeight: '600' },
  title: { fontSize: 30, fontWeight: '700', letterSpacing: -0.8, textAlign: 'center', lineHeight: 36 },
  body: { fontSize: 15, lineHeight: 22, textAlign: 'center', marginTop: 10, maxWidth: 320 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 24, marginBottom: 22 },
  dot: { height: 7, borderRadius: 4 },
  signin: { alignItems: 'center', paddingVertical: 16 },
  signinText: { fontSize: 13 },
});
