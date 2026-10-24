import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useRole } from '@/contexts/RoleContext';
import { FloatingTabBar } from '@/components/floating-tab-bar';
import * as Haptics from 'expo-haptics';

export default function ProfileScreen() {
  const router = useRouter();
  const { isDark, colors } = useTheme();
  const { role, toggleRole, isClient } = useRole();

  const freelancerSkills = [
    'React Native',
    'Expo SDK 58',
    'TypeScript',
    'UI/UX Design',
    'Mobile Money APIs',
    'NestJS',
    'Supabase',
  ];

  const portfolio = [
    {
      id: 'p_1',
      title: 'Fintech Mobile Wallet',
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300',
      tag: 'React Native',
    },
    {
      id: 'p_2',
      title: 'African Logistics Platform',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300',
      tag: 'UI/UX & Mobile',
    },
  ];

  const handleRoleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleRole();
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top Header */}
        <View
          style={[
            styles.topHeader,
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
            {isClient ? 'Company Profile' : 'Developer Profile'}
          </Text>
          <TouchableOpacity
            style={[
              styles.settingsBtn,
              { backgroundColor: colors.backgroundElement, borderColor: colors.border },
            ]}
            onPress={() => router.push('/settings')}
            activeOpacity={0.8}>
            <Ionicons name="settings-outline" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Profile Hero Card */}
          <View
            style={[
              styles.profileHeroCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}>
            <View style={styles.avatarWrap}>
              <Image
                source={{
                  uri: isClient
                    ? 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=200'
                    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
                }}
                style={styles.avatarImg}
              />
              <View style={styles.onlineStatus} />
            </View>

            <Text style={[styles.userName, { color: colors.text }]}>
              {isClient ? 'TechCorp Africa Ltd' : 'Kwame Mensah'}
            </Text>
            <Text style={[styles.userTitle, { color: colors.textSecondary }]}>
              {isClient
                ? 'Enterprise Client • Digital Products & Fintech'
                : 'Senior Mobile & React Native Engineer'}
            </Text>

            {/* Verification Badge */}
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={15} color="#10B981" />
              <Text style={styles.verifiedText}>
                {isClient
                  ? 'Registered Business (TIN Verified) • Escrow Trusted'
                  : 'Ghana Card (NIA) Verified • Trusted Developer'}
              </Text>
            </View>

            {/* Action Buttons Row: Edit Profile & Switch Mode */}
            <View style={styles.heroActionRow}>
              <TouchableOpacity
                style={[
                  styles.editProfileBtn,
                  { backgroundColor: isDark ? colors.backgroundElement : '#EFF6FF' },
                ]}
                onPress={() => router.push('/edit-profile')}
                activeOpacity={0.85}>
                <Ionicons name="create-outline" size={15} color={colors.primary} />
                <Text style={[styles.editProfileBtnText, { color: colors.primary }]}>
                  Edit Profile
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleSwitchPill,
                  {
                    backgroundColor: isClient
                      ? isDark
                        ? '#2E1065'
                        : '#F3E8FF'
                      : isDark
                      ? '#1E293B'
                      : '#EFF6FF',
                    borderColor: isClient ? '#9333EA' : colors.primary,
                  },
                ]}
                onPress={handleRoleToggle}
                activeOpacity={0.85}>
                <Ionicons
                  name="swap-horizontal"
                  size={15}
                  color={isClient ? '#9333EA' : colors.primary}
                />
                <Text
                  style={[
                    styles.roleSwitchText,
                    { color: isClient ? '#9333EA' : colors.primary },
                  ]}>
                  Mode: <Text style={{ fontWeight: '800' }}>{role.toUpperCase()}</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Performance Stats */}
          <View style={styles.statsRow}>
            {isClient ? (
              <>
                <View
                  style={[
                    styles.statCard,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}>
                  <Text style={[styles.statVal, { color: colors.primary }]}>
                    GH₵ 28.5k
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                    Total Escrow
                  </Text>
                </View>
                <View
                  style={[
                    styles.statCard,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}>
                  <Text style={[styles.statVal, { color: '#10B981' }]}>3</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                    Active Jobs
                  </Text>
                </View>
                <View
                  style={[
                    styles.statCard,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}>
                  <Text style={[styles.statVal, { color: '#9333EA' }]}>8</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                    Hired Devs
                  </Text>
                </View>
                <View
                  style={[
                    styles.statCard,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}>
                  <Text style={[styles.statVal, { color: '#F59E0B' }]}>4.9 ★</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                    Client Score
                  </Text>
                </View>
              </>
            ) : (
              <>
                <View
                  style={[
                    styles.statCard,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}>
                  <Text style={[styles.statVal, { color: '#10B981' }]}>100%</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                    Job Success
                  </Text>
                </View>
                <View
                  style={[
                    styles.statCard,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}>
                  <Text style={[styles.statVal, { color: colors.text }]}>8</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                    Completed
                  </Text>
                </View>
                <View
                  style={[
                    styles.statCard,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}>
                  <Text style={[styles.statVal, { color: '#F59E0B' }]}>5.0 ★</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                    Rating
                  </Text>
                </View>
                <View
                  style={[
                    styles.statCard,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}>
                  <Text style={[styles.statVal, { color: colors.primary }]}>
                    10/10
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                    Proposals
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* CLIENT OR FREELANCER SECTIONS */}
          {isClient ? (
            /* Client Specific Sections */
            <>
              <View style={styles.sectionBlock}>
                <Text style={[styles.sectionHeading, { color: colors.textSecondary }]}>
                  Client Quick Actions
                </Text>
                <View style={styles.actionGrid}>
                  <TouchableOpacity
                    style={[
                      styles.actionGridItem,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                    ]}
                    onPress={() => router.push('/job/create')}>
                    <Ionicons name="add-circle-outline" size={22} color={colors.primary} />
                    <Text style={[styles.actionGridLabel, { color: colors.text }]}>
                      Post New Job
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.actionGridItem,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                    ]}
                    onPress={() => router.push('/job/applicants')}>
                    <Ionicons name="people-outline" size={22} color="#9333EA" />
                    <Text style={[styles.actionGridLabel, { color: colors.text }]}>
                      Review Proposals
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.actionGridItem,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                    ]}
                    onPress={() => router.push('/contracts/review')}>
                    <Ionicons name="shield-checkmark-outline" size={22} color="#10B981" />
                    <Text style={[styles.actionGridLabel, { color: colors.text }]}>
                      Release Escrow
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.actionGridItem,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                    ]}
                    onPress={() => router.push('/contracts')}>
                    <Ionicons name="receipt-outline" size={22} color="#F59E0B" />
                    <Text style={[styles.actionGridLabel, { color: colors.text }]}>
                      All Contracts
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Company Info Box */}
              <View style={styles.sectionBlock}>
                <Text style={[styles.sectionHeading, { color: colors.textSecondary }]}>
                  Business Information
                </Text>
                <View
                  style={[
                    styles.companyBox,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}>
                  <View style={styles.companyRow}>
                    <Text style={[styles.companyKey, { color: colors.textSecondary }]}>
                      Registration No.
                    </Text>
                    <Text style={[styles.companyVal, { color: colors.text }]}>
                      CS-29481902-GH
                    </Text>
                  </View>
                  <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
                  <View style={styles.companyRow}>
                    <Text style={[styles.companyKey, { color: colors.textSecondary }]}>
                      Headquarters
                    </Text>
                    <Text style={[styles.companyVal, { color: colors.text }]}>
                      Airport City, Accra
                    </Text>
                  </View>
                  <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
                  <View style={styles.companyRow}>
                    <Text style={[styles.companyKey, { color: colors.textSecondary }]}>
                      Escrow Deposit Method
                    </Text>
                    <Text style={[styles.companyVal, { color: colors.primary }]}>
                      MTN MoMo (024 123 4567)
                    </Text>
                  </View>
                </View>
              </View>
            </>
          ) : (
            /* Freelancer Specific Sections */
            <>
              {/* Skills Section */}
              <View style={styles.sectionBlock}>
                <Text style={[styles.sectionHeading, { color: colors.textSecondary }]}>
                  Skills &amp; Expertise
                </Text>
                <View style={styles.skillsWrap}>
                  {freelancerSkills.map((skill, i) => (
                    <View
                      key={i}
                      style={[
                        styles.skillPill,
                        {
                          backgroundColor: colors.backgroundElement,
                          borderColor: colors.border,
                        },
                      ]}>
                      <Text style={[styles.skillText, { color: colors.text }]}>
                        {skill}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Portfolio Showcase */}
              <View style={styles.sectionBlock}>
                <Text style={[styles.sectionHeading, { color: colors.textSecondary }]}>
                  Portfolio Showcase
                </Text>
                <View style={styles.portfolioGrid}>
                  {portfolio.map((item) => (
                    <View
                      key={item.id}
                      style={[
                        styles.portfolioCard,
                        { backgroundColor: colors.surface, borderColor: colors.border },
                      ]}>
                      <Image source={{ uri: item.image }} style={styles.portfolioImg} />
                      <View style={styles.portfolioDetails}>
                        <Text style={[styles.portfolioTitle, { color: colors.text }]}>
                          {item.title}
                        </Text>
                        <Text style={[styles.portfolioTag, { color: colors.primary }]}>
                          {item.tag}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </>
          )}

          {/* Account Settings Menu */}
          <View style={styles.sectionBlock}>
            <Text style={[styles.sectionHeading, { color: colors.textSecondary }]}>
              Account Management
            </Text>
            <View
              style={[
                styles.menuCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/earnings')}>
                <View style={styles.menuLeft}>
                  <Ionicons name="wallet-outline" size={18} color="#0F73F7" />
                  <Text style={[styles.menuTitle, { color: colors.text }]}>
                    Payout &amp; MoMo Wallet
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
              </TouchableOpacity>

              <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/settings')}>
                <View style={styles.menuLeft}>
                  <Ionicons name="settings-outline" size={18} color={colors.text} />
                  <Text style={[styles.menuTitle, { color: colors.text }]}>
                    Settings &amp; Theme
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
              </TouchableOpacity>

              <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/logout')}>
                <View style={styles.menuLeft}>
                  <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                  <Text style={[styles.menuTitle, { color: '#EF4444' }]}>Sign Out</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <FloatingTabBar
          activeTab="profile"
          onSelectTab={(tab) => {
            if (tab === 'home') router.push('/');
            if (tab === 'jobs') router.push('/contracts');
            if (tab === 'chats') router.push('/messages');
          }}
          onCenterActionPress={() => {
            if (isClient) {
              router.push('/job/create');
            } else {
              router.push('/explore');
            }
          }}
        />
      </SafeAreaView>
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
  topHeader: {
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
    fontSize: 16,
    fontWeight: '800',
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 110,
    gap: 16,
  },
  profileHeroCard: {
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#EBF4FE',
  },
  onlineStatus: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
  },
  userTitle: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 10,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
  heroActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
  },
  editProfileBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  roleSwitchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
  },
  roleSwitchText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  statVal: {
    fontSize: 15,
    fontWeight: '900',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  sectionBlock: {
    gap: 10,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginLeft: 4,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionGridItem: {
    width: '48%',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
  },
  actionGridLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  companyBox: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  companyKey: {
    fontSize: 13,
    fontWeight: '500',
  },
  companyVal: {
    fontSize: 13,
    fontWeight: '700',
  },
  skillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
  },
  skillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  portfolioGrid: {
    gap: 12,
  },
  portfolioCard: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
  },
  portfolioImg: {
    width: '100%',
    height: 120,
    backgroundColor: '#E2E8F0',
  },
  portfolioDetails: {
    padding: 12,
  },
  portfolioTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  portfolioTag: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  menuCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  menuDivider: {
    height: 1,
    marginLeft: 44,
  },
});
