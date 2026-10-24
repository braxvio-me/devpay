import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';

export default function ChooseRoleScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'freelancer' | 'client'>('freelancer');

  const handleContinue = () => {
    router.push({
      pathname: '/register',
      params: { defaultRole: selectedRole },
    });
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color={Colors.light.text} />
          </TouchableOpacity>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>Step 1 of 3</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Headline */}
          <View style={styles.introBlock}>
            <Text style={styles.title}>Join as a Freelancer or Client</Text>
            <Text style={styles.subtitle}>
              Choose how you want to use DevPay Africa. You can seamlessly switch modes anytime from your profile dashboard.
            </Text>
          </View>

          {/* Option 1: Freelancer */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedRole === 'freelancer' && styles.selectedOptionCard,
            ]}
            onPress={() => setSelectedRole('freelancer')}
            activeOpacity={0.88}>
            <View style={styles.cardTopRow}>
              <View
                style={[
                  styles.iconBox,
                  selectedRole === 'freelancer' ? styles.iconBoxActive : styles.iconBoxInactive,
                ]}>
                <Ionicons
                  name="laptop-outline"
                  size={24}
                  color={selectedRole === 'freelancer' ? '#FFFFFF' : '#0F73F7'}
                />
              </View>

              <View
                style={[
                  styles.radioCircle,
                  selectedRole === 'freelancer' && styles.radioCircleActive,
                ]}>
                {selectedRole === 'freelancer' && <View style={styles.radioInner} />}
              </View>
            </View>

            <Text style={styles.optionTitle}>I am a Freelancer / Agency</Text>
            <Text style={styles.optionDescription}>
              Apply for verified jobs across Africa. Every milestone is pre-funded into DevPay escrow before you write a single line of code.
            </Text>

            <View style={styles.perksRow}>
              <View style={styles.perkChip}>
                <Ionicons name="shield-checkmark" size={13} color="#0F73F7" />
                <Text style={styles.perkText}>Escrow Guarantee</Text>
              </View>
              <View style={styles.perkChip}>
                <Ionicons name="flash" size={13} color="#10B981" />
                <Text style={styles.perkText}>Instant MoMo Payouts</Text>
              </View>
              <View style={styles.perkChip}>
                <Ionicons name="card" size={13} color="#9333EA" />
                <Text style={styles.perkText}>Ghana Card Verified</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Option 2: Client */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedRole === 'client' && styles.selectedOptionCard,
            ]}
            onPress={() => setSelectedRole('client')}
            activeOpacity={0.88}>
            <View style={styles.cardTopRow}>
              <View
                style={[
                  styles.iconBox,
                  selectedRole === 'client' ? styles.iconBoxActiveClient : styles.iconBoxInactive,
                ]}>
                <Ionicons
                  name="briefcase-outline"
                  size={24}
                  color={selectedRole === 'client' ? '#FFFFFF' : '#9333EA'}
                />
              </View>

              <View
                style={[
                  styles.radioCircle,
                  selectedRole === 'client' && styles.radioCircleActive,
                ]}>
                {selectedRole === 'client' && <View style={styles.radioInner} />}
              </View>
            </View>

            <Text style={styles.optionTitle}>I am a Client / Business</Text>
            <Text style={styles.optionDescription}>
              Post milestone contracts and hire top vetted African talent. Deposit funds safely in escrow, releasing payment only when deliverables are approved.
            </Text>

            <View style={styles.perksRow}>
              <View style={styles.perkChip}>
                <Ionicons name="lock-closed" size={13} color="#9333EA" />
                <Text style={styles.perkText}>Zero Upfront Risk</Text>
              </View>
              <View style={styles.perkChip}>
                <Ionicons name="people" size={13} color="#0F73F7" />
                <Text style={styles.perkText}>Vetted Talent Pool</Text>
              </View>
              <View style={styles.perkChip}>
                <Ionicons name="help-buoy" size={13} color="#10B981" />
                <Text style={styles.perkText}>Dispute Arbitration</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Continue CTA */}
          <TouchableOpacity
            style={styles.continueBtnWrapper}
            onPress={handleContinue}
            activeOpacity={0.9}>
            <LinearGradient
              colors={['#0F73F7', '#38BDF8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.continueGradient}>
              <Text style={styles.continueText}>
                Continue as {selectedRole === 'freelancer' ? 'Freelancer' : 'Client'}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Footer link to Sign In */}
          <TouchableOpacity
            style={styles.footerLink}
            onPress={() => router.push('/login')}
            activeOpacity={0.8}>
            <Text style={styles.footerLinkText}>
              Already have an account? <Text style={styles.boldLink}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
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
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF3FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  stepBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F73F7',
  },
  scrollContent: {
    padding: 20,
    gap: 18,
    paddingBottom: 40,
  },
  introBlock: {
    gap: 8,
    marginTop: 6,
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.light.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: Colors.light.textSecondary,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 2,
    borderColor: '#EEF3FA',
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    gap: 12,
  },
  selectedOptionCard: {
    borderColor: '#0F73F7',
    backgroundColor: '#FCFDFF',
    shadowOpacity: 0.1,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxActive: {
    backgroundColor: '#0F73F7',
  },
  iconBoxActiveClient: {
    backgroundColor: '#9333EA',
  },
  iconBoxInactive: {
    backgroundColor: '#EFF6FF',
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: '#0F73F7',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0F73F7',
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.light.text,
  },
  optionDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.light.textSecondary,
  },
  perksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  perkChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEF3FA',
  },
  perkText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.text,
  },
  continueBtnWrapper: {
    borderRadius: 27,
    overflow: 'hidden',
    marginTop: 12,
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  continueGradient: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  footerLink: {
    alignItems: 'center',
    marginTop: 6,
  },
  footerLinkText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  boldLink: {
    fontWeight: '800',
    color: '#0F73F7',
  },
});
