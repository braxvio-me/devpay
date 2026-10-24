import { FloatingTabBar } from '@/components/floating-tab-bar';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const [modalVisible, setModalVisible] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState<'momo' | 'telecel' | 'bank'>('momo');
  const [momoPhone] = useState('024 123 4567');

  const availableBalance = 2450.0;
  const pendingMilestones = 1800.0;

  const transactions: Transaction[] = [
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
      reference: 'MOMO-PAY-4412',
    },
    {
      id: 'tx_3',
      title: 'Milestone 1 Funded (In Escrow) — UI Redesign',
      date: '21 Oct, 4:00 PM',
      amount: 'GH₵ 1,800.00',
      type: 'credit',
      status: 'Pending Escrow',
      reference: 'ESCROW-9901',
    },
    {
      id: 'tx_4',
      title: 'Platform Commission (10%)',
      date: '19 Oct, 11:00 AM',
      amount: '-GH₵ 120.00',
      type: 'debit',
      status: 'Completed',
      reference: 'DEV-FEE-1102',
    },
  ];

  const handleWithdrawConfirm = () => {
    const num = parseFloat(withdrawAmount);
    if (isNaN(num) || num < 50) {
      alert('Minimum withdrawal amount is GH₵ 50.00');
      return;
    }
    if (num > availableBalance) {
      alert('Withdrawal amount cannot exceed available balance.');
      return;
    }
    setModalVisible(false);
    alert(`Withdrawal of GH₵ ${num.toFixed(2)} initiated to MTN MoMo (${momoPhone}). Net payout after GH₵ 1.50 network fee: GH₵ ${(num - 1.5).toFixed(2)}.`);
    setWithdrawAmount('');
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top Header */}
        <View style={styles.topHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Earnings &amp; Wallet</Text>
          <TouchableOpacity style={styles.receiptButton}>
            <Ionicons name="download-outline" size={20} color={Colors.light.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Main Hero Wallet Card */}
          <LinearGradient
            colors={['#0F73F7', '#38BDF8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceLabel}>Available for Withdrawal</Text>
              <View style={styles.currencyBadge}>
                <Text style={styles.currencyBadgeText}>GHS (GH₵)</Text>
              </View>
            </View>

            <Text style={styles.balanceAmount}>
              GH₵ {availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>

            {/* Pending Escrow Sub-Row */}
            <View style={styles.pendingRow}>
              <Ionicons name="lock-closed" size={14} color="rgba(255, 255, 255, 0.85)" />
              <Text style={styles.pendingText}>
                Committed in Active Milestones: GH₵ {pendingMilestones.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
            </View>

            {/* Withdraw & Deposit CTA Buttons */}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
              <TouchableOpacity
                style={[styles.withdrawCta, { flex: 1.2 }]}
                onPress={() => router.push('/withdraw')}
                activeOpacity={0.88}>
                <Text style={styles.withdrawCtaText}>Withdraw MoMo</Text>
                <Ionicons name="arrow-forward" size={15} color="#0F73F7" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.withdrawCta,
                  {
                    flex: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                ]}
                onPress={() => router.push('/payment')}
                activeOpacity={0.88}>
                <Text style={[styles.withdrawCtaText, { color: '#FFFFFF' }]}>+ Deposit</Text>
                <Ionicons name="cash-outline" size={15} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Quick Metrics */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Total Earned</Text>
              <Text style={styles.statValue}>GH₵ 12,450</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Completed Jobs</Text>
              <Text style={styles.statValue}>8 Contracts</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Avg Milestone</Text>
              <Text style={styles.statValue}>GH₵ 1,550</Text>
            </View>
          </View>

          {/* Transaction Ledger Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transaction History</Text>
            <Text style={styles.sectionSub}>All events recorded in audit ledger</Text>
          </View>

          {transactions.map((tx) => (
            <View key={tx.id} style={styles.txCard}>
              <View style={styles.txIconBox}>
                <Ionicons
                  name={tx.type === 'credit' ? 'arrow-down-circle' : 'arrow-up-circle'}
                  size={24}
                  color={tx.type === 'credit' ? '#10B981' : '#64748B'}
                />
              </View>

              <View style={styles.txDetails}>
                <Text style={styles.txTitle}>{tx.title}</Text>
                <View style={styles.txMetaRow}>
                  <Text style={styles.txDate}>{tx.date}</Text>
                  <Text style={styles.txRef}>• {tx.reference}</Text>
                </View>
              </View>

              <View style={styles.txAmountCol}>
                <Text
                  style={[
                    styles.txAmount,
                    tx.type === 'credit' && styles.txCredit,
                    tx.status === 'Pending Escrow' && styles.txPending,
                  ]}>
                  {tx.amount}
                </Text>
                <View
                  style={[
                    styles.statusPill,
                    tx.status === 'Completed' && styles.statusCompleted,
                    tx.status === 'Pending Escrow' && styles.statusPendingEscrow,
                  ]}>
                  <Text
                    style={[
                      styles.statusPillText,
                      tx.status === 'Completed' && styles.statusCompletedText,
                      tx.status === 'Pending Escrow' && styles.statusPendingEscrowText,
                    ]}>
                    {tx.status}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Withdrawal Modal */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Withdraw Earnings</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={22} color={Colors.light.text} />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalSubtitle}>
                Funds will be deposited directly to your Ghanaian Mobile Money or Bank Account.
              </Text>

              {/* Method Selector */}
              <View style={styles.payoutTabs}>
                <TouchableOpacity
                  style={[styles.payoutTab, payoutMethod === 'momo' && styles.activePayoutTab]}
                  onPress={() => setPayoutMethod('momo')}>
                  <Text style={styles.payoutEmoji}>📱</Text>
                  <Text style={[styles.payoutText, payoutMethod === 'momo' && styles.activePayoutText]}>
                    MTN MoMo
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.payoutTab, payoutMethod === 'telecel' && styles.activePayoutTab]}
                  onPress={() => setPayoutMethod('telecel')}>
                  <Text style={styles.payoutEmoji}>🔴</Text>
                  <Text style={[styles.payoutText, payoutMethod === 'telecel' && styles.activePayoutText]}>
                    Telecel Cash
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.payoutTab, payoutMethod === 'bank' && styles.activePayoutTab]}
                  onPress={() => setPayoutMethod('bank')}>
                  <Text style={styles.payoutEmoji}>🏦</Text>
                  <Text style={[styles.payoutText, payoutMethod === 'bank' && styles.activePayoutText]}>
                    Bank Transfer
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Amount Input */}
              <View style={styles.amountInputBox}>
                <Text style={styles.ghsPrefix}>GH₵</Text>
                <TextInput
                  style={styles.amountField}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  value={withdrawAmount}
                  onChangeText={setWithdrawAmount}
                  autoFocus
                />
              </View>

              <Text style={styles.minAmountNote}>
                Minimum withdrawal: GH₵ 50.00 • Available: GH₵ {availableBalance.toFixed(2)}
              </Text>

              {/* Transparent Fee Summary Box */}
              <View style={styles.feeBreakdown}>
                <View style={styles.feeRow}>
                  <Text style={styles.feeLabel}>Transfer Fee (MoMo Gateway):</Text>
                  <Text style={styles.feeValue}>GH₵ 1.50</Text>
                </View>
                <View style={styles.feeRow}>
                  <Text style={styles.feeLabel}>Estimated Delivery:</Text>
                  <Text style={styles.feeValue}>Instant (&lt; 2 mins)</Text>
                </View>
              </View>

              {/* Confirm Button */}
              <TouchableOpacity
                style={styles.confirmWithdrawBtn}
                onPress={handleWithdrawConfirm}
                activeOpacity={0.88}>
                <LinearGradient
                  colors={['#0F73F7', '#38BDF8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.confirmGradient}>
                  <Text style={styles.confirmText}>Confirm Withdrawal</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Floating Tab Bar */}
        <FloatingTabBar
          activeTab="home"
          onSelectTab={(tab) => {
            if (tab === 'home') router.push('/');
            if (tab === 'jobs') router.push('/explore');
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
  receiptButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF3FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 110,
  },
  balanceCard: {
    borderRadius: 26,
    padding: 22,
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 6,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  currencyBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  currencyBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 10,
    letterSpacing: -0.5,
  },
  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  pendingText: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  withdrawCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    height: 48,
    borderRadius: 24,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  withdrawCtaText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F73F7',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEF3FA',
  },
  statLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.text,
    marginTop: 4,
  },
  sectionHeader: {
    marginTop: 26,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.light.text,
  },
  sectionSub: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEF3FA',
  },
  txIconBox: {
    marginRight: 12,
  },
  txDetails: {
    flex: 1,
  },
  txTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.text,
  },
  txMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  txDate: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  txRef: {
    fontSize: 10,
    color: Colors.light.textMuted,
  },
  txAmountCol: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.text,
  },
  txCredit: {
    color: '#10B981',
  },
  txPending: {
    color: '#F59E0B',
  },
  statusPill: {
    paddingHorizontal: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusCompleted: {
    backgroundColor: '#ECFDF5',
  },
  statusCompletedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
  },
  statusPendingEscrow: {
    backgroundColor: '#FEF3C7',
  },
  statusPendingEscrowText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
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
  payoutTabs: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 18,
  },
  payoutTab: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 4,
  },
  activePayoutTab: {
    backgroundColor: '#EBF4FE',
    borderWidth: 1.5,
    borderColor: '#0F73F7',
  },
  payoutEmoji: {
    fontSize: 16,
  },
  payoutText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  activePayoutText: {
    color: '#0F73F7',
    fontWeight: '700',
  },
  amountInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 60,
    marginTop: 18,
  },
  ghsPrefix: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F73F7',
    marginRight: 10,
  },
  amountField: {
    flex: 1,
    fontSize: 24,
    fontWeight: '800',
    color: Colors.light.text,
  },
  minAmountNote: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 6,
  },
  feeBreakdown: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#EEF3FA',
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  feeLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  feeValue: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.text,
  },
  confirmWithdrawBtn: {
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    marginTop: 20,
  },
  confirmGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
