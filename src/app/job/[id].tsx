import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '@/components/ui-text';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';
import { useRole } from '@/contexts/RoleContext';
import { useVerification } from '@/contexts/VerificationContext';
import {
  BookmarkButton,
  Button,
  Chip,
  CompanyLogo,
  ScreenBackground,
  Segmented,
  StatusPill,
  SlideToConfirm,
  TopBar,
} from '@/components/ds';
import { getJob } from '@/constants/jobs';
import { Layout, Radius, Shadows } from '@/constants/theme';

type Tab = 'description' | 'company';

export default function JobDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, isDark } = useTheme();
  const { isClient } = useRole();
  const { verified } = useVerification();
  const insets = useSafeAreaInsets();
  const job = getJob(id);

  const [tab, setTab] = useState<Tab>('description');
  const [bookmarked, setBookmarked] = useState(job.bookmarked);
  const [expanded, setExpanded] = useState(false);

  const metrics = [
    { icon: 'briefcase' as const, tint: '#B7792F', value: job.type, label: 'Job Type' },
    { icon: 'time' as const, tint: colors.primary, value: job.hours, label: 'Working Hours' },
    { icon: 'business' as const, tint: '#3A9C8F', value: job.workplace, label: 'Workplace Type' },
  ];

  const short = job.description.length > 150 ? `${job.description.slice(0, 150).trimEnd()}…` : job.description;

  return (
    <View style={styles.screen}>
      <ScreenBackground height={420} />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <TopBar
          title={job.company.name}
          verified={job.company.verified}
          right={
            <BookmarkButton
              active={bookmarked}
              size={44}
              onPress={() => setBookmarked((b) => !b)}
            />
          }
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingTop: 44 }}>
          <Animated.View
            entering={FadeInDown.duration(380)}
            style={[
              styles.sheet,
              { backgroundColor: colors.surface, paddingBottom: insets.bottom + 110 },
              !isDark && Shadows.soft,
            ]}>
            <View style={[styles.logoWrap, { backgroundColor: colors.surface }, !isDark && Shadows.soft]}>
              <CompanyLogo mark={job.company.mark} size={60} ring={false} />
            </View>

            <Text style={[styles.title, { color: colors.text }]} accessibilityRole="header">
              {job.title}
            </Text>
            <Text style={[styles.salary, { color: colors.textSecondary }]}>
              {job.budget} / {job.period}
            </Text>

            <View style={styles.chips}>
              {job.verifiedOnly && <StatusPill label="Verified only" tone="blue" icon="shield-checkmark" />}
              {job.tags.map((t) => (
                <Chip key={t} label={t} size="sm" />
              ))}
            </View>

            <Segmented<Tab>
              value={tab}
              onChange={setTab}
              options={[
                { value: 'description', label: 'Description', icon: 'reader-outline' },
                { value: 'company', label: 'Company', icon: 'business-outline' },
              ]}
              style={{ marginTop: 20 }}
            />

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {tab === 'description' ? (
              <>
                <View style={[styles.metrics, { backgroundColor: colors.backgroundElement }]}>
                  {metrics.map((m, i) => (
                    <React.Fragment key={m.label}>
                      {i > 0 && <View style={[styles.metricDivider, { backgroundColor: colors.border }]} />}
                      <View style={styles.metric}>
                        <View style={styles.metricTop}>
                          <Ionicons name={m.icon} size={15} color={m.tint} />
                          <Text style={[styles.metricValue, { color: colors.text }]} numberOfLines={1}>
                            {m.value}
                          </Text>
                        </View>
                        <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{m.label}</Text>
                      </View>
                    </React.Fragment>
                  ))}
                </View>

                <View style={styles.detailsHead}>
                  <Text style={[styles.h2, { color: colors.text }]}>Job Details</Text>
                  <Ionicons name="ellipsis-horizontal" size={18} color={colors.textMuted} />
                </View>
                <Text style={[styles.body, { color: colors.textSecondary }]}>
                  {expanded ? job.description : short}{' '}
                  <Text
                    onPress={() => setExpanded((e) => !e)}
                    accessibilityRole="button"
                    style={{ color: colors.primaryText, fontWeight: '500' }}>
                    {expanded ? 'Show less' : 'Read More'}
                  </Text>
                </Text>

                <View style={styles.summary}>
                  <SummaryCard icon="briefcase-outline" label="Experience" value={job.experience} />
                  <SummaryCard icon="business-outline" label="Location" value={job.location} />
                </View>
              </>
            ) : (
              <>
                <View style={styles.detailsHead}>
                  <Text style={[styles.h2, { color: colors.text }]}>About {job.company.name}</Text>
                </View>
                <Text style={[styles.body, { color: colors.textSecondary }]}>{job.company.verified ? job.about : `${job.about} Business details not yet verified.`}</Text>
                <View style={styles.summary}>
                  <SummaryCard icon="location-outline" label="Based in" value={job.company.city} />
                  <SummaryCard
                    icon="shield-checkmark-outline"
                    label="Ghana Card"
                    value={job.company.verified ? 'Verified' : 'Pending'}
                  />
                </View>
                <View style={[styles.escrowNote, { backgroundColor: colors.primaryWash }]}>
                  <Ionicons name="lock-closed" size={16} color={colors.primaryText} />
                  <Text style={[styles.escrowText, { color: colors.primaryText }]}>
                    Each milestone is funded into escrow before work starts.
                  </Text>
                </View>
              </>
            )}
          </Animated.View>
        </ScrollView>
      </SafeAreaView>

      <View style={[styles.bottom, { paddingBottom: Math.max(insets.bottom, 16), backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        {isClient ? (
          <Button
            label="View proposals"
            icon={<Ionicons name="people" size={18} color="#FFFFFF" />}
            onPress={() => router.push('/job/applicants')}
          />
        ) : job.verifiedOnly && !verified ? (
          <View style={{ gap: 10 }}>
            <View style={[styles.lockNote, { backgroundColor: colors.primaryWash }]}>
              <Ionicons name="lock-closed" size={16} color={colors.primaryText} />
              <Text style={[styles.lockText, { color: colors.text }]}>{job.company.name} only hires verified freelancers.</Text>
            </View>
            <Button
              label="Get verified to apply"
              icon={<Ionicons name="shield-checkmark" size={18} color="#FFFFFF" />}
              onPress={() => router.push('/verification')}
            />
          </View>
        ) : (
          <SlideToConfirm label="Apply Now" onConfirm={() => router.push(`/job/apply?jobId=${job.id}` as any)} />
        )}
      </View>
    </View>
  );
}

function SummaryCard({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.summaryCard, { borderColor: colors.border, backgroundColor: colors.surface }]}>
      <Ionicons name={icon} size={22} color={colors.text} />
      <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.summaryValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  sheet: {
    marginHorizontal: 0,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    paddingHorizontal: Layout.margin,
    paddingTop: 48,
    flexGrow: 1,
  },
  logoWrap: {
    position: 'absolute',
    top: -36,
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 21, fontWeight: '600', letterSpacing: -0.4, textAlign: 'center' },
  salary: { fontSize: 14, textAlign: 'center', marginTop: 6 },
  chips: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  divider: { height: 1, marginVertical: 18 },
  metrics: { flexDirection: 'row', borderRadius: Radius.md, paddingVertical: 14, paddingHorizontal: 6 },
  metric: { flex: 1, alignItems: 'center', gap: 4 },
  metricTop: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metricValue: { fontSize: 13, fontWeight: '600' },
  metricLabel: { fontSize: 11 },
  metricDivider: { width: 1, marginVertical: 2 },
  detailsHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 22, marginBottom: 10 },
  h2: { fontSize: 16, fontWeight: '600' },
  body: { fontSize: 13, lineHeight: 20 },
  summary: { flexDirection: 'row', gap: 12, marginTop: 16 },
  summaryCard: { flex: 1, borderWidth: 1, borderRadius: Radius.md, padding: 14, gap: 4 },
  summaryLabel: { fontSize: 13, marginTop: 10 },
  summaryValue: { fontSize: 15, fontWeight: '600' },
  escrowNote: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14, borderRadius: Radius.md, marginTop: 16 },
  escrowText: { fontSize: 13, flex: 1 },
  lockNote: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: Radius.md },
  lockText: { flex: 1, fontSize: 13 },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: Layout.margin, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth },
});
