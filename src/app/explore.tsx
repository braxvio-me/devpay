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

export default function ExploreScreen() {
  const router = useRouter();
  const { isDark, colors } = useTheme();
  const { isClient } = useRole();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeChip, setActiveChip] = useState('UI/UX Design');

  const filterChips = isClient
    ? ['Mobile Engineers', 'UI/UX Designers', 'Full Stack', 'MoMo SDK', 'Smart Contracts']
    : ['UI/UX Design', 'Mobile Engineer', 'Frontend', 'Remote', 'Fixed-Price'];

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
            {isClient ? 'Explore Verified Talent' : 'Explore Escrow Jobs'}
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
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}>
            <Ionicons
              name="search"
              size={18}
              color={colors.textSecondary}
              style={{ marginRight: 8 }}
            />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={isClient ? 'Search verified developers...' : 'Search escrow projects...'}
              placeholderTextColor={colors.textMuted}
            />
            <TouchableOpacity
              style={styles.micButton}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
              <Ionicons name="mic-outline" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.avatarButton, { borderColor: colors.border }]}
            onPress={() => router.push('/profile')}
            activeOpacity={0.8}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
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
            {isClient ? '148 Verified Developers Found' : '212 Escrow Jobs Found'}
          </Text>
          {isClient && (
            <TouchableOpacity onPress={() => router.push('/job/create')}>
              <Text style={[styles.postQuickText, { color: colors.primary }]}>
                + Post Job
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Job Cards Feed */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.jobsList}>
          {jobs.map((job) => (
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
                      ]}>
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
                    {isClient ? 'View' : 'Apply'}
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={12}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
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
});
