import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { SuccessOverlay } from '@/components/success-overlay';
import * as Haptics from 'expo-haptics';

interface MilestoneInput {
  id: string;
  title: string;
  amount: string;
}

export default function CreateJobScreen() {
  const router = useRouter();
  const { isDark, colors } = useTheme();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Tech & Dev');
  const [description, setDescription] = useState('');
  const [scope, setScope] = useState<'Small' | 'Medium' | 'Large'>('Medium');
  const [requireKyc, setRequireKyc] = useState(true);
  const [milestones, setMilestones] = useState<MilestoneInput[]>([
    { id: '1', title: 'Milestone 1: Architecture & UI Setup', amount: '1500' },
    { id: '2', title: 'Milestone 2: Core Feature & API Integration', amount: '2000' },
  ]);
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = [
    'Tech & Dev',
    'UI/UX Design',
    'Mobile Apps',
    'Writing',
    'Marketing',
    'Cloud & APIs',
  ];

  const totalBudget = milestones.reduce(
    (sum, m) => sum + (parseFloat(m.amount) || 0),
    0
  );

  const handleAddMilestone = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const nextNum = milestones.length + 1;
    setMilestones((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        title: '',
        amount: '',
      },
    ]);
  };

  const handleRemoveMilestone = (id: string) => {
    if (milestones.length <= 1) {
      Alert.alert('Minimum Requirement', 'At least one milestone is required.');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  const handleUpdateMilestone = (
    id: string,
    field: 'title' | 'amount',
    val: string
  ) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: val } : m))
    );
  };

  const handlePublish = () => {
    if (!title.trim()) {
      Alert.alert('Title Required', 'Please enter a job or contract title.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Description Required', 'Please provide deliverable specifications.');
      return;
    }
    if (totalBudget <= 0) {
      Alert.alert('Budget Required', 'Please enter valid milestone amounts.');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowSuccess(true);
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
              styles.backButton,
              { backgroundColor: colors.backgroundElement, borderColor: colors.border },
            ]}
            onPress={() => router.back()}
            activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Post New Contract
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Top Banner */}
          <LinearGradient
            colors={isDark ? ['#1E1B4B', '#0F172A'] : ['#EFF6FF', '#DBEAFE']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.bannerCard}>
            <View style={styles.bannerIconWrap}>
              <Ionicons name="shield-checkmark" size={24} color="#0F73F7" />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.bannerTitle,
                  { color: isDark ? '#FFFFFF' : '#0F172A' },
                ]}>
                DevPay Escrow Protection
              </Text>
              <Text
                style={[
                  styles.bannerSubtitle,
                  { color: isDark ? '#94A3B8' : '#475569' },
                ]}>
                Milestone 1 is pre-funded to attract verified African talent. Funds are held safely and only released when you approve the deliverable.
              </Text>
            </View>
          </LinearGradient>

          {/* Form Card 1: Job Details */}
          <View
            style={[
              styles.formCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              CONTRACT DETAILS
            </Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Contract Title
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.backgroundElement,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="e.g. Senior React Native Engineer (MoMo SDK)"
                placeholderTextColor={colors.textMuted}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Category Selector */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Category
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.pillRow}>
                {categories.map((cat) => {
                  const active = category === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.catPill,
                        {
                          backgroundColor: active
                            ? colors.primary
                            : colors.backgroundElement,
                          borderColor: active ? colors.primary : colors.border,
                        },
                      ]}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setCategory(cat);
                      }}>
                      <Text
                        style={[
                          styles.catPillText,
                          { color: active ? '#FFFFFF' : colors.text },
                        ]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Scope / Experience Level */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Project Scope
              </Text>
              <View style={styles.scopeRow}>
                {(['Small', 'Medium', 'Large'] as const).map((sc) => {
                  const active = scope === sc;
                  return (
                    <TouchableOpacity
                      key={sc}
                      style={[
                        styles.scopeOption,
                        {
                          backgroundColor: active
                            ? isDark
                              ? '#1E293B'
                              : '#EFF6FF'
                            : colors.backgroundElement,
                          borderColor: active ? colors.primary : colors.border,
                        },
                      ]}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setScope(sc);
                      }}>
                      <Ionicons
                        name={
                          sc === 'Small'
                            ? 'flash-outline'
                            : sc === 'Medium'
                            ? 'cube-outline'
                            : 'planet-outline'
                        }
                        size={18}
                        color={active ? colors.primary : colors.textMuted}
                      />
                      <Text
                        style={[
                          styles.scopeText,
                          {
                            color: active ? colors.primary : colors.text,
                            fontWeight: active ? '700' : '500',
                          },
                        ]}>
                        {sc}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Deliverables & Scope
              </Text>
              <TextInput
                style={[
                  styles.textArea,
                  {
                    backgroundColor: colors.backgroundElement,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="Outline what must be delivered, accepted frameworks, and milestones..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
              />
            </View>
          </View>

          {/* Form Card 2: Escrow Milestones */}
          <View
            style={[
              styles.formCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}>
            <View style={styles.milestoneHeaderRow}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                ESCROW MILESTONES
              </Text>
              <TouchableOpacity
                style={[styles.addBtn, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' }]}
                onPress={handleAddMilestone}>
                <Ionicons name="add" size={16} color={colors.primary} />
                <Text style={[styles.addBtnText, { color: colors.primary }]}>
                  Add Milestone
                </Text>
              </TouchableOpacity>
            </View>

            {milestones.map((m, index) => (
              <View
                key={m.id}
                style={[
                  styles.milestoneBox,
                  { backgroundColor: colors.backgroundElement, borderColor: colors.border },
                ]}>
                <View style={styles.milestoneTop}>
                  <View style={styles.milestoneTag}>
                    <Text style={styles.milestoneTagText}>Phase {index + 1}</Text>
                  </View>
                  {milestones.length > 1 && (
                    <TouchableOpacity
                      onPress={() => handleRemoveMilestone(m.id)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                      <Ionicons name="close-circle-outline" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                </View>

                <TextInput
                  style={[
                    styles.milestoneTitleInput,
                    { color: colors.text, borderBottomColor: colors.border },
                  ]}
                  value={m.title}
                  placeholder="Milestone Title"
                  placeholderTextColor={colors.textMuted}
                  onChangeText={(val) => handleUpdateMilestone(m.id, 'title', val)}
                />

                <View style={styles.amountRow}>
                  <Text style={[styles.currencyLabel, { color: colors.textSecondary }]}>
                    Amount (GH₵)
                  </Text>
                  <TextInput
                    style={[
                      styles.milestoneAmountInput,
                      {
                        backgroundColor: colors.surface,
                        color: colors.text,
                        borderColor: colors.border,
                      },
                    ]}
                    value={m.amount}
                    keyboardType="numeric"
                    placeholder="0.00"
                    placeholderTextColor={colors.textMuted}
                    onChangeText={(val) => handleUpdateMilestone(m.id, 'amount', val)}
                  />
                </View>
              </View>
            ))}

            {/* Total Budget Summary */}
            <View
              style={[
                styles.totalBox,
                { backgroundColor: isDark ? '#0F172A' : '#F1F5F9' },
              ]}>
              <View>
                <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>
                  Total Contract Escrow
                </Text>
                <Text style={styles.totalSublabel}>
                  BoG Compliant Escrow Deposit
                </Text>
              </View>
              <Text style={[styles.totalAmount, { color: colors.primary }]}>
                GH₵ {totalBudget.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
            </View>
          </View>

          {/* Form Card 3: Trust & Verification */}
          <View
            style={[
              styles.formCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              DEVELOPER VERIFICATION
            </Text>

            <View style={styles.switchRow}>
              <View style={styles.switchLeft}>
                <View
                  style={[
                    styles.kycIconWrap,
                    { backgroundColor: isDark ? '#064E3B' : '#ECFDF5' },
                  ]}>
                  <Ionicons name="card-outline" size={20} color="#10B981" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.switchTitle, { color: colors.text }]}>
                    Ghana Card (NIA) Verified Only
                  </Text>
                  <Text
                    style={[styles.switchSubtitle, { color: colors.textSecondary }]}>
                    Only developers with national ID verification can submit proposals
                  </Text>
                </View>
              </View>
              <Switch
                value={requireKyc}
                onValueChange={(val) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setRequireKyc(val);
                }}
                trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
                thumbColor={requireKyc ? '#0F73F7' : '#FFFFFF'}
              />
            </View>
          </View>

          {/* Action CTA */}
          <TouchableOpacity
            style={styles.publishBtnWrap}
            onPress={handlePublish}
            activeOpacity={0.88}>
            <LinearGradient
              colors={['#0F73F7', '#38BDF8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.publishGradient}>
              <Ionicons name="rocket-outline" size={20} color="#FFFFFF" />
              <Text style={styles.publishBtnText}>
                Post Contract & Pre-Fund Escrow
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

      <SuccessOverlay
        visible={showSuccess}
        type="success"
        title="Contract Published!"
        subtitle={`Your contract "${title}" is live. Milestone 1 (GH₵ ${(
          parseFloat(milestones[0]?.amount) || 0
        ).toLocaleString()}) is secured in DevPay Escrow.`}
        dismissLabel="View Contract"
        onDismiss={() => {
          setShowSuccess(false);
          router.replace('/contracts');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 20,
    gap: 18,
    paddingBottom: 40,
  },
  bannerCard: {
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  bannerIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  bannerSubtitle: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
  formCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  textInput: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '500',
    borderWidth: 1,
  },
  textArea: {
    minHeight: 100,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '500',
    borderWidth: 1,
    textAlignVertical: 'top',
  },
  pillRow: {
    gap: 8,
    paddingVertical: 4,
  },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  catPillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  scopeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  scopeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  scopeText: {
    fontSize: 13,
  },
  milestoneHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  milestoneBox: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    gap: 10,
  },
  milestoneTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  milestoneTag: {
    backgroundColor: '#0F73F7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  milestoneTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  milestoneTitleInput: {
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 6,
    borderBottomWidth: 1,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currencyLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  milestoneAmountInput: {
    width: 120,
    height: 38,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: '700',
    borderWidth: 1,
    textAlign: 'right',
  },
  totalBox: {
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  totalSublabel: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 2,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '900',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  switchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  kycIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  switchSubtitle: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  publishBtnWrap: {
    borderRadius: 27,
    overflow: 'hidden',
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
  },
  publishGradient: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  publishBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
