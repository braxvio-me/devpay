import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';
import { ScreenBackground } from '@/components/ds';
import { DevPayMark } from '@/components/devpay-mark';

export default function SplashScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const opacity = useSharedValue(0);
  const lift = useSharedValue(12);

  useEffect(() => {
    opacity.set(withTiming(1, { duration: 500, easing: Easing.out(Easing.exp) }));
    lift.set(withTiming(0, { duration: 600, easing: Easing.out(Easing.exp) }));

    const timer = setTimeout(() => {
      router.replace('/welcome');
    }, 1600);
    return () => clearTimeout(timer);
  }, [lift, opacity, router]);

  const animated = useAnimatedStyle(() => ({
    opacity: opacity.get(),
    transform: [{ translateY: lift.get() }],
  }));

  return (
    <View style={styles.screen}>
      <ScreenBackground height={900} />
      <Animated.View style={[styles.center, animated]}>
        <DevPayMark size={84} />
        <Text style={[styles.name, { color: colors.text }]}>DevPay</Text>
        <Text style={[styles.tag, { color: colors.textSecondary }]}>Freelance work, paid safely.</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  center: { alignItems: 'center', gap: 6 },
  name: { fontSize: 30, fontWeight: '600', letterSpacing: -0.8, marginTop: 14 },
  tag: { fontSize: 14 },
});
