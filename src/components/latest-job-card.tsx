import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Text } from '@/components/ui-text';
import { useTheme } from '@/contexts/ThemeContext';
import { ApplyCorner, AvatarStack, BookmarkButton, Chip, CompanyRow, GlassCard } from '@/components/ds';
import type { Job } from '@/constants/jobs';

interface LatestJobCardProps {
  job: Job;
  /** `feed` = Home "Latest Post" (tags row); `search` = results list (side chips, applicants, Apply corner). */
  layout?: 'feed' | 'search';
  onPress: () => void;
  onBookmarkToggle?: () => void;
  onApplyPress?: () => void;
}

export function LatestJobCard({ job, layout = 'feed', onPress, onBookmarkToggle, onApplyPress }: LatestJobCardProps) {
  const { colors } = useTheme();
  const search = layout === 'search';
  const compact = useWindowDimensions().width < 370;

  return (
    <GlassCard onPress={onPress} accessibilityLabel={`${job.title} at ${job.company.name}`}>
      <View style={styles.top}>
        <CompanyRow company={job.company} />
        <BookmarkButton active={job.bookmarked} onPress={onBookmarkToggle} />
      </View>

      <View style={[styles.mid, compact && styles.midCompact]}>
        <View style={compact ? styles.titleCompact : styles.titleWide}>
          <Text numberOfLines={1} style={[styles.title, { color: colors.text }]}>
            {job.title}
          </Text>
          <Text style={[styles.salary, { color: colors.text }]}>
            {job.budget} <Text style={{ color: colors.textSecondary, fontWeight: '400' }}>/ {job.period}</Text>
          </Text>
        </View>
        {search && (
          <View style={[styles.sideChips, compact && { marginTop: 10 }]}>
            <Chip label={job.tags[1] ?? job.tags[0]} size="sm" />
            {job.tags.length > 2 && <Chip label={`+${job.tags.length - 1}`} size="sm" />}
          </View>
        )}
      </View>

      {search ? (
        <View style={styles.searchBottom}>
          <AvatarStack uris={job.applicants} extra={job.applicantExtra} size={24} />
          <ApplyCorner onPress={onApplyPress ?? onPress} />
        </View>
      ) : (
        <View style={styles.tags}>
          {job.tags.map((t) => (
            <Chip key={t} label={t} size="sm" />
          ))}
        </View>
      )}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  mid: { flexDirection: 'row', alignItems: 'center', marginTop: 14, gap: 10 },
  title: { fontSize: 16, fontWeight: '600', letterSpacing: -0.2 },
  salary: { fontSize: 13, fontWeight: '500' },
  titleWide: { flex: 1, gap: 4 },
  titleCompact: { alignSelf: 'stretch', gap: 4 },
  midCompact: { flexDirection: 'column', alignItems: 'flex-start', gap: 0 },
  sideChips: { flexDirection: 'row', gap: 8 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  searchBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
});
