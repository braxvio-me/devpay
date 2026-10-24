import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
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

interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: string;
  type: 'credit' | 'debit';
  status: 'Completed' | 'Pending Escrow' | 'Processing';
  reference: string;
}

export default function EarningsScreen() {
  const router = useRouter();
  const { isDark, colors } = useTheme();
  const { isClient } = useRole();

  const [modalVisible, setModalVisible] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState<'momo' | 'telecel' | 'bank'>('momo');
  const [showWithdrawSuccess, setShowWithdrawSuccess] = useState(false);

  const availableBalance = isClient ? 28500.0 : 2450.0;
  const pendingMilestones = isClient ? 14200.0 : 1800.0;
  const momoPhone = '024 123 4567';

  const transactions: Transaction[] = isClient
    ? [
        {
          id: 'tx_c1',
          title: 'Escrow Released — Milestone 2 Approved',
          date: 'Today, 2:30 PM',
          amount: '-GH₵ 2,000.00',
          type: 'debit',
          status: 'Completed',
          reference: 'ESC-REL-8831',
        },
        {
          id: 'tx_c2',
          title: 'MTN MoMo Escrow Deposit',
          date: 'Yesterday, 10:15 AM',
          amount: '+GH₵ 5,000.00',
          type: 'credit',
          status: 'Completed',
          reference: 'MOMO-DEP-1029',
        },
        {
          id: 'tx_c3',
          title: 'Contract Pre-funding: Lead Dev',
          date: 'Oct 20, 2026',
          amount: '-GH₵ 1,500.00',
          type: 'debit',
          status: 'Pending Escrow',
          reference: 'ESC-LOCK-4819',
        },
      ]
    : [
        {
          id: 'tx_1',
          title: 'Milestone 2 Approval — React Native App',
          date: 'Today, 2:30 PM',
          amount: '+GH₵ 1,200.00',
          type: 'credit',
          status: 'Completed',
          reference: 'DEV-MS-8831',
        },
        {
          id: 'tx_2',
          title: 'MTN MoMo Payout',
          date: 'Yesterday, 10:15 AM',
          amount: '-GH₵ 850.00',
          type: 'debit',
          status: 'Completed',
          reference: 'MOMO-WD-1029',
        },
        {
          id: 'tx_3',
          title: 'Milestone 1 Escrow Funded — Telecel App',
          date: 'Oct 20, 2026',
          amount: '+GH₵ 1,600.00',
          type: 'credit',
          status: 'Pending Escrow',
          reference: 'ESC-LOCK-4819',
        },
      ];

  const handleWithdraw = () => {
    const num = parseFloat(withdrawAmount);
    if (isNaN(num) || num <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid withdrawal amount.');
      return;
    }
    if (num < 50) {
      Alert.alert('Minimum Limit', 'Minimum withdrawal amount is GH₵ 50.00.');
      return;
    }
    if (num > availableBalance) {
      Alert.alert('Insufficient Balance', 'Amount exceeds available balance.');
      return;
    }
    setModalVisible(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowWithdrawSuccess(true);
    setWithdrawAmount('');
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
            {isClient ? 'Escrow Treasury & Deposits' : 'Earnings & Wallet'}
          </Text>
          <TouchableOpacity
            style={[
              styles.backButton,
              { backgroundColor: colors.backgroundElement, borderColor: colors.border },
            ]}
            onPress={() => Alert.alert('Export Statement', 'A monthly PDF statement will be sent to your registered email.')}>
            <Ionicons name="download-outline" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Main Hero Wallet Card */}
          <LinearGradient
            colors={isDark ? ['#1E1B4B', '#0F172A'] : ['#0F73F7', '#38BDF8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceLabel}>
                {isClient ? 'Total Escrow Capital' : 'Available for MoMo Withdrawal'}
              </Text>
              <View style={styles.currencyBadge}>
                <Text style={styles.currencyBadgeText}>GHS (GH₵)</Text>
              </View>
            </View>

            <Text style={styles.balanceAmount}>
              GH₵ {availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>

            {/* Pending Escrow Sub-Row */}
            <View style={styles.pendingRow}>
              <Ionicons name="lock-closed" size={13} color="rgba(255, 255, 255, 0.85)" />
              <Text style={styles.pendingText}>
                {isClient
                  ? `Released to Developers: GH₵ ${pendingMilestones.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                  : `Committed in Active Milestones: GH₵ ${pendingMilestones.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              </Text>
            </View>

            {/* CTA Buttons */}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
              {isClient ? (
                <TouchableOpacity
                  style={[styles.withdrawCta, { flex: 1 }]}
                  onPress={() => router.push('/payment')}
                  activeOpacity={0.88}>
                  <Ionicons name="card" size={17} color="#0F73F7" />
                  <Text style={styles.withdrawCtaText}>Deposit MoMo Escrow</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity
                    style={[styles.withdrawCta, { flex: 1.2 }]}
                    onPress={() => setModalVisible(true)}
                    activeOpacity={0.88}>
                    <Ionicons name="cash-outline" size={17} color="#0F73F7" />
                    <Text style={styles.withdrawCtaText}>Withdraw to MoMo</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.depositCta, { flex: 0.8 }]}
                    onPress={() => router.push('/payment')}
                    activeOpacity={0.88}>
                    <Ionicons name="arrow-up" size={15} color="#FFFFFF" />
                    <Text style={styles.depositCtaText}>Top Up</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </LinearGradient>

          {/* Quick Metrics */}
          <View style={styles.metricsRow}>
            <View
              style={[
                styles.statCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                {isClient ? 'Avg. Release Time' : 'Avg. Release Window'}
              </Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {isClient ? '2.4 Days' : '1.8 Days'}
              </Text>
            </View>

            <View
              style={[
                styles.statCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                MoMo Network Fee
              </Text>
              <Text style={[styles.statValue, { color: '#10B981' }]}>1% (Capped)</Text>
            </View>

            <View
              style={[
                styles.statCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                DevPay Escrow Fee
              </Text>
              <Text style={[styles.statValue, { color: colors.primary }]}>0% (Free)</Text>
            </View>
          </View>

          {/* Transaction History Section */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Transaction Ledger
            </Text>
            <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>
              Immutable Ghana Bank &amp; Mobile Money records
            </Text>
          </View>

          {transactions.map((tx) => (
            <View
              key={tx.id}
              style={[
                styles.txCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}>
              <View
                style={[
                  styles.txIconBox,
                  {
                    backgroundColor:
                      tx.type === 'credit'
                        ? isDark
                          ? '#064E3B'
                          : '#ECFDF5'
                        : isDark
                        ? '#1E293B'
                        : '#EFF6FF',
                  },
                ]}>
                <Ionicons
                  name={tx.type === 'credit' ? 'arrow-down-outline' : 'arrow-up-outline'}
                  size={18}
                  color={tx.type === 'credit' ? '#10B981' : colors.primary}
                />
              </View>

              <View style={styles.txDetails}>
                <Text style={[styles.txTitle, { color: colors.text }]} numberOfLines={1}>
                  {tx.title}
                </Text>
                <View style={styles.txMetaRow}>
                  <Text style={[styles.txDate, { color: colors.textSecondary }]}>
                    {tx.date}
                  </Text>
                  <Text style={[styles.txRef, { color: colors.textMuted }]}>
                    • {tx.reference}
                  </Text>
                </View>
              </View>

              <View style={styles.txAmountCol}>
                <Text
                  style={[
                    styles.txAmount,
                    { color: tx.type === 'credit' ? '#10B981' : colors.text },
                  ]}>
                  {tx.amount}
                </Text>
                <View
                  style={[
                    styles.statusPill,
                    {
                      backgroundColor:
                        tx.status === 'Completed'
                          ? isDark
                            ? '#064E3B'
                            : '#ECFDF5'
                          : '#FEF3C7',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.statusPillText,
                      {
                        color: tx.status === 'Completed' ? '#10B981' : '#D97706',
                      },
                    ]}>
                    {tx.status}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        <FloatingTabBar
          activeTab="jobs"
          onSelectTab={(tab) => {
            if (tab === 'home') router.push('/');
            if (tab === 'jobs') router.push('/contracts');
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

        {/* Withdrawal Modal */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalBackdrop}>
            <View
              style={[
                styles.modalCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}>
              <View style={styles.modalTopRow}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  Withdraw to Mobile Money
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={22} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                Instant payout to your verified MTN Mobile Money wallet.
              </Text>

              {/* Method select */}
              <View style={styles.methodRow}>
                {(['momo', 'telecel', 'bank'] as const).map((m) => {
                  const active = payoutMethod === m;
                  return (
                    <TouchableOpacity
                      key={m}
                      style={[
                        styles.methodChip,
                        {
                          backgroundColor: active
                            ? colors.primary
                            : colors.backgroundElement,
                          borderColor: active ? colors.primary : colors.border,
                        },
                      ]}
                      onPress={() => setPayoutMethod(m)}>
                      <Text
                        style={[
                          styles.methodChipText,
                          { color: active ? '#FFFFFF' : colors.text },
                        ]}>
                        {m === 'momo'
                          ? 'MTN MoMo'
                          : m === 'telecel'
                          ? 'Telecel Cash'
                          : 'Bank (EFT)'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Amount Input */}
              <View style={styles.amountInputWrap}>
                <Text style={[styles.inputPrefix, { color: colors.textSecondary }]}>
                  GH₵
                </Text>
                <TextInput
                  style={[
                    styles.amountInput,
                    {
                      backgroundColor: colors.backgroundElement,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  value={withdrawAmount}
                  placeholder="0.00"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  onChangeText={setWithdrawAmount}
                />
              </View>

              <View style={styles.walletPreview}>
                <Ionicons name="phone-portrait-outline" size={16} color="#10B981" />
                <Text style={[styles.walletPreviewText, { color: colors.textSecondary }]}>
                  Destination: {momoPhone} (Kwame Mensah)
                </Text>
              </View>

              <TouchableOpacity style={styles.confirmWithdrawBtn} onPress={handleWithdraw}>
                <Text style={styles.confirmWithdrawText}>Confirm Instant Payout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <SuccessOverlay
          visible={showWithdrawSuccess}
          type="success"
          title="Payout Initiated!"
          subtitle={`GH₵ ${withdrawAmount} sent to MTN MoMo (${momoPhone}). Funds will arrive within 60 seconds.`}
          dismissLabel="Done"
          onDismiss={() => setShowWithdrawSuccess(false)}
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
    gap: 16,
  },
  balanceCard: {
    borderRadius: 24,
    padding: 22,
    gap: 10,
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E0F2FE',
    letterSpacing: 0.4,
  },
  currencyBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  currencyBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  balanceAmount: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  pendingText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  withdrawCta: {
    height: 46,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  withdrawCtaText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F73F7',
  },
  depositCta: {
    height: 46,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  depositCtaText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  statValue: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 4,
  },
  sectionHeader: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  sectionSub: {
    fontSize: 11,
    marginTop: 2,
  },
  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    gap: 12,
  },
  txIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txDetails: {
    flex: 1,
  },
  txTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  txMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  txDate: {
    fontSize: 11,
  },
  txRef: {
    fontSize: 10,
  },
  txAmountCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  txAmount: {
    fontSize: 13,
    fontWeight: '800',
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
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
  methodRow: {
    flexDirection: 'row',
    gap: 8,
  },
  methodChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  methodChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  amountInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputPrefix: {
    fontSize: 16,
    fontWeight: '800',
  },
  amountInput: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: '800',
    borderWidth: 1,
  },
  walletPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  walletPreviewText: {
    fontSize: 12,
  },
  confirmWithdrawBtn: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0F73F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  confirmWithdrawText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
