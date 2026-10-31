import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { AvatarStack, BookmarkButton, CompanyRow, PressableScale } from '@/components/ds';
import { Gradients, Radius, Shadows } from '@/constants/theme';
import type { Job } from '@/constants/jobs';

interface RecommendedJobCardProps {
  job: Job;
  featured?: boolean;
  onPress: () => void;
  onBookmarkToggle?: () => void;
  onApplyPress?: () => void;
}

export const RECOMMENDED_CARD_WIDTH = 262;

export function RecommendedJobCard({ job, featured, onPress, onBookmarkToggle, onApplyPress }: RecommendedJobCardProps) {
  const { colors, isDark } = useTheme();
  const light = !!featured;
  const fg = light ? '#FFFFFF' : colors.text;
  const sub = light ? '#FFFFFF' : colors.textSecondary;

  const body = (
    <>
      <View style={styles.top}>
        <CompanyRow company={job.company} light={light} />
        <BookmarkButton active={job.bookmarked} onPress={onBookmarkToggle} onGradient={light && !job.bookmarked} />
      </View>

      <View style={{ gap: 4 }}>
        <Text numberOfLines={1} style={[styles.title, { color: fg }]}>
          {job.title}
        </Text>
        <Text style={[styles.salary, { color: sub }]}>
          {job.budget} <Text style={{ fontWeight: '400' }}>/ {job.period}</Text>
        </Text>
      </View>

      <View style={styles.bottom}>
        <AvatarStack uris={job.applicants} extra={job.applicantExtra} light={light} />
        <Pressable
          onPress={onApplyPress ?? onPress}
          accessibilityRole="button"
          accessibilityLabel={`Apply to ${job.title}`}
          style={[
            styles.apply,
            { backgroundColor: light ? 'rgba(255,255,255,0.2)' : isDark ? colors.primarySoft : colors.primaryWash },
          ]}>
          <Text style={[styles.applyText, { color: light ? '#FFFFFF' : colors.primaryText }]}>Apply</Text>
          <Feather name="arrow-up-right" size={15} color={light ? '#FFFFFF' : colors.primaryText} />
        </Pressable>
      </View>
    </>
  );

  return (
    <PressableScale
      onPress={onPress}
      haptic={false}
      container
      scaleTo={0.98}
      accessibilityLabel={`${job.title} at ${job.company.name}`}
      style={[
        styles.card,
        featured ? Shadows.lifted : isDark ? { borderWidth: 1, borderColor: colors.border } : Shadows.soft,
        !featured && { backgroundColor: colors.surface },
      ]}>
      {featured ? (
        <LinearGradient colors={Gradients.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.inner}>
          {body}
        </LinearGradient>
      ) : (
        <View style={styles.inner}>{body}</View>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: { width: RECOMMENDED_CARD_WIDTH, height: 200, borderRadius: Radius.xl },
  inner: { flex: 1, borderRadius: Radius.xl, padding: 16, justifyContent: 'space-between', overflow: 'hidden' },
  top: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  title: { fontSize: 17, fontWeight: '600', letterSpacing: -0.3 },
  salary: { fontSize: 13, fontWeight: '500' },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginRight: -16, marginBottom: -16 },
  apply: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 48,
    paddingLeft: 30,
    paddingRight: 20,
    borderTopLeftRadius: Radius.lg,
  },
  applyText: { fontSize: 15, fontWeight: '500' },
});
