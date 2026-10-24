import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={['#BFDBFE', '#E0F2FE', '#F8FAFC']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.7 }}
        style={styles.ambientGradient}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          {/* Top Brand Logo */}
          <View style={styles.brandRow}>
            <Ionicons name="shield-checkmark" size={24} color="#0F73F7" />
            <Text style={styles.brandName}>DevPay Africa</Text>
          </View>

          {/* Semicircle Curved Arc of Avatars matching Screenshot 2026-10-23 165026.png */}
          <View style={styles.arcContainer}>
            {/* Avatar 1 (Far Left) */}
            <View style={[styles.avatarFrame, styles.avatar1]}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120' }}
                style={styles.avatarImg}
              />
            </View>

            {/* Avatar 2 (Mid Left) */}
            <View style={[styles.avatarFrame, styles.avatar2]}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' }}
                style={styles.avatarImg}
              />
            </View>

            {/* Avatar 3 (Center Lower) */}
            <View style={[styles.avatarFrame, styles.avatar3]}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160' }}
                style={styles.avatarImg}
              />
            </View>

            {/* Avatar 4 (Mid Right) */}
            <View style={[styles.avatarFrame, styles.avatar4]}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' }}
                style={styles.avatarImg}
              />
            </View>

            {/* Avatar 5 (Far Right) */}
            <View style={[styles.avatarFrame, styles.avatar5]}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120' }}
                style={styles.avatarImg}
              />
            </View>

            {/* Center Plus Button */}
            <View style={styles.plusCircleWrapper}>
              <View style={styles.plusCircle}>
                <Ionicons name="add" size={16} color="#0F172A" />
              </View>
            </View>
          </View>

          {/* Bottom Card Sheet */}
          <View style={styles.bottomCard}>
            <Text style={styles.headline}>
              {"Connect with Africa's top freelancers and get paid securely."}
            </Text>

            <Text style={styles.subheadline}>
              Discover verified talent, protect milestones with escrow, and receive instant Mobile Money payouts.
            </Text>

            {/* Social Auth Buttons Row */}
            <View style={styles.socialButtonsRow}>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.85}>
                <Ionicons name="logo-google" size={18} color="#EA4335" />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton} activeOpacity={0.85}>
                <Ionicons name="logo-apple" size={18} color="#000000" />
                <Text style={styles.socialButtonText}>Apple</Text>
              </TouchableOpacity>
            </View>

            {/* Primary CTA Button: Get Started */}
            <TouchableOpacity
              style={styles.getStartedButton}
              onPress={() => router.push('/choose-role')}
              activeOpacity={0.88}>
              <Text style={styles.getStartedText}>Get Started</Text>
            </TouchableOpacity>

            {/* Footer */}
            <TouchableOpacity
              style={styles.footerRow}
              onPress={() => router.push('/login')}
              activeOpacity={0.8}>
              <Text style={styles.footerText}>
                Already have an account? <Text style={styles.signInText}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  ambientGradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  arcContainer: {
    height: 240,
    position: 'relative',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFrame: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  avatar1: {
    width: 60,
    height: 80,
    left: 10,
    top: 40,
  },
  avatar2: {
    width: 72,
    height: 96,
    left: 60,
    top: 60,
  },
  avatar3: {
    width: 84,
    height: 110,
    alignSelf: 'center',
    top: 80,
    zIndex: 10,
  },
  avatar4: {
    width: 72,
    height: 96,
    right: 60,
    top: 60,
  },
  avatar5: {
    width: 60,
    height: 80,
    right: 10,
    top: 40,
  },
  plusCircleWrapper: {
    position: 'absolute',
    bottom: 25,
    zIndex: 20,
  },
  plusCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bottomCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 28,
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  headline: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 30,
    letterSpacing: -0.5,
  },
  subheadline: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  socialButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  socialButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  getStartedButton: {
    height: 54,
    borderRadius: 27,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  getStartedText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  footerRow: {
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  signInText: {
    color: '#0F172A',
    fontWeight: '800',
  },
});
