import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export default function NotFoundScreen() {
  const router = useRouter();
  const floatY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Float animation on the icon
    floatY.set(
      withRepeat(
        withSequence(
          withTiming(-10, { duration: 1400 }),
          withTiming(0, { duration: 1400 })
        ),
        -1,
        true
      )
    );
    // Fade in
    opacity.set(withTiming(1, { duration: 500 }));
  }, []);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.get() }],
  }));

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
  }));

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={['#EFF6FF', '#F8FAFC']}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.content, fadeStyle]}>
          {/* Floating icon */}
          <Animated.View style={[styles.iconWrap, floatStyle]}>
            <LinearGradient
              colors={['#38BDF8', '#0F73F7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconGradient}>
              <Ionicons name="compass-outline" size={44} color="#FFFFFF" />
            </LinearGradient>
          </Animated.View>

          {/* Code */}
          <Text style={styles.code}>404</Text>

          {/* Title */}
          <Text style={styles.title}>Page Not Found</Text>
          <Text style={styles.subtitle}>
            {"This screen doesn't exist yet.\nLet's get you back on track."}
          </Text>

          {/* Actions */}
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.replace('/')}
            activeOpacity={0.88}>
            <LinearGradient
              colors={['#38BDF8', '#0F73F7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryGradient}>
              <Ionicons name="home-outline" size={18} color="#FFF" />
              <Text style={styles.primaryBtnText}>Go Home</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => router.back()}
            activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={16} color="#0F73F7" />
            <Text style={styles.secondaryBtnText}>Go Back</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconWrap: {
    width: 100,
    height: 100,
    borderRadius: 36,
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 10,
    marginBottom: 28,
  },
  iconGradient: {
    flex: 1,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  code: {
    fontSize: 72,
    fontWeight: '900',
    color: '#0F73F7',
    letterSpacing: -4,
    opacity: 0.15,
    marginTop: -20,
    marginBottom: -10,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 36,
  },
  primaryBtn: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 6,
    marginBottom: 14,
  },
  primaryGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F73F7',
  },
});
