import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { PhoneField } from '@/components/auth-shell';
import { Button, ChoiceCard, GlassCard, ScreenBackground, SectionHeader, TopBar } from '@/components/ds';
import { AmountInput, MethodId, PayMethods, SummaryRow } from '@/components/payments';
import { SuccessOverlay } from '@/components/success-overlay';
import { Layout, Radius } from '@/constants/theme';

const MILESTONES = [
  { id: 'c_1', title: 'Milestone 2 · Design system', who: 'Kwame Mensah · MoMo checkout', amount: 2000 },
  { id: 'c_2', title: 'Milestone 1 · Figma prototype', who: 'Akosua Serwaa · Booking app', amount: 1600 },
];

const cedis = (n: number) => `GH₵ ${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function PaymentScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [target, setTarget] = useState('c_1');
  const [amount, setAmount] = useState('2000');
  const [method, setMethod] = useState<MethodId>('momo');
  const [phone, setPhone] = useState('24 123 4567');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string>();
  const [txRef, setTxRef] = useState('');

  const num = parseFloat(amount) || 0;

  const fund = () => {
    if (num <= 0) return setError('Enter how much to deposit.');
    setError(undefined);
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setTxRef(`DEV-ESCROW-${Math.floor(100000 + Math.random() * 900000)}`);
    }, 1200);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScreenBackground />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <TopBar title="Fund escrow" subtitle="Held safely until you approve" />
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <SectionHeader title="Milestone" />
          <View style={{ gap: 12 }}>
            {MILESTONES.map((m) => (
              <ChoiceCard
                key={m.id}
                selected={target === m.id}
                onPress={() => {
                  setTarget(m.id);
                  setAmount(String(m.amount));
                }}
                title={m.title}
                description={`${m.who} · ${cedis(m.amount)}`}
              />
            ))}
          </View>

          <SectionHeader title="Deposit amount" style={styles.gap} />
          <AmountInput value={amount} onChange={setAmount} quick={[500, 1000, 1600, 2000]} error={error} />

          <SectionHeader title="Pay with" style={styles.gap} />
          <PayMethods
            value={method}
            onChange={setMethod}
            methods={[
              { id: 'momo', name: 'MTN MoMo', detail: 'Approve the prompt on your phone' },
              { id: 'telecel', name: 'Telecel Cash', detail: 'Approve the prompt on your phone' },
              { id: 'card', name: 'Visa / Mastercard', detail: 'Processed by Paystack' },
              { id: 'wallet', name: 'DevPay wallet', detail: 'GH₵ 2,450.00 available' },
            ]}
          />

          {(method === 'momo' || method === 'telecel') && (
            <View style={{ marginTop: 16 }}>
              <PhoneField label={method === 'momo' ? 'MoMo number' : 'Telecel Cash number'} value={phone} onChangeText={setPhone} />
            </View>
          )}

          <GlassCard style={{ marginTop: 20 }}>
            <SummaryRow label="Milestone" value={cedis(num)} />
            <SummaryRow label="Escrow fee" value="Free" />
            <View style={[styles.hr, { backgroundColor: colors.border }]} />
            <SummaryRow label="Total" value={cedis(num)} strong />
          </GlassCard>

          <View style={[styles.note, { backgroundColor: colors.primaryWash }]}>
            <Ionicons name="shield-checkmark" size={16} color={colors.primaryText} />
            <Text style={[styles.noteText, { color: colors.textSecondary }]}>
              Funds stay in escrow until you approve the work. Disputes go to DevPay review.
            </Text>
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Button label={`Deposit ${cedis(num)}`} loading={processing} onPress={fund} />
        </View>
      </SafeAreaView>

      <SuccessOverlay
        visible={!!txRef}
        title="Escrow funded"
        subtitle={`${cedis(num)} is now held in escrow. Ref ${txRef}.`}
        onDismiss={() => {
          setTxRef('');
          router.back();
        }}
        dismissLabel="Done"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Layout.margin, paddingTop: 8, paddingBottom: 32 },
  gap: { marginTop: Layout.sectionGap },
  hr: { height: 1, marginVertical: 6 },
  note: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: Radius.md, marginTop: 16, alignItems: 'center' },
  noteText: { flex: 1, fontSize: 12, lineHeight: 18 },
  footer: { paddingHorizontal: Layout.margin, paddingTop: 10 },
});
