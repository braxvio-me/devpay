import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { useVerification } from '@/contexts/VerificationContext';
import { Avatar, Button, Chip, GlassCard, ScreenBackground, Segmented, StatusPill, TopBar } from '@/components/ds';
import { SuccessOverlay } from '@/components/success-overlay';
import { Portraits } from '@/constants/media';
import { Layout, Radius } from '@/constants/theme';

interface Applicant {
  id: string;
  talentId: string;
  name: string;
  avatar: string;
  title: string;
  rating: number;
  jobs: number;
  bid: number;
  days: number;
  proposal: string;
  skills: string[];
}

const APPLICANTS: Applicant[] = [
  {
    id: 'a1',
    talentId: 'dev_1',
    name: 'Ama Owusu',
    avatar: Portraits.ama,
    title: 'Senior React Native Engineer',
    rating: 5.0,
    jobs: 8,
    bid: 4500,
    days: 14,
    proposal: 'I’ve shipped MTN MoMo and Telecel Cash in production React Native apps. Typed, tested, delivered milestone by milestone.',
    skills: ['React Native', 'Expo', 'TypeScript', 'MoMo API'],
  },
  {
    id: 'a2',
    talentId: 'dev_2',
    name: 'Akosua Serwaa',
    avatar: Portraits.akosua,
    title: 'Product Designer & RN Developer',
    rating: 4.9,
    jobs: 12,
    bid: 4200,
    days: 10,
    proposal: 'Four years designing fintech flows for Ghanaian startups. I can start milestone 1 as soon as escrow is funded.',
    skills: ['Figma', 'React Native', 'Reanimated'],
  },
  {
    id: 'a3',
    talentId: 'dev_3',
    name: 'Kofi Darko',
    avatar: Portraits.kofi,
    title: 'Full Stack & Mobile Engineer',
    rating: 4.8,
    jobs: 5,
    bid: 4800,
    days: 16,
    proposal: 'I specialise in payment webhooks and transaction lifecycles, with automated tests on every milestone handover.',
    skills: ['Node.js', 'React Native', 'PostgreSQL'],
  },
];

type Sort = 'best' | 'price' | 'speed';

export default function JobApplicantsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [sort, setSort] = useState<Sort>('best');
  const [hired, setHired] = useState<Applicant | null>(null);
  const { verified } = useVerification();

  const list = [...APPLICANTS].sort((a, b) =>
    sort === 'price' ? a.bid - b.bid : sort === 'speed' ? a.days - b.days : b.rating - a.rating || b.jobs - a.jobs
  );

  const hire = (a: Applicant) =>
    !verified
      ? Alert.alert('Verify to hire', 'Only verified clients can hire on DevPay. It takes a few minutes.', [
          { text: 'Not now', style: 'cancel' },
          { text: 'Get verified', onPress: () => router.push('/verification') },
        ])
      : Alert.alert('Hire and fund milestone 1?', `${a.name}’s first milestone (GH₵ 1,500) will be locked in escrow.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Hire & fund',
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
          setHired(a);
        },
      },
    ]);

  return (
    <View style={{ flex: 1 }}>
      <ScreenBackground />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <TopBar title="Proposals" subtitle="React Native Engineer (MoMo SDK)" />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.summary}>
            <StatusPill label="Hiring" tone="green" />
            <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
              {APPLICANTS.length} verified freelancers · budget GH₵ 4,500
            </Text>
          </View>

          <Segmented<Sort>
            value={sort}
            onChange={setSort}
            options={[
              { value: 'best', label: 'Top rated' },
              { value: 'price', label: 'Lowest bid' },
              { value: 'speed', label: 'Fastest' },
            ]}
            style={{ marginTop: 14 }}
          />

          <View style={{ gap: 14, marginTop: 16 }}>
            {list.map((a) => (
              <GlassCard key={a.id}>
                <Pressable
                  style={styles.top}
                  onPress={() => router.push(`/talent/${a.talentId}` as any)}
                  accessibilityRole="link"
                  accessibilityLabel={`View ${a.name}’s profile`}>
                  <Avatar uri={a.avatar} size={50} ring={false} />
                  <View style={{ flex: 1 }}>
                    <View style={styles.nameRow}>
                      <Text style={[styles.name, { color: colors.text }]}>{a.name}</Text>
                      <MaterialCommunityIcons name="check-decagram" size={15} color={colors.primary} />
                    </View>
                    <Text style={[styles.title, { color: colors.textSecondary }]} numberOfLines={1}>
                      {a.title}
                    </Text>
                    <View style={styles.meta}>
                      <Ionicons name="star" size={12} color={colors.accentAmber} />
                      <Text style={[styles.metaText, { color: colors.text }]}>{a.rating.toFixed(1)}</Text>
                      <Text style={[styles.metaText, { color: colors.textSecondary }]}>· {a.jobs} jobs</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </Pressable>

                <View style={[styles.bid, { backgroundColor: colors.backgroundElement }]}>
                  <View>
                    <Text style={[styles.bidLabel, { color: colors.textSecondary }]}>Bid</Text>
                    <Text style={[styles.bidValue, { color: colors.text }]}>GH₵ {a.bid.toLocaleString()}</Text>
                  </View>
                  <View style={[styles.bidDiv, { backgroundColor: colors.border }]} />
                  <View>
                    <Text style={[styles.bidLabel, { color: colors.textSecondary }]}>Delivery</Text>
                    <Text style={[styles.bidValue, { color: colors.text }]}>{a.days} days</Text>
                  </View>
                </View>

                <Text style={[styles.proposal, { color: colors.textSecondary }]}>{a.proposal}</Text>
                <View style={styles.skills}>
                  {a.skills.map((s) => (
                    <Chip key={s} label={s} size="sm" />
                  ))}
                </View>

                <View style={styles.actions}>
                  <Button label="Message" variant="soft" size="md" style={{ flex: 1 }} onPress={() => router.push('/chat/t_2' as any)} />
                  <Button label="Hire" size="md" style={{ flex: 1 }} onPress={() => hire(a)} />
                </View>
              </GlassCard>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>

      <SuccessOverlay
        visible={!!hired}
        title={`${hired?.name.split(' ')[0] ?? ''} is hired`}
        subtitle="Milestone 1 is funded in escrow. They’ve been notified to start."
        onDismiss={() => {
          setHired(null);
          router.replace('/contracts');
        }}
        dismissLabel="View contract"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Layout.margin, paddingTop: 8, paddingBottom: 40 },
  summary: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  summaryText: { fontSize: 13 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  name: { fontSize: 16, fontWeight: '600' },
  title: { fontSize: 13, marginTop: 1 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4 },
  metaText: { fontSize: 12 },
  bid: { flexDirection: 'row', alignItems: 'center', gap: 18, padding: 12, borderRadius: Radius.md, marginTop: 14 },
  bidDiv: { width: 1, alignSelf: 'stretch' },
  bidLabel: { fontSize: 11 },
  bidValue: { fontSize: 15, fontWeight: '600', marginTop: 2, fontVariant: ['tabular-nums'] },
  proposal: { fontSize: 13, lineHeight: 19, marginTop: 12 },
  skills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 16 },
});
