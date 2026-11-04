import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '@/components/ui-text';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';
import { useVerification } from '@/contexts/VerificationContext';
import {
  Appear,
  Avatar,
  Button,
  Chip,
  CompanyLogo,
  GlassCard,
  IconButton,
  ListRow,
  ScreenBackground,
  SectionHeader,
  Segmented,
  Sheet,
  StatusPill,
  TopBar,
} from '@/components/ds';
import { SuccessOverlay } from '@/components/success-overlay';
import { getTalent, Project, Review } from '@/constants/talent';
import { Layout, Radius } from '@/constants/theme';

type Tab = 'about' | 'projects' | 'reviews';

const OPEN_JOBS = [
  { id: 'j1', title: 'React Native Engineer (MoMo SDK)', budget: 'GH₵ 4,500' },
  { id: 'j2', title: 'Checkout UX audit', budget: 'GH₵ 1,800' },
];

export default function TalentProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { verified } = useVerification();
  const insets = useSafeAreaInsets();
  const t = getTalent(id);

  const [tab, setTab] = useState<Tab>('about');
  const [saved, setSaved] = useState(false);
  const [hireOpen, setHireOpen] = useState(false);
  const [invited, setInvited] = useState<string | null>(null);

  const stats = [
    { value: String(t.jobsDone), label: 'Jobs done' },
    { value: t.rating.toFixed(1), label: `${t.reviews} reviews` },
    { value: t.onTime, label: 'On time' },
    { value: t.earned, label: 'Earned' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <ScreenBackground height={420} />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <TopBar
          title="Freelancer"
          right={
            <IconButton
              icon={saved ? 'heart' : 'heart-outline'}
              color={saved ? colors.accentCoral : undefined}
              accessibilityLabel={saved ? 'Remove from saved talent' : 'Save freelancer'}
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                setSaved((s) => !s);
              }}
            />
          }
        />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 110 }]}>
          <GlassCard style={styles.hero}>
            <Avatar uri={t.avatar} size={88} online={t.available} />
            <View style={styles.nameRow}>
              <Text style={[styles.name, { color: colors.text }]}>{t.name}</Text>
              {t.verified && <Ionicons name="checkmark-circle" size={18} color={colors.primary} />}
            </View>
            <Text style={[styles.title, { color: colors.textSecondary }]}>{t.title}</Text>
            <View style={styles.metaRow}>
              <Ionicons name="location-sharp" size={13} color={colors.textSecondary} />
              <Text style={[styles.meta, { color: colors.textSecondary }]}>{t.city}</Text>
              <Text style={[styles.meta, { color: colors.textMuted }]}>·</Text>
              <Text style={[styles.meta, { color: colors.text, fontWeight: '600' }]}>{t.rate}</Text>
              <Text style={[styles.meta, { color: colors.textSecondary }]}>/ hr</Text>
            </View>
            <View style={styles.pills}>
              <StatusPill label={t.available ? 'Available now' : 'Busy until Nov'} tone={t.available ? 'green' : 'grey'} />
              {t.verified ? <StatusPill label="Ghana Card verified" tone="blue" icon="shield-checkmark" /> : <StatusPill label="Not verified" tone="amber" />}
            </View>
            <View style={[styles.stats, { borderTopColor: colors.border }]}>
              {stats.map((s, i) => (
                <React.Fragment key={s.label}>
                  {i > 0 && <View style={[styles.statDiv, { backgroundColor: colors.border }]} />}
                  <View style={styles.stat}>
                    <Text style={[styles.statValue, { color: colors.text }]}>{s.value}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{s.label}</Text>
                  </View>
                </React.Fragment>
              ))}
            </View>
          </GlassCard>

          <Segmented<Tab>
            value={tab}
            onChange={setTab}
            options={[
              { value: 'about', label: 'About' },
              { value: 'projects', label: `Projects (${t.projects.length})` },
              { value: 'reviews', label: 'Reviews' },
            ]}
            style={{ marginTop: 18 }}
          />

          <Animated.View key={tab} entering={FadeIn.duration(220)}>
          {tab === 'about' && (
            <>
              <SectionHeader title="About" style={styles.gap} />
              <GlassCard>
                <Text style={[styles.body, { color: colors.text }]}>{t.about}</Text>
              </GlassCard>
              <SectionHeader title="Skills" style={styles.gap} />
              <View style={styles.wrap}>
                {t.skills.map((s) => (
                  <Chip key={s} label={s} size="sm" />
                ))}
              </View>
              <SectionHeader title="Details" style={styles.gap} />
              <GlassCard padded={false} style={{ paddingHorizontal: 16 }}>
                <ListRow icon="chatbubbles-outline" label="Languages" value={t.languages.join(', ')} />
                <ListRow icon="calendar-outline" label="On DevPay since" value={t.memberSince} />
                <ListRow icon="shield-checkmark-outline" label="Escrow contracts" value={`${t.jobsDone} completed`} last />
              </GlassCard>
            </>
          )}

          {tab === 'projects' && (
            <View style={{ gap: 14, marginTop: 18 }}>
              {t.projects.map((p, i) => (
                <Appear key={p.id} index={i}>
                  <ProjectCard project={p} />
                </Appear>
              ))}
            </View>
          )}

          {tab === 'reviews' && (
            <View style={{ gap: 14, marginTop: 18 }}>
              {t.feedback.length === 0 ? (
                <GlassCard style={{ alignItems: 'center', paddingVertical: 28 }}>
                  <Text style={[styles.body, { color: colors.textSecondary }]}>No written reviews yet.</Text>
                </GlassCard>
              ) : (
                t.feedback.map((r) => <ReviewCard key={r.id} review={r} />)
              )}
            </View>
          )}
          </Animated.View>
        </ScrollView>

        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, 16), backgroundColor: colors.background, borderTopColor: colors.border },
          ]}>
          <Button
            label="Message"
            variant="light"
            style={{ flex: 1 }}
            icon={<Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.text} />}
            onPress={() => router.push(`/chat/${t.threadId}` as any)}
          />
          <Button label="Hire" style={{ flex: 1 }} onPress={() => setHireOpen(true)} />
        </View>
      </SafeAreaView>

      <Sheet visible={hireOpen} onClose={() => setHireOpen(false)} title={verified ? `Invite ${t.name.split(' ')[0]} to a job` : 'Verify to hire'}>
        {verified ? (
          <>
            {OPEN_JOBS.map((j, i) => (
              <ListRow
                key={j.id}
                icon="briefcase-outline"
                label={j.title}
                value={j.budget}
                last={i === OPEN_JOBS.length - 1}
                onPress={() => {
                  setHireOpen(false);
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
                  setInvited(j.title);
                }}
              />
            ))}
            <Button
              label="Post a new job"
              variant="soft"
              size="md"
              style={{ marginTop: 14 }}
              onPress={() => {
                setHireOpen(false);
                router.push('/job/create');
              }}
            />
          </>
        ) : (
          <>
            <Text style={[styles.body, { color: colors.textSecondary }]}>
              Only verified clients can hire on DevPay. It takes a few minutes and protects both of you.
            </Text>
            <Button
              label="Get verified"
              style={{ marginTop: 16 }}
              icon={<Ionicons name="shield-checkmark" size={18} color="#FFFFFF" />}
              onPress={() => {
                setHireOpen(false);
                router.push('/verification');
              }}
            />
          </>
        )}
      </Sheet>

      <SuccessOverlay
        visible={!!invited}
        title="Invite sent"
        subtitle={`${t.name} has been invited to “${invited ?? ''}”. You’ll fund milestone 1 when they accept.`}
        onDismiss={() => setInvited(null)}
        dismissLabel="Done"
      />
    </View>
  );
}

function ProjectCard({ project: p }: { project: Project }) {
  const { colors } = useTheme();
  return (
    <GlassCard>
      <View style={styles.pTop}>
        <CompanyLogo mark={p.client.mark} size={40} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.pTitle, { color: colors.text }]}>{p.title}</Text>
          <Text style={[styles.pClient, { color: colors.textSecondary }]}>
            {p.client.name} · {p.completed}
          </Text>
        </View>
      </View>
      <Text style={[styles.pSummary, { color: colors.textSecondary }]}>{p.summary}</Text>
      <View style={styles.wrap}>
        {p.tags.map((tag) => (
          <Chip key={tag} label={tag} size="sm" />
        ))}
      </View>
      <View style={[styles.pFoot, { backgroundColor: colors.backgroundElement }]}>
        <View style={styles.pFootItem}>
          <Text style={[styles.pFootLabel, { color: colors.textSecondary }]}>Paid via escrow</Text>
          <Text style={[styles.pFootValue, { color: colors.text }]}>{p.amount}</Text>
        </View>
        <View style={styles.pFootItem}>
          <Text style={[styles.pFootLabel, { color: colors.textSecondary }]}>Duration</Text>
          <Text style={[styles.pFootValue, { color: colors.text }]}>{p.duration}</Text>
        </View>
        <View style={styles.pFootItem}>
          <Text style={[styles.pFootLabel, { color: colors.textSecondary }]}>Client rating</Text>
          <View style={styles.rating}>
            <Ionicons name="star" size={13} color={colors.accentAmber} />
            <Text style={[styles.pFootValue, { color: colors.text }]}>{p.rating.toFixed(1)}</Text>
          </View>
        </View>
      </View>
    </GlassCard>
  );
}

function ReviewCard({ review: r }: { review: Review }) {
  const { colors } = useTheme();
  return (
    <GlassCard>
      <View style={styles.pTop}>
        <CompanyLogo mark={r.company.mark} size={36} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.rAuthor, { color: colors.text }]}>{r.author}</Text>
          <Text style={[styles.pClient, { color: colors.textSecondary }]}>
            {r.company.name} · {r.date}
          </Text>
        </View>
        <View style={styles.rating}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Ionicons key={i} name={i < Math.round(r.rating) ? 'star' : 'star-outline'} size={13} color={colors.accentAmber} />
          ))}
        </View>
      </View>
      <Text style={[styles.pSummary, { color: colors.text }]}>“{r.text}”</Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Layout.margin, paddingTop: 8 },
  hero: { alignItems: 'center', paddingTop: 22 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  name: { fontSize: 21, fontWeight: '600', letterSpacing: -0.4 },
  title: { fontSize: 14, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  meta: { fontSize: 13 },
  pills: { flexDirection: 'row', gap: 8, marginTop: 12 },
  stats: { flexDirection: 'row', alignSelf: 'stretch', marginTop: 18, paddingTop: 14, borderTopWidth: 1 },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statDiv: { width: 1 },
  statValue: { fontSize: 16, fontWeight: '600', fontVariant: ['tabular-nums'] },
  statLabel: { fontSize: 11 },
  gap: { marginTop: Layout.sectionGap },
  body: { fontSize: 14, lineHeight: 21 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pTitle: { fontSize: 15, fontWeight: '600' },
  pClient: { fontSize: 12, marginTop: 2 },
  pSummary: { fontSize: 13, lineHeight: 19, marginVertical: 12 },
  pFoot: { flexDirection: 'row', borderRadius: Radius.md, padding: 12, marginTop: 14 },
  pFootItem: { flex: 1, gap: 2 },
  pFootLabel: { fontSize: 11 },
  pFootValue: { fontSize: 14, fontWeight: '600', fontVariant: ['tabular-nums'] },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  rAuthor: { fontSize: 14, fontWeight: '600' },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: Layout.margin,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
