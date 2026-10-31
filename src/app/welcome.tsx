import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withTiming, Easing } from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ds';
import { WelcomeFaces } from '@/constants/media';
import { Layout, Radius, Shadows } from '@/constants/theme';
import { DevPayMark } from '@/components/devpay-mark';

/** Arc of portrait frames, as fractions of screen width (x, y, w); h = w * 1.42. */
const ARC = [
  { x: -0.07, y: 0.0, w: 0.19 },
  { x: 0.07, y: 0.08, w: 0.21 },
  { x: 0.24, y: 0.2, w: 0.22 },
  { x: 0.53, y: 0.2, w: 0.21 },
  { x: 0.72, y: 0.08, w: 0.21 },
  { x: 0.88, y: 0.0, w: 0.19 },
];

function Portrait({ uri, i, width }: { uri: string; i: number; width: number }) {
  const a = ARC[i];
  const w = a.w * width;
  const h = w * 1.42;
  const t = useSharedValue(0);

  useEffect(() => {
    t.set(withDelay(80 * Math.abs(i - 2.5), withTiming(1, { duration: 700, easing: Easing.out(Easing.exp) })));
  }, [i, t]);

  const style = useAnimatedStyle(() => ({
    opacity: t.get(),
    transform: [{ translateY: (1 - t.get()) * 18 }],
  }));

  return (
    <Animated.View
      style={[
        styles.frame,
        Shadows.soft,
        { left: a.x * width, top: a.y * width, width: w, height: h, borderRadius: w / 2 },
        style,
      ]}>
      <Image source={{ uri }} contentFit="cover" transition={250} style={{ flex: 1, borderRadius: w / 2 }} />
    </Animated.View>
  );
}

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [heroSpace, setHeroSpace] = useState(0);
  // The arc is ~0.6× its width tall; shrink it on short screens so it never overlaps the brand.
  const arcW = heroSpace > 0 ? Math.min(width, (heroSpace - 36) / 0.6) : width;
  const heroH = arcW * 0.6;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={isDark ? ['#163444', '#0F202A', colors.background] : ['#BFE0F5', '#DCEEF9', '#EEF6FB']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={styles.brand}>
          <DevPayMark size={30} />
          <Text style={[styles.brandText, { color: colors.text }]}>DevPay</Text>
        </View>

        <View
          style={styles.heroWrap}
          onLayout={(e) => setHeroSpace(e.nativeEvent.layout.height)}
          accessible
          accessibilityLabel="Freelancers and clients on DevPay">
          <View style={{ width: arcW, height: heroH, alignSelf: 'center' }}>
            {WelcomeFaces.arc.map((uri, i) => (
              <Portrait key={uri} uri={uri} i={i} width={arcW} />
            ))}
            <View
              style={[
                styles.plus,
                Shadows.button,
                { top: 0.2 * arcW + 0.215 * arcW * 1.42 - 6, left: arcW / 2 - 14, backgroundColor: colors.surface },
              ]}>
              <Ionicons name="add" size={18} color={colors.text} />
            </View>
          </View>
        </View>
      </SafeAreaView>

      <View style={[styles.sheet, { backgroundColor: colors.surface, paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
        <Text style={[styles.headline, { color: colors.text }]} accessibilityRole="header">
          {"Connect with Africa's top freelancers and get paid securely."}
        </Text>
        <Text style={[styles.sub, { color: colors.textSecondary }]}>
          Discover verified talent, protect milestones with escrow, and receive instant Mobile Money payouts.
        </Text>

        <View style={styles.socialRow}>
          <Button
            label="Google"
            variant="light"
            size="md"
            style={{ flex: 1, height: 52 }}
            icon={<Ionicons name="logo-google" size={18} color="#EA4335" />}
            onPress={() => router.push('/register')}
          />
          <Button
            label="Apple"
            variant="light"
            size="md"
            style={{ flex: 1, height: 52 }}
            icon={<Ionicons name="logo-apple" size={19} color={colors.text} />}
            onPress={() => router.push('/register')}
          />
        </View>

        <Button label="Get Started" variant="dark" onPress={() => router.push('/choose-role')} style={{ marginTop: 14 }} />

        <Pressable onPress={() => router.push('/login')} accessibilityRole="link" style={styles.footer} hitSlop={8}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Already have an account? <Text style={{ color: colors.text, fontWeight: '600' }}>Sign In</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  brand: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 10 },
  brandText: { fontSize: 22, fontWeight: '600', letterSpacing: -0.5 },
  heroWrap: { flex: 1, justifyContent: 'flex-end', paddingBottom: 20, overflow: 'hidden' },
  frame: { position: 'absolute', borderWidth: 3, borderColor: '#FFFFFF', backgroundColor: '#DCEEF9' },
  plus: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheet: {
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    paddingHorizontal: Layout.margin + 4,
    paddingTop: 28,
  },
  headline: { fontSize: 22, fontWeight: '600', letterSpacing: -0.5, textAlign: 'center', lineHeight: 28 },
  sub: { fontSize: 14, lineHeight: 20, textAlign: 'center', marginTop: 10, paddingHorizontal: 8 },
  socialRow: { flexDirection: 'row', gap: 12, marginTop: 24 },
  footer: { alignItems: 'center', paddingVertical: 16 },
  footerText: { fontSize: 13 },
});
