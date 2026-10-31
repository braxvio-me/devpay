import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { useRole } from '@/contexts/RoleContext';
import { Button, GlassCard, PressableScale, ScreenBackground, SectionHeader, Segmented, Sheet, TopBar } from '@/components/ds';
import { SummaryRow } from '@/components/payments';
import { SuccessOverlay } from '@/components/success-overlay';
import { Gradients, Layout, Radius, Shadows } from '@/constants/theme';

type PlanId = 'starter' | 'pro' | 'elite';
type BillingCycle = 'monthly' | 'annually';

interface Plan {
  id: PlanId;
  name: string;
  badge?: string;
  monthlyPrice: number;
  annualMonthlyPrice: number;
  description: string;
  color: string;
  gradientColors: [string, string];
  features: string[];
}

const FREELANCER_PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 0,
    annualMonthlyPrice: 0,
    description: 'Get started on DevPay',
    color: '#6B7378',
    gradientColors: ['#4F5B63', '#24323A'],
    features: [
      '5 job proposals / month',
      'Basic Ghana Card (NIA) verification',
      'Standard escrow protection',
      '3% platform fee on payouts',
      'Community chat support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    badge: 'MOST POPULAR',
    monthlyPrice: 49,
    annualMonthlyPrice: 39,
    description: 'Serious freelancers scale faster',
    color: '#2C88B4',
    gradientColors: ['#2C88B4', '#2479A6'],
    features: [
      'Unlimited job proposals',
      'Priority NIA-verified badge',
      'Featured profile in talent search',
      'Reduced 1.5% platform fee',
      'Instant MoMo payouts (no hold)',
      'Milestone dispute priority support',
      'Client direct-message unlock',
      'Weekly earnings analytics',
    ],
  },
  {
    id: 'elite',
    name: 'Elite',
    badge: 'BEST VALUE',
    monthlyPrice: 89,
    annualMonthlyPrice: 69,
    description: 'Top-tier developer positioning',
    color: '#3B7493',
    gradientColors: ['#3B7493', '#3B7493'],
    features: [
      'Everything in Pro',
      'Top of talent search (pinned)',
      'Elite developer shield badge',
      '0% platform fee on payouts',
      'Contract PDF generation & export',
      'Dedicated account manager',
      'Early access to enterprise clients',
      'Portfolio website on devpay',
      'API access for portfolio integrations',
    ],
  },
];

const CLIENT_PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Basic',
    monthlyPrice: 0,
    annualMonthlyPrice: 0,
    description: 'Hire your first developer',
    color: '#6B7378',
    gradientColors: ['#4F5B63', '#24323A'],
    features: [
      '1 active job post at a time',
      'Escrow-protected milestones',
      'Standard developer search',
      '2% escrow management fee',
      'Basic dispute resolution',
    ],
  },
  {
    id: 'pro',
    name: 'Business',
    badge: 'MOST POPULAR',
    monthlyPrice: 99,
    annualMonthlyPrice: 79,
    description: 'Scale your tech hiring in Ghana',
    color: '#2C88B4',
    gradientColors: ['#2C88B4', '#2479A6'],
    features: [
      'Up to 5 active job posts',
      'Access to NIA-verified talent only',
      'Priority proposal delivery',
      'Reduced 1% escrow fee',
      'Instant milestone release',
      'Contract PDF export',
      'Team collaboration (3 seats)',
      'Dedicated escrow account manager',
    ],
  },
  {
    id: 'elite',
    name: 'Enterprise',
    badge: 'UNLIMITED',
    monthlyPrice: 249,
    annualMonthlyPrice: 199,
    description: 'Unlimited hiring power for teams',
    color: '#3B7493',
    gradientColors: ['#3B7493', '#3B7493'],
    features: [
      'Everything in Business',
      'Unlimited active job posts',
      'Dedicated talent curator (human)',
      '0% escrow management fee',
      'Multi-milestone contract builder',
      'Unlimited team seats',
      'Custom SLA & invoice integration',
      'API access for ATS/HRMS sync',
      'Monthly workforce insight reports',
    ],
  },
];

const FAQ = [
  {
    q: 'How is billing handled?',
    a: 'You’re billed monthly or yearly through MTN MoMo, Telecel Cash or bank transfer, with an SMS receipt each cycle.',
  },
  {
    q: 'Can I downgrade or cancel?',
    a: 'Yes, anytime from Settings. Your perks stay active until the end of the billing period.',
  },
  {
    q: 'What happens to my active contracts?',
    a: 'Nothing changes. Contracts, escrow and milestones carry on as they are.',
  },
];

export default function PremiumScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { isClient } = useRole();
  const insets = useSafeAreaInsets();
  const plans = isClient ? CLIENT_PLANS : FREELANCER_PLANS;

  const [selected, setSelected] = useState<PlanId>('pro');
  const [billing, setBilling] = useState<BillingCycle>('monthly');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const plan = plans.find((p) => p.id === selected)!;
  const price = billing === 'annually' ? plan.annualMonthlyPrice : plan.monthlyPrice;

  const confirm = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setConfirmOpen(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      setTimeout(() => setDone(true), 200);
    }, 1500);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScreenBackground height={420} />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <TopBar title="DevPay Pro" />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <Text style={[styles.hero, { color: colors.text }]}>
            {isClient ? 'Hire faster with lower fees' : 'Win more work, keep more of it'}
          </Text>
          <Text style={[styles.heroSub, { color: colors.textSecondary }]}>Pick a plan. Change or cancel anytime.</Text>

          <Segmented<BillingCycle>
            value={billing}
            onChange={setBilling}
            options={[
              { value: 'monthly', label: 'Monthly' },
              { value: 'annually', label: 'Yearly · save 20%' },
            ]}
            style={{ marginTop: 20 }}
          />

          <View style={{ gap: 14, marginTop: 18 }}>
            {plans.map((p) => {
              const active = p.id === selected;
              const amount = billing === 'annually' ? p.annualMonthlyPrice : p.monthlyPrice;
              const featured = p.id === 'pro';
              const fg = featured ? '#FFFFFF' : colors.text;
              const sub = featured ? '#FFFFFF' : colors.textSecondary;
              const body = (
                <>
                  <View style={styles.planTop}>
                    <View style={{ flex: 1 }}>
                      <View style={styles.planNameRow}>
                        <Text style={[styles.planName, { color: fg }]}>{p.name}</Text>
                        {p.badge && (
                          <View style={[styles.badge, { backgroundColor: featured ? 'rgba(255,255,255,0.22)' : colors.primarySoft }]}>
                            <Text style={[styles.badgeText, { color: featured ? '#FFFFFF' : colors.primaryText }]}>
                              {p.badge.charAt(0) + p.badge.slice(1).toLowerCase()}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text style={[styles.planDesc, { color: sub }]}>{p.description}</Text>
                    </View>
                    <View style={[styles.radio, { borderColor: featured ? '#FFFFFF' : active ? colors.primary : colors.backgroundSelected }]}>
                      {active && <View style={[styles.radioDot, { backgroundColor: featured ? '#FFFFFF' : colors.primary }]} />}
                    </View>
                  </View>
                  <Text style={[styles.price, { color: fg }]}>
                    {amount === 0 ? 'Free' : `GH₵ ${amount}`}
                    {amount > 0 && <Text style={[styles.per, { color: sub }]}> / month</Text>}
                  </Text>
                  {active && (
                    <View style={styles.features}>
                      {p.features.map((f) => (
                        <View key={f} style={styles.feature}>
                          <Ionicons name="checkmark-circle" size={16} color={featured ? '#FFFFFF' : colors.accentGreen} />
                          <Text style={[styles.featureText, { color: fg }]}>{f}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </>
              );
              return (
                <PressableScale
                  key={p.id}
                  onPress={() => setSelected(p.id)}
                  scaleTo={0.985}
                  accessibilityLabel={`${p.name} plan`}
                  style={[
                    styles.plan,
                    featured ? Shadows.lifted : isDark ? { borderWidth: 1, borderColor: colors.border } : Shadows.soft,
                    !featured && { backgroundColor: colors.surface },
                    active && !featured && { borderWidth: 1.5, borderColor: colors.primary },
                  ]}>
                  {featured ? (
                    <LinearGradient colors={Gradients.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.planInner}>
                      {body}
                    </LinearGradient>
                  ) : (
                    <View style={styles.planInner}>{body}</View>
                  )}
                </PressableScale>
              );
            })}
          </View>

          <SectionHeader title="Questions" style={{ marginTop: Layout.sectionGap }} />
          <GlassCard padded={false} style={{ paddingHorizontal: 16 }}>
            {FAQ.map((f, i) => (
              <Pressable
                key={f.q}
                onPress={() => setOpenFaq(openFaq === i ? null : i)}
                accessibilityRole="button"
                accessibilityState={{ expanded: openFaq === i }}
                style={[styles.faq, i < FAQ.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}>
                <View style={styles.faqTop}>
                  <Text style={[styles.faqQ, { color: colors.text }]}>{f.q}</Text>
                  <Ionicons name={openFaq === i ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textMuted} />
                </View>
                {openFaq === i && <Text style={[styles.faqA, { color: colors.textSecondary }]}>{f.a}</Text>}
              </Pressable>
            ))}
          </GlassCard>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Button
            label={price === 0 ? 'You’re on the free plan' : `Upgrade to ${plan.name} · GH₵ ${price}/mo`}
            disabled={price === 0}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
              setConfirmOpen(true);
            }}
          />
        </View>
      </SafeAreaView>

      <Sheet visible={confirmOpen} onClose={() => setConfirmOpen(false)} title={`Confirm ${plan.name}`}>
        <GlassCard style={{ marginTop: 4 }}>
          <SummaryRow label="Plan" value={plan.name} />
          <SummaryRow label="Billing" value={billing === 'annually' ? 'Yearly' : 'Monthly'} />
          <SummaryRow label="Pay with" value="MTN MoMo · 024 123 4567" />
          <View style={[styles.hr, { backgroundColor: colors.border }]} />
          <SummaryRow
            label={billing === 'annually' ? 'Due today (12 months)' : 'Due today'}
            value={`GH₵ ${billing === 'annually' ? price * 12 : price}`}
            strong
          />
        </GlassCard>
        <Text style={[styles.sheetNote, { color: colors.textSecondary }]}>Approve the MoMo prompt on your phone to finish.</Text>
        <Button label="Pay & upgrade" loading={processing} onPress={confirm} style={{ marginTop: 14 }} />
      </Sheet>

      <SuccessOverlay
        visible={done}
        type="verified"
        title={`Welcome to ${plan.name}`}
        subtitle="Your new perks are active now."
        dismissLabel="Done"
        onDismiss={() => {
          setDone(false);
          router.back();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Layout.margin, paddingTop: 8, paddingBottom: 32 },
  hero: { fontSize: 26, fontWeight: '600', letterSpacing: -0.6 },
  heroSub: { fontSize: 14, marginTop: 6 },
  plan: { borderRadius: Radius.xl },
  planInner: { borderRadius: Radius.xl, padding: 18 },
  planTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  planNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  planName: { fontSize: 18, fontWeight: '600' },
  badge: { paddingHorizontal: 8, height: 22, borderRadius: Radius.pill, justifyContent: 'center' },
  badgeText: { fontSize: 11, fontWeight: '600' },
  planDesc: { fontSize: 13, marginTop: 3 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  price: { fontSize: 28, fontWeight: '600', letterSpacing: -0.6, marginTop: 14, fontVariant: ['tabular-nums'] },
  per: { fontSize: 14, fontWeight: '400', letterSpacing: 0 },
  features: { gap: 8, marginTop: 14 },
  feature: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { fontSize: 13, flex: 1 },
  faq: { paddingVertical: 16 },
  faqTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  faqQ: { fontSize: 14, fontWeight: '500', flex: 1 },
  faqA: { fontSize: 13, lineHeight: 19, marginTop: 8 },
  footer: { paddingHorizontal: Layout.margin, paddingTop: 10 },
  hr: { height: 1, marginVertical: 6 },
  sheetNote: { fontSize: 12, marginTop: 12, textAlign: 'center' },
});
