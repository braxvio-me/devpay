import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '@/components/ui-text';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';
import { useRole } from '@/contexts/RoleContext';
import { Avatar, Button, CompanyLogo, Field, GlassCard, ListRow, ScreenBackground, SectionHeader, Sheet, StatusPill, TopBar } from '@/components/ds';
import { SummaryRow } from '@/components/payments';
import { SuccessOverlay } from '@/components/success-overlay';
import { Dialog } from '@/lib/dialog';
import { downloadReceipt } from '@/lib/receipt-pdf';
import { useCurrentUser } from '@/contexts/AuthContext';
import { notify } from '@/lib/notify';
import { offlineAlert, useOnline } from '@/hooks/use-online';
import { cedis, getProject, MILESTONE_LABEL, MilestoneStatus, ProjectMilestone, projectTotals } from '@/constants/projects';
import { Layout } from '@/constants/theme';

const TONE: Record<MilestoneStatus, 'green' | 'blue' | 'amber' | 'grey'> = {
  released: 'green',
  in_progress: 'blue',
  funded: 'blue',
  submitted: 'amber',
  upcoming: 'grey',
};

export default function ProjectScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { isClient } = useRole();
  const me = useCurrentUser();
  const online = useOnline();
  const insets = useSafeAreaInsets();
  const base = getProject(id);

  const [milestones, setMilestones] = useState<ProjectMilestone[]>(base.milestones);
  const [submitFor, setSubmitFor] = useState<ProjectMilestone | null>(null);
  const [receiptFor, setReceiptFor] = useState<ProjectMilestone | null>(null);
  const [notes, setNotes] = useState('');
  const [notesError, setNotesError] = useState<string>();
  const [submitted, setSubmitted] = useState(false);

  const p = { ...base, milestones };
  const t = projectTotals(p);
  const current = milestones.find((m) => m.status !== 'released');

  const submitWork = () => {
    if (!notes.trim()) return setNotesError('Say what you delivered so the client knows what to check.');
    if (!online) return offlineAlert('submit work');
    const m = submitFor!;
    setMilestones((list) => list.map((x) => (x.id === m.id ? { ...x, status: 'submitted' } : x)));
    setSubmitFor(null);
    setNotes('');
    setSubmitted(true);
    notify('Work submitted', `${p.company.name} has 7 days to review “${m.title}”.`, `/project/${p.id}`);
  };

  /** The one thing the current user can do on a milestone. */
  const actionFor = (m: ProjectMilestone): { label: string; variant?: 'primary' | 'light' | 'soft'; onPress?: () => void } | null => {
    if (m.status === 'released') return { label: 'Receipt', variant: 'light', onPress: () => setReceiptFor(m) };
    if (isClient) {
      if (m.status === 'submitted') return { label: 'Review & release', onPress: () => router.push('/contracts/review') };
      if (m.status === 'upcoming' && m === current) return { label: 'Fund milestone', onPress: () => router.push('/payment') };
      return null;
    }
    if (m.status === 'in_progress' || m.status === 'funded') return { label: 'Submit work', onPress: () => setSubmitFor(m) };
    return null;
  };

  const primary = current ? actionFor(current) : null;

  return (
    <View style={{ flex: 1 }}>
      <ScreenBackground />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <TopBar title="Project" subtitle={p.category} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 110 }]}>
          <Animated.View entering={FadeInDown.duration(320)}>
            <GlassCard>
              <View style={styles.top}>
                {isClient ? <Avatar uri={p.freelancer.avatar} size={46} ring={false} /> : <CompanyLogo mark={p.company.mark} size={46} />}
                <View style={{ flex: 1 }}>
                  <Text style={[styles.party, { color: colors.textSecondary }]}>{isClient ? `Freelancer · ${p.freelancer.name}` : `Client · ${p.company.name}`}</Text>
                  <Text style={[styles.title, { color: colors.text }]}>{p.title}</Text>
                </View>
              </View>
              <Text style={[styles.summary, { color: colors.textSecondary }]}>{p.summary}</Text>
              <View style={[styles.stats, { borderTopColor: colors.border }]}>
                {[
                  { label: 'Total', value: cedis(t.total) },
                  { label: 'Paid', value: cedis(t.released) },
                  { label: 'In escrow', value: cedis(t.inEscrow) },
                ].map((s, i) => (
                  <React.Fragment key={s.label}>
                    {i > 0 && <View style={[styles.statDiv, { backgroundColor: colors.border }]} />}
                    <View style={styles.stat}>
                      <Text style={[styles.statValue, { color: colors.text }]}>{s.value}</Text>
                      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{s.label}</Text>
                    </View>
                  </React.Fragment>
                ))}
              </View>
              <View style={[styles.track, { backgroundColor: colors.backgroundSelected }]}>
                <View style={[styles.fill, { width: `${Math.round(t.progress * 100)}%`, backgroundColor: colors.accentGreen }]} />
              </View>
              <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                {t.done} of {t.count} milestones paid
              </Text>
            </GlassCard>
          </Animated.View>

          <SectionHeader title="Milestones" style={styles.gap} />
          <GlassCard padded={false} style={{ paddingHorizontal: 16 }}>
            {milestones.map((m, i) => {
              const action = actionFor(m);
              return (
                <Animated.View
                  key={m.id}
                  layout={LinearTransition.duration(220)}
                  style={[styles.ms, i < milestones.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}>
                  <View style={[styles.dot, { backgroundColor: m.status === 'released' ? colors.accentGreen : m === current ? colors.primary : colors.backgroundElement }]}>
                    {m.status === 'released' ? (
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    ) : (
                      <Text style={[styles.dotText, { color: m === current ? '#FFFFFF' : colors.textSecondary }]}>{i + 1}</Text>
                    )}
                  </View>
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={[styles.msTitle, { color: colors.text }]}>{m.title}</Text>
                    <Text style={[styles.msMeta, { color: colors.textSecondary }]}>
                      {cedis(m.amount)} · due {m.due}
                    </Text>
                    <StatusPill label={MILESTONE_LABEL[m.status]} tone={TONE[m.status]} />
                  </View>
                  {action && <Button label={action.label} variant={action.variant ?? 'soft'} size="md" style={styles.msBtn} onPress={action.onPress} />}
                </Animated.View>
              );
            })}
          </GlassCard>

          <SectionHeader title="Details" style={styles.gap} />
          <GlassCard padded={false} style={{ paddingHorizontal: 16 }}>
            <ListRow icon="calendar-outline" label="Started" value={p.started} />
            <ListRow icon="flag-outline" label="Deadline" value={p.deadline} />
            {isClient ? (
              <ListRow icon="person-outline" label="Freelancer profile" value={p.freelancer.name} onPress={() => router.push(`/talent/${p.freelancer.talentId}` as never)} last />
            ) : (
              <ListRow icon="business-outline" label="Client" value={p.company.name} last />
            )}
          </GlassCard>

          <SectionHeader title={`Files · ${p.files.length}`} style={styles.gap} />
          <GlassCard padded={false} style={{ paddingHorizontal: 16 }}>
            {p.files.map((f, i) => (
              <ListRow
                key={f.name}
                icon="document-text-outline"
                label={f.name}
                value={f.size}
                last={i === p.files.length - 1}
                onPress={() => Dialog.alert(f.name, 'Opening files will work once files are stored on DevPay’s servers.')}
              />
            ))}
          </GlassCard>

          <SectionHeader title="Activity" style={styles.gap} />
          <GlassCard>
            {p.activity.map((a, i) => (
              <View key={a.id} style={styles.event}>
                <View style={styles.eventRail}>
                  <View style={[styles.eventIcon, { backgroundColor: colors.primaryWash }]}>
                    <Ionicons name={a.icon} size={14} color={colors.navActive} />
                  </View>
                  {i < p.activity.length - 1 && <View style={[styles.eventLine, { backgroundColor: colors.border }]} />}
                </View>
                <View style={{ flex: 1, paddingBottom: i < p.activity.length - 1 ? 16 : 0 }}>
                  <Text style={[styles.eventText, { color: colors.text }]}>{a.text}</Text>
                  <Text style={[styles.eventDate, { color: colors.textSecondary }]}>{a.date}</Text>
                </View>
              </View>
            ))}
          </GlassCard>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16), backgroundColor: colors.background, borderTopColor: colors.border }]}>
          <Button
            label="Chat"
            variant="light"
            style={{ flex: primary && primary.label !== 'Receipt' ? 0.8 : 1 }}
            icon={<Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.text} />}
            onPress={() => router.push(`/chat/${p.threadId}` as never)}
          />
          {primary && primary.label !== 'Receipt' && <Button label={primary.label} style={{ flex: 1.2 }} onPress={primary.onPress} />}
        </View>
      </SafeAreaView>

      <Sheet visible={!!submitFor} onClose={() => setSubmitFor(null)} title="Submit work">
        <Text style={[styles.sheetText, { color: colors.textSecondary }]}>
          {submitFor?.title} · {submitFor ? cedis(submitFor.amount) : ''}. The client has 7 days to review before it releases automatically.
        </Text>
        <Field
          placeholder="What did you deliver? Links, setup steps, test accounts…"
          multiline
          value={notes}
          onChangeText={(v) => {
            setNotes(v);
            setNotesError(undefined);
          }}
          error={notesError}
          style={{ marginTop: 14 }}
        />
        <Button label="Submit to client" onPress={submitWork} style={{ marginTop: 14 }} />
      </Sheet>

      <Sheet visible={!!receiptFor} onClose={() => setReceiptFor(null)} title="Payment receipt">
        {receiptFor && (
          <GlassCard>
            <SummaryRow label="Project" value={p.title} />
            <SummaryRow label="Milestone" value={receiptFor.title} />
            <SummaryRow label="Released" value={receiptFor.due} />
            <SummaryRow label="Paid to" value="MTN MoMo" />
            <SummaryRow label="Reference" value={`ESC-REL-${p.id.toUpperCase()}-${receiptFor.id.toUpperCase()}`} />
            <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 6 }} />
            <SummaryRow label="Amount" value={cedis(receiptFor.amount)} strong />
          </GlassCard>
        )}
        <Button
          label="Download PDF"
          style={{ marginTop: 14 }}
          icon={<Ionicons name="download-outline" size={18} color="#FFFFFF" />}
          onPress={async () => {
            if (!receiptFor) return;
            const ref = `ESC-REL-${p.id.toUpperCase()}-${receiptFor.id.toUpperCase()}`;
            const err = await downloadReceipt({
              id: ref,
              ref,
              kind: isClient ? 'release' : 'earning',
              title: `${p.title} · ${receiptFor.title}`,
              from: isClient ? me.name : p.company.name,
              to: isClient ? p.freelancer.name : me.name,
              method: 'DevPay escrow → MTN MoMo',
              amount: receiptFor.amount,
              fee: 0,
              createdAt: Date.now(),
              status: 'Paid',
            });
            if (err) Dialog.alert('Receipt', err);
          }}
        />
        <Button label="Close" variant="soft" style={{ marginTop: 8 }} onPress={() => setReceiptFor(null)} />
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

const styles = StyleSheet.create({
  content: { paddingHorizontal: Layout.margin, paddingTop: 8 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  party: { fontSize: 12 },
  title: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3, marginTop: 2 },
  summary: { fontSize: 14, lineHeight: 21, marginTop: 14 },
  stats: { flexDirection: 'row', marginTop: 16, paddingTop: 14, borderTopWidth: 1 },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statDiv: { width: 1 },
  statValue: { fontSize: 15, fontWeight: '600', fontVariant: ['tabular-nums'] },
  statLabel: { fontSize: 11 },
  track: { height: 6, borderRadius: 3, marginTop: 16, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3 },
  progressText: { fontSize: 12, marginTop: 6 },
  gap: { marginTop: Layout.sectionGap },
  ms: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  dot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  dotText: { fontSize: 13, fontWeight: '600' },
  msTitle: { fontSize: 14, fontWeight: '600' },
  msMeta: { fontSize: 12 },
  msBtn: { minWidth: 104 },
  event: { flexDirection: 'row', gap: 12 },
  eventRail: { alignItems: 'center' },
  eventIcon: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  eventLine: { width: 2, flex: 1, marginTop: 4 },
  eventText: { fontSize: 14 },
  eventDate: { fontSize: 12, marginTop: 2 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', gap: 12, paddingHorizontal: Layout.margin, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth },
  sheetText: { fontSize: 13, lineHeight: 19 },
});
