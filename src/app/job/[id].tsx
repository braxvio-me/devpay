import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  interpolateColor,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TRACK_WIDTH = SCREEN_WIDTH - 40; // 20px padding each side
const THUMB_SIZE = 56;
const THUMB_MARGIN = 4;
const MAX_DRAG = TRACK_WIDTH - THUMB_SIZE - THUMB_MARGIN * 2;
const THRESHOLD = MAX_DRAG * 0.72; // 72% triggers apply

export default function JobDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<'description' | 'company'>('description');
  const [isBookmarked, setIsBookmarked] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [applied, setApplied] = useState(false);

  // Shared values for swipe-to-apply
  const dragX = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const bookmarkScale = useSharedValue(1);

  const job = {
    id: id || '1',
    company: 'Google',
    title: 'Jr. UI/UX Designer',
    salary: 'GH₵ 3,500 - GH₵ 5,500 / Month',
    type: 'Full-Time',
    hours: '10AM - 6PM',
    workplace: 'Hybrid',
    experience: '2 - 4 Years',
    location: 'Accra, Ghana',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/240px-Google_%22G%22_logo.svg.png',
    isTrusted: true,
    description:
      'Looking for a UX/UI Designer to create intuitive, scalable, and user-centered experiences across web and mobile platforms. You will work closely with product managers, engineers, and stakeholders to define DevPay milestone escrow flows, user journeys, wireframes, and design system components.',
  };

  // ─── Swipe-to-apply gesture ───────────────────────────────────────────────
  const handleApplied = () => {
    setApplied(true);
    // Navigate to apply screen after brief success pause
    setTimeout(() => {
      router.push(`/job/apply?jobId=${job.id}` as any);
    }, 600);
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      isDragging.set(true);
    })
    .onUpdate((e) => {
      const clamped = Math.max(0, Math.min(e.translationX, MAX_DRAG));
      dragX.set(clamped);
    })
    .onEnd((e) => {
      if (dragX.get() >= THRESHOLD) {
        // Snap to end and trigger apply
        dragX.set(withSpring(MAX_DRAG, { duration: 220, dampingRatio: 1 }));
        runOnJS(handleApplied)();
      } else {
        // Spring back
        dragX.set(withSpring(0, {
          duration: 400,
          dampingRatio: 0.75,
          velocity: e.velocityX,
        }));
      }
      isDragging.set(false);
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: dragX.get() }],
  }));

  const trackFillStyle = useAnimatedStyle(() => ({
    width: dragX.get() + THUMB_SIZE + THUMB_MARGIN * 2,
    opacity: interpolate(dragX.get(), [0, MAX_DRAG * 0.3], [0.15, 0.6]),
  }));

  const labelOpacityStyle = useAnimatedStyle(() => ({
    opacity: interpolate(dragX.get(), [0, MAX_DRAG * 0.5], [1, 0]),
  }));

  const successOpacityStyle = useAnimatedStyle(() => ({
    opacity: interpolate(dragX.get(), [THRESHOLD * 0.8, MAX_DRAG], [0, 1]),
  }));

  // Chevrons animated fade based on drag
  const chevronsStyle = useAnimatedStyle(() => ({
    opacity: interpolate(dragX.get(), [0, MAX_DRAG * 0.4], [0.8, 0]),
  }));

  // Bookmark press animation
  const toggleBookmark = () => {
    setIsBookmarked((b) => !b);
    bookmarkScale.set(
      withSpring(1.4, { duration: 120, dampingRatio: 0.5 }, () => {
        bookmarkScale.set(withSpring(1, { duration: 200, dampingRatio: 0.7 }));
      })
    );
  };

  const bookmarkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bookmarkScale.get() }],
  }));

  return (
    <View style={styles.screen}>
      {/* Blurred / Frosted background */}
      <View style={styles.blurredBackgroundWrapper}>
        <LinearGradient
          colors={['#E0EEFD', '#EDF5FD', '#F5F9FD']}
          style={styles.blurredGradient}
        />
        <View style={styles.blurredContentPreview}>
          <View style={styles.previewSearchBar} />
          <View style={styles.previewChipsRow}>
            <View style={styles.previewChip} />
            <View style={styles.previewChip} />
            <View style={styles.previewChip} />
          </View>
        </View>
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top Navigation Bar */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.circleButton}
            onPress={() => router.back()}
            activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color={Colors.light.text} />
          </TouchableOpacity>

          <View style={styles.headerTitleRow}>
            <Text style={styles.headerCompany}>{job.company}</Text>
            <Ionicons name="checkmark-circle" size={17} color="#0F73F7" />
          </View>

          <TouchableOpacity
            style={styles.circleButton}
            onPress={toggleBookmark}
            activeOpacity={0.8}>
            <Animated.View style={bookmarkStyle}>
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={18}
                color={Colors.light.accentCoral}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Main Sheet Card with Overlapping Circular Logo */}
          <View style={styles.sheetContainer}>
            {/* Floating Overlapping Company Logo Badge */}
            <View style={styles.floatingLogoBadge}>
              <Image source={{ uri: job.logo }} style={styles.googleLogo} />
            </View>

            {/* Title & Salary */}
            <Text style={styles.title}>{job.title}</Text>
            <Text style={styles.salary}>{job.salary}</Text>

            {/* Quick Pills Row */}
            <View style={styles.pillsRow}>
              <View style={styles.pill}>
                <Text style={styles.pillText}>{job.type}</Text>
              </View>
              <View style={styles.pill}>
                <Text style={styles.pillText}>{job.location}</Text>
              </View>
              <View style={styles.pill}>
                <Text style={styles.pillText}>{job.workplace}</Text>
              </View>
            </View>

            {/* Segmented Control: Description / Company */}
            <View style={styles.segmentedContainer}>
              <TouchableOpacity
                style={[styles.segmentButton, activeTab === 'description' && styles.activeSegment]}
                onPress={() => setActiveTab('description')}
                activeOpacity={0.8}>
                <Ionicons
                  name="document-text-outline"
                  size={15}
                  color={activeTab === 'description' ? Colors.light.text : Colors.light.textMuted}
                />
                <Text
                  style={[
                    styles.segmentText,
                    activeTab === 'description' && styles.activeSegmentText,
                  ]}>
                  Description
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.segmentButton, activeTab === 'company' && styles.activeSegment]}
                onPress={() => setActiveTab('company')}
                activeOpacity={0.8}>
                <Ionicons
                  name="business-outline"
                  size={15}
                  color={activeTab === 'company' ? Colors.light.text : Colors.light.textMuted}
                />
                <Text
                  style={[
                    styles.segmentText,
                    activeTab === 'company' && styles.activeSegmentText,
                  ]}>
                  Company
                </Text>
              </TouchableOpacity>
            </View>

            {/* Triple Metric Cards Row */}
            <View style={styles.metricsRow}>
              <View style={styles.metricCard}>
                <View style={styles.metricTopRow}>
                  <Text style={styles.metricEmoji}>💼</Text>
                  <Text style={styles.metricValue}>Full-Time</Text>
                </View>
                <Text style={styles.metricLabel}>Job Type</Text>
              </View>

              <View style={styles.metricCard}>
                <View style={styles.metricTopRow}>
                  <Text style={styles.metricEmoji}>⏱</Text>
                  <Text style={styles.metricValue}>10AM - 6PM</Text>
                </View>
                <Text style={styles.metricLabel}>Working Hours</Text>
              </View>

              <View style={styles.metricCard}>
                <View style={styles.metricTopRow}>
                  <Text style={styles.metricEmoji}>🏢</Text>
                  <Text style={styles.metricValue}>Hybrid</Text>
                </View>
                <Text style={styles.metricLabel}>Workplace Type</Text>
              </View>
            </View>

            {/* Job Details Section Header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Job Details</Text>
              <Ionicons name="ellipsis-horizontal" size={18} color={Colors.light.textMuted} />
            </View>

            {/* Description Text */}
            <Text style={styles.descriptionText}>
              {isExpanded
                ? `${job.description} Deliverables include setting up typed Reanimated motion, building responsive payment checkout screens, integrating with our NestJS escrow backend, and ensuring seamless Mobile Money withdrawals.`
                : `${job.description.slice(0, 155)}... `}
              <Text
                style={styles.readMoreText}
                onPress={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? 'Show Less' : 'Read More'}
              </Text>
            </Text>

            {/* Two Side-by-Side Summary Cards: Experience & Location */}
            <View style={styles.summaryGrid}>
              <View style={styles.summaryCard}>
                <Ionicons name="briefcase-outline" size={20} color={Colors.light.text} />
                <Text style={styles.summaryLabel}>Experience</Text>
                <Text style={styles.summaryValue}>{job.experience}</Text>
              </View>

              <View style={styles.summaryCard}>
                <Ionicons name="business-outline" size={20} color={Colors.light.text} />
                <Text style={styles.summaryLabel}>Location</Text>
                <Text style={styles.summaryValue}>{job.location}</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom: Swipe-to-Apply Button */}
        <View style={styles.bottomBar}>
          <GestureDetector gesture={panGesture}>
            <View style={styles.swipeTrack}>
              {/* Track fill glow */}
              <Animated.View style={[styles.trackFill, trackFillStyle]} />

              {/* Slide thumb */}
              <Animated.View style={[styles.thumb, thumbStyle]}>
                <LinearGradient
                  colors={applied ? ['#10B981', '#059669'] : ['#38BDF8', '#0F73F7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.thumbGradient}>
                  {applied ? (
                    <Ionicons name="checkmark" size={24} color="#FFF" />
                  ) : (
                    <Ionicons name="chevron-forward" size={24} color="#FFF" />
                  )}
                </LinearGradient>
              </Animated.View>

              {/* Track label: "Swipe to Apply" */}
              <Animated.View style={[styles.trackLabelWrap, labelOpacityStyle]}>
                <Text style={styles.trackLabel}>Swipe to Apply</Text>
                <Animated.View style={[styles.chevronGroup, chevronsStyle]}>
                  <Text style={styles.chevronChar}>›</Text>
                  <Text style={styles.chevronChar}>›</Text>
                  <Text style={styles.chevronChar}>›</Text>
                </Animated.View>
              </Animated.View>

              {/* Success label */}
              <Animated.View style={[styles.trackLabelWrap, styles.trackLabelAbsolute, successOpacityStyle]}>
                <Text style={styles.trackLabelSuccess}>Applied! 🎉</Text>
              </Animated.View>
            </View>
          </GestureDetector>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EDF5FD',
  },
  blurredBackgroundWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    overflow: 'hidden',
  },
  blurredGradient: {
    ...StyleSheet.absoluteFill,
  },
  blurredContentPreview: {
    paddingHorizontal: 20,
    paddingTop: 16,
    opacity: 0.18,
  },
  previewSearchBar: {
    height: 44,
    backgroundColor: '#94A3B8',
    borderRadius: 14,
    marginBottom: 12,
  },
  previewChipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  previewChip: {
    width: 80,
    height: 28,
    backgroundColor: '#94A3B8',
    borderRadius: 10,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  circleButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerCompany: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  scrollContent: {
    paddingTop: 36,
    paddingBottom: 120,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 20,
    paddingTop: 46,
    paddingBottom: 24,
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    minHeight: 700,
  },
  floatingLogoBadge: {
    position: 'absolute',
    top: -34,
    alignSelf: 'center',
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 20,
  },
  googleLogo: {
    width: 38,
    height: 38,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 21,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  salary: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    justifyContent: 'center',
  },
  pill: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  pillText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    padding: 4,
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#EEF3FA',
  },
  segmentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 20,
  },
  activeSegment: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textMuted,
  },
  activeSegmentText: {
    color: Colors.light.text,
    fontWeight: '700',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEF3FA',
    alignItems: 'center',
  },
  metricTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricEmoji: {
    fontSize: 12,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  metricLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 21,
    color: '#64748B',
  },
  readMoreText: {
    color: '#0F73F7',
    fontWeight: '700',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EEF3FA',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 8,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  // ─── Bottom swipe-to-apply ────────────────────────────────────────────────
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 28,
    paddingTop: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
  },
  swipeTrack: {
    height: THUMB_SIZE + THUMB_MARGIN * 2,
    borderRadius: (THUMB_SIZE + THUMB_MARGIN * 2) / 2,
    backgroundColor: '#EBF5FE',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    overflow: 'hidden',
    justifyContent: 'center',
    paddingLeft: THUMB_MARGIN,
  },
  trackFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: (THUMB_SIZE + THUMB_MARGIN * 2) / 2,
    backgroundColor: '#0F73F7',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    zIndex: 10,
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  thumbGradient: {
    flex: 1,
    borderRadius: THUMB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackLabelWrap: {
    position: 'absolute',
    left: THUMB_SIZE + THUMB_MARGIN * 2 + 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trackLabelAbsolute: {
    left: 0,
    right: 0,
    justifyContent: 'center',
  },
  trackLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F73F7',
    letterSpacing: 0.2,
  },
  trackLabelSuccess: {
    fontSize: 15,
    fontWeight: '800',
    color: '#059669',
    textAlign: 'center',
  },
  chevronGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  chevronChar: {
    fontSize: 20,
    fontWeight: '800',
    color: 'rgba(15, 115, 247, 0.45)',
    lineHeight: 24,
  },
});
