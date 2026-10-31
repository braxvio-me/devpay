import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useRole } from '@/contexts/RoleContext';
import * as Haptics from 'expo-haptics';

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
    color: '#64748B',
    gradientColors: ['#475569', '#334155'],
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
    color: '#0F73F7',
    gradientColors: ['#0F73F7', '#1D4ED8'],
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
    color: '#9333EA',
    gradientColors: ['#7C3AED', '#9333EA'],
    features: [
      'Everything in Pro',
      '⚡ Top of talent search (pinned)',
      'Elite developer shield badge',
      '0% platform fee on payouts',
      'Contract PDF generation & export',
      'Dedicated account manager',
      'Early access to enterprise clients',
      'Portfolio website (devpay.africa/u/you)',
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
    color: '#64748B',
    gradientColors: ['#475569', '#334155'],
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
    color: '#0F73F7',
    gradientColors: ['#0F73F7', '#1D4ED8'],
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
    color: '#9333EA',
    gradientColors: ['#7C3AED', '#9333EA'],
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

export default function PremiumScreen() {
  const router = useRouter();
  const { isDark, colors } = useTheme();
  const { isClient } = useRole();

  const plans = isClient ? CLIENT_PLANS : FREELANCER_PLANS;

  const [selectedPlan, setSelectedPlan] = useState<PlanId>('pro');
  const [billing, setBilling] = useState<BillingCycle>('monthly');
  const [upgradeModal, setUpgradeModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const currentPlan = plans.find((p) => p.id === selectedPlan)!;
  const price =
    billing === 'annually' ? currentPlan.annualMonthlyPrice : currentPlan.monthlyPrice;

  const handleUpgrade = () => {
    if (selectedPlan === 'starter') {
      Alert.alert('Already on Starter', 'You are currently on the free Starter plan.');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setUpgradeModal(true);
  };

  const handleConfirmPayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setUpgradeModal(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => setSuccessModal(true), 200);
    }, 1800);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View
          style={[
            styles.header,
            { backgroundColor: colors.surface, borderBottomColor: colors.border },
          ]}>
          <TouchableOpacity
            style={[
              styles.backBtn,
              { backgroundColor: colors.backgroundElement, borderColor: colors.border },
            ]}
            onPress={() => router.back()}
            activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>DevPay Premium</Text>
          <View style={styles.crownBadge}>
            <Ionicons name="star" size={14} color="#F59E0B" />
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Hero Section */}
          <LinearGradient
            colors={isDark ? ['#0B1120', '#1E1B4B'] : ['#0F73F7', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroSection}>
            <View style={styles.heroIconRow}>
              <View style={styles.heroBadge}>
                <Ionicons name="star" size={18} color="#F59E0B" />
                <Text style={styles.heroBadgeText}>DEVPAY PREMIUM</Text>
              </View>
            </View>
            <Text style={styles.heroTitle}>
              {isClient
                ? "Hire Ghana's Best Developers"
                : 'Get Hired Faster & Earn More'}
            </Text>
            <Text style={styles.heroSub}>
              {isClient
                ? 'Unlock unlimited job posts, zero escrow fees, and a dedicated hiring team.'
                : 'Top profile placement, 0% platform fees, and instant MoMo payouts.'}
            </Text>

            {/* Billing Toggle */}
            <View style={styles.billingToggleRow}>
              <TouchableOpacity
                style={[
                  styles.billingPill,
                  billing === 'monthly' && styles.billingPillActive,
                ]}
                onPress={() => {
                  setBilling('monthly');
                  Haptics.selectionAsync();
                }}>
                <Text
                  style={[
                    styles.billingPillText,
                    billing === 'monthly' && styles.billingPillTextActive,
                  ]}>
                  Monthly
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.billingPill,
                  billing === 'annually' && styles.billingPillActive,
                ]}
                onPress={() => {
                  setBilling('annually');
                  Haptics.selectionAsync();
                }}>
                <Text
                  style={[
                    styles.billingPillText,
                    billing === 'annually' && styles.billingPillTextActive,
                  ]}>
                  Annual
                </Text>
                <View style={styles.saveBadge}>
                  <Text style={styles.saveText}>Save 20%</Text>
                </View>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Plan Cards */}
          <View style={styles.plansSection}>
            <Text style={[styles.plansTitle, { color: colors.text }]}>Choose Your Plan</Text>
            {plans.map((plan) => {
              const planPrice =
                billing === 'annually' ? plan.annualMonthlyPrice : plan.monthlyPrice;
              const isSelected = selectedPlan === plan.id;
              return (
                <TouchableOpacity
                  key={plan.id}
                  activeOpacity={0.85}
                  onPress={() => {
                    setSelectedPlan(plan.id);
                    Haptics.selectionAsync();
                  }}
                  style={[
                    styles.planCard,
                    {
                      backgroundColor: colors.surface,
                      borderColor: isSelected ? plan.color : colors.border,
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}>
                  {/* Card Top Row */}
                  <View style={styles.planCardTop}>
                    <View style={styles.planCardLeft}>
                      <LinearGradient
                        colors={plan.gradientColors}
                        style={styles.planIconCircle}>
                        <Ionicons
                          name={
                            plan.id === 'starter'
                              ? 'leaf-outline'
                              : plan.id === 'pro'
                              ? 'rocket-outline'
                              : 'diamond-outline'
                          }
                          size={18}
                          color="#FFFFFF"
                        />
                      </LinearGradient>
                      <View style={styles.planNameBlock}>
                        <Text style={[styles.planName, { color: colors.text }]}>
                          {plan.name}
                        </Text>
                        <Text style={[styles.planDesc, { color: colors.textSecondary }]}>
                          {plan.description}
                        </Text>
                      </View>
                    </View>

                    {plan.badge && (
                      <LinearGradient
                        colors={plan.gradientColors}
                        style={styles.planBadge}>
                        <Text style={styles.planBadgeText}>{plan.badge}</Text>
                      </LinearGradient>
                    )}
                  </View>

                  {/* Price */}
                  <View style={styles.priceRow}>
                    {planPrice === 0 ? (
                      <Text style={[styles.priceText, { color: plan.color }]}>Free</Text>
                    ) : (
                      <View style={styles.priceInner}>
                        <Text style={[styles.priceCurrency, { color: plan.color }]}>GH&#8373;</Text>
                        <Text style={[styles.priceAmount, { color: plan.color }]}>
                          {planPrice}
                        </Text>
                        <Text style={[styles.pricePer, { color: colors.textMuted }]}>
                          /month
                        </Text>
                      </View>
                    )}
                    {billing === 'annually' && planPrice > 0 && (
                      <Text style={[styles.annualNote, { color: colors.textMuted }]}>
                        billed GH&#8373;{planPrice * 12}/yr
                      </Text>
                    )}
                  </View>

                  {/* Features List */}
                  <View style={styles.featuresList}>
                    {plan.features.map((feature, i) => (
                      <View key={i} style={styles.featureRow}>
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color={plan.id === 'starter' ? '#64748B' : plan.color}
                        />
                        <Text
                          style={[styles.featureText, { color: colors.textSecondary }]}>
                          {feature}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <View style={[styles.selectedCheck, { borderColor: plan.color }]}>
                      <Ionicons name="checkmark" size={14} color={plan.color} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Upgrade CTA */}
          <View style={styles.ctaSection}>
            {selectedPlan === 'starter' ? (
              <View
                style={[
                  styles.currentPlanBanner,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text style={[styles.currentPlanText, { color: colors.text }]}>
                  You are on the free Starter plan
                </Text>
              </View>
            ) : (
              <TouchableOpacity activeOpacity={0.88} onPress={handleUpgrade}>
                <LinearGradient
                  colors={currentPlan.gradientColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.upgradeBtn}>
                  <Ionicons name="star" size={18} color="#FFFFFF" />
                  <Text style={styles.upgradeBtnText}>
                    Upgrade to {currentPlan.name} — GH&#8373;{price}/mo
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            {/* Trust Row */}
            <View style={styles.trustRow}>
              <View style={styles.trustItem}>
                <Ionicons name="shield-checkmark" size={14} color="#10B981" />
                <Text style={[styles.trustText, { color: colors.textMuted }]}>
                  Cancel anytime
                </Text>
              </View>
              <View style={styles.trustItem}>
                <Ionicons name="lock-closed" size={14} color="#10B981" />
                <Text style={[styles.trustText, { color: colors.textMuted }]}>
                  Secure MoMo billing
                </Text>
              </View>
              <View style={styles.trustItem}>
                <Ionicons name="refresh-circle" size={14} color="#10B981" />
                <Text style={[styles.trustText, { color: colors.textMuted }]}>
                  Auto-renews
                </Text>
              </View>
            </View>
          </View>

          {/* FAQ */}
          <View style={styles.faqSection}>
            <Text style={[styles.faqTitle, { color: colors.text }]}>Common Questions</Text>
            {[
              {
                q: 'How is billing handled?',
                a: 'Your DevPay Premium subscription is billed monthly or annually through MTN MoMo, Telecel Cash, or bank transfer. You\'ll receive a receipt SMS every billing cycle.',
              },
              {
                q: 'Can I downgrade or cancel?',
                a: 'Yes — you can cancel or downgrade at any time from Settings > Premium. Your current plan perks remain active until the end of the billing period.',
              },
              {
                q: 'What happens to my active contracts?',
                a: 'All existing contracts, escrow locks, and milestones remain fully active and unaffected when you upgrade or downgrade.',
              },
            ].map((item, i) => (
              <View
                key={i}
                style={[
                  styles.faqCard,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}>
                <Text style={[styles.faqQ, { color: colors.text }]}>{item.q}</Text>
                <Text style={[styles.faqA, { color: colors.textSecondary }]}>{item.a}</Text>
              </View>
            ))}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>

      {/* ========== UPGRADE PAYMENT MODAL ========== */}
      <Modal
        visible={upgradeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setUpgradeModal(false)}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalSheet,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}>
            <LinearGradient
              colors={currentPlan.gradientColors}
              style={styles.modalHeroStrip}>
              <Ionicons name="star" size={22} color="#FFFFFF" />
              <Text style={styles.modalHeroTitle}>Activate {currentPlan.name}</Text>
            </LinearGradient>

            <View style={styles.modalBody}>
              <View style={styles.modalRow}>
                <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>
                  Plan
                </Text>
                <Text style={[styles.modalValue, { color: colors.text }]}>
                  {currentPlan.name} ({billing === 'monthly' ? 'Monthly' : 'Annual'})
                </Text>
              </View>
              <View style={[styles.modalDivider, { backgroundColor: colors.border }]} />
              <View style={styles.modalRow}>
                <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>
                  Amount
                </Text>
                <Text style={[styles.modalValue, { color: currentPlan.color, fontWeight: '800' }]}>
                  GH&#8373; {billing === 'annually' ? price * 12 : price}.00
                </Text>
              </View>
              <View style={[styles.modalDivider, { backgroundColor: colors.border }]} />
              <View style={styles.modalRow}>
                <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>
                  Payment via
                </Text>
                <View style={styles.momoRow}>
                  <View style={styles.momoDot} />
                  <Text style={[styles.modalValue, { color: colors.text }]}>
                    MTN MoMo (024 123 4567)
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleConfirmPayment}
              disabled={processing}
              style={styles.confirmBtnWrap}>
              <LinearGradient
                colors={currentPlan.gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.confirmBtn}>
                {processing ? (
                  <Text style={styles.confirmBtnText}>Processing&#8230;</Text>
                ) : (
                  <>
                    <Ionicons name="lock-closed" size={16} color="#FFFFFF" />
                    <Text style={styles.confirmBtnText}>
                      Pay GH&#8373; {billing === 'annually' ? price * 12 : price}.00 via MoMo
                    </Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setUpgradeModal(false)}>
              <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ========== SUCCESS MODAL ========== */}
      <Modal
        visible={successModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setSuccessModal(false);
          router.back();
        }}>
        <View style={styles.successOverlay}>
          <View
            style={[
              styles.successCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}>
            <LinearGradient
              colors={currentPlan.gradientColors}
              style={styles.successIconCircle}>
              <Ionicons name="star" size={32} color="#FFFFFF" />
            </LinearGradient>
            <Text style={[styles.successTitle, { color: colors.text }]}>
              Welcome to {currentPlan.name}! &#127881;
            </Text>
            <Text style={[styles.successSub, { color: colors.textSecondary }]}>
              Your DevPay {currentPlan.name} plan is now active.
              {'\n'}Premium features have been unlocked on your account.
            </Text>
            <TouchableOpacity
              style={[styles.successBtn, { backgroundColor: currentPlan.color }]}
              onPress={() => {
                setSuccessModal(false);
                router.back();
              }}>
              <Text style={styles.successBtnText}>Back to Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  safeArea: { flex: 1 },

  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  crownBadge: {
    width: 40,
    alignItems: 'center',
  },

  scrollContent: { paddingBottom: 60 },

  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 28,
    gap: 12,
  },
  heroIconRow: { flexDirection: 'row' },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.2,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  heroSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.78)',
    lineHeight: 20,
  },

  billingToggleRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: 3,
    marginTop: 6,
    alignSelf: 'flex-start',
    gap: 2,
  },
  billingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  billingPillActive: {
    backgroundColor: '#FFFFFF',
  },
  billingPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
  billingPillTextActive: {
    color: '#1E40AF',
  },
  saveBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  saveText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  plansSection: { padding: 20, gap: 14 },
  plansTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 4,
  },

  planCard: {
    borderRadius: 16,
    padding: 18,
    gap: 14,
    position: 'relative',
  },
  planCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  planCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  planIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planNameBlock: { flex: 1 },
  planName: { fontSize: 16, fontWeight: '700', letterSpacing: -0.2 },
  planDesc: { fontSize: 12, marginTop: 2 },
  planBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  planBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },

  priceRow: { gap: 2 },
  priceInner: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  priceCurrency: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  priceAmount: { fontSize: 36, fontWeight: '800', letterSpacing: -1 },
  pricePer: { fontSize: 13, marginBottom: 6 },
  priceText: { fontSize: 28, fontWeight: '800' },
  annualNote: { fontSize: 11, marginTop: 2 },

  featuresList: { gap: 8 },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  featureText: { fontSize: 13, lineHeight: 18, flex: 1 },

  selectedCheck: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  ctaSection: { paddingHorizontal: 20, gap: 16 },
  currentPlanBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  currentPlanText: { fontSize: 15, fontWeight: '600' },
  upgradeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
  },
  upgradeBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },

  trustRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    flexWrap: 'wrap',
  },
  trustItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  trustText: { fontSize: 12 },

  faqSection: { padding: 20, gap: 12 },
  faqTitle: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
  faqCard: { borderRadius: 14, padding: 16, borderWidth: 1, gap: 6 },
  faqQ: { fontSize: 14, fontWeight: '700' },
  faqA: { fontSize: 13, lineHeight: 19 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  modalHeroStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 20,
  },
  modalHeroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalBody: { padding: 20, gap: 0 },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  modalDivider: { height: 1 },
  modalLabel: { fontSize: 14 },
  modalValue: { fontSize: 14, fontWeight: '600' },
  momoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  momoDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F59E0B',
  },
  confirmBtnWrap: { paddingHorizontal: 20, paddingBottom: 8 },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
  },
  confirmBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  cancelBtn: { padding: 16, alignItems: 'center', marginBottom: 8 },
  cancelBtnText: { fontSize: 14, fontWeight: '600' },

  // Success
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  successCard: {
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    gap: 14,
    width: '100%',
    borderWidth: 1,
  },
  successIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4, textAlign: 'center' },
  successSub: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
  },
  successBtn: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 4,
  },
  successBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
});
