import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { useRole } from '@/contexts/RoleContext';
import { FloatingTabBar, TabType } from '@/components/floating-tab-bar';
import { SuccessOverlay } from '@/components/success-overlay';
import {
  Appear,
  Avatar,
  Button,
  CompanyLogo,
  Field,
  GlassCard,
  IconButton,
  ScreenBackground,
  Segmented,
  Sheet,
  StatusPill,
  useNavClearance,
} from '@/components/ds';
import { SummaryRow } from '@/components/payments';
import { Companies, Company } from '@/constants/companies';
import { Portraits } from '@/constants/media';
import { Layout, Radius } from '@/constants/theme';

type Status = 'In Progress' | 'In Review' | 'Released';

interface Contract {
  id: string;
  company?: Company;
  person?: { name: string; avatar: string };
  title: string;
  total: string;
  milestone: { index: number; count: number; title: string; amount: string; status: Status; due: string; revisions: number };
}

export default function ContractsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isClient } = useRole();
  const navClearance = useNavClearance();
  const [segment, setSegment] = useState<'active' | 'completed'>('active');
  const [submitFor, setSubmitFor] = useState<Contract | null>(null);
  const [notes, setNotes] = useState('');
  const [link, setLink] = useState('');
  const [notesError, setNotesError] = useState<string>();
  const [submitted, setSubmitted] = useState(false);
  const [receiptFor, setReceiptFor] = useState<Contract | null>(null);

  const party = (c: Company, name: string, avatar: string) =>
    isClient ? { person: { name, avatar } } : { company: c };

  const active: Contract[] = [
    {
      id: 'c_1',
      ...party(Companies.volta, 'Kwame Mensah', Portraits.kwame),
      title: 'MoMo checkout redesign',
      total: 'GH₵ 4,500',
      milestone: { index: 2, count: 3, title: 'Design system & tokens', amount: 'GH₵ 2,000', status: isClient ? 'In Review' : 'In Progress', due: '3 days left', revisions: 0 },
    },
    {
      id: 'c_2',
      ...party(Companies.sankofa, 'Akosua Serwaa', Portraits.akosua),
      title: 'Booking app checkout',
      total: 'GH₵ 3,200',
      milestone: { index: 1, count: 2, title: 'Prototype & checkout flow', amount: 'GH₵ 1,600', status: 'In Review', due: 'Auto-approves in 4 days', revisions: 1 },
    },
  ];
  const completed: Contract[] = [
    {
      id: 'c_3',
      ...party(Companies.kente, 'Kofi Darko', Portraits.kofi),
      title: 'Learning dashboard',
      total: 'GH₵ 5,000',
      milestone: { index: 3, count: 3, title: 'Final handoff', amount: 'GH₵ 1,500', status: 'Released', due: 'Paid 12 Oct', revisions: 1 },
    },
  ];
  const list = segment === 'active' ? active : completed;

  const submit = () => {
    if (!notes.trim()) return setNotesError('Add a short summary so the client knows what to check.');
    setSubmitFor(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setSubmitted(true);
    setNotes('');
    setLink('');
    setNotesError(undefined);
  };

  const onTab = (tab: TabType) => {
    if (tab === 'home') router.replace('/');
    if (tab === 'chats') router.push('/messages');
    if (tab === 'profile') router.push('/profile');
  };

  return (
    <View style={{ flex: 1 }}>
      <ScreenBackground />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <IconButton
              icon="chevron-back"
              accessibilityLabel="Go back"
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            />
            <Text style={[styles.title, { color: colors.text }]} accessibilityRole="header">
              Contracts
            </Text>
          </View>
          <IconButton icon="notifications-outline" accessibilityLabel="Notifications" badge onPress={() => router.push('/notifications')} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Layout.margin, paddingBottom: navClearance }}>
          <Segmented
            value={segment}
            onChange={setSegment}
            options={[
              { value: 'active', label: `Active (${active.length})` },
              { value: 'completed', label: `Completed (${completed.length})` },
            ]}
          />

          <View style={{ gap: 14, marginTop: 18 }}>
            {list.map((c, i) => (
              <Appear key={`${segment}-${c.id}`} index={i}>
              <ContractCard
                contract={c}
                isClient={isClient}
                onReview={() => router.push('/contracts/review')}
                onSubmit={() => setSubmitFor(c)}
                onChat={() => router.push('/chat/t_1' as any)}
                onReceipt={() => setReceiptFor(c)}
              />
              </Appear>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>

      <FloatingTabBar activeTab="jobs" onSelectTab={onTab} onCenterActionPress={() => router.push(isClient ? '/job/create' : '/explore')} />

      <Sheet visible={!!submitFor} onClose={() => setSubmitFor(null)} title="Submit work">
        <Text style={[styles.sheetSub, { color: colors.textSecondary }]}>
          {submitFor?.milestone.title} · {submitFor?.milestone.amount}. The client gets 7 days to review before funds auto-release.
        </Text>
        <View style={{ gap: 14, marginTop: 14 }}>
          <Field label="Link (GitHub, Figma, Drive)" icon="link-outline" placeholder="https://" autoCapitalize="none" value={link} onChangeText={setLink} />
          <Field
            label="What did you deliver?"
            placeholder="Summary, setup steps, test accounts…"
            multiline
            value={notes}
            onChangeText={(t) => {
              setNotes(t);
              if (notesError) setNotesError(undefined);
            }}
            error={notesError}
          />
          <Button label="Submit to Client" onPress={submit} />
        </View>
      </Sheet>

      <Sheet visible={!!receiptFor} onClose={() => setReceiptFor(null)} title="Payment receipt">
        {receiptFor && (
          <GlassCard style={{ marginTop: 4 }}>
            <SummaryRow label="Contract" value={receiptFor.title} />
            <SummaryRow label="Milestone" value={receiptFor.milestone.title} />
            <SummaryRow label="Released" value={receiptFor.milestone.due.replace('Paid ', '')} />
            <SummaryRow label="Paid to" value="MTN MoMo · 024 123 4567" />
            <SummaryRow label="Reference" value={`ESC-REL-${receiptFor.id.toUpperCase()}`} />
            <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 6 }} />
            <SummaryRow label="Amount" value={receiptFor.milestone.amount} strong />
          </GlassCard>
        )}
        <Button label="Close" variant="soft" style={{ marginTop: 14 }} onPress={() => setReceiptFor(null)} />
      </Sheet>

      <SuccessOverlay
        visible={submitted}
        title="Work submitted"
        subtitle="The client has been notified. Their 7-day review window starts now."
        onDismiss={() => setSubmitted(false)}
      />
    </View>
  );
}

function ContractCard({
  contract: c,
  isClient,
  onReview,
  onSubmit,
  onChat,
  onReceipt,
}: {
  contract: Contract;
  isClient: boolean;
  onReview: () => void;
  onSubmit: () => void;
  onChat: () => void;
  onReceipt: () => void;
}) {
  const { colors } = useTheme();
  const m = c.milestone;
  const tone = m.status === 'In Progress' ? 'blue' : m.status === 'In Review' ? 'amber' : 'green';
  const name = c.company?.name ?? c.person?.name ?? '';

  return (
    <GlassCard>
      <View style={styles.top}>
        {c.company ? <CompanyLogo mark={c.company.mark} size={42} /> : <Avatar uri={c.person!.avatar} size={42} ring={false} />}
        <View style={{ flex: 1 }}>
          <Text style={[styles.party, { color: colors.textSecondary }]}>{name}</Text>
          <Text style={[styles.cTitle, { color: colors.text }]} numberOfLines={2}>
            {c.title}
          </Text>
        </View>
        <Text style={[styles.total, { color: colors.text }]}>{c.total}</Text>
      </View>

      <View style={styles.progress} accessibilityLabel={`Milestone ${m.index} of ${m.count}`}>
        {Array.from({ length: m.count }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.seg,
              { backgroundColor: i < m.index - 1 || m.status === 'Released' ? colors.accentGreen : i === m.index - 1 ? colors.primary : colors.backgroundSelected },
            ]}
          />
        ))}
      </View>

      <View style={[styles.milestone, { backgroundColor: colors.backgroundElement }]}>
        <View style={styles.mTop}>
          <Text style={[styles.mLabel, { color: colors.textSecondary }]}>
            Milestone {m.index} of {m.count}
          </Text>
          <StatusPill label={m.status} tone={tone} />
        </View>
        <View style={styles.mTop}>
          <Text style={[styles.mTitle, { color: colors.text }]}>{m.title}</Text>
          <Text style={[styles.mAmount, { color: colors.text }]}>{m.amount}</Text>
        </View>
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{m.due}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="refresh-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{m.revisions}/2 revisions</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Button label="Chat" variant="soft" size="md" style={{ width: 96 }} onPress={onChat} />
        {m.status === 'Released' ? (
          <Button label="Paid · View receipt" variant="light" size="md" style={{ flex: 1 }} onPress={onReceipt} />
        ) : isClient ? (
          m.status === 'In Review' ? (
            <Button label="Review & release" size="md" style={{ flex: 1 }} onPress={onReview} />
          ) : (
            <Button label="Work in progress" variant="light" size="md" disabled style={{ flex: 1 }} />
          )
        ) : m.status === 'In Progress' ? (
          <Button label="Submit work" size="md" style={{ flex: 1 }} onPress={onSubmit} />
        ) : (
          <Button label="Client is reviewing" variant="light" size="md" disabled style={{ flex: 1 }} />
        )}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  header: {
    height: Layout.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.margin,
    marginBottom: 6,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { fontSize: 26, fontWeight: '600', letterSpacing: -0.6 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  party: { fontSize: 12 },
  cTitle: { fontSize: 16, fontWeight: '600', marginTop: 2 },
  total: { fontSize: 15, fontWeight: '600', fontVariant: ['tabular-nums'] },
  progress: { flexDirection: 'row', gap: 6, marginTop: 16 },
  seg: { flex: 1, height: 5, borderRadius: 3 },
  milestone: { borderRadius: Radius.md, padding: 14, marginTop: 14, gap: 8 },
  mTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  mLabel: { fontSize: 12, fontWeight: '500' },
  mTitle: { flex: 1, fontSize: 14, fontWeight: '600' },
  mAmount: { fontSize: 14, fontWeight: '600', fontVariant: ['tabular-nums'] },
  meta: { flexDirection: 'row', gap: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  sheetSub: { fontSize: 13, lineHeight: 19 },
});
