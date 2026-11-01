import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/ui-text';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useOnline, offlineAlert } from '@/hooks/use-online';
import { notify } from '@/lib/notify';
import { useTheme } from '@/contexts/ThemeContext';
import { Button, CompanyRow, Field, GlassCard, ScreenBackground, SectionHeader, TopBar } from '@/components/ds';
import { SuccessOverlay } from '@/components/success-overlay';
import { getJob } from '@/constants/jobs';
import { Layout, Radius } from '@/constants/theme';

interface Milestone {
  id: string;
  title: string;
  amount: string;
  days: string;
}

const cedis = (n: number) => `GH₵ ${n.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

export default function JobApplyScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const online = useOnline();
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const job = getJob(jobId);

  const [cover, setCover] = useState('');
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: 'm1', title: 'Design tokens & component library', amount: '2000', days: '4' },
    { id: 'm2', title: 'Interactive prototype', amount: '2500', days: '6' },
  ]);
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDays, setNewDays] = useState('');
  const [addError, setAddError] = useState<string>();
  const [link, setLink] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [coverError, setCoverError] = useState<string>();
  const [done, setDone] = useState(false);

  const total = milestones.reduce((s, m) => s + (parseFloat(m.amount) || 0), 0);

  const addMilestone = () => {
    if (!newTitle.trim() || !newAmount.trim()) return setAddError('Add a title and an amount.');
    setMilestones([...milestones, { id: `m_${Date.now()}`, title: newTitle.trim(), amount: newAmount, days: newDays || '5' }]);
    setNewTitle('');
    setNewAmount('');
    setNewDays('');
    setAddError(undefined);
    setAdding(false);
  };

  const submit = () => {
    if (!cover.trim()) return setCoverError('Write a short pitch so the client knows why you.');
    if (!online) return offlineAlert('send your proposal');
    setSubmitting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
      notify('Proposal sent', `${job.company.name} will review your proposal for ${job.title}.`, '/contracts');
    }, 800);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScreenBackground />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <TopBar title="Send proposal" />
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <GlassCard>
            <CompanyRow company={job.company} />
            <Text style={[styles.jobTitle, { color: colors.text }]}>{job.title}</Text>
            <Text style={[styles.jobBudget, { color: colors.textSecondary }]}>
              Budget {job.budget} / {job.period}
            </Text>
          </GlassCard>

          <SectionHeader title="Your pitch" style={styles.gap} />
          <Field
            placeholder={`Hi ${job.company.name} team, here’s how I’d approach this…`}
            multiline
            value={cover}
            onChangeText={(t) => {
              setCover(t);
              setCoverError(undefined);
            }}
            error={coverError}
          />

          <SectionHeader title="Milestones" style={styles.gap} />
          <GlassCard padded={false} style={{ paddingHorizontal: 16 }}>
            {milestones.map((m, i) => (
              <View key={m.id} style={[styles.ms, { borderBottomColor: colors.border }, i < milestones.length - 1 && styles.msBorder]}>
                <View style={[styles.msNum, { backgroundColor: colors.primaryWash }]}>
                  <Text style={[styles.msNumText, { color: colors.primaryText }]}>{i + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.msTitle, { color: colors.text }]}>{m.title}</Text>
                  <Text style={[styles.msSub, { color: colors.textSecondary }]}>{m.days} days</Text>
                </View>
                <Text style={[styles.msAmount, { color: colors.text }]}>GH₵ {Number(m.amount).toLocaleString()}</Text>
                {milestones.length > 1 && (
                  <Pressable
                    onPress={() => setMilestones(milestones.filter((x) => x.id !== m.id))}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel={`Remove ${m.title}`}>
                    <Ionicons name="close-circle" size={20} color={colors.textMuted} />
                  </Pressable>
                )}
              </View>
            ))}
          </GlassCard>

          {adding ? (
            <GlassCard style={{ marginTop: 12, gap: 12 }}>
              <Field placeholder="Milestone title" value={newTitle} onChangeText={setNewTitle} />
              <View style={styles.two}>
                <Field placeholder="Amount (GH₵)" keyboardType="number-pad" value={newAmount} onChangeText={(t) => setNewAmount(t.replace(/\D/g, ''))} style={{ flex: 1 }} />
                <Field placeholder="Days" keyboardType="number-pad" value={newDays} onChangeText={(t) => setNewDays(t.replace(/\D/g, ''))} style={{ width: 100 }} />
              </View>
              {addError && <Text style={[styles.err, { color: colors.accentCoral }]}>{addError}</Text>}
              <View style={styles.two}>
                <Button label="Cancel" variant="ghost" size="md" style={{ flex: 1 }} onPress={() => setAdding(false)} />
                <Button label="Add" variant="soft" size="md" style={{ flex: 1 }} onPress={addMilestone} />
              </View>
            </GlassCard>
          ) : (
            <Button
              label="Add milestone"
              variant="soft"
              size="md"
              style={{ marginTop: 12 }}
              icon={<Ionicons name="add" size={18} color={colors.primaryText} />}
              onPress={() => setAdding(true)}
            />
          )}

          <SectionHeader title="Relevant work" style={styles.gap} />
          <Field icon="link-outline" placeholder="https://" autoCapitalize="none" keyboardType="url" value={link} onChangeText={setLink} />

          <View style={[styles.note, { backgroundColor: colors.primaryWash }]}>
            <Ionicons name="shield-checkmark" size={16} color={colors.primaryText} />
            <Text style={[styles.noteText, { color: colors.textSecondary }]}>
              The client funds each milestone into escrow before you start it.
            </Text>
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Total bid</Text>
            <Text style={[styles.total, { color: colors.text }]}>{cedis(total)}</Text>
          </View>
          <Button label="Send Proposal" loading={submitting} onPress={submit} />
        </View>
      </SafeAreaView>

      <SuccessOverlay
        visible={done}
        title="Proposal sent"
        subtitle={`${job.company.name} will review your ${milestones.length}-milestone proposal. We’ll notify you when they reply.`}
        onDismiss={() => {
          setDone(false);
          router.replace('/');
        }}
        dismissLabel="Back to Home"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Layout.margin, paddingTop: 8, paddingBottom: 32 },
  jobTitle: { fontSize: 17, fontWeight: '600', marginTop: 14 },
  jobBudget: { fontSize: 13, marginTop: 4 },
  gap: { marginTop: Layout.sectionGap },
  ms: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  msBorder: { borderBottomWidth: StyleSheet.hairlineWidth },
  msNum: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  msNumText: { fontSize: 13, fontWeight: '600' },
  msTitle: { fontSize: 14, fontWeight: '500' },
  msSub: { fontSize: 12, marginTop: 2 },
  msAmount: { fontSize: 14, fontWeight: '600', fontVariant: ['tabular-nums'] },
  two: { flexDirection: 'row', gap: 10 },
  err: { fontSize: 12, marginLeft: 6 },
  note: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: Radius.md, marginTop: 20, alignItems: 'center' },
  noteText: { flex: 1, fontSize: 12, lineHeight: 18 },
  footer: { paddingHorizontal: Layout.margin, paddingTop: 10, gap: 10 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  totalLabel: { fontSize: 13 },
  total: { fontSize: 20, fontWeight: '600', letterSpacing: -0.4, fontVariant: ['tabular-nums'] },
});
