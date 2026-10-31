import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useRole } from '@/contexts/RoleContext';
import { FloatingTabBar } from '@/components/floating-tab-bar';
import { SuccessOverlay } from '@/components/success-overlay';
import * as Haptics from 'expo-haptics';

interface Milestone {
  id: string;
  title: string;
  amount: string;
  status: 'In Progress' | 'In Review' | 'Completed';
  deadline: string;
  revisionsUsed: number;
}

interface Contract {
  id: string;
  party: string; // client name or freelancer name depending on role
  title: string;
  totalBudget: string;
  activeMilestone: Milestone;
}

export default function ContractsScreen() {
  const router = useRouter();
  const { isDark, colors } = useTheme();
  const { isClient } = useRole();

  const [activeSegment, setActiveSegment] = useState<'active' | 'completed'>('active');
  const [submissionModal, setSubmissionModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [deliverableNotes, setDeliverableNotes] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [showSubmitSuccess, setShowSubmitSuccess] = useState(false);

  const contracts: Contract[] = [
    {
      id: 'c_1',
      party: isClient ? 'Kwame Mensah (Lead Dev)' : 'Google Africa',
      title: 'Mobile App UI/UX Redesign & MoMo SDK',
      totalBudget: 'GH₵ 4,500.00',
      activeMilestone: {
        id: 'm_2',
        title: 'Milestone 2: Design System & Mobile Tokens',
        amount: 'GH₵ 2,000.00',
        status: isClient ? 'In Review' : 'In Progress',
        deadline: '3 Days Remaining',
        revisionsUsed: 0,
      },
    },
    {
      id: 'c_2',
      party: isClient ? 'Akosua Serwaa (UI Designer)' : 'Telecel Digital Labs',
      title: 'MoMo Payment Checkout Screen',
      totalBudget: 'GH₵ 3,200.00',
      activeMilestone: {
        id: 'm_1',
        title: 'Milestone 1: Prototype & Checkout Flow',
        amount: 'GH₵ 1,600.00',
        status: 'In Review',
        deadline: 'Review expires in 4 days (Auto-approves)',
        revisionsUsed: 1,
      },
    },
  ];

  const handleOpenSubmission = (c: Contract) => {
    setSelectedContract(c);
    setSubmissionModal(true);
  };

  const handleSubmitDeliverable = () => {
    if (!deliverableNotes.trim()) {
      Alert.alert('Notes Required', 'Please provide a brief summary of the work.');
      return;
    }
    setSubmissionModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowSubmitSuccess(true);
    setDeliverableNotes('');
    setGithubUrl('');
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View
          style={[
            styles.topHeader,
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
            {isClient ? 'Managed Contracts & Escrow' : 'My Contracts & Milestones'}
          </Text>
          <TouchableOpacity
            style={[
              styles.backButton,
              { backgroundColor: colors.backgroundElement, borderColor: colors.border },
            ]}
            onPress={() => router.push('/notifications')}
            activeOpacity={0.8}>
            <Ionicons name="notifications-outline" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Segmented Control: Active vs Completed */}
        <View style={styles.segmentWrapper}>
          <TouchableOpacity
            style={[
              styles.segmentBtn,
              {
                backgroundColor:
                  activeSegment === 'active'
                    ? colors.primary
                    : colors.backgroundElement,
                borderColor:
                  activeSegment === 'active' ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setActiveSegment('active')}>
            <Text
              style={[
                styles.segmentText,
                { color: activeSegment === 'active' ? '#FFFFFF' : colors.text },
              ]}>
              Active Contracts (2)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentBtn,
              {
                backgroundColor:
                  activeSegment === 'completed'
                    ? colors.primary
                    : colors.backgroundElement,
                borderColor:
                  activeSegment === 'completed' ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setActiveSegment('completed')}>
            <Text
              style={[
                styles.segmentText,
                { color: activeSegment === 'completed' ? '#FFFFFF' : colors.text },
              ]}>
              Completed (8)
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {contracts.map((c) => (
            <View
              key={c.id}
              style={[
                styles.contractCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}>
              {/* Contract Top Row */}
              <View style={styles.cardHeader}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={[styles.clientName, { color: colors.primary }]}>
                    {c.party}
                  </Text>
                  <Text style={[styles.projectTitle, { color: colors.text }]}>
                    {c.title}
                  </Text>
                </View>
                <View
                  style={[
                    styles.budgetPill,
                    { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' },
                  ]}>
                  <Text style={[styles.budgetText, { color: colors.primary }]}>
                    {c.totalBudget}
                  </Text>
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              {/* Active Milestone Box */}
              <View
                style={[
                  styles.milestoneBox,
                  { backgroundColor: colors.backgroundElement, borderColor: colors.border },
                ]}>
                <View style={styles.milestoneHeader}>
                  <Text style={[styles.milestoneTag, { color: colors.textSecondary }]}>
                    ACTIVE MILESTONE
                  </Text>
                  <View
                    style={[
                      styles.statusPill,
                      c.activeMilestone.status === 'In Progress'
                        ? styles.statusInProgress
                        : styles.statusInReview,
                    ]}>
                    <Text
                      style={[
                        styles.statusText,
                        c.activeMilestone.status === 'In Progress'
                          ? styles.statusInProgressText
                          : styles.statusInReviewText,
                      ]}>
                      {c.activeMilestone.status}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.milestoneTitle, { color: colors.text }]}>
                  {c.activeMilestone.title}
                </Text>
                <Text style={[styles.milestoneAmount, { color: colors.text }]}>
                  {c.activeMilestone.amount}
                </Text>

                {/* Deadlines & Revision Counts */}
                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={13} color="#0F73F7" />
                    <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                      {c.activeMilestone.deadline}
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="refresh-outline" size={13} color="#D97706" />
                    <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                      Revisions: {c.activeMilestone.revisionsUsed}/2
                    </Text>
                  </View>
                </View>

                {/* Actions: Client vs Freelancer */}
                {isClient ? (
                  c.activeMilestone.status === 'In Review' ? (
                    <TouchableOpacity
                      style={styles.reviewBtnWrap}
                      onPress={() => router.push('/contracts/review')}
                      activeOpacity={0.88}>
                      <LinearGradient
                        colors={['#10B981', '#059669']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.actionBtnGradient}>
                        <Ionicons name="shield-checkmark" size={16} color="#FFFFFF" />
                        <Text style={styles.actionBtnText}>
                          Review Deliverable & Release Escrow
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.clientWaitingBox}>
                      <Ionicons name="hourglass-outline" size={16} color="#0F73F7" />
                      <Text style={[styles.clientWaitingText, { color: colors.textSecondary }]}>
                        Developer is working on deliverable. Funds locked in escrow.
                      </Text>
                    </View>
                  )
                ) : (
                  c.activeMilestone.status === 'In Progress' ? (
                    <TouchableOpacity
                      style={styles.submitBtnWrap}
                      onPress={() => handleOpenSubmission(c)}
                      activeOpacity={0.88}>
                      <LinearGradient
                        colors={['#0F73F7', '#38BDF8']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.actionBtnGradient}>
                        <Ionicons name="cloud-upload" size={16} color="#FFFFFF" />
                        <Text style={styles.actionBtnText}>
                          Submit Work & Request Release
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.waitingReviewBox}>
                      <Ionicons name="time" size={15} color="#D97706" />
                      <Text style={styles.waitingReviewText}>
                        Client is currently reviewing your submission (7-day window)
                      </Text>
                    </View>
                  )
                )}
              </View>
            </View>
          ))}
        </ScrollView>

        <FloatingTabBar
          activeTab="jobs"
          onSelectTab={(tab) => {
            if (tab === 'home') router.push('/');
            if (tab === 'chats') router.push('/messages');
            if (tab === 'profile') router.push('/profile');
          }}
          onCenterActionPress={() => {
            if (isClient) {
              router.push('/job/create');
            } else {
              router.push('/explore');
            }
          }}
        />

        {/* Deliverable Submission Modal */}
        <Modal visible={submissionModal} transparent animationType="slide">
          <View style={styles.modalBackdrop}>
            <View
              style={[
                styles.modalCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}>
              <View style={styles.modalTopRow}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  Submit Milestone Work
                </Text>
                <TouchableOpacity onPress={() => setSubmissionModal(false)}>
                  <Ionicons name="close" size={22} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.modalSub, { color: colors.textSecondary }]}>
                {selectedContract?.activeMilestone.title} ({selectedContract?.activeMilestone.amount})
              </Text>

              <View style={styles.modalInputGroup}>
                <Text style={[styles.modalLabel, { color: colors.text }]}>
                  GitHub PR or Repository URL
                </Text>
                <TextInput
                  style={[
                    styles.modalInput,
                    {
                      backgroundColor: colors.backgroundElement,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="https://github.com/..."
                  placeholderTextColor={colors.textMuted}
                  value={githubUrl}
                  onChangeText={setGithubUrl}
                />
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={[styles.modalLabel, { color: colors.text }]}>
                  Deliverable Notes
                </Text>
                <TextInput
                  style={[
                    styles.modalTextArea,
                    {
                      backgroundColor: colors.backgroundElement,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="Describe your delivery, setup instructions, or test accounts..."
                  placeholderTextColor={colors.textMuted}
                  multiline
                  numberOfLines={4}
                  value={deliverableNotes}
                  onChangeText={setDeliverableNotes}
                />
              </View>

              <View style={styles.modalBtnRow}>
                <TouchableOpacity
                  style={[
                    styles.cancelBtn,
                    { backgroundColor: colors.backgroundElement },
                  ]}
                  onPress={() => setSubmissionModal(false)}>
                  <Text style={[styles.cancelBtnText, { color: colors.text }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.submitModalBtn}
                  onPress={handleSubmitDeliverable}>
                  <Text style={styles.submitModalBtnText}>Submit to Client</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <SuccessOverlay
          visible={showSubmitSuccess}
          type="verified"
          title="Deliverable Submitted!"
          subtitle="Your work has been submitted to the client. The 7-day review window has started."
          dismissLabel="Done"
          onDismiss={() => setShowSubmitSuccess(false)}
        />
      </SafeAreaView>
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
  topHeader: {
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
    fontSize: 16,
    fontWeight: '800',
  },
  segmentWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
  },
  segmentBtn: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 110,
    gap: 16,
  },
  contractCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  clientName: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  projectTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  budgetPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  budgetText: {
    fontSize: 12,
    fontWeight: '800',
  },
  divider: {
    height: 1,
  },
  milestoneBox: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    gap: 8,
  },
  milestoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  milestoneTag: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusInProgress: {
    backgroundColor: '#EFF6FF',
  },
  statusInReview: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusInProgressText: {
    color: '#0F73F7',
  },
  statusInReviewText: {
    color: '#D97706',
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  milestoneAmount: {
    fontSize: 18,
    fontWeight: '900',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
  },
  submitBtnWrap: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 6,
  },
  reviewBtnWrap: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 6,
  },
  actionBtnGradient: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  clientWaitingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
    paddingVertical: 6,
  },
  clientWaitingText: {
    fontSize: 12,
    flex: 1,
  },
  waitingReviewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    paddingVertical: 6,
  },
  waitingReviewText: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: '600',
    flex: 1,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderWidth: 1,
    gap: 14,
  },
  modalTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalSub: {
    fontSize: 13,
    fontWeight: '600',
  },
  modalInputGroup: {
    gap: 6,
  },
  modalLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  modalInput: {
    height: 46,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 13,
    borderWidth: 1,
  },
  modalTextArea: {
    minHeight: 90,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    borderWidth: 1,
    textAlignVertical: 'top',
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  cancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  submitModalBtn: {
    flex: 2,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#0F73F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitModalBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
