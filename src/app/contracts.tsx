import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';
import { FloatingTabBar } from '@/components/floating-tab-bar';

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
  client: string;
  title: string;
  totalBudget: string;
  activeMilestone: Milestone;
}

export default function ContractsScreen() {
  const router = useRouter();
  const [activeSegment, setActiveSegment] = useState<'active' | 'completed'>('active');
  const [submissionModal, setSubmissionModal] = useState(false);
  const [deliverableNotes, setDeliverableNotes] = useState('');
  const [githubUrl, setGithubUrl] = useState('');

  const contracts: Contract[] = [
    {
      id: 'c_1',
      client: 'Google Africa',
      title: 'Mobile App UI/UX Redesign',
      totalBudget: 'GH₵ 4,500.00',
      activeMilestone: {
        id: 'm_2',
        title: 'Milestone 2: Design System & Mobile Tokens',
        amount: 'GH₵ 2,000.00',
        status: 'In Progress',
        deadline: '3 Days Remaining',
        revisionsUsed: 0,
      },
    },
    {
      id: 'c_2',
      client: 'Telecel Digital Labs',
      title: 'MoMo Payment Checkout Screen',
      totalBudget: 'GH₵ 3,200.00',
      activeMilestone: {
        id: 'm_1',
        title: 'Milestone 1: Figma Prototype & Checkout Flow',
        amount: 'GH₵ 1,600.00',
        status: 'In Review',
        deadline: 'Review expires in 4 days (Auto-approves)',
        revisionsUsed: 1,
      },
    },
  ];

  const handleSubmitDeliverable = () => {
    setSubmissionModal(false);
    alert('Deliverable submitted to client! 7-day review window started. Client has been notified via email & in-app.');
    setDeliverableNotes('');
    setGithubUrl('');
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.topHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Contracts &amp; Milestones</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push('/notifications')}
            activeOpacity={0.8}>
            <Ionicons name="notifications-outline" size={20} color={Colors.light.text} />
          </TouchableOpacity>
        </View>

        {/* Segmented Control: Active vs Completed */}
        <View style={styles.segmentWrapper}>
          <TouchableOpacity
            style={[styles.segmentBtn, activeSegment === 'active' && styles.activeSegmentBtn]}
            onPress={() => setActiveSegment('active')}>
            <Text style={[styles.segmentText, activeSegment === 'active' && styles.activeSegmentText]}>
              Active Contracts (2)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, activeSegment === 'completed' && styles.activeSegmentBtn]}
            onPress={() => setActiveSegment('completed')}>
            <Text style={[styles.segmentText, activeSegment === 'completed' && styles.activeSegmentText]}>
              Completed (8)
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {contracts.map((c) => (
            <View key={c.id} style={styles.contractCard}>
              {/* Contract Top Row */}
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.clientName}>{c.client}</Text>
                  <Text style={styles.projectTitle}>{c.title}</Text>
                </View>
                <View style={styles.budgetPill}>
                  <Text style={styles.budgetText}>{c.totalBudget}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Active Milestone Box */}
              <View style={styles.milestoneBox}>
                <View style={styles.milestoneHeader}>
                  <Text style={styles.milestoneTag}>ACTIVE MILESTONE</Text>
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

                <Text style={styles.milestoneTitle}>{c.activeMilestone.title}</Text>
                <Text style={styles.milestoneAmount}>{c.activeMilestone.amount}</Text>

                {/* Deadlines & Revision Counts */}
                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={13} color="#2563EB" />
                    <Text style={styles.metaText}>{c.activeMilestone.deadline}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="refresh-outline" size={13} color="#64748B" />
                    <Text style={styles.metaText}>
                      Revisions: {c.activeMilestone.revisionsUsed}/2
                    </Text>
                  </View>
                </View>

                {/* Submit Deliverable Action */}
                {c.activeMilestone.status === 'In Progress' ? (
                  <TouchableOpacity
                    style={styles.submitDeliverableBtn}
                    onPress={() => setSubmissionModal(true)}
                    activeOpacity={0.88}>
                    <LinearGradient
                      colors={['#0F73F7', '#38BDF8']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.btnGradient}>
                      <Ionicons name="cloud-upload-outline" size={16} color="#FFFFFF" />
                      <Text style={styles.btnText}>Submit Deliverable</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.inReviewBanner}>
                    <Ionicons name="hourglass-outline" size={15} color="#D97706" />
                    <Text style={styles.inReviewText}>
                      Deliverable submitted. Client review window active.
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Deliverable Submission Modal */}
        <Modal
          visible={submissionModal}
          transparent
          animationType="slide"
          onRequestClose={() => setSubmissionModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Submit Milestone Work</Text>
                <TouchableOpacity onPress={() => setSubmissionModal(false)}>
                  <Ionicons name="close" size={22} color={Colors.light.text} />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalSubtitle}>
                Provide links to your deliverables (Figma, GitHub, Loom) and a summary of completed work.
              </Text>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>GitHub / Figma / Deliverable Link</Text>
                <View style={styles.modalInputBox}>
                  <Ionicons name="link-outline" size={18} color={Colors.light.textMuted} style={{ marginRight: 8 }} />
                  <TextInput
                    style={styles.modalInput}
                    placeholder="https://github.com/... or https://figma.com/..."
                    placeholderTextColor={Colors.light.textMuted}
                    value={githubUrl}
                    onChangeText={setGithubUrl}
                  />
                </View>
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Submission Notes</Text>
                <TextInput
                  style={[styles.modalInputBox, styles.modalTextArea]}
                  placeholder="Detail what was built and instructions for the client..."
                  placeholderTextColor={Colors.light.textMuted}
                  multiline
                  numberOfLines={4}
                  value={deliverableNotes}
                  onChangeText={setDeliverableNotes}
                />
              </View>

              {/* Submit CTA */}
              <TouchableOpacity
                style={styles.confirmSubmitBtn}
                onPress={handleSubmitDeliverable}
                activeOpacity={0.88}>
                <LinearGradient
                  colors={['#0F73F7', '#38BDF8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.btnGradient}>
                  <Text style={styles.confirmSubmitText}>Send for Client Approval</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Floating Tab Bar */}
        <FloatingTabBar
          activeTab="jobs"
          onSelectTab={(tab) => {
            if (tab === 'home') router.push('/');
            if (tab === 'chats') router.push('/messages');
            if (tab === 'profile') router.push('/profile');
          }}
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
  topHeader: {
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
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.light.text,
  },
  segmentWrapper: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    marginHorizontal: 20,
    marginTop: 8,
    padding: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 11,
  },
  activeSegmentBtn: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  activeSegmentText: {
    color: '#0F73F7',
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
  },
  contractCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEF3FA',
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  clientName: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontWeight: '600',
  },
  projectTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.light.text,
    marginTop: 2,
  },
  budgetPill: {
    backgroundColor: '#F0FDF4',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  budgetText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEF3FA',
    marginVertical: 14,
  },
  milestoneBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E8EFF8',
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  milestoneTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F73F7',
    letterSpacing: 0.5,
  },
  statusPill: {
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusInProgress: {
    backgroundColor: '#EFF6FF',
  },
  statusInProgressText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  },
  statusInReview: {
    backgroundColor: '#FEF3C7',
  },
  statusInReviewText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
  },
  milestoneTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.text,
    marginTop: 8,
  },
  milestoneAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F73F7',
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  submitDeliverableBtn: {
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    marginTop: 14,
  },
  btnGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  inReviewBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFBEB',
    padding: 10,
    borderRadius: 10,
    marginTop: 12,
  },
  inReviewText: {
    fontSize: 11,
    color: '#B45309',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.light.text,
  },
  modalSubtitle: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    lineHeight: 18,
    marginTop: 6,
  },
  modalInputGroup: {
    marginTop: 16,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 6,
  },
  modalInputBox: {
    height: 50,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEF3FA',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  modalInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.light.text,
  },
  modalTextArea: {
    height: 100,
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  confirmSubmitBtn: {
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    marginTop: 22,
  },
  confirmSubmitText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
