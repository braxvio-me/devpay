import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

export interface RecommendedJob {
  id: string;
  company: string;
  location: string;
  isTrusted?: boolean;
  logo: string;
  title: string;
  salary: string;
  applicantCount?: number;
  isBookmarked?: boolean;
}

interface RecommendedJobCardProps {
  job: RecommendedJob;
  onPress: () => void;
  onBookmarkToggle?: () => void;
  onApplyPress?: () => void;
}

export function RecommendedJobCard({
  job,
  onPress,
  onBookmarkToggle,
  onApplyPress,
}: RecommendedJobCardProps) {
  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={onPress}
      activeOpacity={0.9}>
      <LinearGradient
        colors={['#0F73F7', '#38BDF8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}>
        {/* Top Row: Logo, Company Name, Verified Check, Bookmark */}
        <View style={styles.topRow}>
          <View style={styles.companyInfoRow}>
            <View style={styles.logoCircle}>
              <Image source={{ uri: job.logo }} style={styles.logo} />
            </View>
            <View style={styles.companyTextContainer}>
              <Text style={styles.companyName} numberOfLines={1}>{job.company}</Text>
              <View style={styles.trustedRow}>
                <Text style={styles.locationText}>{job.location}</Text>
                {job.isTrusted && !job.location.includes('Trusted') && (
                  <View style={styles.trustedBadge}>
                    <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                    <Text style={styles.trustedText}>Trusted</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.bookmarkButton}
            onPress={onBookmarkToggle}
            activeOpacity={0.8}>
            <Ionicons
              name={job.isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={18}
              color={Colors.light.accentCoral}
            />
          </TouchableOpacity>
        </View>

        {/* Middle Section: Job Title & Salary */}
        <View style={styles.middleSection}>
          <Text style={styles.jobTitle} numberOfLines={1}>
            {job.title}
          </Text>
          <Text style={styles.salaryText}>{job.salary}</Text>
        </View>

        {/* Bottom Row: Applicant Avatars Stack + Apply Button */}
        <View style={styles.bottomRow}>
          <View style={styles.avatarStack}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }}
              style={[styles.stackAvatar, { zIndex: 3 }]}
            />
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' }}
              style={[styles.stackAvatar, { left: -8, zIndex: 2 }]}
            />
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' }}
              style={[styles.stackAvatar, { left: -16, zIndex: 1 }]}
            />
            <View style={[styles.avatarCountPill, { left: -22 }]}>
              <Text style={styles.avatarCountText}>+{job.applicantCount ?? 12}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.applyButton}
            onPress={onApplyPress ?? onPress}
            activeOpacity={0.85}>
            <Text style={styles.applyButtonText}>Apply</Text>
            <Ionicons name="arrow-up-outline" size={13} color="#0F73F7" style={styles.arrowIcon} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: 270,
    height: 195,
    borderRadius: 24,
    marginRight: 16,
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 6,
  },
  gradient: {
    flex: 1,
    borderRadius: 24,
    padding: 16,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  companyInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  companyTextContainer: {
    justifyContent: 'center',
  },
  companyName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  trustedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  locationText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  trustedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  trustedText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bookmarkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  middleSection: {
    marginTop: 6,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  salaryText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stackAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  avatarCountPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCountText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#0F73F7',
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  applyButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F73F7',
  },
  arrowIcon: {
    transform: [{ rotate: '45deg' }],
  },
});
