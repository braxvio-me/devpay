import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useRole } from '@/contexts/RoleContext';
import { useVerification } from '@/contexts/VerificationContext';
import { FloatingTabBar, TabType } from '@/components/floating-tab-bar';
import { Avatar, Chip, GlassCard, IconButton, ListRow, ScreenBackground, SectionHeader, useNavClearance } from '@/components/ds';
import { CurrentUser } from '@/constants/media';
import { Gradients, Layout, Radius, Shadows } from '@/constants/theme';

const SKILLS = ['React Native', 'TypeScript', 'Expo', 'MoMo APIs', 'Figma'];

export default function ProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isClient, toggleRole } = useRole();
  const navClearance = useNavClearance();
  const [available, setAvailable] = useState(true);
  const { verified, identity } = useVerification();

  const verification = verified ? 100 : identity ? 88 : isClient ? 60 : 76;
  const stats = isClient
    ? [
        { value: '12', label: 'Hires' },
        { value: '4.9', label: 'Rating' },
        { value: 'GH₵ 48k', label: 'Escrowed' },
      ]
    : [
        { value: '23', label: 'Jobs done' },
        { value: '5.0', label: 'Rating' },
        { value: '98%', label: 'On time' },
      ];

  const onTab = (tab: TabType) => {
    if (tab === 'home') router.replace('/');
    if (tab === 'jobs') router.push(isClient ? '/explore' : '/contracts');
    if (tab === 'chats') router.push('/messages');
  };

  return (
    <View style={{ flex: 1 }}>
      <ScreenBackground height={420} />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <IconButton
              icon="chevron-back"
              accessibilityLabel="Go back"
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            />
            <Text style={[styles.title, { color: colors.text }]} accessibilityRole="header">
              Profile
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <IconButton icon="notifications-outline" badge accessibilityLabel="Notifications" onPress={() => router.push('/notifications')} />
            <IconButton icon="settings-outline" accessibilityLabel="Settings" onPress={() => router.push('/settings')} />
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Layout.margin, paddingBottom: navClearance }}>
          <GlassCard style={styles.identity}>
            <Avatar uri={CurrentUser.avatar} size={84} online={available} />
            <View style={styles.nameRow}>
              <Text style={[styles.name, { color: colors.text }]}>{CurrentUser.name}</Text>
              {verified && <MaterialCommunityIcons name="check-decagram" size={18} color={colors.primary} />}
            </View>
            <Text style={[styles.headline, { color: colors.textSecondary }]}>
              {isClient ? 'Hiring for Kente Labs' : 'Senior React Native Engineer'}
            </Text>
            <View style={styles.loc}>
              <Ionicons name="location-sharp" size={13} color={colors.textSecondary} />
              <Text style={[styles.locText, { color: colors.textSecondary }]}>{CurrentUser.location}</Text>
            </View>

            <View style={[styles.stats, { borderTopColor: colors.border }]}>
              {stats.map((s, i) => (
                <React.Fragment key={s.label}>
                  {i > 0 && <View style={[styles.statDiv, { backgroundColor: colors.border }]} />}
                  <View style={styles.stat}>
                    <Text style={[styles.statValue, { color: colors.text }]}>{s.value}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{s.label}</Text>
                  </View>
                </React.Fragment>
              ))}
            </View>
          </GlassCard>

          <Pressable onPress={() => router.push('/verification')} accessibilityRole="button" style={[styles.verify, Shadows.lifted]}>
            <LinearGradient colors={Gradients.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.verifyInner}>
              <View style={{ flex: 1, gap: 8 }}>
                <Text style={styles.verifyTitle}>{verified ? 'Verified · all features unlocked' : `Profile ${verification}% complete`}</Text>
                <View style={styles.track}>
                  <View style={[styles.fill, { width: `${verification}%` }]} />
                </View>
                <Text style={styles.verifySub}>
                  {verified ? 'See your verified benefits' : isClient ? 'Get verified to hire and fund larger escrows' : 'Get verified to earn the Trusted badge'}
                </Text>
              </View>
              <View style={styles.verifyBtn}>
                <Ionicons name="arrow-forward" size={18} color={colors.primaryText} />
              </View>
            </LinearGradient>
          </Pressable>

          <View style={styles.duo}>
            <GlassCard style={styles.duoCard} onPress={toggleRole} accessibilityLabel={isClient ? 'Switch to freelancer' : 'Switch to client'}>
              <View style={[styles.duoIcon, { backgroundColor: colors.primaryWash }]}>
                <Ionicons name="swap-horizontal" size={20} color={colors.navActive} />
              </View>
              <Text style={[styles.duoTitle, { color: colors.text }]}>{isClient ? 'Switch to Freelancer' : 'Switch to Client'}</Text>
              <Text style={[styles.duoSub, { color: colors.textSecondary }]}>{isClient ? 'Find work and get paid' : 'Post jobs and hire'}</Text>
            </GlassCard>
            <GlassCard style={styles.duoCard}>
              <View style={styles.duoTop}>
                <View style={[styles.duoIcon, { backgroundColor: available ? colors.greenSoft : colors.backgroundElement }]}>
                  <Ionicons name="radio-button-on" size={20} color={available ? colors.accentGreen : colors.textMuted} />
                </View>
                <Switch
                  value={available}
                  onValueChange={setAvailable}
                  trackColor={{ true: colors.accentGreen, false: colors.backgroundSelected }}
                  thumbColor="#FFFFFF"
                  accessibilityLabel="Available for work"
                />
              </View>
              <Text style={[styles.duoTitle, { color: colors.text }]}>{available ? 'Available' : 'Away'}</Text>
              <Text style={[styles.duoSub, { color: colors.textSecondary }]}>{available ? 'Clients can invite you' : 'Hidden from search'}</Text>
            </GlassCard>
          </View>

          {!isClient && (
            <>
              <SectionHeader title="Skills" onSeeAll={() => router.push('/edit-profile')} actionLabel="Edit" style={styles.gap} />
              <View style={styles.skills}>
                {SKILLS.map((s) => (
                  <Chip key={s} label={s} size="sm" />
                ))}
              </View>
            </>
          )}

          <SectionHeader title="Account" style={styles.gap} />
          <GlassCard padded={false} style={{ paddingHorizontal: 16 }}>
            <ListRow icon="person-outline" label="Personal information" onPress={() => router.push('/edit-profile')} />
            <ListRow
              icon="shield-checkmark-outline"
              label="Verification"
              value={verified ? 'Verified' : identity ? 'Fee due' : 'Not verified'}
              onPress={() => router.push('/verification')}
            />
            <ListRow icon="wallet-outline" label={isClient ? 'Escrow wallet' : 'Earnings'} onPress={() => router.push('/earnings')} />
            <ListRow icon="phone-portrait-outline" label="Payout methods" value="MTN MoMo" onPress={() => router.push('/withdraw')} />
            <ListRow icon="diamond-outline" label="DevPay Pro" onPress={() => router.push('/premium')} last />
          </GlassCard>

          <SectionHeader title="Preferences" style={styles.gap} />
          <GlassCard padded={false} style={{ paddingHorizontal: 16 }}>
            <ListRow icon="contrast-outline" label="Appearance" onPress={() => router.push('/appearance')} />
            <ListRow icon="settings-outline" label="Settings" onPress={() => router.push('/settings')} />
            <ListRow icon="log-out-outline" label="Log out" danger onPress={() => router.push('/logout')} last />
          </GlassCard>
        </ScrollView>
      </SafeAreaView>

      <FloatingTabBar activeTab="profile" onSelectTab={onTab} onCenterActionPress={() => router.push(isClient ? '/job/create' : '/explore')} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: Layout.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.margin,
    marginBottom: 6,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { fontSize: 26, fontWeight: '600', letterSpacing: -0.6 },
  identity: { alignItems: 'center', paddingTop: 22 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  name: { fontSize: 21, fontWeight: '600', letterSpacing: -0.4 },
  headline: { fontSize: 14, marginTop: 2 },
  loc: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 6 },
  locText: { fontSize: 12 },
  stats: { flexDirection: 'row', alignSelf: 'stretch', marginTop: 18, paddingTop: 14, borderTopWidth: 1 },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statDiv: { width: 1 },
  statValue: { fontSize: 17, fontWeight: '600', fontVariant: ['tabular-nums'] },
  statLabel: { fontSize: 12 },
  verify: { marginTop: 16, borderRadius: Radius.xl },
  verifyInner: { borderRadius: Radius.xl, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 },
  verifyTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  track: { height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.3)', overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3, backgroundColor: '#FFFFFF' },
  verifySub: { color: '#FFFFFF', fontSize: 12, fontWeight: '500' },
  verifyBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  duo: { flexDirection: 'row', gap: 12, marginTop: 16 },
  duoCard: { flex: 1, gap: 4 },
  duoTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  duoIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  duoTitle: { fontSize: 15, fontWeight: '600' },
  duoSub: { fontSize: 12 },
  gap: { marginTop: Layout.sectionGap },
  skills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
