import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '@/components/ui-text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';
import { useRole } from '@/contexts/RoleContext';
import { FloatingTabBar, TabType } from '@/components/floating-tab-bar';
import { SearchBar } from '@/components/search-bar';
import { LatestJobCard } from '@/components/latest-job-card';
import { ProjectCard } from '@/components/project-card';
import { Appear, Button, Chip, GlassCard, IconButton, ScreenBackground, StatusPill, useNavClearance } from '@/components/ds';
import { Jobs, JobCategories } from '@/constants/jobs';
import { Projects, ProjectStatus, projectTotals, cedis } from '@/constants/projects';
import { Layout } from '@/constants/theme';

type Tab = 'open' | ProjectStatus;

/** The client's own job posts (demo). */
const MY_POSTS = [
  { id: 'j1', title: 'React Native Engineer (MoMo SDK)', budget: 'GH₵ 4,500', proposals: 3, posted: '2 days ago' },
  { id: 'j2', title: 'Checkout UX audit', budget: 'GH₵ 1,800', proposals: 7, posted: '5 days ago' },
];

export default function WorkScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isClient } = useRole();
  const navClearance = useNavClearance();
  const [tab, setTab] = useState<Tab>('open');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('See All');
  const [jobs, setJobs] = useState(Jobs);

  const byStatus = (s: ProjectStatus) => Projects.filter((p) => p.status === s);
  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'open', label: isClient ? 'My posts' : 'Find jobs', count: isClient ? MY_POSTS.length : Jobs.length },
    { id: 'active', label: 'Active', count: byStatus('active').length },
    { id: 'review', label: 'In review', count: byStatus('review').length },
    { id: 'completed', label: 'Completed', count: byStatus('completed').length },
  ];

  const openJobs = useMemo(() => {
    const q = query.toLowerCase().trim();
    return jobs.filter((j) => {
      if (category !== 'See All' && j.category !== category) return false;
      return !q || `${j.title} ${j.company.name} ${j.tags.join(' ')} ${j.location}`.toLowerCase().includes(q);
    });
  }, [category, jobs, query]);

  const activeEscrow = byStatus('active')
    .concat(byStatus('review'))
    .reduce((s, p) => s + projectTotals(p).inEscrow, 0);

  const onTab = (t: TabType) => {
    if (t === 'home') router.replace('/');
    if (t === 'chats') router.push('/messages');
    if (t === 'profile') router.push('/profile');
  };

  const projects = tab === 'open' ? [] : byStatus(tab);

  return (
    <View style={{ flex: 1 }}>
      <ScreenBackground />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <IconButton icon="chevron-back" accessibilityLabel="Go back" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
            <Text style={[styles.title, { color: colors.text }]} accessibilityRole="header">
              {isClient ? 'Projects' : 'My work'}
            </Text>
          </View>
          <IconButton icon="notifications-outline" accessibilityLabel="Notifications" badge onPress={() => router.push('/notifications')} />
        </View>

        <View style={styles.tabs}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.tabsContent, { alignItems: 'center' }]} accessibilityRole="tablist">
            {tabs.map((t) => (
              <Chip key={t.id} label={`${t.label} · ${t.count}`} selected={tab === t.id} onPress={() => setTab(t.id)} />
            ))}
          </ScrollView>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: Layout.margin, paddingBottom: navClearance }}>
          <Animated.View key={tab} entering={FadeIn.duration(220)}>
            {tab === 'open' && !isClient && (
              <>
                <SearchBar value={query} onChangeText={setQuery} placeholder="Search jobs, skills, companies..." />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cats} contentContainerStyle={styles.tabsContent}>
                  {JobCategories.map((c) => (
                    <Chip key={c} size="sm" label={c} selected={category === c} onPress={() => setCategory(c)} />
                  ))}
                </ScrollView>
                <Text style={[styles.count, { color: colors.textSecondary }]}>
                  {openJobs.length} open job{openJobs.length === 1 ? '' : 's'} · tap one for full details
                </Text>
                <View style={{ gap: 14 }}>
                  {openJobs.map((j, i) => (
                    <Appear key={j.id} index={i}>
                      <LatestJobCard
                        job={j}
                        layout="search"
                        onPress={() => router.push(`/job/${j.id}` as never)}
                        onApplyPress={() => router.push(`/job/${j.id}` as never)}
                        onBookmarkToggle={() => setJobs((prev) => prev.map((x) => (x.id === j.id ? { ...x, bookmarked: !x.bookmarked } : x)))}
                      />
                    </Appear>
                  ))}
                  {openJobs.length === 0 && <Empty icon="search" text="No jobs match. Try another skill or category." />}
                </View>
              </>
            )}

            {tab === 'open' && isClient && (
              <>
                <View style={styles.actions}>
                  <Button label="Post a job" size="md" style={{ flex: 1 }} icon={<Ionicons name="add" size={18} color="#FFFFFF" />} onPress={() => router.push('/job/create')} />
                  <Button
                    label="Find talent"
                    variant="light"
                    size="md"
                    style={{ flex: 1 }}
                    icon={<Ionicons name="people-outline" size={18} color={colors.text} />}
                    onPress={() => router.push('/explore')}
                  />
                </View>
                <View style={{ gap: 14 }}>
                  {MY_POSTS.map((post, i) => (
                    <Appear key={post.id} index={i}>
                      <GlassCard onPress={() => router.push('/job/applicants')} accessibilityLabel={`${post.title}, ${post.proposals} proposals`}>
                        <View style={styles.postTop}>
                          <StatusPill label="Hiring" tone="green" />
                          <Text style={[styles.postedAgo, { color: colors.textSecondary }]}>Posted {post.posted}</Text>
                        </View>
                        <Text style={[styles.postTitle, { color: colors.text }]}>{post.title}</Text>
                        <View style={styles.postFoot}>
                          <Text style={[styles.postBudget, { color: colors.text }]}>{post.budget}</Text>
                          <View style={styles.meta}>
                            <Ionicons name="people-outline" size={15} color={colors.primaryText} />
                            <Text style={[styles.link, { color: colors.primaryText }]}>{post.proposals} proposals</Text>
                            <Ionicons name="chevron-forward" size={15} color={colors.primaryText} />
                          </View>
                        </View>
                      </GlassCard>
                    </Appear>
                  ))}
                </View>
              </>
            )}

            {tab !== 'open' && (
              <>
                {(tab === 'active' || tab === 'review') && (
                  <View style={[styles.note, { backgroundColor: colors.primaryWash }]}>
                    <Ionicons name="shield-checkmark" size={16} color={colors.primaryText} />
                    <Text style={[styles.noteText, { color: colors.text }]}>{cedis(activeEscrow)} held in escrow across your open projects.</Text>
                  </View>
                )}
                <View style={{ gap: 14 }}>
                  {projects.map((p, i) => (
                    <Appear key={p.id} index={i}>
                      <ProjectCard project={p} asClient={isClient} onPress={() => router.push(`/project/${p.id}` as never)} />
                    </Appear>
                  ))}
                  {projects.length === 0 && <Empty icon="folder-open-outline" text="Nothing here yet." />}
                </View>
              </>
            )}
          </Animated.View>
        </ScrollView>
      </SafeAreaView>

      <FloatingTabBar activeTab="jobs" onSelectTab={onTab} onCenterActionPress={() => router.push('/assistant')} />
    </View>
  );
}

function Empty({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  const { colors } = useTheme();
  return (
    <GlassCard style={styles.empty}>
      <Ionicons name={icon} size={24} color={colors.primary} />
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{text}</Text>
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
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { fontSize: 26, fontWeight: '700', letterSpacing: -0.6 },
  tabs: { height: 52, justifyContent: 'center', marginBottom: 6 },
  tabsContent: { gap: 8, paddingHorizontal: Layout.margin },
  cats: { flexGrow: 0, marginTop: 14, marginHorizontal: -Layout.margin },
  count: { fontSize: 13, marginTop: 16, marginBottom: 12 },
  actions: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  postTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  postedAgo: { fontSize: 12 },
  postTitle: { fontSize: 16, fontWeight: '600', marginTop: 12 },
  postFoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  postBudget: { fontSize: 15, fontWeight: '600' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  link: { fontSize: 13, fontWeight: '600' },
  note: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 16, marginBottom: 14 },
  noteText: { flex: 1, fontSize: 13 },
  empty: { alignItems: 'center', gap: 8, paddingVertical: 28 },
  emptyText: { fontSize: 14, textAlign: 'center' },
});
