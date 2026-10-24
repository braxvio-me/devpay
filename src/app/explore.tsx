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
import { Colors } from '@/constants/theme';
import { FloatingTabBar } from '@/components/floating-tab-bar';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChip, setActiveChip] = useState('UI/UX Designer');
  const [floatingTab, setFloatingTab] = useState<'saved' | 'applied'>('saved');

  const filterChips = ['UI/UX Designer', 'Mobile Engineer', 'Frontend', 'Remote'];

  const jobs: FilterJob[] = [
    {
      id: '1',
      company: 'Google Africa',
      location: 'Accra • Trusted',
      isTrusted: true,
      logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120',
      title: 'Jr. UI/UX Designer',
      salary: 'GH₵ 2,500 - 4,000 / Milestone',
      tags: ['Remote', '+3'],
      applicantCount: 12,
      isBookmarked: true,
    },
    {
      id: '2',
      company: 'Microsoft Ghana',
      location: 'Accra • Trusted',
      isTrusted: true,
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120',
      title: 'Full-Stack React Native Dev',
      salary: 'GH₵ 3,500 - 5,500 / Milestone',
      tags: ['Fixed-Price', '+2'],
      applicantCount: 14,
      isBookmarked: false,
    },
    {
      id: '3',
      company: 'Apple Partner Studio',
      location: 'Kumasi • Trusted',
      isTrusted: true,
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120',
      title: 'Senior iOS & Design Lead',
      salary: 'GH₵ 4,000 - 7,000 / Milestone',
      tags: ['Milestone', '+2'],
      applicantCount: 8,
      isBookmarked: true,
    },
  ];

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top Header: back + title */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Explore Jobs</Text>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.push('/notifications')}
            activeOpacity={0.8}>
            <Ionicons name="notifications-outline" size={20} color={Colors.light.text} />
          </TouchableOpacity>
        </View>

        {/* Top Search Row (Search input + Mic + Avatar) */}
        <View style={styles.topSearchRow}>
          <View style={styles.searchInputWrap}>
            <Ionicons name="search" size={18} color={Colors.light.textSecondary} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search projects..."
              placeholderTextColor={Colors.light.textMuted}
            />
            <TouchableOpacity style={styles.micButton}>
              <Ionicons name="mic-outline" size={18} color="#0F73F7" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.avatarButton}
            onPress={() => router.push('/profile')}
            activeOpacity={0.8}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }}
              style={styles.avatarImage}
            />
          </TouchableOpacity>
        </View>

        {/* Filter Dropdowns Row */}
        <View style={styles.filterDropdownRow}>
          <TouchableOpacity style={styles.dropdownBtn}>
            <Ionicons name="options-outline" size={14} color={Colors.light.text} />
            <Text style={styles.dropdownText}>Filters</Text>
            <Ionicons name="chevron-down" size={12} color={Colors.light.text} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.dropdownBtn}>
            <Text style={styles.dropdownText}>Recently</Text>
            <Ionicons name="chevron-down" size={12} color={Colors.light.text} />
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
                style={[styles.chip, isSelected && styles.activeChip]}
                onPress={() => setActiveChip(chip)}>
                <Text style={[styles.chipText, isSelected && styles.activeChipText]}>
                  {chip}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Results Counter Header */}
        <View style={styles.countRow}>
          <Text style={styles.countText}>212 Jobs Found</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all &gt;&gt;</Text>
          </TouchableOpacity>
        </View>

        {/* Job Cards Feed */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.jobsList}>
          {jobs.map((job) => (
            <TouchableOpacity
              key={job.id}
              style={styles.jobCard}
              onPress={() => router.push(`/job/${job.id}` as any)}
              activeOpacity={0.88}>
              {/* Top row */}
              <View style={styles.cardTopRow}>
                <View style={styles.companyRow}>
                  <View style={styles.cardLogoCircle}>
                    <Ionicons name="cube-outline" size={20} color="#0F73F7" />
                  </View>
                  <View>
                    <Text style={styles.cardCompanyName}>{job.company}</Text>
                    <View style={styles.cardLocationRow}>
                      <Text style={styles.cardLocationText}>{job.location}</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity style={styles.cardBookmark}>
                  <Ionicons
                    name={job.isBookmarked ? 'bookmark' : 'bookmark-outline'}
                    size={16}
                    color={job.isBookmarked ? Colors.light.accentCoral : Colors.light.textMuted}
                  />
                </TouchableOpacity>
              </View>

              {/* Title & Salary */}
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{job.title}</Text>
                <Text style={styles.cardSalary}>{job.salary}</Text>
              </View>

              {/* Tags & Apply */}
              <View style={styles.cardFooter}>
                <View style={styles.cardTagsRow}>
                  {job.tags.map((tag, i) => (
                    <View key={i} style={styles.cardTagPill}>
                      <Text style={styles.cardTagText}>{tag}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.cardApplyBtn}
                  onPress={() => router.push(`/job/${job.id}` as any)}>
                  <Text style={styles.cardApplyText}>Apply</Text>
                  <Ionicons name="arrow-up-outline" size={12} color="#0F73F7" style={styles.arrowRot} />
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
          onCenterActionPress={() => router.push('/explore')}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF3FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.light.text,
  },
  topSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 4,
    gap: 12,
  },
  searchInputWrap: {
    flex: 1,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#EEF3FA',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.text,
  },
  micButton: {
    padding: 6,
  },
  avatarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  filterDropdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 14,
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dropdownText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.text,
  },
  chipsScroll: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  activeChip: {
    backgroundColor: '#0F73F7',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  activeChipText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 8,
  },
  countText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F73F7',
  },
  jobsList: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEF3FA',
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 3 },
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EBF4FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardCompanyName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.text,
  },
  cardLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  cardLocationText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  cardBookmark: {
    padding: 4,
  },
  cardBody: {
    marginVertical: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
  },
  cardSalary: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F73F7',
    marginTop: 3,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTagsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  cardTagPill: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  cardTagText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  cardApplyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EBF4FE',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  cardApplyText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F73F7',
  },
  arrowRot: {
    transform: [{ rotate: '45deg' }],
  },
  floatingToggleWrapper: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  floatingToggleBar: {
    flexDirection: 'row',
    backgroundColor: '#0F73F7',
    borderRadius: 24,
    padding: 4,
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  floatingTabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  activeFloatingTab: {
    backgroundColor: '#FFFFFF',
  },
  floatingTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  activeFloatingTabText: {
    color: '#0F73F7',
    fontWeight: '700',
  },
});
