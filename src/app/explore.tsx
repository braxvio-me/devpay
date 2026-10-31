import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useRole } from '@/contexts/RoleContext';
import { FloatingTabBar } from '@/components/floating-tab-bar';
import * as Haptics from 'expo-haptics';

interface FilterJob {
  id: string;
  company: string;
  location: string;
  isTrusted: boolean;
  logo: string;
  title: string;
  salary: string;
  tags: string[];
  applicantCount: number;
  isBookmarked: boolean;
}

interface DeveloperTalent {
  id: string;
  name: string;
  title: string;
  location: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  completedEscrows: number;
  hourlyRate: string;
  avgMilestone: string;
  skills: string[];
  bio: string;
  isGhanaCardVerified: boolean;
}

export default function ExploreScreen() {
  const router = useRouter();
  const { isDark, colors } = useTheme();
  const { isClient } = useRole();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeChip, setActiveChip] = useState(isClient ? 'All Developers' : 'All Jobs');

  const filterChips = isClient
    ? ['All Developers', 'React Native & Mobile', 'UI/UX Design', 'Full Stack & APIs', 'MoMo Integrators']
    : ['All Jobs', 'Mobile Engineer', 'UI/UX Design', 'Frontend', 'Remote', 'Fixed-Price'];

  const developers: DeveloperTalent[] = [
    {
      id: 'dev_1',
      name: 'Kwame Mensah',
      title: 'Senior Mobile Engineer & React Native Architect',
      location: 'Accra, Ghana • Available Now',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      rating: 5.0,
      reviewsCount: 28,
      completedEscrows: 16,
      hourlyRate: 'GH₵ 120/hr',
      avgMilestone: 'GH₵ 3,500 avg',
      skills: ['React Native', 'Expo SDK 58', 'MTN MoMo API', 'TypeScript', 'Supabase'],
      bio: '6+ years engineering consumer fintech and payment checkouts across West Africa. 100% on-time milestone delivery.',
      isGhanaCardVerified: true,
    },
    {
      id: 'dev_2',
      name: 'Akosua Serwaa',
      title: 'Lead UI/UX & Mobile Product Designer',
      location: 'Kumasi • Remote Available',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
      rating: 4.9,
      reviewsCount: 19,
      completedEscrows: 12,
      hourlyRate: 'GH₵ 95/hr',
      avgMilestone: 'GH₵ 2,800 avg',
      skills: ['Figma', 'Mobile Tokens', 'Design Systems', 'Micro-interactions'],
      bio: 'Crafts accessible, high-conversion mobile UI and component design systems for African fintech startups.',
      isGhanaCardVerified: true,
    },
    {
      id: 'dev_3',
      name: 'Emmanuel Darko',
      title: 'Full Stack Node.js & Cloud Architect',
      location: 'East Legon, Accra',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      rating: 4.9,
      reviewsCount: 31,
      completedEscrows: 24,
      hourlyRate: 'GH₵ 140/hr',
      avgMilestone: 'GH₵ 4,500 avg',
      skills: ['Node.js', 'NestJS', 'PostgreSQL', 'Telecel Cash API', 'Docker'],
      bio: 'Back-end payment infrastructure engineer specializing in Bank of Ghana regulatory compliance and webhook processing.',
      isGhanaCardVerified: true,
    },
    {
      id: 'dev_4',
      name: 'Nana Kwesi Adjei',
      title: 'Mobile Security & Identity Engineer',
      location: 'Tema, Ghana',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
      rating: 4.8,
      reviewsCount: 15,
      completedEscrows: 10,
      hourlyRate: 'GH₵ 110/hr',
      avgMilestone: 'GH₵ 3,200 avg',
      skills: ['React Native', 'Flutter', 'Biometrics', 'Ghana Card SDK'],
      bio: 'Expert in native biometric authentication, cryptographic key storage, and identity verification modules.',
      isGhanaCardVerified: true,
    },
  ];

  const jobs: FilterJob[] = [
    {
      id: '1',
      company: 'Google Africa',
      location: 'Accra • Escrow Guaranteed',
      isTrusted: true,
      logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120',
      title: 'Senior UI/UX Designer',
      salary: 'GH₵ 3,500 - 5,000 / Milestone',
      tags: ['Remote', 'Expo SDK', 'Figma'],
      applicantCount: 12,
      isBookmarked: true,
    },
    {
      id: '2',
      company: 'Telecel Digital Labs',
      location: 'Accra • Escrow Guaranteed',
      isTrusted: true,
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120',
      title: 'Full-Stack React Native Dev',
      salary: 'GH₵ 4,000 - 6,500 / Milestone',
      tags: ['Fixed-Price', 'MoMo API', 'TypeScript'],
      applicantCount: 14,
      isBookmarked: false,
    },
    {
      id: '3',
      company: 'Hubtel Ghana',
      location: 'East Legon • Escrow Guaranteed',
      isTrusted: true,
      logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120',
      title: 'Lead Mobile Security Engineer',
      salary: 'GH₵ 5,000 - 8,000 / Milestone',
      tags: ['Milestone', 'KYC Required', 'BoG Compliant'],
      applicantCount: 8,
      isBookmarked: true,
    },
  ];

  const filteredDevelopers = developers.filter((dev) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      dev.name.toLowerCase().includes(q) ||
      dev.title.toLowerCase().includes(q) ||
      dev.skills.some((s) => s.toLowerCase().includes(q)) ||
      dev.bio.toLowerCase().includes(q);

    let matchesChip = true;
    if (activeChip === 'React Native & Mobile') {
      matchesChip = dev.skills.some((s) => /react native|mobile|expo/i.test(s)) || /mobile/i.test(dev.title);
    } else if (activeChip === 'UI/UX Design') {
      matchesChip = dev.skills.some((s) => /figma|design|ui/i.test(s)) || /design/i.test(dev.title);
    } else if (activeChip === 'Full Stack & APIs') {
      matchesChip = dev.skills.some((s) => /node|stack|api|cloud/i.test(s)) || /full stack/i.test(dev.title);
    } else if (activeChip === 'MoMo Integrators') {
      matchesChip = dev.skills.some((s) => /momo|payment/i.test(s)) || /fintech|payment/i.test(dev.bio);
    }
    return matchesQuery && matchesChip;
  });

  const filteredJobs = jobs.filter((job) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q) ||
      job.tags.some((t) => t.toLowerCase().includes(q));

    let matchesChip = true;
    if (activeChip === 'UI/UX Design') {
      matchesChip = job.tags.some((t) => /design|ui/i.test(t)) || /design/i.test(job.title);
    } else if (activeChip === 'Mobile Engineer') {
      matchesChip = job.tags.some((t) => /mobile|react native|expo/i.test(t)) || /mobile|engineer/i.test(job.title);
    } else if (activeChip === 'Frontend') {
      matchesChip = job.tags.some((t) => /frontend|react|typescript/i.test(t)) || /frontend/i.test(job.title);
    } else if (activeChip === 'Remote') {
      matchesChip = /remote/i.test(job.location);
    } else if (activeChip === 'Fixed-Price') {
      matchesChip = job.tags.some((t) => /milestone|fixed/i.test(t)) || /milestone/i.test(job.salary);
    }
    return matchesQuery && matchesChip;
  });

  const handleResetSearch = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSearchQuery('');
    setActiveChip(isClient ? 'All Developers' : 'All Jobs');
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top Header */}
        <View
          style={[
            styles.headerRow,
            { backgroundColor: colors.surface, borderBottomColor: colors.border },
          ]}>
          <TouchableOpacity
            style={[
              styles.backBtn,
              { backgroundColor: colors.backgroundElement, borderColor: colors.border },
            ]}
            onPress={() => router.back()}
            activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {isClient ? 'Find & Hire Verified Developers' : 'Explore Escrow Jobs'}
          </Text>
          <TouchableOpacity
            style={[
              styles.backBtn,
              { backgroundColor: colors.backgroundElement, borderColor: colors.border },
            ]}
            onPress={() => router.push('/notifications')}
            activeOpacity={0.8}>
            <Ionicons name="notifications-outline" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Top Search Row */}
        <View style={styles.topSearchRow}>
          <View
            style={[
              styles.searchInputWrap,
              {
                backgroundColor: colors.surface,
                borderColor: isSearchFocused ? colors.primary : colors.border,
                shadowColor: isSearchFocused ? colors.primary : '#0F73F7',
                shadowOpacity: isSearchFocused ? (isDark ? 0.35 : 0.12) : 0.04,
                shadowRadius: isSearchFocused ? 10 : 6,
                elevation: isSearchFocused ? 4 : 2,
              },
            ]}>
            <Ionicons
              name="search"
              size={18}
              color={isSearchFocused ? colors.primary : colors.textSecondary}
              style={{ marginRight: 8 }}
            />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder={isClient ? 'Search by skill, name or stack...' : 'Search escrow projects...'}
              placeholderTextColor={colors.textMuted}
              returnKeyType="search"
              autoCorrect={false}
              autoCapitalize="none"
            />
            {searchQuery.length > 0 ? (
              <TouchableOpacity
                style={styles.micButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSearchQuery('');
                }}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.micButton}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                <Ionicons name="mic-outline" size={18} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[styles.avatarButton, { borderColor: colors.border }]}
            onPress={() => router.push('/profile')}
            activeOpacity={0.8}>
            <Image
              source={{
                uri: isClient
                  ? 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100'
                  : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
              }}
              style={styles.avatarImage}
            />
          </TouchableOpacity>
        </View>

        {/* Filter Chips Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}>
          {filterChips.map((chip) => {
            const isSelected = chip === activeChip;
            return (
              <TouchableOpacity
                key={chip}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isSelected
                      ? colors.primary
                      : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setActiveChip(chip);
                }}>
                <Text
                  style={[
                    styles.chipText,
                    { color: isSelected ? '#FFFFFF' : colors.text },
                    isSelected && { fontWeight: '700' },
                  ]}>
                  {chip}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Results Counter Header */}
        <View style={styles.countRow}>
          <Text style={[styles.countText, { color: colors.textSecondary }]}>
            {isClient
              ? `${filteredDevelopers.length} Verified Developer${filteredDevelopers.length === 1 ? '' : 's'} Found`
              : `${filteredJobs.length} Escrow Job${filteredJobs.length === 1 ? '' : 's'} Found`}
          </Text>
          {isClient && (
            <TouchableOpacity onPress={() => router.push('/job/create')} activeOpacity={0.8}>
              <Text style={[styles.postQuickText, { color: colors.primary }]}>
                + Post Job
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Feed: Developers (Client) vs Jobs (Freelancer) */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.jobsList}>
          {isClient ? (
            /* CLIENT VIEW: Verified Developers Directory */
            filteredDevelopers.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={[styles.emptyIconCircle, { backgroundColor: isDark ? '#1E293B' : '#EBF4FE' }]}>
                  <Ionicons name="search" size={30} color={colors.primary} />
                </View>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No Developers Found</Text>
                <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
                  {searchQuery
                    ? `No developers matched "${searchQuery}". Try searching for skills like React Native, MoMo, or UI/UX.`
                    : `No developers found in the "${activeChip}" category.`}
                </Text>
                <TouchableOpacity
                  style={[styles.resetSearchBtn, { backgroundColor: colors.primary }]}
                  onPress={handleResetSearch}
                  activeOpacity={0.85}>
                  <Text style={styles.resetSearchBtnText}>Reset Search & Filters</Text>
                </TouchableOpacity>
              </View>
            ) : (
              filteredDevelopers.map((dev) => (
                <View
                  key={dev.id}
                style={[
                  styles.devCard,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}>
                {/* Dev Card Top Row */}
                <View style={styles.devCardHeader}>
                  <Image source={{ uri: dev.avatar }} style={styles.devAvatar} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <View style={styles.devNameRow}>
                      <Text style={[styles.devName, { color: colors.text }]}>{dev.name}</Text>
                      {dev.isGhanaCardVerified && (
                        <View style={styles.ghanaBadge}>
                          <Ionicons name="shield-checkmark" size={11} color="#10B981" />
                          <Text style={styles.ghanaBadgeText}>NIA Verified</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.devTitle, { color: colors.textSecondary }]} numberOfLines={1}>
                      {dev.title}
                    </Text>
                    <View style={styles.devRatingRow}>
                      <Ionicons name="star" size={13} color="#F59E0B" />
                      <Text style={[styles.ratingVal, { color: colors.text }]}>{dev.rating.toFixed(1)}</Text>
                      <Text style={[styles.reviewsCount, { color: colors.textSecondary }]}>
                        ({dev.reviewsCount} reviews • {dev.completedEscrows} escrows)
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Rate & Escrow Reliability */}
                <View style={[styles.rateBanner, { backgroundColor: colors.backgroundElement }]}>
                  <Text style={[styles.rateBannerText, { color: colors.primary }]}>
                    {dev.hourlyRate} <Text style={{ color: colors.textSecondary, fontWeight: '400' }}>• {dev.avgMilestone}</Text>
                  </Text>
                  <View style={styles.completionPill}>
                    <Text style={styles.completionPillText}>100% Escrow Release</Text>
                  </View>
                </View>

                {/* Bio */}
                <Text style={[styles.devBio, { color: colors.textSecondary }]} numberOfLines={2}>
                  {dev.bio}
                </Text>

                {/* Skill Pills */}
                <View style={styles.skillsRow}>
                  {dev.skills.slice(0, 4).map((skill, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.devSkillPill,
                        { backgroundColor: isDark ? '#1E293B' : '#F1F5F9', borderColor: colors.border },
                      ]}>
                      <Text style={[styles.devSkillText, { color: colors.textSecondary }]}>
                        {skill}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={[styles.devDivider, { backgroundColor: colors.border }]} />

                {/* Actions: Hire & Message */}
                <View style={styles.devActionRow}>
                  <TouchableOpacity
                    style={[
                      styles.msgDevBtn,
                      { backgroundColor: colors.backgroundElement, borderColor: colors.border },
                    ]}
                    onPress={() => router.push('/chat/1' as any)}
                    activeOpacity={0.85}>
                    <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.text} />
                    <Text style={[styles.msgDevText, { color: colors.text }]}>Message</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.hireDevBtn}
                    onPress={() => router.push('/job/create')}
                    activeOpacity={0.88}>
                    <LinearGradient
                      colors={['#0F73F7', '#38BDF8']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.hireBtnGradient}>
                      <Ionicons name="briefcase" size={15} color="#FFFFFF" />
                      <Text style={styles.hireBtnText}>Hire & Fund Escrow</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )
        ) : (
            /* FREELANCER VIEW: Jobs Feed */
            filteredJobs.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={[styles.emptyIconCircle, { backgroundColor: isDark ? '#1E293B' : '#EBF4FE' }]}>
                  <Ionicons name="search" size={30} color={colors.primary} />
                </View>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No Escrow Jobs Found</Text>
                <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
                  {searchQuery
                    ? `No jobs matched "${searchQuery}". Try searching for terms like React Native, MoMo, or UI/UX.`
                    : `No jobs found under the "${activeChip}" filter.`}
                </Text>
                <TouchableOpacity
                  style={[styles.resetSearchBtn, { backgroundColor: colors.primary }]}
                  onPress={handleResetSearch}
                  activeOpacity={0.85}>
                  <Text style={styles.resetSearchBtnText}>Reset Search & Filters</Text>
                </TouchableOpacity>
              </View>
            ) : (
              filteredJobs.map((job) => (
                <TouchableOpacity
                  key={job.id}
                style={[
                  styles.jobCard,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
                onPress={() => router.push(`/job/${job.id}` as any)}
                activeOpacity={0.88}>
                {/* Top row */}
                <View style={styles.cardTopRow}>
                  <View style={styles.companyRow}>
                    <View
                      style={[
                        styles.cardLogoCircle,
                        { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' },
                      ]}>
                      <Ionicons name="cube-outline" size={20} color={colors.primary} />
                    </View>
                    <View>
                      <Text style={[styles.companyName, { color: colors.textSecondary }]}>
                        {job.company}
                      </Text>
                      <Text style={[styles.locationText, { color: colors.textMuted }]}>
                        {job.location}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.bookmarkBtn,
                      { backgroundColor: colors.backgroundElement },
                    ]}
                    onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                    <Ionicons
                      name={job.isBookmarked ? 'bookmark' : 'bookmark-outline'}
                      size={16}
                      color={job.isBookmarked ? colors.primary : colors.textMuted}
                    />
                  </TouchableOpacity>
                </View>

                {/* Body */}
                <View style={styles.cardBody}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>
                    {job.title}
                  </Text>
                  <Text style={[styles.cardSalary, { color: colors.primary }]}>
                    {job.salary}
                  </Text>
                </View>

                {/* Tags & Apply */}
                <View style={styles.cardFooter}>
                  <View style={styles.cardTagsRow}>
                    {job.tags.map((tag, i) => (
                      <View
                        key={i}
                        style={[
                          styles.cardTagPill,
                          {
                            backgroundColor: colors.backgroundElement,
                            borderColor: colors.border,
                          },
                        ]}
                      >
                        <Text style={[styles.cardTagText, { color: colors.textSecondary }]}>
                          {tag}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.cardApplyBtn,
                      { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' },
                    ]}
                    onPress={() => router.push(`/job/${job.id}` as any)}>
                    <Text style={[styles.cardApplyText, { color: colors.primary }]}>
                      Apply
                    </Text>
                    <Ionicons
                      name="arrow-forward"
                      size={12}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )
        )}
        </ScrollView>

        {/* Main Tab Bar */}
        <FloatingTabBar
          activeTab="jobs"
          onSelectTab={(tab) => {
            if (tab === 'home') router.push('/');
            if (tab === 'chats') router.push('/messages');
            if (tab === 'profile') router.push('/profile');
          }}
          onCenterActionPress={() => {
            if (isClient) {
              router.push('/job/create');
            } else {
              router.push('/explore');
            }
          }}
        />
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
  headerRow: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  topSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 12,
    gap: 12,
  },
  searchInputWrap: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  micButton: {
    padding: 6,
  },
  avatarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  chipsScroll: {
    paddingHorizontal: 20,
    gap: 8,
    paddingTop: 12,
    paddingBottom: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 6,
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
  },
  postQuickText: {
    fontSize: 13,
    fontWeight: '800',
  },
  jobsList: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 110,
    gap: 14,
  },
  jobCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    gap: 10,
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardLogoCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  companyName: {
    fontSize: 13,
    fontWeight: '700',
  },
  locationText: {
    fontSize: 11,
    marginTop: 1,
  },
  bookmarkBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    gap: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  cardSalary: {
    fontSize: 13,
    fontWeight: '700',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  cardTagsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  cardTagPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  cardTagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardApplyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  cardApplyText: {
    fontSize: 12,
    fontWeight: '700',
  },
  devCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    gap: 12,
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  devCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  devAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E2E8F0',
  },
  devNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  devName: {
    fontSize: 15,
    fontWeight: '800',
  },
  ghanaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  ghanaBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
  },
  devTitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  devRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  ratingVal: {
    fontSize: 12,
    fontWeight: '800',
  },
  reviewsCount: {
    fontSize: 11,
  },
  rateBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  rateBannerText: {
    fontSize: 13,
    fontWeight: '800',
  },
  completionPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  completionPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10B981',
  },
  devBio: {
    fontSize: 12,
    lineHeight: 18,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  devSkillPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  devSkillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  devDivider: {
    height: 1,
    marginVertical: 2,
  },
  devActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  msgDevBtn: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  msgDevText: {
    fontSize: 13,
    fontWeight: '700',
  },
  hireDevBtn: {
    flex: 1.5,
    height: 40,
    borderRadius: 12,
    overflow: 'hidden',
  },
  hireBtnGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  hireBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 28,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  resetSearchBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetSearchBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
