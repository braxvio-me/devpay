import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

export default function PaymentScreen() {
  const router = useRouter();
  const { isDark, colors } = useTheme();

  const [selectedContract, setSelectedContract] = useState('c_1');
  const [amount, setAmount] = useState('2000');
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'telecel' | 'card' | 'wallet'>('momo');
  const [phone, setPhone] = useState('024 123 4567');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [txRef, setTxRef] = useState('');

  const contracts = [
    {
      id: 'c_1',
      title: 'Milestone 2: Design System Tokens',
      client: 'Google Africa',
      freelancer: 'Kwame Mensah',
      milestoneAmount: '2000',
    },
    {
      id: 'c_2',
      title: 'Milestone 1: Figma Prototype',
      client: 'Telecel Digital Labs',
      freelancer: 'Kwame Mensah',
      milestoneAmount: '1600',
    },
  ];

  const handleSelectContract = (contractId: string) => {
    setSelectedContract(contractId);
    const found = contracts.find((c) => c.id === contractId);
    if (found) {
      setAmount(found.milestoneAmount);
    }
  };

  const handleFundEscrow = () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid deposit amount in GH₵.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setTxRef(`DEV-ESCROW-${Math.floor(100000 + Math.random() * 900000)}`);
      setSuccessModal(true);
    }, 1200);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Fund Milestone Escrow</Text>
          <View style={styles.secureBadge}>
            <Ionicons name="shield-checkmark" size={14} color="#10B981" />
            <Text style={styles.secureText}>Escrow</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Milestone Target Selection */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeading}>Target Contract Milestone</Text>
            {contracts.map((c) => {
              const isSelected = selectedContract === c.id;
              return (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.contractCard, isSelected && styles.contractCardSelected]}
                  onPress={() => handleSelectContract(c.id)}
                  activeOpacity={0.85}>
                  <View style={styles.contractTopRow}>
                    <Text style={styles.contractTitle}>{c.title}</Text>
                    <View style={styles.contractAmountPill}>
                      <Text style={styles.contractAmountText}>GH₵ {c.milestoneAmount}</Text>
                    </View>
                  </View>
                  <Text style={styles.contractMeta}>
                    Client: {c.client} • Freelancer: {c.freelancer}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Amount Input */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeading}>Escrow Deposit Amount (GH₵)</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.amountCurrencyPrefix}>GH₵</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="2000"
                placeholderTextColor={Colors.light.textMuted}
              />
            </View>

            {/* Quick Chips */}
            <View style={styles.quickChipsRow}>
              {['500', '1000', '1600', '2000', '3500'].map((chip) => (
                <TouchableOpacity
                  key={chip}
                  style={[styles.chip, amount === chip && styles.chipActive]}
                  onPress={() => setAmount(chip)}
                  activeOpacity={0.8}>
                  <Text style={[styles.chipText, amount === chip && styles.chipTextActive]}>
                    GH₵ {chip}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Payment Method Selector */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeading}>Select Payment Gateway</Text>
            <View style={styles.methodsList}>
              {/* MTN MoMo */}
              <TouchableOpacity
                style={[styles.methodItem, paymentMethod === 'momo' && styles.methodItemActive]}
                onPress={() => setPaymentMethod('momo')}
                activeOpacity={0.85}>
                <View style={[styles.methodIconBox, { backgroundColor: '#FEF08A' }]}>
                  <Ionicons name="phone-portrait" size={18} color="#854D0E" />
                </View>
                <View style={styles.methodInfo}>
                  <Text style={styles.methodName}>MTN Mobile Money</Text>
                  <Text style={styles.methodSub}>Instant prompt to approve on phone (*170#)</Text>
                </View>
                <View style={[styles.radioCircle, paymentMethod === 'momo' && styles.radioActive]}>
                  {paymentMethod === 'momo' && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>

              {/* Telecel Cash */}
              <TouchableOpacity
                style={[styles.methodItem, paymentMethod === 'telecel' && styles.methodItemActive]}
                onPress={() => setPaymentMethod('telecel')}
                activeOpacity={0.85}>
                <View style={[styles.methodIconBox, { backgroundColor: '#FEE2E2' }]}>
                  <Ionicons name="flash" size={18} color="#DC2626" />
                </View>
                <View style={styles.methodInfo}>
                  <Text style={styles.methodName}>Telecel Cash</Text>
                  <Text style={styles.methodSub}>Instant approval via *110# prompt</Text>
                </View>
                <View style={[styles.radioCircle, paymentMethod === 'telecel' && styles.radioActive]}>
                  {paymentMethod === 'telecel' && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>

              {/* Bank Card */}
              <TouchableOpacity
                style={[styles.methodItem, paymentMethod === 'card' && styles.methodItemActive]}
                onPress={() => setPaymentMethod('card')}
                activeOpacity={0.85}>
                <View style={[styles.methodIconBox, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="card" size={18} color="#0F73F7" />
                </View>
                <View style={styles.methodInfo}>
                  <Text style={styles.methodName}>Visa / Mastercard</Text>
                  <Text style={styles.methodSub}>Paystack / Hubtel Ghana gateway</Text>
                </View>
                <View style={[styles.radioCircle, paymentMethod === 'card' && styles.radioActive]}>
                  {paymentMethod === 'card' && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>

              {/* Wallet Balance */}
              <TouchableOpacity
                style={[styles.methodItem, paymentMethod === 'wallet' && styles.methodItemActive]}
                onPress={() => setPaymentMethod('wallet')}
                activeOpacity={0.85}>
                <View style={[styles.methodIconBox, { backgroundColor: '#ECFDF5' }]}>
                  <Ionicons name="wallet" size={18} color="#10B981" />
                </View>
                <View style={styles.methodInfo}>
                  <Text style={styles.methodName}>DevPay Wallet Balance</Text>
                  <Text style={styles.methodSub}>GH₵ 2,450.00 Available balance</Text>
                </View>
                <View style={[styles.radioCircle, paymentMethod === 'wallet' && styles.radioActive]}>
                  {paymentMethod === 'wallet' && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* MoMo Phone Input if MoMo selected */}
          {(paymentMethod === 'momo' || paymentMethod === 'telecel') && (
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionHeading}>
                {paymentMethod === 'momo' ? 'MTN MoMo Number' : 'Telecel Cash Number'}
              </Text>
              <View style={styles.phoneInputRow}>
                <View style={styles.flagBox}>
                  <Text style={styles.flag}>🇬🇭</Text>
                  <Text style={styles.countryCode}>+233</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholder="24 123 4567"
                  placeholderTextColor={Colors.light.textMuted}
                />
              </View>
            </View>
          )}

          {/* Escrow Protection Notice */}
          <View style={styles.escrowNoticeCard}>
            <Ionicons name="shield-checkmark" size={24} color="#0F73F7" />
            <View style={styles.escrowNoticeContent}>
              <Text style={styles.escrowNoticeTitle}>100% Escrow Protection Guarantee</Text>
              <Text style={styles.escrowNoticeDesc}>
                Deposited funds are locked securely in DevPay escrow. The freelancer cannot access or withdraw these funds until you review and explicitly approve their completed deliverables.
              </Text>
            </View>
          </View>

          {/* Fund CTA */}
          <TouchableOpacity
            style={styles.fundBtnWrapper}
            onPress={handleFundEscrow}
            disabled={isProcessing}
            activeOpacity={0.9}>
            <LinearGradient
              colors={['#0F73F7', '#38BDF8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.fundGradient}>
              <Text style={styles.fundBtnText}>
                {isProcessing
                  ? 'Initiating MoMo Push...'
                  : `Authorize Deposit • GH₵ ${parseFloat(amount || '0').toLocaleString()}.00`}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>

        {/* Payment Success Modal */}
        <Modal visible={successModal} transparent animationType="fade">
          <View style={styles.modalBackdrop}>
            <View style={styles.receiptCard}>
              <View style={styles.successIconCircle}>
                <Ionicons name="checkmark-done" size={32} color="#10B981" />
              </View>

              <Text style={styles.receiptTitle}>Milestone Escrow Funded!</Text>
              <Text style={styles.receiptAmount}>GH₵ {parseFloat(amount || '0').toLocaleString()}.00</Text>
              <Text style={styles.receiptSubtitle}>
                Funds are now secured in DevPay Escrow. The freelancer has been notified to begin milestone deliverables.
              </Text>

              <View style={styles.receiptMetaBox}>
                <View style={styles.receiptMetaRow}>
                  <Text style={styles.receiptMetaKey}>Reference ID</Text>
                  <Text style={styles.receiptMetaVal}>{txRef}</Text>
                </View>
                <View style={styles.receiptMetaRow}>
                  <Text style={styles.receiptMetaKey}>Method</Text>
                  <Text style={styles.receiptMetaVal}>
                    {paymentMethod === 'momo'
                      ? 'MTN MoMo'
                      : paymentMethod === 'telecel'
                      ? 'Telecel Cash'
                      : paymentMethod === 'card'
                      ? 'Bank Card'
                      : 'DevPay Wallet'}
                  </Text>
                </View>
                <View style={styles.receiptMetaRow}>
                  <Text style={styles.receiptMetaKey}>Protection</Text>
                  <Text style={[styles.receiptMetaVal, { color: '#0F73F7' }]}>
                    DevPay Escrow Locked 🔒
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.receiptDoneBtn}
                onPress={() => {
                  setSuccessModal(false);
                  router.push('/contracts');
                }}
                activeOpacity={0.88}>
                <Text style={styles.receiptDoneBtnText}>View Contract &amp; Milestones</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF3FA',
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
    fontSize: 17,
    fontWeight: '800',
    color: Colors.light.text,
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  secureText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
  scrollContent: {
    padding: 20,
    gap: 18,
    paddingBottom: 40,
  },
  sectionBlock: {
    gap: 8,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 2,
  },
  contractCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#EEF3FA',
    gap: 6,
  },
  contractCardSelected: {
    borderColor: '#0F73F7',
    backgroundColor: '#F0F7FF',
  },
  contractTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contractTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
    flex: 1,
  },
  contractAmountPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  contractAmountText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F73F7',
  },
  contractMeta: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 60,
    borderWidth: 1,
    borderColor: '#EEF3FA',
  },
  amountCurrencyPrefix: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F73F7',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '900',
    color: Colors.light.text,
  },
  quickChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF3FA',
  },
  chipActive: {
    backgroundColor: '#0F73F7',
    borderColor: '#0F73F7',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  methodsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EEF3FA',
    overflow: 'hidden',
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  methodItemActive: {
    backgroundColor: '#F8FAFF',
  },
  methodIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  methodSub: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: '#0F73F7',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0F73F7',
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEF3FA',
    height: 48,
    overflow: 'hidden',
  },
  flagBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: '#EEF3FA',
  },
  flag: {
    fontSize: 16,
  },
  countryCode: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.text,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 14,
    color: Colors.light.text,
  },
  escrowNoticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  escrowNoticeContent: {
    flex: 1,
  },
  escrowNoticeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F73F7',
    marginBottom: 4,
  },
  escrowNoticeDesc: {
    fontSize: 12,
    lineHeight: 18,
    color: '#1E40AF',
  },
  fundBtnWrapper: {
    borderRadius: 27,
    overflow: 'hidden',
    marginTop: 10,
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  fundGradient: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  fundBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  receiptCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  receiptTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.light.text,
  },
  receiptAmount: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F73F7',
  },
  receiptSubtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
  },
  receiptMetaBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    gap: 8,
    marginVertical: 4,
  },
  receiptMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  receiptMetaKey: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  receiptMetaVal: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.text,
  },
  receiptDoneBtn: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0F73F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  receiptDoneBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
