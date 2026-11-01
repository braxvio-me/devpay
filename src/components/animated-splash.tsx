import React, { useEffect, useState } from 'react';
import { StyleSheet, AccessibilityInfo, useWindowDimensions } from 'react-native';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withDelay, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { Text } from '@/components/ui-text';
import { DevPayMark } from '@/components/devpay-mark';

/**
 * Continues the native splash (black, logo 200pt wide) and animates it into the app.
 * The logo starts at exactly the native splash size so the hand-off is invisible.
 */
const NATIVE_LOGO_WIDTH = 200 * 0.9; // splash-icon.png draws the mark at 90% of a 200pt image
const NATIVE_LOGO_HEIGHT = NATIVE_LOGO_WIDTH / (218 / 149);

export function AnimatedSplash({ onDone }: { onDone: () => void }) {
  const { width } = useWindowDimensions();
  const [reduce, setReduce] = useState<boolean | null>(null);
  const logo = useSharedValue(0);
  const glow = useSharedValue(0);
  const words = useSharedValue(0);
  const fade = useSharedValue(1);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setReduce)
      .catch(() => setReduce(false));
  }, []);

  useEffect(() => {
    if (reduce === null) return;
    const finish = () => onDone();
    if (reduce) {
      fade.set(withDelay(400, withTiming(0, { duration: 250 }, (done) => done && runOnJS(finish)())));
      return;
    }
    logo.set(withDelay(200, withSequence(withTiming(-0.06, { duration: 140 }), withSpring(1, { duration: 650, dampingRatio: 0.7 }))));
    glow.set(withDelay(380, withSequence(withTiming(1, { duration: 360 }), withTiming(0, { duration: 600 }))));
    words.set(withDelay(520, withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) })));
    fade.set(withDelay(1550, withTiming(0, { duration: 360, easing: Easing.in(Easing.quad) }, (done) => done && runOnJS(finish)())));
  }, [fade, glow, logo, onDone, reduce, words]);

  // logo: 0 = native size/position, 1 = smaller and lifted to make room for the wordmark.
  const logoStyle = useAnimatedStyle(() => {
    const p = logo.get();
    return { transform: [{ translateY: -36 * Math.max(0, p) }, { scale: 1 - 0.38 * p }] };
  });
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.get() * 0.18,
    transform: [{ translateY: -36 * Math.max(0, logo.get()) }, { scale: 0.6 + glow.get() * 0.6 }],
  }));
  const wordStyle = useAnimatedStyle(() => ({ opacity: words.get(), transform: [{ translateY: 46 - words.get() * 12 }] }));
  const rootStyle = useAnimatedStyle(() => ({ opacity: fade.get() }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.root, rootStyle]} pointerEvents="none" accessible accessibilityLabel="DevPay">
      <Animated.View style={[styles.glow, { width: width * 0.7, height: width * 0.7, borderRadius: width * 0.35 }, glowStyle]} />
      <Animated.View style={logoStyle}>
        <DevPayMark size={NATIVE_LOGO_HEIGHT} />
      </Animated.View>
      <Animated.View style={[styles.words, wordStyle]}>
        <Text style={styles.name}>DevPay</Text>
        <Text style={styles.tag}>Freelance work, paid safely.</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center', zIndex: 2000 },
  glow: { position: 'absolute', backgroundColor: '#13C3A3' },
  words: { position: 'absolute', alignItems: 'center', top: '50%' },
  name: { color: '#FFFFFF', fontSize: 30, fontWeight: '700', letterSpacing: -0.8 },
  tag: { color: '#13C3A3', fontSize: 14, fontWeight: '500', marginTop: 6 },
});
