import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { SuccessOverlay } from '@/components/success-overlay';
import * as Haptics from 'expo-haptics';

export default function MilestoneReviewScreen() {
  const router = useRouter();
  const { isDark, colors } = useTheme();

  const [revisionModal, setRevisionModal] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [showApproveSuccess, setShowApproveSuccess] = useState(false);
  const [showRevisionSuccess, setShowRevisionSuccess] = useState(false);

  const deliverable = {
    contractTitle: 'Mobile App UI/UX Redesign & MoMo SDK',
    milestoneTitle: 'Milestone 2: Design System & Mobile Tokens',
    amount: 'GH₵ 2,000.00',
    developer: {
      name: 'Kwame Mensah',
      role: 'Senior React Native Engineer',
      rating: '5.0 ★ (8 jobs)',
      phone: '+233 24 ••• 4567 (MTN MoMo)',
      kyc: true,
    },
    notes:
      'Completed full token integration with Dark/Light palette support, haptic feedback on tab changes, and clean typecheck passed. Pull request submitted with complete unit test suite.',
    githubPr: 'https://github.com/braxvio-me/devpay/pull/4',
    demoUrl: 'https://devpay.africa/demo/v1.0.2',
    revisionsUsed: 0,
    revisionsAllowed: 2,
  };

  const handleApproveAndRelease = () => {
    Alert.alert(
      'Release Escrow Funds',
      `Are you sure you want to approve this milestone and release ${deliverable.amount} directly to ${deliverable.developer.name}'s MTN Mobile Money?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Release Payment',
          style: 'default',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setShowApproveSuccess(true);
          },
        },
      ]
    );
  };

  const handleSubmitRevision = () => {
    if (!revisionNotes.trim()) {
      Alert.alert('Notes Required', 'Please specify what changes are needed.');
      return;
    }
    setRevisionModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setShowRevisionSuccess(true);
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
            Review Deliverable
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Milestone Status Banner */}
          <LinearGradient
            colors={isDark ? ['#064E3B', '#0F172A'] : ['#ECFDF5', '#D1FAE5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.bannerCard}>
            <View style={styles.bannerIcon}>
              <Ionicons name="hourglass" size={24} color="#10B981" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.bannerBadge}>
                <Text style={styles.bannerBadgeText}>AWAITING YOUR APPROVAL</Text>
              </View>
              <Text
                style={[
                  styles.bannerAmount,
                  { color: isDark ? '#FFFFFF' : '#065F46' },
                ]}>
                {deliverable.amount}
              </Text>
              <Text
                style={[
                  styles.bannerDesc,
                  { color: isDark ? '#94A3B8' : '#047857' },
                ]}>
                Funds secured in DevPay Escrow.
              </Text>
            </View>
          </LinearGradient>

          {/* Developer Card */}
          <View
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}>
            <Text style={[styles.cardSectionTitle, { color: colors.textSecondary }]}>
              SUBMITTED BY DEVELOPER
            </Text>
            <View style={styles.developerRow}>
              <View style={[styles.avatarBox, { backgroundColor: colors.primary }]}>
                <Text style={styles.avatarInitials}>KM</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.devNameRow}>
                  <Text style={[styles.devName, { color: colors.text }]}>
                    {deliverable.developer.name}
                  </Text>
                  {deliverable.developer.kyc && (
                    <Ionicons name="checkmark-circle" size={15} color="#10B981" />
                  )}
                </View>
                <Text style={[styles.devRole, { color: colors.textSecondary }]}>
                  {deliverable.developer.role}
                </Text>
                <Text style={[styles.devRating, { color: colors.textMuted }]}>
                  {deliverable.developer.rating} • {deliverable.developer.phone}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.chatBtn, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' }]}
                onPress={() => router.push('/messages')}>
                <Ionicons name="chatbubble-outline" size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Deliverables Card */}
          <View
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}>
            <Text style={[styles.cardSectionTitle, { color: colors.textSecondary }]}>
              DELIVERABLE NOTES & ARTIFACTS
            </Text>
            <Text style={[styles.milestoneName, { color: colors.text }]}>
              {deliverable.milestoneTitle}
            </Text>

            <View
              style={[
                styles.notesBox,
                { backgroundColor: colors.backgroundElement, borderColor: colors.border },
              ]}>
              <Text style={[styles.notesText, { color: colors.text }]}>
                {deliverable.notes}
              </Text>
            </View>

            {/* Links */}
            <View style={styles.linkList}>
              <TouchableOpacity
                style={[
                  styles.linkRow,
                  { backgroundColor: colors.backgroundElement, borderColor: colors.border },
                ]}
                onPress={() =>
                  Alert.alert('GitHub PR', deliverable.githubPr)
                }>
                <View style={styles.linkLeft}>
                  <Ionicons name="logo-github" size={20} color={colors.text} />
                  <View>
                    <Text style={[styles.linkLabel, { color: colors.text }]}>
                      GitHub Pull Request #4
                    </Text>
                    <Text style={styles.linkUrl}>github.com/braxvio-me/devpay</Text>
                  </View>
                </View>
                <Ionicons name="open-outline" size={16} color={colors.primary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.linkRow,
                  { backgroundColor: colors.backgroundElement, borderColor: colors.border },
                ]}
                onPress={() =>
                  Alert.alert('Demo Build', deliverable.demoUrl)
                }>
                <View style={styles.linkLeft}>
                  <Ionicons name="phone-portrait-outline" size={20} color="#0F73F7" />
                  <View>
                    <Text style={[styles.linkLabel, { color: colors.text }]}>
                      Live Expo Preview Build
                    </Text>
                    <Text style={styles.linkUrl}>devpay.africa/demo/v1.0.2</Text>
                  </View>
                </View>
                <Ionicons name="open-outline" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Escrow Guarantee Policy Card */}
          <View
            style={[
              styles.guaranteeBox,
              { backgroundColor: isDark ? '#1E1B4B' : '#EEF2FF', borderColor: colors.border },
            ]}>
            <Ionicons name="shield-outline" size={20} color="#6366F1" />
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.guaranteeTitle,
                  { color: isDark ? '#FFFFFF' : '#312E81' },
                ]}>
                Automatic Release Window: 7 Days
              </Text>
              <Text
                style={[
                  styles.guaranteeSubtitle,
                  { color: isDark ? '#C7D2FE' : '#4338CA' },
                ]}>
                If you neither approve nor request a revision within 7 days, escrow releases automatically per DevPay Terms.
              </Text>
            </View>
          </View>

          {/* Action CTAs */}
          <View style={styles.actionContainer}>
            {/* Primary: Approve & Release */}
            <TouchableOpacity
              style={styles.approveBtnWrap}
              onPress={handleApproveAndRelease}
              activeOpacity={0.88}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.approveGradient}>
                <Ionicons name="checkmark-done" size={20} color="#FFFFFF" />
                <Text style={styles.approveBtnText}>
                  Approve & Release {deliverable.amount}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Secondary: Request Revision */}
            <TouchableOpacity
              style={[
                styles.revisionBtn,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={() => setRevisionModal(true)}
              activeOpacity={0.8}>
              <Ionicons name="repeat-outline" size={18} color="#D97706" />
              <Text style={styles.revisionBtnText}>
                Request Revisions (
                {deliverable.revisionsAllowed - deliverable.revisionsUsed} left)
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Revision Modal */}
      <Modal visible={revisionModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}>
            <View style={styles.modalTopRow}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Request Revisions
              </Text>
              <TouchableOpacity onPress={() => setRevisionModal(false)}>
                <Ionicons name="close" size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Explain clearly what needs adjustment. The developer will be notified and funds remain held in escrow.
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
              placeholder="e.g. Please fix the header offset on Android and adjust padding on smaller devices..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={4}
              value={revisionNotes}
              onChangeText={setRevisionNotes}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={[
                  styles.cancelModalBtn,
                  { backgroundColor: colors.backgroundElement },
                ]}
                onPress={() => setRevisionModal(false)}>
                <Text style={[styles.cancelModalText, { color: colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitRevisionBtn}
                onPress={handleSubmitRevision}>
                <Text style={styles.submitRevisionText}>Send Revision Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Overlays */}
      <SuccessOverlay
        visible={showApproveSuccess}
        type="success"
        title="Escrow Released!"
        subtitle={`${deliverable.amount} has been transferred directly to ${deliverable.developer.name}'s MTN Mobile Money wallet.`}
        dismissLabel="Back to Contracts"
        onDismiss={() => {
          setShowApproveSuccess(false);
          router.replace('/contracts');
        }}
      />

      <SuccessOverlay
        visible={showRevisionSuccess}
        type="verified"
        title="Revision Sent!"
        subtitle={`Your feedback has been sent to ${deliverable.developer.name}. Funds remain safely secured in escrow.`}
        dismissLabel="Understood"
        onDismiss={() => {
          setShowRevisionSuccess(false);
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
  bannerCard: {
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  bannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  bannerBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bannerAmount: {
    fontSize: 22,
    fontWeight: '900',
  },
  bannerDesc: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  card: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    gap: 14,
  },
  cardSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  developerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  devNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  devName: {
    fontSize: 15,
    fontWeight: '800',
  },
  devRole: {
    fontSize: 12,
    marginTop: 1,
  },
  devRating: {
    fontSize: 11,
    marginTop: 2,
  },
  chatBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneName: {
    fontSize: 16,
    fontWeight: '800',
  },
  notesBox: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
  },
  notesText: {
    fontSize: 13,
    lineHeight: 20,
  },
  linkList: {
    gap: 10,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  linkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  linkLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  linkUrl: {
    fontSize: 11,
    color: '#0F73F7',
    marginTop: 1,
  },
  guaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
  },
  guaranteeTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  guaranteeSubtitle: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  actionContainer: {
    gap: 10,
    marginTop: 6,
  },
  approveBtnWrap: {
    borderRadius: 27,
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
  },
  approveGradient: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  approveBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  revisionBtn: {
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  revisionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D97706',
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
  modalSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  modalTextArea: {
    minHeight: 100,
    borderRadius: 14,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    textAlignVertical: 'top',
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  cancelModalBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelModalText: {
    fontSize: 14,
    fontWeight: '700',
  },
  submitRevisionBtn: {
    flex: 2,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D97706',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitRevisionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
