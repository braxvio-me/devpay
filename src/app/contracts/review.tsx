import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import { Dialog } from '@/lib/dialog';
import { Text } from '@/components/ui-text';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useOnline, offlineAlert } from '@/hooks/use-online';
import { notify } from '@/lib/notify';
import { useTheme } from '@/contexts/ThemeContext';
import { Avatar, Button, Field, GlassCard, ListRow, ScreenBackground, SectionHeader, Sheet, StatusPill, TopBar } from '@/components/ds';
import { SuccessOverlay } from '@/components/success-overlay';
import { useReceipts } from '@/contexts/ReceiptsContext';
import { useCurrentUser } from '@/contexts/AuthContext';
import { Portraits } from '@/constants/media';
import { Layout, Radius } from '@/constants/theme';

const D = {
  contract: 'MoMo checkout redesign',
  milestone: 'Milestone 2 · Design system & tokens',
  amount: 'GH₵ 2,000.00',
  dev: { name: 'Kwame Mensah', role: 'Senior React Native Engineer', avatar: Portraits.kwame, rating: '5.0', jobs: 8 },
  notes:
    'Tokens are wired for light and dark, tab changes have haptics, and the typecheck passes. The pull request includes unit tests for every component.',
  pr: 'https://github.com/example/devpay/pull/4',
  demo: 'https://example.com/demo',
  revisionsUsed: 0,
  revisionsAllowed: 2,
};

export default function MilestoneReviewScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const online = useOnline();
  const [revisionOpen, setRevisionOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [notesError, setNotesError] = useState<string>();
  const [result, setResult] = useState<'released' | 'revision' | null>(null);
  const [receiptRef, setReceiptRef] = useState('');
  const { addReceipt } = useReceipts();
  const me = useCurrentUser();

  const release = () =>
    !online
      ? offlineAlert('release payment')
      : Dialog.alert('Release payment?', `${D.amount} goes to ${D.dev.name}’s MTN MoMo now.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Release',
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
          const r = addReceipt({
            kind: 'release',
            title: `Released · ${D.milestone}`,
            from: me.name,
            to: D.dev.name,
            method: 'DevPay escrow → MTN MoMo',
            amount: Number(D.amount.replace(/[^\d.]/g, '')),
            status: 'Sent',
          });
          setReceiptRef(r.ref);
          setResult('released');
          notify('Payment released', `${D.amount} sent to ${D.dev.name}.`, '/contracts');
        },
      },
    ]);

  const sendRevision = () => {
    if (!notes.trim()) return setNotesError('Say what needs to change.');
    setRevisionOpen(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    setResult('revision');
  };

  return (
    <View style={{ flex: 1 }}>
      <ScreenBackground />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <TopBar title="Review work" subtitle={D.contract} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <GlassCard>
            <View style={styles.rowBetween}>
              <StatusPill label="Awaiting your approval" tone="amber" icon="time" />
              <Text style={[styles.auto, { color: colors.textSecondary }]}>Auto-releases in 7 days</Text>
            </View>
            <Text style={[styles.milestone, { color: colors.text }]}>{D.milestone}</Text>
            <Text style={[styles.amount, { color: colors.text }]}>{D.amount}</Text>
            <Text style={[styles.held, { color: colors.textSecondary }]}>Held in escrow</Text>
          </GlassCard>

          <SectionHeader title="Submitted by" style={styles.gap} />
          <GlassCard style={styles.dev}>
            <Avatar uri={D.dev.avatar} size={48} ring={false} />
            <View style={{ flex: 1 }}>
              <View style={styles.nameRow}>
                <Text style={[styles.devName, { color: colors.text }]}>{D.dev.name}</Text>
                <MaterialCommunityIcons name="check-decagram" size={15} color={colors.primary} />
              </View>
              <Text style={[styles.devRole, { color: colors.textSecondary }]}>{D.dev.role}</Text>
              <View style={styles.nameRow}>
                <Ionicons name="star" size={12} color={colors.accentAmber} />
                <Text style={[styles.devRole, { color: colors.textSecondary }]}>
                  {D.dev.rating} · {D.dev.jobs} jobs
                </Text>
              </View>
            </View>
          </GlassCard>

          <SectionHeader title="Delivery notes" style={styles.gap} />
          <GlassCard>
            <Text style={[styles.notes, { color: colors.text }]}>{D.notes}</Text>
          </GlassCard>

          <SectionHeader title="Files & links" style={styles.gap} />
          <GlassCard padded={false} style={{ paddingHorizontal: 16 }}>
            <ListRow icon="git-pull-request-outline" label="Pull request #4" onPress={() => Linking.openURL(D.pr)} />
            <ListRow icon="play-circle-outline" label="Live demo" onPress={() => Linking.openURL(D.demo)} last />
          </GlassCard>

          <View style={[styles.revisions, { backgroundColor: colors.backgroundElement }]}>
            <Ionicons name="refresh" size={16} color={colors.textSecondary} />
            <Text style={[styles.revText, { color: colors.textSecondary }]}>
              {D.revisionsAllowed - D.revisionsUsed} of {D.revisionsAllowed} revision requests left
            </Text>
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Button label="Request changes" variant="light" style={{ flex: 1 }} onPress={() => setRevisionOpen(true)} />
          <Button label="Release" style={{ flex: 1 }} onPress={release} />
        </View>
      </SafeAreaView>

      <Sheet visible={revisionOpen} onClose={() => setRevisionOpen(false)} title="Request changes">
        <Text style={[styles.sheetSub, { color: colors.textSecondary }]}>Funds stay in escrow while {D.dev.name.split(' ')[0]} revises.</Text>
        <View style={{ gap: 14, marginTop: 14 }}>
          <Field
            placeholder="What should change?"
            multiline
            value={notes}
            onChangeText={(t) => {
              setNotes(t);
              setNotesError(undefined);
            }}
            error={notesError}
          />
          <Button label="Send request" onPress={sendRevision} />
        </View>
      </Sheet>

      <SuccessOverlay
        visible={result === 'released'}
        title="Payment released"
        subtitle={`${D.amount} is on its way to ${D.dev.name}’s MTN MoMo wallet.`}
        dismissLabel="Back to contracts"
        onDismiss={() => {
          setResult(null);
          router.replace('/contracts');
        }}
        secondaryLabel="View receipt"
        onSecondary={() => {
          setResult(null);
          router.replace(`/receipts/${receiptRef}`);
        }}
      />
      <SuccessOverlay
        visible={result === 'revision'}
        type="pending"
        title="Changes requested"
        subtitle={`${D.dev.name} has your notes. Funds stay in escrow.`}
        dismissLabel="Done"
        onDismiss={() => {
          setResult(null);
          router.replace('/contracts');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Layout.margin, paddingTop: 8, paddingBottom: 32 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  auto: { fontSize: 12 },
  milestone: { fontSize: 16, fontWeight: '600', marginTop: 14 },
  amount: { fontSize: 30, fontWeight: '600', letterSpacing: -0.8, marginTop: 6, fontVariant: ['tabular-nums'] },
  held: { fontSize: 13, marginTop: 2 },
  gap: { marginTop: Layout.sectionGap },
  dev: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  devName: { fontSize: 15, fontWeight: '600' },
  devRole: { fontSize: 12, marginTop: 1 },
  notes: { fontSize: 14, lineHeight: 21 },
  revisions: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: Radius.md, marginTop: 16 },
  revText: { fontSize: 13 },
  footer: { flexDirection: 'row', gap: 12, paddingHorizontal: Layout.margin, paddingTop: 10 },
  sheetSub: { fontSize: 13 },
});
