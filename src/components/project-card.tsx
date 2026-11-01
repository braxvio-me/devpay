import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui-text';
import { useTheme } from '@/contexts/ThemeContext';
import { Avatar, CompanyLogo, GlassCard, StatusPill } from '@/components/ds';
import { cedis, MILESTONE_LABEL, Project, projectTotals } from '@/constants/projects';
import { Radius } from '@/constants/theme';

const STATUS = {
  active: { label: 'In progress', tone: 'blue' as const },
  review: { label: 'In review', tone: 'amber' as const },
  completed: { label: 'Completed', tone: 'green' as const },
};

/** Project summary card. Clients see the freelancer; freelancers see the client company. */
export function ProjectCard({ project: p, asClient, onPress }: { project: Project; asClient: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  const t = projectTotals(p);
  const current = p.milestones.find((m) => m.status !== 'released') ?? p.milestones[p.milestones.length - 1];
  const currentIndex = p.milestones.indexOf(current) + 1;

  return (
    <GlassCard onPress={onPress} accessibilityLabel={`${p.title}, ${STATUS[p.status].label}`}>
      <View style={styles.top}>
        {asClient ? <Avatar uri={p.freelancer.avatar} size={42} ring={false} /> : <CompanyLogo mark={p.company.mark} size={42} />}
        <View style={{ flex: 1 }}>
          <Text style={[styles.party, { color: colors.textSecondary }]}>{asClient ? p.freelancer.name : p.company.name}</Text>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
            {p.title}
          </Text>
        </View>
        <StatusPill label={STATUS[p.status].label} tone={STATUS[p.status].tone} />
      </View>

      <View style={styles.progress} accessibilityLabel={`${t.done} of ${t.count} milestones paid`}>
        {p.milestones.map((m) => (
          <View
            key={m.id}
            style={[
              styles.seg,
              {
                backgroundColor:
                  m.status === 'released' ? colors.accentGreen : m.status === 'upcoming' ? colors.backgroundSelected : m.status === 'submitted' ? colors.accentAmber : colors.primary,
              },
            ]}
          />
        ))}
      </View>

      <View style={[styles.current, { backgroundColor: colors.backgroundElement }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.mLabel, { color: colors.textSecondary }]}>
            {p.status === 'completed' ? 'All milestones paid' : `Milestone ${currentIndex} of ${t.count} · ${MILESTONE_LABEL[current.status]}`}
          </Text>
          <Text style={[styles.mTitle, { color: colors.text }]} numberOfLines={1}>
            {p.status === 'completed' ? `Finished ${p.deadline}` : current.title}
          </Text>
        </View>
        <Text style={[styles.amount, { color: colors.text }]}>{cedis(p.status === 'completed' ? t.released : current.amount)}</Text>
      </View>

      <View style={styles.foot}>
        <View style={styles.meta}>
          <Ionicons name="lock-closed-outline" size={13} color={colors.textSecondary} />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>{cedis(t.inEscrow)} in escrow</Text>
        </View>
        <View style={styles.meta}>
          <Ionicons name="calendar-outline" size={13} color={colors.textSecondary} />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>Due {current.due}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  party: { fontSize: 12 },
  title: { fontSize: 16, fontWeight: '600', marginTop: 2 },
  progress: { flexDirection: 'row', gap: 6, marginTop: 16 },
  seg: { flex: 1, height: 5, borderRadius: 3 },
  current: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: Radius.md, marginTop: 12 },
  mLabel: { fontSize: 12 },
  mTitle: { fontSize: 14, fontWeight: '600', marginTop: 2 },
  amount: { fontSize: 14, fontWeight: '600', fontVariant: ['tabular-nums'] },
  foot: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 12 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12 },
});
