import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { useRole } from '@/contexts/RoleContext';
import { SearchBar } from '@/components/search-bar';
import { LatestJobCard } from '@/components/latest-job-card';
import {
  ApplyCorner,
  Appear,
  Avatar,
  Chip,
  GlassCard,
  IconButton,
  ListRow,
  ScreenBackground,
  Sheet,
  SectionHeader,
  Segmented,
} from '@/components/ds';
import { Jobs, Job } from '@/constants/jobs';
import { CurrentUser } from '@/constants/media';
import { TalentList, Talent } from '@/constants/talent';
import { Layout } from '@/constants/theme';

const JOB_CHIPS = ['UI/UX Designer', 'Mobile Dev', 'Graphic Designer', 'Hybrid', 'Remote'];
const TALENT_CHIPS = ['All', 'Mobile', 'Design', 'Backend'];
const APPLIED_IDS = ['2', '4'];

type Sort = 'Recently' | 'Highest budget';
type Shelf = 'saved' | 'applied';

const budgetFloor = (j: Job) => Number(j.budget.replace(/[^\d,-]/g, '').split('-')[0].replace(/,/g, '')) || 0;

export default function ExploreScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isClient } = useRole();
  const insets = useSafeAreaInsets();
  const narrow = useWindowDimensions().width < 370;

  const [query, setQuery] = useState('');
  const [chip, setChip] = useState<string | null>(isClient ? 'All' : 'UI/UX Designer');
  const [sort, setSort] = useState<Sort>('Recently');
  const [showFilters, setShowFilters] = useState(false);
  const [shelf, setShelf] = useState<Shelf | null>(null);
  const [jobs, setJobs] = useState(Jobs);
  const [voiceOpen, setVoiceOpen] = useState(false);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    let list = jobs.filter((j) => {
      const hay = `${j.title} ${j.company.name} ${j.tags.join(' ')} ${j.workplace} ${j.category}`.toLowerCase();
      if (q && !hay.includes(q)) return false;
      if (shelf === 'saved' && !j.bookmarked) return false;
      if (shelf === 'applied' && !APPLIED_IDS.includes(j.id)) return false;
      if (!chip) return true;
      if (chip === 'UI/UX Designer' || chip === 'Graphic Designer') return j.category === 'UI/UX Design';
      if (chip === 'Mobile Dev') return j.category === 'Tech & Dev';
      return hay.includes(chip.toLowerCase());
    });
    if (sort === 'Highest budget') list = [...list].sort((a, b) => budgetFloor(b) - budgetFloor(a));
    return list;
  }, [jobs, query, chip, sort, shelf]);

  const talent = TalentList.filter((t) => {
    const q = query.toLowerCase().trim();
    const hay = `${t.name} ${t.title} ${t.skills.join(' ')}`.toLowerCase();
    if (q && !hay.includes(q)) return false;
    if (chip === 'Mobile') return /mobile|react native/.test(hay);
    if (chip === 'Design') return /design|figma/.test(hay);
    if (chip === 'Backend') return /node|nest|postgres/.test(hay);
    return true;
  });

  const toggleBookmark = (id: string) =>
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, bookmarked: !j.bookmarked } : j)));

  const count = isClient ? talent.length : results.length;
  const chips = isClient ? TALENT_CHIPS : JOB_CHIPS;

  return (
    <View style={styles.screen}>
      <ScreenBackground />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={styles.searchRow}>
          <IconButton
            icon="chevron-back"
            accessibilityLabel="Go back"
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          />
          <SearchBar
            value={query}
            onChangeText={setQuery}
            placeholder={isClient ? 'Search talent, skills...' : 'Search Here...'}
            style={{ flex: 1 }}
            right={
              <View style={styles.searchRight}>
                <Pressable
                  onPress={() => setVoiceOpen(true)}
                  accessibilityRole="button"
                  accessibilityLabel="Search by voice"
                  style={[styles.mic, { backgroundColor: colors.primarySoft }]}>
                  <Ionicons name="mic" size={18} color={colors.primary} />
                </Pressable>
                {!narrow && (
                  <Pressable onPress={() => router.push('/profile')} accessibilityRole="button" accessibilityLabel="Open profile">
                    <Avatar uri={CurrentUser.avatar} size={40} ring={false} />
                  </Pressable>
                )}
              </View>
            }
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: Layout.margin, paddingBottom: insets.bottom + 110 }}>
          <View style={styles.filterRow}>
            <Pressable
              onPress={() => setShowFilters((s) => !s)}
              style={styles.row6}
              accessibilityRole="button"
              accessibilityState={{ expanded: showFilters }}>
              <Ionicons name="funnel-outline" size={17} color={colors.text} />
              <Text style={[styles.filterText, { color: colors.text }]}>Filters</Text>
              <Ionicons name={showFilters ? 'chevron-up' : 'chevron-down'} size={16} color={colors.text} />
            </Pressable>
            {!isClient && (
              <Pressable
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  setSort((s) => (s === 'Recently' ? 'Highest budget' : 'Recently'));
                }}
                style={styles.row6}
                accessibilityRole="button"
                accessibilityLabel={`Sort: ${sort}`}>
                <Text style={[styles.filterText, { color: colors.text }]}>{sort}</Text>
                <Ionicons name="chevron-down" size={16} color={colors.text} />
              </Pressable>
            )}
          </View>

          {showFilters && (
            <GlassCard style={styles.filterPanel}>
              <Text style={[styles.panelLabel, { color: colors.textSecondary }]}>Workplace</Text>
              <View style={styles.wrap}>
                {['Remote', 'Hybrid', 'On-Site'].map((w) => (
                  <Chip key={w} size="sm" label={w} selected={chip === w} onPress={() => setChip(chip === w ? null : w)} />
                ))}
              </View>
              <Text style={[styles.panelLabel, { color: colors.textSecondary, marginTop: 12 }]}>Contract</Text>
              <View style={styles.wrap}>
                {['Fixed-Price', 'Full-time', 'Milestone'].map((w) => (
                  <Chip key={w} size="sm" label={w} selected={chip === w} onPress={() => setChip(chip === w ? null : w)} />
                ))}
              </View>
            </GlassCard>
          )}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chips}
            contentContainerStyle={styles.chipsContent}>
            {chips.map((c) => (
              <Chip key={c} label={c} selected={chip === c} onPress={() => setChip(chip === c && !isClient ? null : c)} />
            ))}
          </ScrollView>

          <SectionHeader
            title={isClient ? `${count} Verified Freelancers` : `${count} Jobs Found`}
            onSeeAll={() => {
              setChip(isClient ? 'All' : null);
              setShelf(null);
              setQuery('');
            }}
            style={{ marginTop: 20 }}
          />

          <View style={{ gap: 14 }}>
            {isClient
              ? talent.map((t, i) => (
                  <Appear key={t.id} index={i}>
                  <TalentCard
                    talent={t}
                    onPress={() => router.push(`/talent/${t.id}` as any)}
                    onMessage={() => router.push(`/chat/${t.threadId}` as any)}
                  />
                  </Appear>
                ))
              : results.map((job, i) => (
                  <Appear key={job.id} index={i}>
                    <LatestJobCard
                      job={job}
                      layout="search"
                      onPress={() => router.push(`/job/${job.id}` as any)}
                      onBookmarkToggle={() => toggleBookmark(job.id)}
                    />
                  </Appear>
                ))}
            {count === 0 && (
              <GlassCard style={{ alignItems: 'center', paddingVertical: 28, gap: 6 }}>
                <Ionicons name="search" size={22} color={colors.primary} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>
                  {shelf === 'saved' ? 'No saved jobs yet' : shelf === 'applied' ? 'No applications yet' : 'No matches'}
                </Text>
                <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
                  {shelf ? 'Tap the bookmark on any job to keep it here.' : 'Try a different skill or clear your filters.'}
                </Text>
              </GlassCard>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      {!isClient && (
        <View style={[styles.shelf, { bottom: Math.max(insets.bottom, 16) + 8 }]} pointerEvents="box-none">
          <Segmented<Shelf>
            variant="cta"
            value={shelf}
            onChange={(v) => setShelf((s) => (s === v ? null : v))}
            options={[
              { value: 'saved', label: 'Saved', icon: 'briefcase' },
              { value: 'applied', label: 'Applied', icon: 'document-text-outline' },
            ]}
            style={{ width: 230 }}
          />
        </View>
      )}
      <Sheet visible={voiceOpen} onClose={() => setVoiceOpen(false)} title="Search by voice">
        <View style={styles.voice}>
          <View style={[styles.voiceMic, { backgroundColor: colors.primarySoft }]}>
            <Ionicons name="mic" size={30} color={colors.primary} />
          </View>
          <Text style={[styles.voiceText, { color: colors.textSecondary }]}>
            Voice search isn’t available yet. Try a popular search instead.
          </Text>
        </View>
        {(isClient ? ['React Native', 'Figma designer', 'Node.js backend'] : ['UI/UX Designer', 'React Native', 'Remote writing']).map((q, i, arr) => (
          <ListRow
            key={q}
            icon="search-outline"
            label={q}
            last={i === arr.length - 1}
            onPress={() => {
              setQuery(q);
              setChip(isClient ? 'All' : null);
              setVoiceOpen(false);
            }}
          />
        ))}
      </Sheet>
    </View>
  );
}

function TalentCard({ talent, onPress, onMessage }: { talent: Talent; onPress: () => void; onMessage: () => void }) {
  const { colors } = useTheme();
  return (
    <GlassCard onPress={onPress} style={{ paddingBottom: 0 }} accessibilityLabel={`${talent.name}, ${talent.title}`}>
      <View style={styles.talentTop}>
        <Avatar uri={talent.avatar} size={48} online={talent.available} />
        <View style={{ flex: 1, gap: 2 }}>
          <View style={styles.row6}>
            <Text style={[styles.talentName, { color: colors.text }]}>{talent.name}</Text>
            {talent.verified && <MaterialCommunityIcons name="check-decagram" size={15} color={colors.primary} />}
          </View>
          <Text style={[styles.talentSub, { color: colors.textSecondary }]} numberOfLines={1}>
            {talent.title}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 8 }}>
          <View style={styles.rating}>
            <Ionicons name="star" size={13} color={colors.accentAmber} />
            <Text style={[styles.ratingText, { color: colors.text }]}>{talent.rating.toFixed(1)}</Text>
          </View>
          <IconButton icon="chatbubble-ellipses-outline" size={34} iconSize={16} accessibilityLabel={`Message ${talent.name}`} onPress={onMessage} />
        </View>
      </View>
      <View style={[styles.wrap, { marginTop: 12 }]}>
        {talent.skills.map((s) => (
          <Chip key={s} size="sm" label={s} />
        ))}
      </View>
      <View style={styles.talentBottom}>
        <Text style={[styles.rate, { color: colors.text }]}>
          {talent.rate} <Text style={{ color: colors.textSecondary, fontWeight: '400' }}>/ hr · {talent.city}</Text>
        </Text>
        <ApplyCorner label="View profile" onPress={onPress} />
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: Layout.margin, paddingTop: 8, paddingBottom: 6 },
  searchRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  mic: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  filterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
  row6: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  filterText: { fontSize: 14 },
  filterPanel: { marginTop: 12 },
  panelLabel: { fontSize: 12, fontWeight: '500', marginBottom: 8 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chips: { marginHorizontal: -Layout.margin, marginTop: 14, flexGrow: 0 },
  chipsContent: { gap: 10, paddingHorizontal: Layout.margin },
  emptyTitle: { fontSize: 16, fontWeight: '600' },
  emptySub: { fontSize: 13, textAlign: 'center' },
  voice: { alignItems: 'center', gap: 12, paddingVertical: 8, marginBottom: 6 },
  voiceMic: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  voiceText: { fontSize: 13, textAlign: 'center', lineHeight: 19, maxWidth: 280 },
  shelf: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  talentTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  talentName: { fontSize: 16, fontWeight: '600' },
  talentSub: { fontSize: 13 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { fontSize: 13, fontWeight: '600' },
  talentBottom: { height: 56, marginHorizontal: -16, paddingLeft: 16, justifyContent: 'center', marginTop: 8 },
  rate: { fontSize: 14, fontWeight: '600' },
});
