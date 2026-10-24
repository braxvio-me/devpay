import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { SuccessOverlay } from '@/components/success-overlay';
import * as Haptics from 'expo-haptics';

interface Applicant {
  id: string;
  name: string;
  initials: string;
  avatarBg: string;
  title: string;
  rating: string;
  completedJobs: number;
  bidAmount: string;
  bidTime: string;
  proposal: string;
  skills: string[];
  kycVerified: boolean;
}

export default function JobApplicantsScreen() {
  const router = useRouter();
  const { isDark, colors } = useTheme();

  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [showHiredSuccess, setShowHiredSuccess] = useState(false);

  const applicants: Applicant[] = [
    {
      id: 'app_1',
      name: 'Kwame Mensah',
      initials: 'KM',
      avatarBg: '#0F73F7',
      title: 'Senior Mobile & React Native Engineer',
      rating: '5.0 ★',
      completedJobs: 8,
      bidAmount: 'GH₵ 4,500.00',
      bidTime: '14 Days Delivery',
      proposal:
        'I have production experience integrating MTN MoMo Open API and Telecel Cash in React Native apps. All deliverables are built with TypeScript, Expo SDK 58, and modular milestone deliveries.',
      skills: ['React Native', 'Expo', 'TypeScript', 'MoMo API'],
      kycVerified: true,
    },
    {
      id: 'app_2',
      name: 'Akosua Serwaa',
      initials: 'AS',
      avatarBg: '#9333EA',
      title: 'UI/UX Designer & React Native Dev',
      rating: '4.9 ★',
      completedJobs: 12,
      bidAmount: 'GH₵ 4,200.00',
      bidTime: '10 Days Delivery',
      proposal:
        'Award-winning product designer with 4+ years building high-converting fintech interfaces for African tech startups. Can start milestone 1 immediately upon escrow deposit.',
      skills: ['Figma', 'React Native', 'Reanimated', 'Tailwind'],
      kycVerified: true,
    },
    {
      id: 'app_3',
      name: 'Emmanuel Osei',
      initials: 'EO',
      avatarBg: '#10B981',
      title: 'Full Stack & Mobile Engineer',
      rating: '4.8 ★',
      completedJobs: 5,
      bidAmount: 'GH₵ 4,800.00',
      bidTime: '16 Days Delivery',
      proposal:
        'Specialized in secure financial transaction lifecycles and webhook verification. I guarantee 100% bug-free escrow milestone handovers.',
      skills: ['Node.js', 'React Native', 'Webhooks', 'PostgreSQL'],
      kycVerified: true,
    },
  ];

  const handleHire = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    Alert.alert(
      'Hire & Fund Milestone 1',
      `Accept ${applicant.name}'s proposal of ${applicant.bidAmount}? Milestone 1 (GH₵ 1,500.00) will be locked in DevPay Escrow.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm & Fund Escrow',
          style: 'default',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setShowHiredSuccess(true);
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View
          style={[
            styles.header,
            { backgroundColor: colors.surface, borderBottomColor: colors.border },
          ]}>
          <TouchableOpacity
            style={[
              styles.backButton,
              { backgroundColor: colors.backgroundElement, borderColor: colors.border },
            ]}
            onPress={() => router.back()}
            activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Job Proposals (3)
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Job summary pill */}
          <View
            style={[
              styles.jobSummaryCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}>
            <View style={styles.jobBadgeRow}>
              <View style={styles.activeJobBadge}>
                <Text style={styles.activeJobBadgeText}>OPEN FOR HIRING</Text>
              </View>
              <Text style={[styles.jobBudgetText, { color: colors.primary }]}>
                Budget: GH₵ 4,500.00
              </Text>
            </View>
            <Text style={[styles.jobTitle, { color: colors.text }]}>
              Senior React Native Engineer (MoMo SDK)
            </Text>
            <Text style={[styles.jobDesc, { color: colors.textSecondary }]}>
              3 Ghana Card verified developers have submitted milestone proposals.
            </Text>
          </View>

          {/* Applicants List */}
          <Text style={[styles.sectionHeading, { color: colors.textSecondary }]}>
            SUBMITTED PROPOSALS
          </Text>

          {applicants.map((app) => (
            <View
              key={app.id}
              style={[
                styles.applicantCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}>
              {/* Applicant Header */}
              <View style={styles.cardHeader}>
                <View style={[styles.avatar, { backgroundColor: app.avatarBg }]}>
                  <Text style={styles.avatarText}>{app.initials}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.nameRow}>
                    <Text style={[styles.name, { color: colors.text }]}>
                      {app.name}
                    </Text>
                    {app.kycVerified && (
                      <Ionicons name="checkmark-circle" size={15} color="#10B981" />
                    )}
                  </View>
                  <Text style={[styles.devRole, { color: colors.textSecondary }]}>
                    {app.title}
                  </Text>
                  <Text style={[styles.statsLine, { color: colors.textMuted }]}>
                    {app.rating} • {app.completedJobs} contracts completed
                  </Text>
                </View>

                {/* Bid Badge */}
                <View style={styles.bidWrap}>
                  <Text style={[styles.bidAmount, { color: colors.primary }]}>
                    {app.bidAmount}
                  </Text>
                  <Text style={styles.bidTime}>{app.bidTime}</Text>
                </View>
              </View>

              {/* Cover Letter */}
              <View
                style={[
                  styles.proposalBox,
                  { backgroundColor: colors.backgroundElement, borderColor: colors.border },
                ]}>
                <Text
                  style={[styles.proposalText, { color: colors.text }]}
                  numberOfLines={3}>
                  &ldquo;{app.proposal}&rdquo;
                </Text>
              </View>

              {/* Skills */}
              <View style={styles.skillsRow}>
                {app.skills.map((s, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.skillBadge,
                      { backgroundColor: colors.backgroundElement, borderColor: colors.border },
                    ]}>
                    <Text style={[styles.skillText, { color: colors.text }]}>{s}</Text>
                  </View>
                ))}
              </View>

              {/* Action Buttons */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[
                    styles.chatBtn,
                    { backgroundColor: colors.backgroundElement, borderColor: colors.border },
                  ]}
                  onPress={() => router.push('/messages')}
                  activeOpacity={0.8}>
                  <Ionicons name="chatbubble-outline" size={16} color={colors.text} />
                  <Text style={[styles.chatBtnText, { color: colors.text }]}>
                    Interview
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.hireBtnWrap}
                  onPress={() => handleHire(app)}
                  activeOpacity={0.88}>
                  <LinearGradient
                    colors={['#0F73F7', '#38BDF8']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.hireGradient}>
                    <Ionicons name="briefcase" size={15} color="#FFFFFF" />
                    <Text style={styles.hireBtnText}>Hire &amp; Fund Escrow</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>

      <SuccessOverlay
        visible={showHiredSuccess}
        type="success"
        title="Contract Initiated!"
        subtitle={`${selectedApplicant?.name} has been hired. Milestone 1 (GH₵ 1,500.00) is locked in DevPay Escrow. Contract active.`}
        dismissLabel="View Contract"
        onDismiss={() => {
          setShowHiredSuccess(false);
          router.replace('/contracts');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
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
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  jobSummaryCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    gap: 8,
  },
  jobBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeJobBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activeJobBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10B981',
  },
  jobBudgetText: {
    fontSize: 13,
    fontWeight: '800',
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  jobDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginTop: 4,
  },
  applicantCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    gap: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
  },
  devRole: {
    fontSize: 12,
    marginTop: 1,
  },
  statsLine: {
    fontSize: 11,
    marginTop: 2,
  },
  bidWrap: {
    alignItems: 'flex-end',
  },
  bidAmount: {
    fontSize: 15,
    fontWeight: '800',
  },
  bidTime: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  proposalBox: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  proposalText: {
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  skillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  chatBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  chatBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  hireBtnWrap: {
    flex: 2,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  hireGradient: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  hireBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
