import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';
import * as Haptics from 'expo-haptics';
import { SuccessOverlay } from '@/components/success-overlay';

interface MilestoneItem {
  id: string;
  title: string;
  amount: string;
  duration: string;
}

export default function JobApplyScreen() {
  const router = useRouter();

  const [coverLetter, setCoverLetter] = useState(
    'Hi Google Africa team, I have 6+ years specializing in React Native and mobile fintech design tokens. I recently engineered the MoMo checkout flow for DevPay and can deliver pixel-perfect baseline grids adhering to your African regional guidelines.'
  );

  const [milestones, setMilestones] = useState<MilestoneItem[]>([
    {
      id: 'm1',
      title: 'Milestone 1: Design Tokens & Component Library',
      amount: '2000',
      duration: '4 Days',
    },
    {
      id: 'm2',
      title: 'Milestone 2: Interactive High-Fidelity Prototype',
      amount: '2500',
      duration: '6 Days',
    },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [portfolioLink, setPortfolioLink] = useState('https://github.com/kwamemensah/devpay');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  const totalBid = milestones.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  const handleAddMilestone = () => {
    if (!newTitle.trim() || !newAmount.trim()) {
      Alert.alert('Incomplete Milestone', 'Please enter a milestone title and amount in GH₵.');
      return;
    }

    setMilestones([
      ...milestones,
      {
        id: `m_${Date.now()}`,
        title: newTitle.trim(),
        amount: newAmount.trim(),
        duration: '5 Days',
      },
    ]);
    setNewTitle('');
    setNewAmount('');
    setShowAddMilestone(false);
  };

  const handleRemoveMilestone = (id: string) => {
    if (milestones.length <= 1) {
      Alert.alert('Required', 'A proposal must include at least one escrow milestone.');
      return;
    }
    setMilestones(milestones.filter((m) => m.id !== id));
  };

  const handleSubmitProposal = async () => {
    if (!coverLetter.trim()) {
      Alert.alert('Required', 'Please write a brief pitch or cover letter.');
      return;
    }

    setIsSubmitting(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setTimeout(async () => {
      setIsSubmitting(false);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowSuccessOverlay(true);
    }, 800);
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Submit Milestone Proposal</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Job Summary Banner */}
          <View style={styles.jobSummaryCard}>
            <Image
              source={{
                uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/240px-Google_%22G%22_logo.svg.png',
              }}
              style={styles.companyLogo}
            />
            <View style={styles.jobSummaryDetails}>
              <View style={styles.companyRow}>
                <Text style={styles.companyName}>Google Africa</Text>
                <Ionicons name="checkmark-circle" size={14} color="#0F73F7" />
              </View>
              <Text style={styles.jobTitle}>Jr. UI/UX Designer</Text>
              <Text style={styles.clientBudget}>Client Budget: GH₵ 3,500 - 5,500</Text>
            </View>
          </View>

          {/* Proposal Bid Summary Card */}
          <View style={styles.bidSummaryCard}>
            <View>
              <Text style={styles.bidLabel}>Total Proposed Bid (Escrow Total)</Text>
              <Text style={styles.bidAmount}>GH₵ {totalBid.toLocaleString()}.00</Text>
            </View>
            <View style={styles.milestoneCountBadge}>
              <Text style={styles.milestoneCountText}>{milestones.length} Milestones</Text>
            </View>
          </View>

          {/* Milestone Breakdown Section */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>Escrow Milestones</Text>
              <TouchableOpacity
                onPress={() => setShowAddMilestone(!showAddMilestone)}
                activeOpacity={0.7}>
                <Text style={styles.addMilestoneText}>
                  {showAddMilestone ? 'Close' : '+ Add Milestone'}
                </Text>
              </TouchableOpacity>
            </View>

            {milestones.map((milestone, idx) => (
              <View key={milestone.id} style={styles.milestoneCard}>
                <View style={styles.milestoneIndexBox}>
                  <Text style={styles.milestoneIndexText}>{idx + 1}</Text>
                </View>
                <View style={styles.milestoneDetails}>
                  <Text style={styles.milestoneTitle}>{milestone.title}</Text>
                  <Text style={styles.milestoneMeta}>
                    GH₵ {parseFloat(milestone.amount).toLocaleString()} • {milestone.duration}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleRemoveMilestone(milestone.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="trash-outline" size={18} color={Colors.light.textMuted} />
                </TouchableOpacity>
              </View>
            ))}

            {showAddMilestone && (
              <View style={styles.addMilestoneForm}>
                <Text style={styles.formMiniTitle}>New Milestone Details</Text>
                <TextInput
                  style={styles.miniInput}
                  placeholder="Milestone Title (e.g. QA & Polish)"
                  placeholderTextColor={Colors.light.textMuted}
                  value={newTitle}
                  onChangeText={setNewTitle}
                />
                <TextInput
                  style={styles.miniInput}
                  placeholder="Amount in GH₵ (e.g. 1500)"
                  placeholderTextColor={Colors.light.textMuted}
                  value={newAmount}
                  onChangeText={setNewAmount}
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  style={styles.miniAddBtn}
                  onPress={handleAddMilestone}
                  activeOpacity={0.85}>
                  <Text style={styles.miniAddBtnText}>Add to Proposal</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Cover Letter / Pitch */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeading}>Cover Letter & Pitch</Text>
            <TextInput
              style={styles.coverLetterInput}
              value={coverLetter}
              onChangeText={setCoverLetter}
              placeholder="Introduce yourself and outline why you are ideal for this project..."
              placeholderTextColor={Colors.light.textMuted}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          {/* Relevant Link */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeading}>Relevant Portfolio / Deliverable Link</Text>
            <TextInput
              style={styles.singleInput}
              value={portfolioLink}
              onChangeText={setPortfolioLink}
              placeholder="https://github.com/..."
              placeholderTextColor={Colors.light.textMuted}
              autoCapitalize="none"
            />
          </View>

          {/* Escrow Guarantee Callout */}
          <View style={styles.guaranteeBox}>
            <Ionicons name="shield-checkmark" size={22} color="#0F73F7" />
            <View style={styles.guaranteeTextWrap}>
              <Text style={styles.guaranteeTitle}>DevPay Escrow Protection</Text>
              <Text style={styles.guaranteeDesc}>
                Before you begin any milestone, the client must pre-fund the full amount into DevPay secure escrow.
              </Text>
            </View>
          </View>

          {/* Submit CTA */}
          <TouchableOpacity
            style={styles.submitBtnWrapper}
            onPress={handleSubmitProposal}
            disabled={isSubmitting}
            activeOpacity={0.9}>
            <LinearGradient
              colors={['#178BF9', '#0866D6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitGradient}>
              <Text style={styles.submitBtnText}>
                {isSubmitting ? 'Submitting Proposal...' : `Submit Proposal (GH₵ ${totalBid.toLocaleString()})`}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>

        {/* Success Modal with Confetti & Animation */}
        <SuccessOverlay
          visible={showSuccessOverlay}
          type="success"
          title="Proposal Submitted! 🚀"
          subtitle="Your milestone proposal has been delivered to Google Africa. You will receive an instant notification once they fund Milestone 1 into escrow."
          onDismiss={() => {
            setShowSuccessOverlay(false);
            router.push('/contracts');
          }}
          dismissLabel="View My Contracts"
        />
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
    borderBottomWidth: 1,
    borderBottomColor: '#EEF3FA',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#EEF3FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.light.text,
  },
  scrollContent: {
    padding: 20,
    gap: 18,
    paddingBottom: 40,
  },
  jobSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF3FA',
    gap: 14,
  },
  companyLogo: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
  jobSummaryDetails: {
    flex: 1,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  companyName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.light.text,
    marginTop: 2,
  },
  clientBudget: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F73F7',
    marginTop: 2,
  },
  bidSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EFF6FF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  bidLabel: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '600',
  },
  bidAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F73F7',
    marginTop: 2,
  },
  milestoneCountBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  milestoneCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F73F7',
  },
  sectionBlock: {
    gap: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  addMilestoneText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F73F7',
  },
  milestoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EEF3FA',
    gap: 12,
  },
  milestoneIndexBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneIndexText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F73F7',
  },
  milestoneDetails: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.text,
  },
  milestoneMeta: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  addMilestoneForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 10,
  },
  formMiniTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F73F7',
  },
  miniInput: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    fontSize: 13,
    color: Colors.light.text,
    backgroundColor: '#F8FAFC',
  },
  miniAddBtn: {
    height: 42,
    borderRadius: 12,
    backgroundColor: '#0F73F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniAddBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  coverLetterInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEF3FA',
    padding: 14,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.light.text,
    minHeight: 120,
  },
  singleInput: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEF3FA',
    paddingHorizontal: 14,
    fontSize: 14,
    color: Colors.light.text,
  },
  guaranteeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  guaranteeTextWrap: {
    flex: 1,
  },
  guaranteeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F73F7',
  },
  guaranteeDesc: {
    fontSize: 12,
    color: '#1E40AF',
    lineHeight: 17,
    marginTop: 2,
  },
  submitBtnWrapper: {
    borderRadius: 26,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  submitGradient: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
