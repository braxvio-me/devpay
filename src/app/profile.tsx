import React, { useEffect, useState } from 'react';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { View, StyleSheet, ScrollView, Pressable, Share } from 'react-native';
import { Image } from 'expo-image';
import { Dialog } from '@/lib/dialog';
import { Text } from '@/components/ui-text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useRole } from '@/contexts/RoleContext';
import { useVerification } from '@/contexts/VerificationContext';
import { FloatingTabBar, TabType } from '@/components/floating-tab-bar';
import {
  Avatar,
  Chip,
  GlassCard,
  IconButton,
  ListRow,
  ScreenBackground,
  SectionHeader,
  useNavClearance,
  Switch,
} from '@/components/ds';
import { useCurrentUser } from '@/contexts/AuthContext';
import { Layout, Radius, Shadows } from '@/constants/theme';

/** Green "live" dot with a soft pulse while available. */
function LiveDot({ on }: { on: boolean }) {
  const { colors } = useTheme();
  const pulse = useSharedValue(0);
  useEffect(() => {
    if (!on) {
      cancelAnimation(pulse);
      pulse.set(0);
      return;
    }
    pulse.set(withRepeat(withTiming(1, { duration: 1600, easing: Easing.out(Easing.quad) }), -1));
  }, [on, pulse]);
  const ring = useAnimatedStyle(() => ({ opacity: 0.5 * (1 - pulse.get()), transform: [{ scale: 1 + pulse.get() * 1.6 }] }));
  const tone = on ? colors.accentGreen : colors.textMuted;
  return (
    <View style={styles.live} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
      {on && <Animated.View style={[styles.liveDot, { backgroundColor: tone, position: 'absolute' }, ring]} />}
      <View style={[styles.liveDot, { backgroundColor: tone }]} />
    </View>
  );
}

const SKILLS = ['React Native', 'TypeScript', 'Expo', 'MoMo APIs', 'Figma'];

export default function ProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isClient } = useRole();
  const me = useCurrentUser();
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
    if (tab === 'jobs') router.push('/contracts');
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
          {/* Identity: full-width cover, overlapping avatar, open stats. No card. */}
          <View style={[styles.cover, { backgroundColor: colors.action }]}>
            <View style={[styles.coverShape, { width: 260, height: 260, right: -70, top: -120, backgroundColor: '#2279A8' }]} />
            <View style={[styles.coverShape, { width: 150, height: 150, right: -20, top: -50, backgroundColor: '#2A86B6' }]} />
            <Image source={require('../../assets/images/logo-mark.png')} tintColor="#2E8DBE" contentFit="contain" style={styles.coverMark} />
            <View style={styles.coverRole}>
              <Ionicons name={isClient ? 'briefcase' : 'code-slash'} size={12} color="#FFFFFF" />
              <Text style={styles.coverRoleText}>{isClient ? 'CLIENT' : 'FREELANCER'}</Text>
            </View>
          </View>

          <View style={styles.idRow}>
            <View style={[styles.avatarRing, { backgroundColor: colors.background }]}>
              <Avatar uri={me.avatar} size={92} online={available} />
            </View>
            <View style={styles.idActions}>
              <Pressable
                onPress={() => router.push('/edit-profile')}
                accessibilityRole="button"
                style={({ pressed }) => [styles.editBtn, { borderColor: colors.border, backgroundColor: pressed ? colors.backgroundElement : colors.surface }]}>
                <Ionicons name="create-outline" size={16} color={colors.text} />
                <Text style={[styles.editText, { color: colors.text }]}>Edit profile</Text>
              </Pressable>
              <Pressable
                onPress={() => Share.share({ message: `${me.name} on DevPay · ${me.headline}` }).catch(() => {})}
                accessibilityRole="button"
                accessibilityLabel="Share profile"
                style={({ pressed }) => [styles.shareBtn, { borderColor: colors.border, backgroundColor: pressed ? colors.backgroundElement : colors.surface }]}>
                <Ionicons name="share-outline" size={17} color={colors.text} />
              </Pressable>
            </View>
          </View>

          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: colors.text }]}>{me.name}</Text>
            {verified && <Ionicons name="checkmark-circle" size={20} color={colors.action} accessibilityLabel="Verified" />}
          </View>
          <Text style={[styles.headline, { color: colors.text }]}>{me.headline}</Text>
          <View style={styles.metaRow}>
            <View style={styles.meta}>
              <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>{me.location}</Text>
            </View>
            <View style={styles.meta}>
              <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>Joined 2025</Text>
            </View>
          </View>

          <View style={[styles.stats, { borderColor: colors.border }]}>
            {stats.map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <View style={[styles.statDiv, { backgroundColor: colors.border }]} />}
                <View style={styles.stat}>
                  <View style={styles.statTop}>
                    <Text style={[styles.statValue, { color: colors.text }]}>{s.value}</Text>
                    {s.label === 'Rating' && <Ionicons name="star" size={14} color="#E8A317" />}
                  </View>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{s.label}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>

          <Pressable onPress={() => router.push('/verification')} accessibilityRole="button" style={[styles.verify, Shadows.lifted]}>
            <View style={[styles.verifyInner, { backgroundColor: colors.feature }]}>
              <View style={{ flex: 1, gap: 8 }}>
                <Text style={styles.verifyTitle}>{verified ? 'Verified · all features unlocked' : `Profile ${verification}% complete`}</Text>
                <View style={styles.track}>
                  <View style={[styles.fill, { width: `${verification}%` }]} />
                </View>
                <Text style={styles.verifySub}>
                  {verified ? 'See your verified benefits' : isClient ? 'Get verified to hire and fund larger escrows' : 'Get verified to earn the Verified badge'}
                </Text>
              </View>
              <View style={styles.verifyBtn}>
                <Ionicons name="arrow-forward" size={18} color={colors.primaryText} />
              </View>
            </View>
          </Pressable>

          {/* Flat status strip: no cards, just two lines with hairline dividers. */}
          <View style={[styles.strip, { borderColor: colors.border }]}>
            <Pressable
              onPress={() =>
                Dialog.alert(
                  `${isClient ? 'Client' : 'Freelancer'} account`,
                  `Each DevPay account has one role. To ${isClient ? 'find work' : 'hire'}, sign up again with a different phone number.`
                )
              }
              accessibilityRole="button"
              accessibilityLabel={`Account type: ${isClient ? 'client' : 'freelancer'}. One role per account.`}
              style={({ pressed }) => [styles.stripRow, pressed && { opacity: 0.6 }]}>
              <Ionicons name={isClient ? 'briefcase-outline' : 'laptop-outline'} size={22} color={colors.action} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.stripTitle, { color: colors.text }]}>{isClient ? 'Client account' : 'Freelancer account'}</Text>
                <Text style={[styles.stripSub, { color: colors.textSecondary }]}>One role per account</Text>
              </View>
              <Ionicons name="lock-closed" size={14} color={colors.textMuted} />
            </Pressable>
            <View style={[styles.stripLine, { backgroundColor: colors.border }]} />
            <View style={styles.stripRow}>
              <LiveDot on={available} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.stripTitle, { color: colors.text }]}>{available ? 'Available for work' : 'Away'}</Text>
                <Text style={[styles.stripSub, { color: colors.textSecondary }]}>
                  {available ? (isClient ? 'Freelancers can message you' : 'Clients can invite you') : 'Hidden from search'}
                </Text>
              </View>
              <Switch value={available} onValueChange={setAvailable} accessibilityLabel="Available for work" />
            </View>
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
              icon="id-card-outline"
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

      <FloatingTabBar activeTab="profile" onSelectTab={onTab} onCenterActionPress={() => router.push('/assistant')} />
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
  cover: { height: 132, marginHorizontal: -Layout.margin, marginTop: 4, overflow: 'hidden' },
  coverShape: { position: 'absolute', borderRadius: 999 },
  coverMark: { position: 'absolute', left: Layout.margin + 4, bottom: -18, width: 150, height: 102, opacity: 0.9 },
  coverRole: { position: 'absolute', right: Layout.margin, bottom: 14, flexDirection: 'row', alignItems: 'center', gap: 6 },
  coverRoleText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700', letterSpacing: 1.4 },
  idRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: -48 },
  avatarRing: { padding: 4, borderRadius: 60 },
  idActions: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 38, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1 },
  editText: { fontSize: 14, fontWeight: '600' },
  shareBtn: { width: 38, height: 38, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  name: { fontSize: 26, fontWeight: '700', letterSpacing: -0.7 },
  headline: { fontSize: 15, marginTop: 4 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 8 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 13 },
  stats: { flexDirection: 'row', marginTop: 18, paddingVertical: 14, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth },
  stat: { flex: 1, gap: 2 },
  statTop: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statDiv: { width: StyleSheet.hairlineWidth, marginRight: 16 },
  statValue: { fontSize: 22, fontWeight: '700', letterSpacing: -0.5, fontVariant: ['tabular-nums'] },
  statLabel: { fontSize: 12 },
  verify: { marginTop: 16, borderRadius: Radius.xl },
  verifyInner: { borderRadius: Radius.xl, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 },
  verifyTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  track: { height: 6, borderRadius: 3, backgroundColor: '#4A8FB5', overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3, backgroundColor: '#FFFFFF' },
  verifySub: { color: '#FFFFFF', fontSize: 12, fontWeight: '500' },
  verifyBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  gap: { marginTop: Layout.sectionGap },
  strip: { marginTop: 18, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth },
  stripRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  stripLine: { height: StyleSheet.hairlineWidth, marginLeft: 36 },
  stripTitle: { fontSize: 15, fontWeight: '600' },
  stripSub: { fontSize: 12, marginTop: 2 },
  live: { width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  liveDot: { width: 10, height: 10, borderRadius: 5 },
  skills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
