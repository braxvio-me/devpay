import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

export interface LatestJob {
  id: string;
  company: string;
  location: string;
  isTrusted?: boolean;
  logo: string;
  title: string;
  salary: string;
  tags: string[];
  isBookmarked?: boolean;
  applicantCount?: number;
}

interface LatestJobCardProps {
  job: LatestJob;
  onPress: () => void;
  onBookmarkToggle?: () => void;
  onApplyPress?: () => void;
}

export function LatestJobCard({
  job,
  onPress,
  onBookmarkToggle,
  onApplyPress,
}: LatestJobCardProps) {
  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={onPress}
      activeOpacity={0.88}>
      {/* Top Row: Logo, Company Name, Verified Badge, Bookmark */}
      <View style={styles.topRow}>
        <View style={styles.companyInfoRow}>
          <View style={styles.logoCircle}>
            <Image source={{ uri: job.logo }} style={styles.logo} />
          </View>
          <View style={styles.companyTextContainer}>
            <Text style={styles.companyName}>{job.company}</Text>
            <View style={styles.trustedRow}>
              <Text style={styles.locationText}>{job.location}</Text>
              {job.isTrusted && (
                <View style={styles.trustedBadge}>
                  <Ionicons name="checkmark-circle" size={12} color={Colors.light.accentGreen} />
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
            color={job.isBookmarked ? Colors.light.accentCoral : Colors.light.textMuted}
          />
        </TouchableOpacity>
      </View>

      {/* Middle Section: Job Title & Salary */}
      <View style={styles.middleSection}>
        <Text style={styles.jobTitle}>{job.title}</Text>
        <Text style={styles.salaryText}>{job.salary}</Text>
      </View>

      {/* Bottom Row: Tags + Apply Button */}
      <View style={styles.bottomRow}>
        <View style={styles.tagsContainer}>
          {job.tags.slice(0, 3).map((tag, idx) => (
            <View key={idx} style={styles.tagPill}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {job.tags.length > 3 && (
            <View style={styles.tagPillExtra}>
              <Text style={styles.tagTextExtra}>+{job.tags.length - 3}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.applyButton}
          onPress={onApplyPress ?? onPress}
          activeOpacity={0.85}>
          <Text style={styles.applyButtonText}>Apply</Text>
          <Ionicons name="arrow-up-outline" size={12} color={Colors.light.primary} style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EEF3FA',
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
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
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#EEF3FA',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  companyTextContainer: {
    justifyContent: 'center',
  },
  companyName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  trustedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  locationText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  trustedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  trustedText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.accentGreen,
  },
  bookmarkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleSection: {
    marginVertical: 10,
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
  },
  salaryText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.primary,
    marginTop: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    flex: 1,
  },
  tagPill: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.light.textSecondary,
  },
  tagPillExtra: {
    backgroundColor: '#E2E8F0',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  tagTextExtra: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.textSecondary,
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#EBF4FE',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  applyButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  arrowIcon: {
    transform: [{ rotate: '45deg' }],
  },
});
