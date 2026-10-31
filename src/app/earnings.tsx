import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useRole } from '@/contexts/RoleContext';
import { Appear, Button, GlassCard, IconButton, ScreenBackground, SectionHeader, StatusPill, TopBar } from '@/components/ds';
import { Gradients, Layout, Radius, Shadows } from '@/constants/theme';

interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: string;
  type: 'credit' | 'debit';
  status: 'Completed' | 'In escrow';
  reference: string;
}

const cedis = (n: number) => `GH₵ ${n.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

export default function EarningsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isClient } = useRole();

  const available = isClient ? 28500 : 2450;
  const pending = isClient ? 14200 : 1800;
  const [showAll, setShowAll] = useState(false);

  const transactions: Transaction[] = isClient
    ? [
        { id: 'c1', title: 'Released · Milestone 2', date: 'Today, 14:30', amount: '-GH₵ 2,000.00', type: 'debit', status: 'Completed', reference: 'ESC-REL-8831' },
        { id: 'c2', title: 'MTN MoMo deposit', date: 'Yesterday, 10:15', amount: '+GH₵ 5,000.00', type: 'credit', status: 'Completed', reference: 'MOMO-DEP-1029' },
        { id: 'c3', title: 'Pre-funded · Booking app', date: '20 Oct 2026', amount: '-GH₵ 1,500.00', type: 'debit', status: 'In escrow', reference: 'ESC-LOCK-4819' },
        { id: 'c4', title: 'Released · Learning dashboard', date: '12 Oct 2026', amount: '-GH₵ 1,500.00', type: 'debit', status: 'Completed', reference: 'ESC-REL-8210' },
      ]
    : [
        { id: 'f1', title: 'Milestone 2 approved · Volta Pay', date: 'Today, 14:30', amount: '+GH₵ 1,200.00', type: 'credit', status: 'Completed', reference: 'DEV-MS-8831' },
        { id: 'f2', title: 'Payout to MTN MoMo', date: 'Yesterday, 10:15', amount: '-GH₵ 850.00', type: 'debit', status: 'Completed', reference: 'MOMO-WD-1029' },
        { id: 'f3', title: 'Milestone 1 funded · Sankofa', date: '20 Oct 2026', amount: '+GH₵ 1,600.00', type: 'credit', status: 'In escrow', reference: 'ESC-LOCK-4819' },
        { id: 'f4', title: 'Milestone 3 approved · Kente Labs', date: '12 Oct 2026', amount: '+GH₵ 1,500.00', type: 'credit', status: 'Completed', reference: 'DEV-MS-8210' },
        { id: 'f5', title: 'Payout to MTN MoMo', date: '12 Oct 2026', amount: '-GH₵ 1,500.00', type: 'debit', status: 'Completed', reference: 'MOMO-WD-0977' },
      ];

  const stats = [
    { label: isClient ? 'Avg. release' : 'Avg. payout', value: isClient ? '2.4 days' : '1.8 days' },
    { label: 'MoMo fee', value: '1% capped' },
    { label: 'Escrow fee', value: 'Free' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <ScreenBackground />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <TopBar
          title={isClient ? 'Escrow wallet' : 'Earnings'}
          right={
            <IconButton
              icon="download-outline"
              accessibilityLabel="Download statement"
              onPress={() => Alert.alert('Statement on its way', 'We’ll email this month’s PDF statement to you.')}
            />
          }
        />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={[styles.walletShadow, Shadows.lifted]}>
            <LinearGradient colors={Gradients.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.wallet}>
              <View style={styles.rowBetween}>
                <Text style={styles.wLabel}>{isClient ? 'Escrow balance' : 'Available to withdraw'}</Text>
                <View style={styles.wBadge}>
                  <Text style={styles.wBadgeText}>GHS</Text>
                </View>
              </View>
              <Text style={styles.wAmount}>{cedis(available)}</Text>
              <View style={styles.wPending}>
                <Ionicons name="lock-closed" size={13} color="rgba(255,255,255,0.9)" />
                <Text style={styles.wPendingText}>
                  {cedis(pending)} {isClient ? 'released to freelancers' : 'held in active milestones'}
                </Text>
              </View>
              <View style={styles.wActions}>
                {isClient ? (
                  <Button
                    label="Deposit"
                    variant="light"
                    size="md"
                    style={{ flex: 1 }}
                    icon={<Ionicons name="add" size={18} color={colors.text} />}
                    onPress={() => router.push('/payment')}
                  />
                ) : (
                  <>
                    <Button
                      label="Withdraw"
                      variant="light"
                      size="md"
                      style={{ flex: 1 }}
                      icon={<Ionicons name="arrow-down" size={17} color={colors.text} />}
                      onPress={() => router.push('/withdraw')}
                    />
                    <Button
                      label="Top up"
                      variant="ghost"
                      size="md"
                      fg="#FFFFFF"
                      style={[{ flex: 1 }, styles.ghostOnBlue]}
                      icon={<Ionicons name="add" size={18} color="#FFFFFF" />}
                      onPress={() => router.push('/payment')}
                    />
                  </>
                )}
              </View>
            </LinearGradient>
          </View>

          <View style={styles.stats}>
            {stats.map((s) => (
              <GlassCard key={s.label} style={styles.stat}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{s.label}</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>{s.value}</Text>
              </GlassCard>
            ))}
          </View>

          <SectionHeader
            title="Recent activity"
            actionLabel={showAll ? 'Show less' : 'See all'}
            onSeeAll={() => setShowAll((v) => !v)}
            style={{ marginTop: Layout.sectionGap }}
          />
          <GlassCard padded={false} style={{ paddingHorizontal: 16 }}>
            {(showAll ? transactions : transactions.slice(0, 3)).map((t, i, list) => (
              <Appear
                key={t.id}
                index={i}
                style={[styles.tx, i < list.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}>
                <View style={[styles.txIcon, { backgroundColor: t.type === 'credit' ? colors.greenSoft : colors.primaryWash }]}>
                  <Ionicons
                    name={t.type === 'credit' ? 'arrow-down' : 'arrow-up'}
                    size={18}
                    color={t.type === 'credit' ? colors.accentGreen : colors.navActive}
                  />
                </View>
                <View style={{ flex: 1, gap: 3 }}>
                  <Text style={[styles.txTitle, { color: colors.text }]} numberOfLines={1}>
                    {t.title}
                  </Text>
                  <Text style={[styles.txDate, { color: colors.textSecondary }]} numberOfLines={1}>
                    {t.date}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <Text style={[styles.txAmount, { color: t.type === 'credit' ? colors.accentGreen : colors.text }]}>{t.amount}</Text>
                  {t.status === 'In escrow' && <StatusPill label="In escrow" tone="amber" />}
                </View>
              </Appear>
            ))}
          </GlassCard>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Layout.margin, paddingBottom: 48, paddingTop: 8 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  walletShadow: { borderRadius: Radius.xl },
  wallet: { borderRadius: Radius.xl, padding: 20 },
  wLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '500' },
  wBadge: { backgroundColor: 'rgba(255,255,255,0.22)', paddingHorizontal: 10, height: 24, borderRadius: Radius.pill, justifyContent: 'center' },
  wBadgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
  wAmount: { color: '#FFFFFF', fontSize: 34, fontWeight: '600', letterSpacing: -1, marginTop: 8, fontVariant: ['tabular-nums'] },
  wPending: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  wPendingText: { color: 'rgba(255,255,255,0.9)', fontSize: 13 },
  wActions: { flexDirection: 'row', gap: 10, marginTop: 20 },
  ghostOnBlue: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' },
  stats: { flexDirection: 'row', gap: 10, marginTop: 16 },
  stat: { flex: 1, padding: 14, gap: 4 },
  statLabel: { fontSize: 12 },
  statValue: { fontSize: 15, fontWeight: '600' },
  tx: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  txIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  txTitle: { fontSize: 14, fontWeight: '500' },
  txDate: { fontSize: 12 },
  txAmount: { fontSize: 14, fontWeight: '600', fontVariant: ['tabular-nums'] },
});
