import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useRole } from '@/contexts/RoleContext';
import * as Haptics from 'expo-haptics';

import { DevPayHeader } from '@/components/devpay-header';
import { ReminderCard } from '@/components/reminder-card';
import { SearchBar } from '@/components/search-bar';
import { CategoryPills } from '@/components/category-pills';
import { RecommendedJobCard, RecommendedJob } from '@/components/recommended-job-card';
import { LatestJobCard, LatestJob } from '@/components/latest-job-card';
import { FloatingTabBar, TabType } from '@/components/floating-tab-bar';
import { Toast, useToast } from '@/components/toast';
import { JobCardSkeleton } from '@/components/skeleton';

export default function HomeScreen() {
  const router = useRouter();
  const { toastRef, show: showToast } = useToast();
  const { isDark, colors } = useTheme();
  const { isClient } = useRole();

  const [searchQuery, setSearchQuery] = useState('');
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('See All');
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Initial content fetch simulation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 900);
  };

  const categories = [
    'See All',
    'Tech & Dev',
    'UI/UX Design',
    'Mobile Apps',
    'Writing',
    'Marketing',
  ];

  const [recommendedJobs, setRecommendedJobs] = useState<RecommendedJob[]>([
    {
      id: '1',
      company: 'Google Africa',
      location: 'Accra',
      isTrusted: true,
      logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120',
      title: 'Senior UI/UX Designer',
      salary: 'GH₵ 3,500 - 5,000 / Milestone',
      applicantCount: 12,
      isBookmarked: true,
    },
    {
      id: '2',
      company: 'Telecel Digital Labs',
      location: 'Kumasi (Remote)',
      isTrusted: true,
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120',
      title: 'Mobile Engineer (MoMo SDK)',
      salary: 'GH₵ 4,000 - 6,500 / Milestone',
      applicantCount: 8,
      isBookmarked: false,
    },
    {
      id: '3',
      company: 'MTN Ghana Group',
      location: 'Accra (Hybrid)',
      isTrusted: true,
      logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=120',
      title: 'Full Stack React Native Dev',
      salary: 'GH₵ 5,000 - 8,000 / Milestone',
      applicantCount: 19,
      isBookmarked: false,
    },
  ]);

  const [latestJobs, setLatestJobs] = useState<LatestJob[]>([
    {
      id: '4',
      company: 'Paystack Africa',
      location: 'Remote (Ghana)',
      isTrusted: true,
      logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120',
      title: 'Senior TypeScript & Expo Engineer',
      salary: 'GH₵ 6,000.00 / Milestone',
      tags: ['TypeScript', 'Expo SDK'],
      applicantCount: 5,
    },
    {
      id: '5',
      company: 'Hubtel Logistics',
      location: 'East Legon, Accra',
      isTrusted: true,
      logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=120',
      title: 'Mobile App Performance Architect',
      salary: 'GH₵ 4,500.00 / Milestone',
      tags: ['React Native', 'Reanimated'],
      applicantCount: 11,
    },
  ]);

  const toggleRecommendedBookmark = (id: string) => {
    setRecommendedJobs((prev) =>
      prev.map((j) => {
        if (j.id !== id) return j;
        const next = !j.isBookmarked;
        showToast({
          title: next ? 'Job Saved!' : 'Removed from saved',
          message: next ? 'Find it anytime in your saved jobs.' : 'Job removed from your saved list.',
          type: next ? 'success' : 'info',
        });
        return { ...j, isBookmarked: next };
      })
    );
  };

  const toggleLatestBookmark = (id: string) => {
    setLatestJobs((prev) =>
      prev.map((j) => {
        if (j.id !== id) return j;
        const next = !j.isBookmarked;
        showToast({
          title: next ? 'Job Saved!' : 'Removed from saved',
          message: next ? 'Tap Chats to follow up with the client.' : 'Removed from your saved list.',
          type: next ? 'success' : 'info',
        });
        return { ...j, isBookmarked: next };
      })
    );
  };

  const filteredRecommendedJobs = recommendedJobs.filter((job) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q);
    const matchesCategory =
      selectedCategory === 'See All' ||
      job.title.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const filteredLatestJobs = latestJobs.filter((job) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.tags.some((t) => t.toLowerCase().includes(q));
    const matchesCategory =
      selectedCategory === 'See All' ||
      job.tags.some((t) => t.toLowerCase().includes(selectedCategory.toLowerCase())) ||
      job.title.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const handleTabSelect = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'jobs') {
      if (isClient) {
        router.push('/explore');
      } else {
        router.push('/contracts');
      }
    }
    if (tab === 'chats') router.push('/messages');
    if (tab === 'profile') router.push('/profile');
    if (tab === 'action') {
      if (isClient) {
        router.push('/job/create');
      } else {
        router.push('/explore');
      }
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top App Header */}
        <DevPayHeader
          location="Accra, Ghana"
          unreadCount={2}
          onNotificationPress={() => router.push('/notifications')}
          onProfilePress={() => router.push('/profile')}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }>

          {/* ========================================================================= */}
          {/* CLIENT DASHBOARD MODE                                                     */}
          {/* ========================================================================= */}
          {isClient ? (
            <View style={styles.clientDashboard}>
              {/* Client Escrow Hero Card */}
              <LinearGradient
                colors={isDark ? ['#1E1B4B', '#0F172A'] : ['#0F73F7', '#1D4ED8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.clientHeroCard}>
                <View style={styles.clientHeroTop}>
                  <View>
                    <Text style={styles.clientHeroSub}>TOTAL ESCROW SECURED</Text>
                    <Text style={styles.clientHeroAmount}>GH₵ 28,500.00</Text>
                  </View>
                  <View style={styles.activeContractsBadge}>
                    <Text style={styles.activeContractsText}>3 ACTIVE</Text>
                  </View>
                </View>

                <View style={styles.clientStatsRow}>
                  <View style={styles.clientStatItem}>
                    <Text style={styles.clientStatVal}>GH₵ 14,200.00</Text>
                    <Text style={styles.clientStatLabel}>Released to Date</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.clientStatItem}>
                    <Text style={styles.clientStatVal}>GH₵ 14,300.00</Text>
                    <Text style={styles.clientStatLabel}>In Active Escrow</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.postJobBtn}
                  onPress={() => router.push('/job/create')}
                  activeOpacity={0.9}>
                  <LinearGradient
                    colors={['#38BDF8', '#0F73F7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.postJobGradient}>
                    <Ionicons name="add-circle" size={18} color="#FFFFFF" />
                    <Text style={styles.postJobText}>Post New Milestone Contract</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>

              {/* Client Search for Verified Developers & Skills */}
              <SearchBar
                value={clientSearchQuery}
                onChangeText={setClientSearchQuery}
                onFilterPress={() => router.push('/explore')}
                placeholder="Search verified talent, React Native, UI/UX…"
                onSubmitEditing={() => router.push('/explore')}
              />
              {clientSearchQuery.trim().length > 0 && (
                <TouchableOpacity
                  style={[styles.clientSearchDirectBtn, { backgroundColor: colors.surface, borderColor: colors.primary }]}
                  onPress={() => router.push('/explore')}
                  activeOpacity={0.85}>
                  <Ionicons name="search" size={16} color={colors.primary} />
                  <Text style={[styles.clientSearchDirectText, { color: colors.text }]}>
                    Find developers matching <Text style={{ color: colors.primary, fontWeight: '800' }}>&ldquo;{clientSearchQuery}&rdquo;</Text> in Directory
                  </Text>
                  <Ionicons name="arrow-forward" size={14} color={colors.primary} />
                </TouchableOpacity>
              )}

              {/* Action Required: Deliverable Awaiting Review */}
              <View style={styles.sectionHeaderRow}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Action Required ⚡
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.reviewActionCard,
                  { backgroundColor: colors.surface, borderColor: '#F59E0B' },
                ]}
                onPress={() => router.push('/contracts/review')}
                activeOpacity={0.88}>
                <View style={styles.reviewHeader}>
                  <View style={styles.pendingBadge}>
                    <Ionicons name="time" size={12} color="#D97706" />
                    <Text style={styles.pendingBadgeText}>SUBMITTED FOR REVIEW</Text>
                  </View>
                  <Text style={[styles.reviewAmount, { color: colors.primary }]}>
                    GH₵ 2,000.00
                  </Text>
                </View>

                <Text style={[styles.reviewTitle, { color: colors.text }]}>
                  Mobile App UI/UX Redesign
                </Text>
                <Text style={[styles.reviewSubtitle, { color: colors.textSecondary }]}>
                  Milestone 2 submitted by Kwame Mensah. Pull request and live demo attached.
                </Text>

                <View style={styles.reviewFooter}>
                  <Text style={styles.reviewTimeLeft}>7 days to auto-release</Text>
                  <View style={styles.reviewCta}>
                    <Text style={styles.reviewCtaText}>Review & Release</Text>
                    <Ionicons name="arrow-forward" size={14} color="#0F73F7" />
                  </View>
                </View>
              </TouchableOpacity>

              {/* Active Job Posts with Proposals */}
              <View style={[styles.sectionHeaderRow, { marginTop: 18 }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Active Job Openings (1)
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.clientJobCard,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
                onPress={() => router.push('/job/applicants')}
                activeOpacity={0.88}>
                <View style={styles.clientJobTop}>
                  <View style={styles.jobTagRow}>
                    <View style={styles.openPill}>
                      <Text style={styles.openPillText}>HIRING OPEN</Text>
                    </View>
                    <Text style={[styles.applicantCountPill, { color: colors.primary }]}>
                      3 Proposals
                    </Text>
                  </View>
                  <Text style={[styles.clientJobBudget, { color: colors.primary }]}>
                    GH₵ 4,500.00
                  </Text>
                </View>

                <Text style={[styles.clientJobTitle, { color: colors.text }]}>
                  Senior React Native Engineer (MoMo SDK)
                </Text>
                <Text style={[styles.clientJobSub, { color: colors.textSecondary }]}>
                  3 Ghana Card verified developers applied. Compare proposals and hire.
                </Text>

                <View style={[styles.cardDivider, { backgroundColor: colors.border }]} />

                <View style={styles.clientJobBottom}>
                  <View style={styles.applicantAvatars}>
                    <View style={[styles.miniAvatar, { backgroundColor: '#0F73F7' }]}>
                      <Text style={styles.miniAvatarText}>KM</Text>
                    </View>
                    <View style={[styles.miniAvatar, { backgroundColor: '#9333EA', marginLeft: -8 }]}>
                      <Text style={styles.miniAvatarText}>AS</Text>
                    </View>
                    <View style={[styles.miniAvatar, { backgroundColor: '#10B981', marginLeft: -8 }]}>
                      <Text style={styles.miniAvatarText}>EO</Text>
                    </View>
                  </View>
                  <View style={styles.reviewCta}>
                    <Text style={styles.reviewCtaText}>View Proposals</Text>
                    <Ionicons name="chevron-forward" size={14} color="#0F73F7" />
                  </View>
                </View>
              </TouchableOpacity>

              {/* Quick Actions Grid */}
              <View style={styles.quickGrid}>
                <TouchableOpacity
                  style={[styles.quickTile, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() => router.push('/job/create')}>
                  <Ionicons name="document-text-outline" size={20} color="#0F73F7" />
                  <Text style={[styles.quickTileText, { color: colors.text }]}>Post Job</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.quickTile, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() => router.push('/contracts')}>
                  <Ionicons name="briefcase-outline" size={20} color="#10B981" />
                  <Text style={[styles.quickTileText, { color: colors.text }]}>Contracts</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.quickTile, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() => router.push('/payment')}>
                  <Ionicons name="card-outline" size={20} color="#9333EA" />
                  <Text style={[styles.quickTileText, { color: colors.text }]}>Escrow MoMo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.quickTile, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() => router.push('/settings')}>
                  <Ionicons name="shield-outline" size={20} color="#F59E0B" />
                  <Text style={[styles.quickTileText, { color: colors.text }]}>Disputes</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* ========================================================================= */
            /* FREELANCER DASHBOARD MODE                                                 */
            /* ========================================================================= */
            <>
              {/* Reminder Hero Card */}
              <ReminderCard
                onPress={() => router.push('/contracts')}
              />

              {/* Search Bar with Filter Button */}
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFilterPress={() => router.push('/explore')}
              />

              {/* Category Filter Pills Horizontal Scroll */}
              <CategoryPills
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />

              {filteredRecommendedJobs.length === 0 && filteredLatestJobs.length === 0 ? (
                <View style={[styles.emptySearchCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <View style={[styles.emptySearchCircle, { backgroundColor: isDark ? '#1E293B' : '#EBF4FE' }]}>
                    <Ionicons name="search" size={26} color={colors.primary} />
                  </View>
                  <Text style={[styles.emptySearchTitle, { color: colors.text }]}>No Escrow Jobs Found</Text>
                  <Text style={[styles.emptySearchSub, { color: colors.textSecondary }]}>
                    No jobs match &ldquo;{searchQuery}&rdquo; under &ldquo;{selectedCategory}&rdquo;.
                  </Text>
                  <TouchableOpacity
                    style={[styles.resetSearchBtn, { backgroundColor: colors.primary }]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSearchQuery('');
                      setSelectedCategory('See All');
                    }}
                    activeOpacity={0.85}>
                    <Text style={styles.resetSearchBtnText}>Reset Search & Filters</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  {/* Section: Recommended 🚀 */}
                  {filteredRecommendedJobs.length > 0 && (
                    <>
                      <View style={styles.sectionHeaderRow}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                          Recommended 🚀
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/explore')}>
                          <Text style={styles.seeAllText}>See all →</Text>
                        </TouchableOpacity>
                      </View>

                      {/* Horizontal Recommended Jobs Carousel */}
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalCarousel}>
                        {isLoading ? (
                          <View style={{ flexDirection: 'row', gap: 14 }}>
                            <View style={{ width: 270 }}>
                              <JobCardSkeleton />
                            </View>
                            <View style={{ width: 270 }}>
                              <JobCardSkeleton />
                            </View>
                          </View>
                        ) : (
                          filteredRecommendedJobs.map((job) => (
                            <RecommendedJobCard
                              key={job.id}
                              job={job}
                              onPress={() => router.push(`/job/${job.id}` as any)}
                              onBookmarkToggle={() => toggleRecommendedBookmark(job.id)}
                              onApplyPress={() => router.push(`/job/${job.id}` as any)}
                            />
                          ))
                        )}
                      </ScrollView>
                    </>
                  )}

                  {/* Section: Latest Post ✨ */}
                  {filteredLatestJobs.length > 0 && (
                    <>
                      <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                          Latest Post ✨
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/explore')}>
                          <Text style={styles.seeAllText}>See all →</Text>
                        </TouchableOpacity>
                      </View>

                      {/* Vertical Latest Jobs List */}
                      <View style={styles.latestList}>
                        {isLoading ? (
                          <View style={{ gap: 12 }}>
                            <JobCardSkeleton />
                            <JobCardSkeleton />
                            <JobCardSkeleton />
                          </View>
                        ) : (
                          filteredLatestJobs.map((job) => (
                            <LatestJobCard
                              key={job.id}
                              job={job}
                              onPress={() => router.push(`/job/${job.id}` as any)}
                              onBookmarkToggle={() => toggleLatestBookmark(job.id)}
                              onApplyPress={() => router.push(`/job/${job.id}` as any)}
                            />
                          ))
                        )}
                      </View>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </ScrollView>

        {/* Floating Bottom Navigation Bar */}
        <FloatingTabBar
          activeTab={activeTab}
          onSelectTab={handleTabSelect}
          onCenterActionPress={() => {
            if (isClient) {
              router.push('/job/create');
            } else {
              router.push('/explore');
            }
          }}
        />

        {/* Global Toast */}
        <Toast ref={toastRef} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 120,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F73F7',
  },
  horizontalCarousel: {
    gap: 14,
    paddingRight: 10,
    paddingBottom: 4,
  },
  latestList: {
    gap: 12,
  },
  // Client mode styles
  clientDashboard: {
    gap: 16,
  },
  clientHeroCard: {
    borderRadius: 24,
    padding: 22,
    gap: 16,
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  clientHeroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  clientHeroSub: {
    fontSize: 11,
    fontWeight: '800',
    color: '#E0F2FE',
    letterSpacing: 0.8,
  },
  clientHeroAmount: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 4,
    letterSpacing: -0.5,
  },
  activeContractsBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeContractsText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  clientStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 16,
    paddingVertical: 12,
  },
  clientStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  clientStatVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  clientStatLabel: {
    fontSize: 11,
    color: '#BAE6FD',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  postJobBtn: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  postJobGradient: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  postJobText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  reviewActionCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    gap: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pendingBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D97706',
  },
  reviewAmount: {
    fontSize: 16,
    fontWeight: '800',
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  reviewSubtitle: {
    fontSize: 12,
    lineHeight: 18,
  },
  reviewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  reviewTimeLeft: {
    fontSize: 11,
    color: '#D97706',
    fontWeight: '600',
  },
  reviewCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewCtaText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F73F7',
  },
  clientJobCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    gap: 8,
  },
  clientJobTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  jobTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  openPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  openPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10B981',
  },
  applicantCountPill: {
    fontSize: 12,
    fontWeight: '700',
  },
  clientJobBudget: {
    fontSize: 15,
    fontWeight: '800',
  },
  clientJobTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  clientJobSub: {
    fontSize: 12,
    lineHeight: 18,
  },
  cardDivider: {
    height: 1,
    marginVertical: 4,
  },
  clientJobBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  applicantAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  miniAvatarText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  quickGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  quickTile: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
  },
  quickTileText: {
    fontSize: 11,
    fontWeight: '700',
  },
  clientSearchDirectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
    gap: 8,
  },
  clientSearchDirectText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
  },
  emptySearchCard: {
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 36,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  emptySearchCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptySearchTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySearchSub: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginBottom: 16,
  },
  resetSearchBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetSearchBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
