import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '@/components/ui-text';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOnline, offlineAlert } from '@/hooks/use-online';
import { notify } from '@/lib/notify';
import { useTheme } from '@/contexts/ThemeContext';
import { useRole } from '@/contexts/RoleContext';
import { Button, Field, GlassCard, IconButton, ScreenBackground, SectionHeader, TopBar } from '@/components/ds';
import { AmountInput, MethodId, PayMethods, SummaryRow } from '@/components/payments';
import { SuccessOverlay } from '@/components/success-overlay';
import { useReceipts } from '@/contexts/ReceiptsContext';
import { useWalletLock } from '@/contexts/WalletLockContext';
import { PinSheet } from '@/components/pin-sheet';
import { useCurrentUser } from '@/contexts/AuthContext';
import { Layout, Radius } from '@/constants/theme';

const FEE = 1.5;
const MIN = 20;
const cedis = (n: number) => `GH₵ ${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function WithdrawScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isClient } = useRole();
  const insets = useSafeAreaInsets();
  const online = useOnline();
  const available = isClient ? 28500 : 2450;
  const locked = isClient ? 14300 : 1800;

  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<MethodId>('momo');
  const [pin, setPin] = useState('');
  const [processing, setProcessing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [txRef, setTxRef] = useState('');
  const { addReceipt } = useReceipts();
  const me = useCurrentUser();

  const num = parseFloat(amount) || 0;
  const amountError =
    !submitted ? undefined : num < MIN ? `Minimum withdrawal is ${cedis(MIN)}.` : num > available ? 'That’s more than your available balance.' : undefined;
  const [pinCheck, setPinCheck] = useState<string>();
  const [pinSetup, setPinSetup] = useState(false);
  const { hasPin, checkPin } = useWalletLock();
  const pinError = pinCheck ?? (submitted && pin.length < 4 ? 'Enter your 4-digit wallet PIN.' : undefined);

  const withdraw = async () => {
    setSubmitted(true);
    setPinCheck(undefined);
    if (num < MIN || num > available) return;
    // Payouts need the same PIN that opens the wallet.
    if (hasPin === false) return setPinSetup(true);
    if (pin.length < 4) return;
    const err = await checkPin(pin);
    if (err) {
      setPin('');
      return setPinCheck(err);
    }
    if (!online) return offlineAlert('withdraw');
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      const receipt = addReceipt({
        kind: 'payout',
        title: isClient ? 'Escrow refund' : `Payout to ${method === 'bank' ? 'bank account' : 'mobile wallet'}`,
        from: isClient ? 'DevPay escrow' : 'DevPay wallet',
        to: me.name,
        method: ({ momo: 'MTN MoMo', telecel: 'Telecel Cash', at: 'AT Money', bank: 'Bank transfer', card: 'Card', wallet: 'DevPay wallet' } as Record<string, string>)[method] ?? method,
        amount: Math.max(0, num - FEE),
        fee: FEE,
        status: 'Sent',
      });
      setTxRef(receipt.ref);
      notify('Payout on its way', `${cedis(Math.max(0, num - FEE))} is heading to your ${method === 'bank' ? 'bank account' : 'mobile wallet'}.`, '/earnings');
    }, 1100);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScreenBackground />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <TopBar
          title={isClient ? 'Refund escrow' : 'Withdraw'}
          right={<IconButton icon="receipt-outline" accessibilityLabel="Earnings history" onPress={() => router.push('/earnings')} />}
        />
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={[styles.balance, { backgroundColor: colors.primaryWash, borderColor: colors.primarySoft }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.bLabel, { color: colors.textSecondary }]}>{isClient ? 'Unallocated escrow' : 'Available balance'}</Text>
              <Text style={[styles.bValue, { color: colors.text }]}>{cedis(available)}</Text>
            </View>
            <View style={styles.locked}>
              <Ionicons name="lock-closed" size={13} color={colors.textSecondary} />
              <Text style={[styles.lockedText, { color: colors.textSecondary }]}>{cedis(locked)} in milestones</Text>
            </View>
          </View>

          <SectionHeader title="Amount" style={styles.gap} />
          <AmountInput value={amount} onChange={setAmount} quick={[100, 250, 500, 1000]} max={available} error={amountError} />

          <SectionHeader title="Send to" style={styles.gap} />
          <PayMethods
            value={method}
            onChange={setMethod}
            methods={[
              { id: 'momo', name: 'MTN MoMo', detail: '024 123 4567 · Kwame Mensah', badge: 'Primary' },
              { id: 'telecel', name: 'Telecel Cash', detail: '020 987 6543' },
              { id: 'bank', name: 'GCB Bank', detail: '•••• 4821 · 1–2 business days' },
            ]}
          />

          <SectionHeader title="Confirm" style={styles.gap} />
          <GlassCard>
            <SummaryRow label="Amount" value={cedis(num)} />
            <SummaryRow label="Network fee" value={cedis(num > 0 ? FEE : 0)} />
            <View style={[styles.hr, { backgroundColor: colors.border }]} />
            <SummaryRow label="You receive" value={cedis(Math.max(0, num - FEE))} strong />
          </GlassCard>

          <Field
            label="Wallet PIN"
            icon="keypad-outline"
            placeholder="••••"
            keyboardType="number-pad"
            secureTextEntry
            maxLength={4}
            value={pin}
            onChangeText={(t) => {
              setPin(t.replace(/\D/g, ''));
              setPinCheck(undefined);
            }}
            error={pinError}
            style={{ marginTop: 16 }}
          />
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Button label={num > 0 ? `Withdraw ${cedis(num)}` : 'Withdraw'} loading={processing} onPress={withdraw} />
        </View>
      </SafeAreaView>

      <PinSheet visible={pinSetup} mode="create" onClose={() => setPinSetup(false)} />
      <SuccessOverlay
        visible={!!txRef}
        title="Payout on its way"
        subtitle={`${cedis(Math.max(0, num - FEE))} is heading to your ${method === 'bank' ? 'bank account' : 'mobile wallet'}. Ref ${txRef}.`}
        onDismiss={() => {
          setTxRef('');
          router.back();
        }}
        dismissLabel="Done"
        secondaryLabel="View receipt"
        onSecondary={() => {
          const ref = txRef;
          setTxRef('');
          router.replace(`/receipts/${ref}`);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Layout.margin, paddingTop: 8, paddingBottom: 32 },
  balance: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: Radius.lg, borderWidth: 1, gap: 10 },
  bLabel: { fontSize: 12 },
  bValue: { fontSize: 22, fontWeight: '600', letterSpacing: -0.4, marginTop: 2, fontVariant: ['tabular-nums'] },
  locked: { flexDirection: 'row', alignItems: 'center', gap: 4, maxWidth: 140 },
  lockedText: { fontSize: 12 },
  gap: { marginTop: Layout.sectionGap },
  hr: { height: 1, marginVertical: 6 },
  footer: { paddingHorizontal: Layout.margin, paddingTop: 10 },
});
