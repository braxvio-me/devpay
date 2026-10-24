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

export default function WithdrawScreen() {
  const router = useRouter();

  const availableBalance = 2450.0;
  const lockedEscrow = 1800.0;

  const [amount, setAmount] = useState('1000');
  const [selectedMethod, setSelectedMethod] = useState<'momo' | 'telecel' | 'bank'>('momo');
  const [pin, setPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [txRef, setTxRef] = useState('');

  const numAmount = parseFloat(amount) || 0;
  const networkFee = 1.5;
  const netAmount = Math.max(0, numAmount - networkFee);

  const handleQuickAmount = (val: number) => {
    setAmount(String(val));
  };

  const handleWithdraw = () => {
    if (numAmount < 20) {
      Alert.alert('Minimum Limit', 'Minimum withdrawal amount is GH₵ 20.00');
      return;
    }
    if (numAmount > availableBalance) {
      Alert.alert('Insufficient Balance', 'Amount exceeds your available balance.');
      return;
    }
    if (pin.length < 4) {
      Alert.alert('Security PIN Required', 'Please enter your 4-digit transaction PIN to authorize this MoMo payout.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setTxRef(`MOMO-PAY-${Math.floor(100000 + Math.random() * 900000)}`);
      setSuccessModal(true);
    }, 1100);
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
          <Text style={styles.headerTitle}>Withdraw Payout</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push('/earnings')}
            activeOpacity={0.8}>
            <Ionicons name="receipt-outline" size={18} color="#0F73F7" />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Balance Card */}
          <LinearGradient
            colors={['#0F73F7', '#38BDF8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceLabel}>Available for Withdrawal</Text>
              <View style={styles.verifiedTag}>
                <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                <Text style={styles.verifiedTagText}>Instant MoMo</Text>
              </View>
            </View>

            <Text style={styles.balanceAmount}>
              GH₵ {availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>

            <View style={styles.lockedRow}>
              <Ionicons name="lock-closed" size={13} color="rgba(255, 255, 255, 0.85)" />
              <Text style={styles.lockedText}>
                GH₵ {lockedEscrow.toLocaleString('en-US', { minimumFractionDigits: 2 })} in Active Milestone Escrow
              </Text>
            </View>
          </LinearGradient>

          {/* Amount Input */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeading}>Withdrawal Amount</Text>
            <View style={styles.amountInputRow}>
              <Text style={styles.currencyPrefix}>GH₵</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="1000"
                placeholderTextColor={Colors.light.textMuted}
              />
            </View>

            {/* Quick Amount Buttons */}
            <View style={styles.quickChipsRow}>
              {[100, 250, 500, 1000].map((val) => (
                <TouchableOpacity
                  key={val}
                  style={[styles.chip, numAmount === val && styles.chipActive]}
                  onPress={() => handleQuickAmount(val)}
                  activeOpacity={0.8}>
                  <Text style={[styles.chipText, numAmount === val && styles.chipTextActive]}>
                    GH₵ {val}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.chip, numAmount === availableBalance && styles.chipActive]}
                onPress={() => handleQuickAmount(availableBalance)}
                activeOpacity={0.8}>
                <Text
                  style={[
                    styles.chipText,
                    numAmount === availableBalance && styles.chipTextActive,
                  ]}>
                  Max
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Destination Accounts */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeading}>Payout Destination</Text>
            <View style={styles.methodsBox}>
              {/* MTN MoMo */}
              <TouchableOpacity
                style={[
                  styles.methodRow,
                  selectedMethod === 'momo' && styles.methodRowSelected,
                ]}
                onPress={() => setSelectedMethod('momo')}
                activeOpacity={0.85}>
                <View style={[styles.methodIconCircle, { backgroundColor: '#FEF08A' }]}>
                  <Ionicons name="phone-portrait" size={18} color="#854D0E" />
                </View>
                <View style={styles.methodInfo}>
                  <View style={styles.methodNameRow}>
                    <Text style={styles.methodName}>MTN Mobile Money</Text>
                    <View style={styles.primaryBadge}>
                      <Text style={styles.primaryBadgeText}>Primary</Text>
                    </View>
                  </View>
                  <Text style={styles.methodNumber}>024 123 4567 • Kwame Mensah</Text>
                </View>
                <View style={[styles.radio, selectedMethod === 'momo' && styles.radioActive]}>
                  {selectedMethod === 'momo' && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>

              {/* Telecel Cash */}
              <TouchableOpacity
                style={[
                  styles.methodRow,
                  selectedMethod === 'telecel' && styles.methodRowSelected,
                ]}
                onPress={() => setSelectedMethod('telecel')}
                activeOpacity={0.85}>
                <View style={[styles.methodIconCircle, { backgroundColor: '#FEE2E2' }]}>
                  <Ionicons name="flash" size={18} color="#DC2626" />
                </View>
                <View style={styles.methodInfo}>
                  <Text style={styles.methodName}>Telecel Cash</Text>
                  <Text style={styles.methodNumber}>020 987 6543 • Kwame Mensah</Text>
                </View>
                <View style={[styles.radio, selectedMethod === 'telecel' && styles.radioActive]}>
                  {selectedMethod === 'telecel' && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>

              {/* Bank Transfer */}
              <TouchableOpacity
                style={[
                  styles.methodRow,
                  selectedMethod === 'bank' && styles.methodRowSelected,
                ]}
                onPress={() => setSelectedMethod('bank')}
                activeOpacity={0.85}>
                <View style={[styles.methodIconCircle, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="business" size={18} color="#0F73F7" />
                </View>
                <View style={styles.methodInfo}>
                  <Text style={styles.methodName}>GCB Bank Ghana</Text>
                  <Text style={styles.methodNumber}>•••• •••• 4129 (High Street)</Text>
                </View>
                <View style={[styles.radio, selectedMethod === 'bank' && styles.radioActive]}>
                  {selectedMethod === 'bank' && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Fee Breakdown */}
          <View style={styles.breakdownCard}>
            <Text style={styles.breakdownTitle}>Payout Summary &amp; Breakdown</Text>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownKey}>Requested Amount</Text>
              <Text style={styles.breakdownVal}>GH₵ {numAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownKey}>MoMo Network Fee / E-Levy</Text>
              <Text style={styles.breakdownVal}>-GH₵ {networkFee.toFixed(2)}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownKey}>DevPay Payout Fee</Text>
              <Text style={[styles.breakdownVal, { color: '#10B981' }]}>GH₵ 0.00 (Free)</Text>
            </View>
            <View style={styles.breakdownDivider} />
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownTotalKey}>Net Payout to Account</Text>
              <Text style={styles.breakdownTotalVal}>GH₵ {netAmount.toFixed(2)}</Text>
            </View>
          </View>

          {/* 4-Digit Security PIN */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeading}>Authorize with 4-Digit Security PIN</Text>
            <View style={styles.pinInputWrap}>
              <Ionicons name="keypad-outline" size={20} color="#0F73F7" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.pinInput}
                value={pin}
                onChangeText={setPin}
                placeholder="Enter 4-digit PIN (e.g. 1234)"
                placeholderTextColor={Colors.light.textMuted}
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
              />
            </View>
          </View>

          {/* Withdraw CTA */}
          <TouchableOpacity
            style={styles.withdrawBtnWrapper}
            onPress={handleWithdraw}
            disabled={isProcessing}
            activeOpacity={0.9}>
            <LinearGradient
              colors={['#0F73F7', '#38BDF8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.withdrawGradient}>
              <Text style={styles.withdrawBtnText}>
                {isProcessing
                  ? 'Processing MoMo Payout...'
                  : `Withdraw GH₵ ${netAmount.toFixed(2)} Now`}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>

        {/* Payout Success Modal */}
        <Modal visible={successModal} transparent animationType="fade">
          <View style={styles.modalBackdrop}>
            <View style={styles.receiptCard}>
              <View style={styles.successCircle}>
                <Ionicons name="checkmark-done" size={32} color="#10B981" />
              </View>

              <Text style={styles.receiptHeading}>Payout Dispatched!</Text>
              <Text style={styles.receiptCash}>GH₵ {netAmount.toFixed(2)}</Text>
              <Text style={styles.receiptSub}>
                Funds have been sent to your Mobile Money wallet. You will receive an SMS confirmation from MTN shortly.
              </Text>

              <View style={styles.receiptBox}>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptKey}>Reference</Text>
                  <Text style={styles.receiptVal}>{txRef}</Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptKey}>Destination</Text>
                  <Text style={styles.receiptVal}>
                    {selectedMethod === 'momo'
                      ? 'MTN MoMo (024 123 4567)'
                      : selectedMethod === 'telecel'
                      ? 'Telecel Cash (020 987 6543)'
                      : 'GCB Bank (•••• 4129)'}
                  </Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptKey}>Status</Text>
                  <Text style={[styles.receiptVal, { color: '#10B981' }]}>Completed ✓</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.doneBtn}
                onPress={() => {
                  setSuccessModal(false);
                  router.push('/earnings');
                }}
                activeOpacity={0.88}>
                <Text style={styles.doneBtnText}>View Earnings History</Text>
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
  scrollContent: {
    padding: 20,
    gap: 18,
    paddingBottom: 40,
  },
  balanceCard: {
    borderRadius: 22,
    padding: 20,
    gap: 8,
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 4,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  balanceLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  verifiedTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F73F7',
  },
  balanceAmount: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  lockedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  lockedText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
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
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 60,
    borderWidth: 1,
    borderColor: '#EEF3FA',
  },
  currencyPrefix: {
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
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF3FA',
    alignItems: 'center',
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
    fontWeight: '700',
  },
  methodsBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EEF3FA',
    overflow: 'hidden',
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  methodRowSelected: {
    backgroundColor: '#F0F7FF',
  },
  methodIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodInfo: {
    flex: 1,
  },
  methodNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  methodName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  primaryBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  primaryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F73F7',
  },
  methodNumber: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  radio: {
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
  breakdownCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF3FA',
    gap: 10,
  },
  breakdownTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 2,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  breakdownKey: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  breakdownVal: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.text,
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  breakdownTotalKey: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.light.text,
  },
  breakdownTotalVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F73F7',
  },
  pinInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEF3FA',
    paddingHorizontal: 14,
    height: 48,
  },
  pinInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
  },
  withdrawBtnWrapper: {
    borderRadius: 27,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  withdrawGradient: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  withdrawBtnText: {
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
  successCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  receiptHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.light.text,
  },
  receiptCash: {
    fontSize: 28,
    fontWeight: '900',
    color: '#10B981',
  },
  receiptSub: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  receiptBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    gap: 8,
    marginVertical: 4,
  },
  receiptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  receiptKey: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  receiptVal: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.text,
  },
  doneBtn: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0F73F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  doneBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
