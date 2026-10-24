import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function SplashScreen() {
  const router = useRouter();
  const scale = useSharedValue(0.7);
  const opacity = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    // Reanimated 4: use .set() not .value = 
    opacity.set(withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) }));
    scale.set(withSpring(1, { damping: 14, stiffness: 120 }));
    glowOpacity.set(withSequence(
      withTiming(0.6, { duration: 600 }),
      withTiming(0.3, { duration: 600 })
    ));

    const timer = setTimeout(() => {
      router.replace('/welcome');
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
    opacity: opacity.get(),
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.get(),
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#071739', '#0B204E', '#06132D']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}>
        {/* Ambient Halo Glow */}
        <Animated.View style={[styles.haloGlow, glowStyle]}>
          <LinearGradient
            colors={['rgba(56, 189, 248, 0.4)', 'transparent']}
            style={styles.haloGradient}
          />
        </Animated.View>

        {/* Center Logo & Title */}
        <Animated.View style={[styles.content, animatedStyle]}>
          <View style={styles.logoBadge}>
            <LinearGradient
              colors={['#38BDF8', '#0F73F7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoGradient}>
              <Ionicons name="shield-checkmark" size={44} color="#FFFFFF" />
            </LinearGradient>
          </View>

          <Text style={styles.title}>DevPay Africa</Text>
          <Text style={styles.tagline}>Trust &amp; Milestone Payments for African Talent</Text>
        </Animated.View>

        {/* Subtle Bottom Trust Pill */}
        <View style={styles.footer}>
          <View style={styles.trustBadge}>
            <Ionicons name="lock-closed" size={12} color="#38BDF8" />
            <Text style={styles.trustText}>Secured by Escrow &amp; Mobile Money</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  haloGlow: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    overflow: 'hidden',
  },
  haloGradient: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadge: {
    width: 88,
    height: 88,
    borderRadius: 32,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 8,
  },
  logoGradient: {
    flex: 1,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 20,
    letterSpacing: -0.6,
  },
  tagline: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 8,
    fontWeight: '500',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
  },
  trustText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#E2E8F0',
  },
});
