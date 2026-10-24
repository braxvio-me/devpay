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
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('See All');
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Initial content fetch simulation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
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
      company: 'Apple Partner Studio',
      location: 'Kumasi',
      isTrusted: true,
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120',
      title: 'iOS React Native Engineer',
      salary: 'GH₵ 4,000 - 6,500 / Milestone',
      applicantCount: 16,
      isBookmarked: false,
    },
    {
      id: '3',
      company: 'Paystack Ghana',
      location: 'Accra',
      isTrusted: true,
      logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=120',
      title: 'Fintech Payment Architect',
      salary: 'GH₵ 5,000 - 8,000 / Milestone',
      applicantCount: 9,
      isBookmarked: false,
    },
  ]);

  const [latestJobs, setLatestJobs] = useState<LatestJob[]>([
    {
      id: '4',
      company: 'Microsoft Ghana',
      location: 'Accra',
      isTrusted: true,
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120',
      title: 'Full-Stack TypeScript Engineer',
      salary: 'GH₵ 3,800 - 5,200 / Milestone',
      tags: ['Fixed-Price', 'Remote', 'Milestone 1 Funded'],
      isBookmarked: false,
      applicantCount: 14,
    },
    {
      id: '5',
      company: 'Telecel Digital Labs',
      location: 'Accra',
      isTrusted: true,
      logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120',
      title: 'Mobile App Product Designer',
      salary: 'GH₵ 2,800 - 4,200 / Milestone',
      tags: ['On-Site', 'Escrow Protected', '+2'],
      isBookmarked: true,
      applicantCount: 7,
    },
    {
      id: '6',
      company: 'Hubtel Payments Hub',
      location: 'Takoradi',
      isTrusted: true,
      logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=120',
      title: 'MoMo Integration Specialist',
      salary: 'GH₵ 4,200 - 6,000 / Milestone',
      tags: ['Remote', 'Verified Client', '+3'],
      isBookmarked: false,
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

  const handleTabSelect = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'jobs') router.push('/explore');
    if (tab === 'chats') router.push('/messages');
    if (tab === 'profile') router.push('/profile');
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top Header: Avatar + Location + Circular Bell Button */}
        <DevPayHeader
          location="23/B Airport Res., Accra"
          unreadCount={3}
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
              tintColor="#0F73F7"
              colors={['#0F73F7', '#38BDF8']}
            />
          }>
          {/* Reminder Banner */}
          <ReminderCard
            title="Reminder"
            subtitle="Milestone deliverable due in 2 hours"
            countdown="9 : 4 5"
            onPress={() => router.push('/job/1' as any)}
          />

          {/* Search Bar with Filter Button */}
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFilterPress={() => router.push('/explore')}
            placeholder="Search Here..."
          />

          {/* Category Filter Pills Horizontal Scroll */}
          <CategoryPills
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Section: Recommended 🚀 */}
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, isDark && { color: '#F1F5F9' }]}>Recommended 🚀</Text>
            <TouchableOpacity onPress={() => router.push('/explore')}>
              <Text style={styles.seeAllText}>See all &gt;&gt;</Text>
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
              recommendedJobs.map((job) => (
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

          {/* Section: Latest Post ✨ */}
          <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
            <Text style={[styles.sectionTitle, isDark && { color: '#F1F5F9' }]}>Latest Post ✨</Text>
            <TouchableOpacity onPress={() => router.push('/explore')}>
              <Text style={styles.seeAllText}>See all &gt;&gt;</Text>
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
              latestJobs.map((job) => (
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
        </ScrollView>

        {/* Floating Bottom Navigation Bar */}
        <FloatingTabBar
          activeTab={activeTab}
          onSelectTab={handleTabSelect}
          onCenterActionPress={() => router.push('/explore')}
        />

        {/* Global Toast — must be inside SafeAreaView, above everything */}
        <Toast ref={toastRef} />
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
  scrollContent: {
    paddingBottom: 110, // Space for floating bottom nav
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 18,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.light.text,
    letterSpacing: -0.3,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F73F7',
  },
  horizontalCarousel: {
    paddingHorizontal: 20,
    paddingBottom: 6,
  },
  latestList: {
    marginTop: 4,
  },
});
