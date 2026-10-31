import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useRole } from '@/contexts/RoleContext';
import { useVerification } from '@/contexts/VerificationContext';

import { DevPayHeader } from '@/components/devpay-header';
import { ReminderCard } from '@/components/reminder-card';
import { SearchBar } from '@/components/search-bar';
import { CategoryPills } from '@/components/category-pills';
import { RecommendedJobCard, RECOMMENDED_CARD_WIDTH } from '@/components/recommended-job-card';
import { LatestJobCard } from '@/components/latest-job-card';
import { FloatingTabBar, TabType } from '@/components/floating-tab-bar';
import { Toast, useToast } from '@/components/toast';
import { JobCardSkeleton } from '@/components/skeleton';
import {
  Appear,
  AvatarStack,
  Button,
  GlassCard,
  ListRow,
  PressableScale,
  ScreenBackground,
  SectionHeader,
  Sheet,
  StatusPill,
  useNavClearance,
} from '@/components/ds';
import { Jobs, JobCategories, Job } from '@/constants/jobs';
import { ApplicantFaces } from '@/constants/media';
import { Gradients, Layout, Radius, Shadows } from '@/constants/theme';

const LOCATIONS = ['East Legon, Accra', 'Osu, Accra', 'Airport City, Accra', 'Kumasi', 'Tema', 'Takoradi', 'Remote'];

export default function HomeScreen() {
  const router = useRouter();
  const { toastRef, show: showToast } = useToast();
  const { colors } = useTheme();
  const { isClient } = useRole();
  const navClearance = useNavClearance();

  const [searchQuery, setSearchQuery] = useState('');
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('See All');
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [jobs, setJobs] = useState<Job[]>(Jobs);
  const [location, setLocation] = useState('East Legon, Accra');
  const [locationOpen, setLocationOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  };

  const toggleBookmark = (id: string) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id !== id) return j;
        const next = !j.bookmarked;
        showToast({
          title: next ? 'Job saved' : 'Removed from saved',
          message: next ? 'Find it anytime under Saved.' : 'Job removed from your saved list.',
          type: next ? 'success' : 'info',
        });
        return { ...j, bookmarked: next };
      })
    );
  };

  const q = searchQuery.toLowerCase().trim();
  const filtered = jobs.filter((job) => {
    const matchesSearch =
      !q ||
      job.title.toLowerCase().includes(q) ||
      job.company.name.toLowerCase().includes(q) ||
      job.tags.some((t) => t.toLowerCase().includes(q));
    const matchesCategory = selectedCategory === 'See All' || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  const recommended = filtered.slice(0, 3);
  const latest = filtered.slice(3).length ? filtered.slice(3) : filtered.slice(0, 1);

  const handleTabSelect = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'jobs') router.push(isClient ? '/explore' : '/contracts');
    if (tab === 'chats') router.push('/messages');
    if (tab === 'profile') router.push('/profile');
  };

  const openJob = (id: string) => router.push(`/job/${id}` as any);

  return (
    <View style={styles.screen}>
      <ScreenBackground />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <DevPayHeader
          location={location}
          onLocationPress={() => setLocationOpen(true)}
          unreadCount={2}
          onNotificationPress={() => router.push('/notifications')}
          onProfilePress={() => router.push('/profile')}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: navClearance }]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
          }>
          {isClient ? (
            <ClientDashboard
              query={clientSearchQuery}
              onQuery={setClientSearchQuery}
            />
          ) : (
            <>
              <ReminderCard
                subtitle="Milestone 2 due in 2 hours"
                countdown="945"
                onPress={() => router.push('/contracts')}>
                <SearchBar
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onFilterPress={() => router.push('/explore')}
                />
              </ReminderCard>

              <View style={{ marginTop: 16 }}>
                <CategoryPills
                  categories={JobCategories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </View>

              {filtered.length === 0 ? (
                <GlassCard style={styles.empty}>
                  <View style={[styles.emptyIcon, { backgroundColor: colors.primarySoft }]}>
                    <Ionicons name="search" size={24} color={colors.primary} />
                  </View>
                  <Text style={[styles.emptyTitle, { color: colors.text }]}>No jobs match</Text>
                  <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
                    Nothing for “{searchQuery || selectedCategory}”. Try another skill or clear the filters.
                  </Text>
                  <Button
                    label="Clear filters"
                    variant="soft"
                    size="md"
                    onPress={() => {
                      setSearchQuery('');
                      setSelectedCategory('See All');
                    }}
                  />
                </GlassCard>
              ) : (
                <>
                  <SectionHeader title="Recommended" icon="rocket" onSeeAll={() => router.push('/explore')} style={styles.sectionGap} />
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={RECOMMENDED_CARD_WIDTH + 14}
                    decelerationRate="fast"
                    style={styles.carousel}
                    contentContainerStyle={styles.carouselContent}>
                    {isLoading
                      ? [0, 1].map((i) => (
                          <View key={i} style={{ width: RECOMMENDED_CARD_WIDTH }}>
                            <JobCardSkeleton />
                          </View>
                        ))
                      : recommended.map((job, i) => (
                          <Appear key={job.id} index={i}>
                            <RecommendedJobCard
                              job={job}
                              featured={i === 0}
                              onPress={() => openJob(job.id)}
                              onBookmarkToggle={() => toggleBookmark(job.id)}
                              onApplyPress={() => openJob(job.id)}
                            />
                          </Appear>
                        ))}
                  </ScrollView>

                  <SectionHeader title="Latest Post" icon="pin" iconColor={colors.accentCoral} onSeeAll={() => router.push('/explore')} style={styles.sectionGap} />
                  <View style={{ gap: 14 }}>
                    {isLoading ? (
                      <JobCardSkeleton />
                    ) : (
                      latest.map((job, i) => (
                        <Appear key={job.id} index={i + 2}>
                          <LatestJobCard job={job} onPress={() => openJob(job.id)} onBookmarkToggle={() => toggleBookmark(job.id)} />
                        </Appear>
                      ))
                    )}
                  </View>
                </>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>

      <FloatingTabBar
        activeTab={activeTab}
        onSelectTab={handleTabSelect}
        onCenterActionPress={() => router.push(isClient ? '/job/create' : '/explore')}
      />
      <Sheet visible={locationOpen} onClose={() => setLocationOpen(false)} title="Your location">
        {LOCATIONS.map((l, i) => (
          <ListRow
            key={l}
            icon="location-outline"
            label={l}
            last={i === LOCATIONS.length - 1}
            right={l === location ? <Ionicons name="checkmark-circle" size={20} color={colors.primary} /> : undefined}
            onPress={() => {
              setLocation(l);
              setLocationOpen(false);
            }}
          />
        ))}
      </Sheet>
      <Toast ref={toastRef} />
    </View>
  );
}

function ClientDashboard({ query, onQuery }: { query: string; onQuery: (q: string) => void }) {
  const router = useRouter();
  const { colors } = useTheme();
  const { verified } = useVerification();

  const quick = [
    { icon: 'document-text' as const, label: 'Post job', to: '/job/create' },
    { icon: 'briefcase' as const, label: 'Contracts', to: '/contracts' },
    { icon: 'wallet' as const, label: 'Fund escrow', to: '/payment' },
    { icon: 'shield-checkmark' as const, label: 'Disputes', to: '/settings' },
  ];

  return (
    <View>
      <SearchBar
        value={query}
        onChangeText={onQuery}
        placeholder="Search verified talent..."
        onFilterPress={() => router.push('/explore')}
        onSubmitEditing={() => router.push('/explore')}
      />

      <View style={[styles.escrowCard, Shadows.lifted]}>
        <LinearGradient colors={Gradients.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.escrowInner}>
          <View style={styles.rowBetween}>
            <Text style={styles.escrowLabel}>Held in escrow</Text>
            <View style={styles.escrowBadge}>
              <Text style={styles.escrowBadgeText}>3 active contracts</Text>
            </View>
          </View>
          <Text style={styles.escrowAmount}>GH₵ 28,500.00</Text>
          <View style={styles.escrowSplit}>
            <View style={{ flex: 1 }}>
              <Text style={styles.escrowSmall}>Released</Text>
              <Text style={styles.escrowSmallVal}>GH₵ 14,200</Text>
            </View>
            <View style={styles.escrowDivider} />
            <View style={{ flex: 1, paddingLeft: 16 }}>
              <Text style={styles.escrowSmall}>Awaiting release</Text>
              <Text style={styles.escrowSmallVal}>GH₵ 14,300</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {!verified && (
        <GlassCard onPress={() => router.push('/verification')} style={styles.verifyCard} accessibilityLabel="Get verified to hire">
          <View style={[styles.verifyIcon, { backgroundColor: colors.primaryWash }]}>
            <Ionicons name="shield-checkmark" size={20} color={colors.primaryText} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardTitle, { color: colors.text, marginTop: 0 }]}>Get verified to hire</Text>
            <Text style={[styles.cardSub, { color: colors.textSecondary, marginTop: 2 }]}>Unlock hiring and larger escrows</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </GlassCard>
      )}

      <View style={styles.quickRow}>
        {quick.map((a) => (
          <PressableScale key={a.label} onPress={() => router.push(a.to as any)} style={styles.quickItem} accessibilityLabel={a.label}>
            <View style={[styles.quickIcon, { backgroundColor: colors.surface }, Shadows.button]}>
              <Ionicons name={a.icon} size={21} color={colors.navActive} />
            </View>
            <Text style={[styles.quickLabel, { color: colors.textSecondary }]}>{a.label}</Text>
          </PressableScale>
        ))}
      </View>

      <SectionHeader title="Needs your review" style={styles.sectionGap} />
      <GlassCard onPress={() => router.push('/contracts/review')}>
        <View style={styles.rowBetween}>
          <StatusPill label="Submitted for review" tone="amber" icon="time" />
          <Text style={[styles.amount, { color: colors.text }]}>GH₵ 2,000</Text>
        </View>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Mobile App UI/UX Redesign</Text>
        <Text style={[styles.cardSub, { color: colors.textSecondary }]}>
          Milestone 2 from Ama Owusu. Figma file and demo video attached.
        </Text>
        <View style={[styles.rowBetween, { marginTop: 14 }]}>
          <Text style={[styles.cardMeta, { color: colors.accentAmber }]}>Auto-releases in 7 days</Text>
          <View style={styles.row4}>
            <Text style={[styles.link, { color: colors.primaryText }]}>Review & release</Text>
            <Ionicons name="arrow-forward" size={15} color={colors.primaryText} />
          </View>
        </View>
      </GlassCard>

      <SectionHeader title="Open jobs" onSeeAll={() => router.push('/job/applicants')} actionLabel="Proposals" style={styles.sectionGap} />
      <GlassCard onPress={() => router.push('/job/applicants')}>
        <View style={styles.rowBetween}>
          <StatusPill label="Hiring" tone="green" />
          <Text style={[styles.amount, { color: colors.text }]}>GH₵ 4,500</Text>
        </View>
        <Text style={[styles.cardTitle, { color: colors.text }]}>React Native Engineer (MoMo SDK)</Text>
        <Text style={[styles.cardSub, { color: colors.textSecondary }]}>
          3 Ghana Card verified freelancers applied.
        </Text>
        <View style={[styles.rowBetween, { marginTop: 14 }]}>
          <AvatarStack uris={ApplicantFaces} />
          <View style={styles.row4}>
            <Text style={[styles.link, { color: colors.primaryText }]}>Compare proposals</Text>
            <Ionicons name="chevron-forward" size={15} color={colors.primaryText} />
          </View>
        </View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: { paddingHorizontal: Layout.margin, paddingTop: 12 },
  sectionGap: { marginTop: Layout.sectionGap },
  carousel: { marginHorizontal: -Layout.margin, marginBottom: -10, flexGrow: 0, overflow: 'visible' },
  carouselContent: { gap: 14, paddingHorizontal: Layout.margin, paddingTop: 4, paddingBottom: 28 },
  empty: { marginTop: 24, alignItems: 'center', paddingVertical: 32, gap: 8 },
  emptyIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  emptyTitle: { fontSize: 17, fontWeight: '600' },
  emptySub: { fontSize: 13, lineHeight: 19, textAlign: 'center', marginBottom: 8, maxWidth: 260 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  row4: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  escrowCard: { marginTop: 18, borderRadius: Radius.xl },
  escrowInner: { borderRadius: Radius.xl, padding: 20, gap: 6 },
  escrowLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '500' },
  escrowBadge: { backgroundColor: 'rgba(255,255,255,0.22)', paddingHorizontal: 10, height: 26, borderRadius: Radius.pill, justifyContent: 'center' },
  escrowBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '500' },
  escrowAmount: { color: '#FFFFFF', fontSize: 30, fontWeight: '600', letterSpacing: -0.8, fontVariant: ['tabular-nums'] },
  escrowSplit: { flexDirection: 'row', marginTop: 12, paddingTop: 14, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.25)' },
  escrowDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.25)' },
  escrowSmall: { color: 'rgba(255,255,255,0.82)', fontSize: 12 },
  escrowSmallVal: { color: '#FFFFFF', fontSize: 15, fontWeight: '600', marginTop: 2, fontVariant: ['tabular-nums'] },
  verifyCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16 },
  verifyIcon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  quickRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  quickItem: { alignItems: 'center', gap: 8, width: 74 },
  quickIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { fontSize: 12 },
  amount: { fontSize: 15, fontWeight: '600', fontVariant: ['tabular-nums'] },
  cardTitle: { fontSize: 16, fontWeight: '600', marginTop: 12, letterSpacing: -0.2 },
  cardSub: { fontSize: 13, lineHeight: 19, marginTop: 4 },
  cardMeta: { fontSize: 12, fontWeight: '500' },
  link: { fontSize: 13, fontWeight: '500' },
});
