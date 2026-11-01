import React, { useEffect, useState } from 'react';
import { StyleSheet, AccessibilityInfo, View, useColorScheme } from 'react-native';
import Animated, { Easing, interpolate, runOnJS, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming, type SharedValue } from 'react-native-reanimated';
import { Text } from '@/components/ui-text';
import { DevPayMark } from '@/components/devpay-mark';

/**
 * Launch animation. Picks up from the native splash (logo centred, 200pt image) and turns it into
 * the DevPay lockup: the mark settles, the wordmark unrolls beside it letter by letter, a thin
 * progress line fills, then everything lifts away to reveal the app.
 */
const NATIVE_LOGO_WIDTH = 200 * 0.9; // splash-icon.png draws the mark at 90% of a 200pt image
const NATIVE_LOGO_HEIGHT = NATIVE_LOGO_WIDTH / (218 / 149);
const MARK = 46; // final mark height in the lockup
const START_SCALE = NATIVE_LOGO_HEIGHT / MARK;
const WORD = ['D', 'e', 'v', 'P', 'a', 'y'];

function Letter({ ch, i, words, color }: { ch: string; i: number; words: SharedValue<number>; color: string }) {
  const style = useAnimatedStyle(() => {
    // Each letter starts a little after the previous one.
    const t = Math.min(1, Math.max(0, words.get() * (WORD.length + 2) - i));
    return { opacity: t, transform: [{ translateY: (1 - t) * 18 }] };
  });
  return <Animated.Text style={[styles.letter, { color }, style]}>{ch}</Animated.Text>;
}

export function AnimatedSplash({ onDone }: { onDone: () => void }) {
  const dark = useColorScheme() === 'dark';
  const bg = dark ? '#0C1317' : '#FFFFFF';
  const ink = dark ? '#FFFFFF' : '#15181B';
  const blue = dark ? '#5FB4DE' : '#1C6E99';

  const [reduce, setReduce] = useState<boolean | null>(null);
  const [wordW, setWordW] = useState(0);
  const mark = useSharedValue(0);
  const open = useSharedValue(0);
  const words = useSharedValue(0);
  const tag = useSharedValue(0);
  const bar = useSharedValue(0);
  const exit = useSharedValue(0);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setReduce)
      .catch(() => setReduce(false));
  }, []);

  useEffect(() => {
    if (reduce === null || !wordW) return;
    const finish = () => onDone();
    if (reduce) {
      mark.set(1);
      open.set(1);
      words.set(1);
      tag.set(1);
      exit.set(withDelay(700, withTiming(1, { duration: 250 }, (done) => done && runOnJS(finish)())));
      return;
    }
    mark.set(withDelay(120, withSpring(1, { duration: 700, dampingRatio: 0.82 })));
    open.set(withDelay(380, withTiming(1, { duration: 520, easing: Easing.out(Easing.cubic) })));
    words.set(withDelay(430, withTiming(1, { duration: 560, easing: Easing.out(Easing.quad) })));
    tag.set(withDelay(860, withTiming(1, { duration: 380, easing: Easing.out(Easing.cubic) })));
    bar.set(withDelay(820, withTiming(1, { duration: 820, easing: Easing.inOut(Easing.cubic) })));
    exit.set(withDelay(1720, withTiming(1, { duration: 380, easing: Easing.in(Easing.cubic) }, (done) => done && runOnJS(finish)())));
  }, [bar, exit, mark, onDone, open, reduce, tag, wordW, words]);

  const markStyle = useAnimatedStyle(() => ({ transform: [{ scale: interpolate(mark.get(), [0, 1], [START_SCALE, 1]) }] }));
  // The wordmark slot widens from 0, which slides the centred mark left into the lockup.
  const slotStyle = useAnimatedStyle(() => ({ width: open.get() * (wordW + 12) }));
  const tagStyle = useAnimatedStyle(() => ({ opacity: tag.get(), transform: [{ translateY: (1 - tag.get()) * 8 }] }));
  const barStyle = useAnimatedStyle(() => ({ transform: [{ scaleX: bar.get() }], opacity: 1 - exit.get() }));
  const contentStyle = useAnimatedStyle(() => ({ opacity: 1 - exit.get(), transform: [{ translateY: -24 * exit.get() }, { scale: 1 - 0.03 * exit.get() }] }));
  const rootStyle = useAnimatedStyle(() => ({ opacity: interpolate(exit.get(), [0, 0.4, 1], [1, 1, 0]) }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.root, { backgroundColor: bg }, rootStyle]} pointerEvents="none" accessible accessibilityLabel="DevPay">
      {/* Invisible copy to measure the wordmark. */}
      <View style={styles.measure} onLayout={(e) => setWordW(Math.ceil(e.nativeEvent.layout.width))}>
        <Text style={[styles.letter, { fontWeight: '700' }]}>DevPay</Text>
      </View>

      <Animated.View style={[styles.center, contentStyle]}>
        <View style={styles.lockup}>
          <Animated.View style={markStyle}>
            <DevPayMark size={MARK} />
          </Animated.View>
          <Animated.View style={[styles.slot, slotStyle]}>
            <View style={styles.word}>
              {WORD.map((ch, i) => (
                <Letter key={i} ch={ch} i={i} words={words} color={i < 3 ? ink : blue} />
              ))}
            </View>
          </Animated.View>
        </View>
        <Animated.Text style={[styles.tag, { color: dark ? '#9FB0BA' : '#5F6B73' }, tagStyle]}>Freelance work, paid safely.</Animated.Text>
      </Animated.View>

      <View style={[styles.track, { backgroundColor: dark ? '#1C2A32' : '#E7EDF1' }]}>
        <Animated.View style={[styles.fill, { backgroundColor: blue }, barStyle]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', justifyContent: 'center', zIndex: 2000 },
  measure: { position: 'absolute', opacity: 0, left: -1000 },
  center: { alignItems: 'center' },
  lockup: { flexDirection: 'row', alignItems: 'center' },
  slot: { overflow: 'hidden', height: 52, justifyContent: 'center' },
  word: { flexDirection: 'row', paddingLeft: 12 },
  letter: { fontFamily: 'Inter_700Bold', fontSize: 36, fontWeight: 'normal', letterSpacing: -1.2, includeFontPadding: false },
  tag: { fontFamily: 'Inter_500Medium', fontSize: 14, marginTop: 14 },
  track: { position: 'absolute', bottom: '18%', width: 120, height: 3, borderRadius: 2, overflow: 'hidden' },
  fill: { height: 3, width: 120, borderRadius: 2, transformOrigin: 'left' },
});
