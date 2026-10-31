import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { useRole } from '@/contexts/RoleContext';
import { useVerification } from '@/contexts/VerificationContext';
import { Button, GlassCard, ScreenBackground, SectionHeader, StatusPill, TopBar } from '@/components/ds';
import { MethodId, PayMethods, SummaryRow } from '@/components/payments';
import { SuccessOverlay } from '@/components/success-overlay';
import { Gradients, Layout, Radius, Shadows } from '@/constants/theme';

/** One-time verification fee (placeholder pricing until the backend sets it). */
const FEE = { freelancer: 50, client: 150 } as const;

const BENEFITS = {
  freelancer: [
    { icon: 'shield-checkmark' as const, title: 'Trusted badge', text: 'Shown on your profile and every proposal' },
    { icon: 'lock-open' as const, title: 'Verified-only jobs', text: 'Apply to jobs that require a Ghana Card check' },
    { icon: 'trending-up' as const, title: 'Ranked higher', text: 'Appear first when clients search talent' },
    { icon: 'flash' as const, title: 'Faster payouts', text: 'Withdrawals skip the manual review queue' },
  ],
  client: [
    { icon: 'people' as const, title: 'Hire freelancers', text: 'Invite and hire anyone on DevPay' },
    { icon: 'wallet' as const, title: 'Bigger escrow', text: 'Fund milestones up to GH₵ 50,000' },
    { icon: 'shield-checkmark' as const, title: 'Verified client badge', text: 'Top freelancers reply to verified clients first' },
    { icon: 'help-buoy' as const, title: 'Priority disputes', text: 'Your cases are reviewed first' },
  ],
};

export default function VerificationScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { role, isClient } = useRole();
  const { identity, paid, verified, completePayment } = useVerification();
  const insets = useSafeAreaInsets();
  const [method, setMethod] = useState<MethodId>('momo');
  const [paying, setPaying] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const fee = FEE[role];
  const step = !identity ? 1 : !paid ? 2 : 3;

  const pay = () => {
    setPaying(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setTimeout(() => {
      setPaying(false);
      completePayment();
      setCelebrate(true);
    }, 1300);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScreenBackground height={420} />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <TopBar title="Get verified" />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={[styles.hero, Shadows.lifted]}>
            <LinearGradient colors={Gradients.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroInner}>
              <View style={styles.heroBadge}>
                <MaterialCommunityIcons name={verified ? 'check-decagram' : 'shield-account'} size={30} color={colors.primaryText} />
              </View>
              <Text style={styles.heroTitle}>{verified ? 'You’re verified' : isClient ? 'Become a verified client' : 'Become a Trusted freelancer'}</Text>
              <Text style={styles.heroSub}>
                {verified ? 'All verified features are unlocked on your account.' : `Two quick steps · one-time GH₵ ${fee}`}
              </Text>
              <View style={styles.progress}>
                {[1, 2, 3].map((n) => (
                  <View key={n} style={[styles.progressSeg, { backgroundColor: n < step || verified ? '#FFFFFF' : 'rgba(255,255,255,0.3)' }]} />
                ))}
              </View>
            </LinearGradient>
          </View>

          <SectionHeader title="Steps" style={styles.gap} />
          <View style={{ gap: 12 }}>
            <StepCard
              n={1}
              done={identity}
              active={step === 1}
              title={isClient ? 'Business documents' : 'Ghana Card'}
              text={isClient ? 'Registration, GRA TIN and director’s ID' : 'Your PIN and photos of both sides'}
            />
            <StepCard
              n={2}
              done={paid}
              active={step === 2}
              title="Verification fee"
              text={`GH₵ ${fee}.00 one-time, paid with MoMo or card`}
            />
            <StepCard n={3} done={verified} active={false} title="Features unlocked" text="Your badge appears straight away" />
          </View>

          {step === 2 && (
            <>
              <SectionHeader title="Pay the fee" style={styles.gap} />
              <PayMethods
                value={method}
                onChange={setMethod}
                methods={[
                  { id: 'momo', name: 'MTN MoMo', detail: '024 123 4567' },
                  { id: 'telecel', name: 'Telecel Cash', detail: 'Approve the prompt on your phone' },
                  { id: 'card', name: 'Visa / Mastercard', detail: 'Processed by Paystack' },
                ]}
              />
              <GlassCard style={{ marginTop: 14 }}>
                <SummaryRow label={isClient ? 'Business verification' : 'Ghana Card verification'} value={`GH₵ ${fee}.00`} />
                <SummaryRow label="Renewal" value="Never" />
                <View style={[styles.hr, { backgroundColor: colors.border }]} />
                <SummaryRow label="Total" value={`GH₵ ${fee}.00`} strong />
              </GlassCard>
            </>
          )}

          <SectionHeader title={verified ? 'Unlocked for you' : 'What you unlock'} style={styles.gap} />
          <GlassCard padded={false} style={{ paddingHorizontal: 16 }}>
            {BENEFITS[role].map((b, i) => (
              <View key={b.title} style={[styles.benefit, i < BENEFITS[role].length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}>
                <View style={[styles.bIcon, { backgroundColor: verified ? colors.greenSoft : colors.primaryWash }]}>
                  <Ionicons name={b.icon} size={18} color={verified ? colors.accentGreen : colors.navActive} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.bTitle, { color: colors.text }]}>{b.title}</Text>
                  <Text style={[styles.bText, { color: colors.textSecondary }]}>{b.text}</Text>
                </View>
                {verified && <Ionicons name="checkmark-circle" size={20} color={colors.accentGreen} />}
              </View>
            ))}
          </GlassCard>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          {verified ? (
            <Button label="Done" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
          ) : step === 1 ? (
            <Button label={isClient ? 'Verify my business' : 'Verify my Ghana Card'} onPress={() => router.push({ pathname: '/kyc', params: { from: 'verification' } })} />
          ) : (
            <Button label={`Pay GH₵ ${fee}.00 & get verified`} loading={paying} onPress={pay} />
          )}
        </View>
      </SafeAreaView>

      <SuccessOverlay
        visible={celebrate}
        type="verified"
        title={isClient ? 'Verified client' : 'You’re Trusted'}
        subtitle="Your badge is live and verified features are unlocked."
        dismissLabel="See what’s unlocked"
        onDismiss={() => setCelebrate(false)}
      />
    </View>
  );
}

function StepCard({
  n,
  done,
  active,
  title,
  text,
  action,
}: {
  n: number;
  done: boolean;
  active: boolean;
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <GlassCard style={[styles.step, active && { borderWidth: 1.5, borderColor: colors.primary }]}>
      <View
        style={[
          styles.stepNum,
          { backgroundColor: done ? colors.accentGreen : active ? colors.primary : colors.backgroundElement },
        ]}>
        {done ? (
          <Ionicons name="checkmark" size={16} color="#FFFFFF" />
        ) : (
          <Text style={[styles.stepNumText, { color: active ? '#FFFFFF' : colors.textSecondary }]}>{n}</Text>
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.stepTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.stepText, { color: colors.textSecondary }]}>{text}</Text>
      </View>
      {action ?? (done ? <StatusPill label="Done" tone="green" /> : null)}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Layout.margin, paddingTop: 8, paddingBottom: 32 },
  hero: { borderRadius: Radius.xl },
  heroInner: { borderRadius: Radius.xl, padding: 20, alignItems: 'flex-start' },
  heroBadge: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  heroTitle: { color: '#FFFFFF', fontSize: 21, fontWeight: '600', letterSpacing: -0.4, marginTop: 14 },
  heroSub: { color: '#FFFFFF', fontSize: 13, fontWeight: '500', marginTop: 4 },
  progress: { flexDirection: 'row', gap: 6, alignSelf: 'stretch', marginTop: 18 },
  progressSeg: { flex: 1, height: 5, borderRadius: 3 },
  gap: { marginTop: Layout.sectionGap },
  step: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepNum: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  stepNumText: { fontSize: 14, fontWeight: '600' },
  stepTitle: { fontSize: 15, fontWeight: '600' },
  stepText: { fontSize: 12, marginTop: 2 },
  hr: { height: 1, marginVertical: 6 },
  benefit: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  bIcon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  bTitle: { fontSize: 14, fontWeight: '600' },
  bText: { fontSize: 12, marginTop: 2 },
  footer: { paddingHorizontal: Layout.margin, paddingTop: 10 },
});
