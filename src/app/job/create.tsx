import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { Button, Chip, Field, GlassCard, ScreenBackground, SectionHeader, Segmented, TopBar } from '@/components/ds';
import { SuccessOverlay } from '@/components/success-overlay';
import { Layout, Radius } from '@/constants/theme';

interface MilestoneInput {
  id: string;
  title: string;
  amount: string;
}

type Scope = 'Small' | 'Medium' | 'Large';
const CATEGORIES = ['Tech & Dev', 'UI/UX Design', 'Mobile Apps', 'Writing', 'Marketing', 'Cloud & APIs'];

export default function CreateJobScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Tech & Dev');
  const [description, setDescription] = useState('');
  const [scope, setScope] = useState<Scope>('Medium');
  const [requireKyc, setRequireKyc] = useState(true);
  const [milestones, setMilestones] = useState<MilestoneInput[]>([
    { id: '1', title: 'Architecture & UI setup', amount: '1500' },
    { id: '2', title: 'Core features & API integration', amount: '2000' },
  ]);
  const [errors, setErrors] = useState<{ title?: string; description?: string; budget?: string }>({});
  const [published, setPublished] = useState(false);

  const total = milestones.reduce((s, m) => s + (parseFloat(m.amount) || 0), 0);
  const update = (id: string, field: 'title' | 'amount', val: string) =>
    setMilestones((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: field === 'amount' ? val.replace(/\D/g, '') : val } : m)));

  const publish = () => {
    const next = {
      title: !title.trim() ? 'Give the job a title.' : undefined,
      description: !description.trim() ? 'Describe what you need delivered.' : undefined,
      budget: total <= 0 ? 'Add an amount to at least one milestone.' : undefined,
    };
    setErrors(next);
    if (next.title || next.description || next.budget) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setPublished(true);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScreenBackground />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <TopBar title="Post a job" />
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={{ gap: 16 }}>
            <Field label="Job title" icon="briefcase-outline" placeholder="e.g. React Native engineer for MoMo app" value={title} onChangeText={setTitle} error={errors.title} />
            <Field label="What needs to be delivered?" placeholder="Scope, deliverables, tools, deadlines…" multiline value={description} onChangeText={setDescription} error={errors.description} />
          </View>

          <SectionHeader title="Category" style={styles.gap} />
          <View style={styles.wrap}>
            {CATEGORIES.map((c) => (
              <Chip key={c} label={c} size="sm" selected={category === c} onPress={() => setCategory(c)} />
            ))}
          </View>

          <SectionHeader title="Project size" style={styles.gap} />
          <Segmented<Scope>
            value={scope}
            onChange={setScope}
            options={[
              { value: 'Small', label: 'Small' },
              { value: 'Medium', label: 'Medium' },
              { value: 'Large', label: 'Large' },
            ]}
          />

          <SectionHeader title="Milestones" style={styles.gap} />
          <View style={{ gap: 12 }}>
            {milestones.map((m, i) => (
              <GlassCard key={m.id} style={{ gap: 12 }}>
                <View style={styles.msHead}>
                  <View style={[styles.msNum, { backgroundColor: colors.primaryWash }]}>
                    <Text style={[styles.msNumText, { color: colors.primaryText }]}>{i + 1}</Text>
                  </View>
                  <Text style={[styles.msLabel, { color: colors.textSecondary }]}>Milestone {i + 1}</Text>
                  {milestones.length > 1 && (
                    <Pressable
                      onPress={() => setMilestones((prev) => prev.filter((x) => x.id !== m.id))}
                      hitSlop={8}
                      accessibilityRole="button"
                      accessibilityLabel={`Remove milestone ${i + 1}`}>
                      <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
                    </Pressable>
                  )}
                </View>
                <Field placeholder="What’s delivered" value={m.title} onChangeText={(t) => update(m.id, 'title', t)} />
                <Field
                  placeholder="Amount"
                  keyboardType="number-pad"
                  value={m.amount}
                  onChangeText={(t) => update(m.id, 'amount', t)}
                  prefix={<Text style={[styles.cur, { color: colors.textSecondary }]}>GH₵</Text>}
                />
              </GlassCard>
            ))}
          </View>
          {errors.budget && <Text style={[styles.err, { color: colors.accentCoral }]}>{errors.budget}</Text>}
          <Button
            label="Add milestone"
            variant="soft"
            size="md"
            style={{ marginTop: 12 }}
            icon={<Ionicons name="add" size={18} color={colors.primaryText} />}
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              setMilestones((prev) => [...prev, { id: String(Date.now()), title: '', amount: '' }]);
            }}
          />

          <GlassCard style={[styles.kyc, { marginTop: Layout.sectionGap }]}>
            <View style={[styles.kycIcon, { backgroundColor: colors.greenSoft }]}>
              <Ionicons name="id-card" size={18} color={colors.accentGreen} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.kycTitle, { color: colors.text }]}>Ghana Card verified only</Text>
              <Text style={[styles.kycSub, { color: colors.textSecondary }]}>Only Trusted freelancers can apply</Text>
            </View>
            <Switch
              value={requireKyc}
              onValueChange={setRequireKyc}
              trackColor={{ true: colors.primary, false: colors.backgroundSelected }}
              thumbColor="#FFFFFF"
              accessibilityLabel="Require Ghana Card verification"
            />
          </GlassCard>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Total budget · {milestones.length} milestones</Text>
            <Text style={[styles.total, { color: colors.text }]}>GH₵ {total.toLocaleString()}</Text>
          </View>
          <Button label="Publish Job" onPress={publish} />
        </View>
      </SafeAreaView>

      <SuccessOverlay
        visible={published}
        title="Job published"
        subtitle="Verified freelancers can now send proposals. You’ll fund milestone 1 when you hire."
        onDismiss={() => {
          setPublished(false);
          router.replace('/');
        }}
        dismissLabel="Back to Home"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Layout.margin, paddingTop: 8, paddingBottom: 32 },
  gap: { marginTop: Layout.sectionGap },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  msHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  msNum: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  msNumText: { fontSize: 13, fontWeight: '600' },
  msLabel: { flex: 1, fontSize: 13, fontWeight: '500' },
  cur: { fontSize: 15, fontWeight: '500' },
  err: { fontSize: 12, marginTop: 8, marginLeft: 6 },
  kyc: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: Radius.lg },
  kycIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  kycTitle: { fontSize: 14, fontWeight: '600' },
  kycSub: { fontSize: 12, marginTop: 2 },
  footer: { paddingHorizontal: Layout.margin, paddingTop: 10, gap: 10 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  totalLabel: { fontSize: 13 },
  total: { fontSize: 20, fontWeight: '600', letterSpacing: -0.4, fontVariant: ['tabular-nums'] },
});
