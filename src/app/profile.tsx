import React, { useState } from 'react';
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
import { Colors } from '@/constants/theme';
import { FloatingTabBar } from '@/components/floating-tab-bar';

export default function ProfileScreen() {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState<'freelancer' | 'client'>('freelancer');

  const skills = [
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
    const nextRole = activeRole === 'freelancer' ? 'client' : 'freelancer';
    setActiveRole(nextRole);
    alert(`Switched to ${nextRole.toUpperCase()} mode! Dashboard context updated without logging out.`);
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top Header */}
        <View style={styles.topHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => router.push('/settings')}
            activeOpacity={0.8}>
            <Ionicons name="settings-outline" size={20} color={Colors.light.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Profile Card Header */}
          <View style={styles.profileHeroCard}>
            <View style={styles.avatarWrap}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' }}
                style={styles.avatarImg}
              />
              <View style={styles.onlineStatus} />
            </View>

            <Text style={styles.userName}>Kwame Mensah</Text>
            <Text style={styles.userTitle}>Senior Mobile &amp; React Native Engineer</Text>

            {/* Ghana Card Verified Badge */}
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={15} color="#10B981" />
              <Text style={styles.verifiedText}>Ghana Card Verified • Trusted</Text>
            </View>

            {/* Edit Profile Action Pill */}
            <TouchableOpacity
              style={styles.editProfileBtn}
              onPress={() => router.push('/edit-profile')}
              activeOpacity={0.85}>
              <Ionicons name="create-outline" size={15} color="#0F73F7" />
              <Text style={styles.editProfileBtnText}>Edit Profile</Text>
            </TouchableOpacity>

            {/* Role Switcher Pill */}
            <TouchableOpacity
              style={styles.roleSwitchPill}
              onPress={handleRoleToggle}
              activeOpacity={0.85}>
              <Ionicons name="swap-horizontal" size={16} color="#0F73F7" />
              <Text style={styles.roleSwitchText}>
                Active: <Text style={styles.boldRole}>{activeRole === 'freelancer' ? 'Freelancer' : 'Client'}</Text> (Tap to Switch)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Performance Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statVal}>100%</Text>
              <Text style={styles.statLabel}>Job Success</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statVal}>8</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statVal}>5.0 ★</Text>
              <Text style={styles.statLabel}>Client Rating</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statVal}>10/10</Text>
              <Text style={styles.statLabel}>Proposals Left</Text>
            </View>
          </View>

          {/* Skills Section */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeading}>Skills &amp; Expertise</Text>
            <View style={styles.skillsWrap}>
              {skills.map((skill, i) => (
                <View key={i} style={styles.skillPill}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Portfolio Section */}
          <View style={styles.sectionBlock}>
            <View style={styles.portfolioHeader}>
              <Text style={styles.sectionHeading}>Featured Portfolio</Text>
              <TouchableOpacity onPress={() => router.push('/edit-profile')} activeOpacity={0.8}>
                <Text style={styles.addPortfolioText}>+ Add Work</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.portfolioGrid}>
              {portfolio.map((item) => (
                <View key={item.id} style={styles.portfolioCard}>
                  <Image source={{ uri: item.image }} style={styles.portfolioImg} />
                  <View style={styles.portfolioContent}>
                    <Text style={styles.portfolioTag}>{item.tag}</Text>
                    <Text style={styles.portfolioTitle}>{item.title}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Account Settings Menu */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeading}>Account &amp; Preferences</Text>
            <View style={styles.menuBox}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/edit-profile')}>
                <View style={styles.menuLeft}>
                  <Ionicons name="person-outline" size={18} color="#0F73F7" />
                  <Text style={styles.menuTitle}>Edit Profile Information</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.light.textMuted} />
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/kyc')}>
                <View style={styles.menuLeft}>
                  <Ionicons name="card-outline" size={18} color="#10B981" />
                  <Text style={styles.menuTitle}>Ghana Card ID Verification</Text>
                </View>
                <View style={styles.menuRight}>
                  <Text style={styles.verifiedTag}>Verified ✓</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.light.textMuted} />
                </View>
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/earnings')}>
                <View style={styles.menuLeft}>
                  <Ionicons name="wallet-outline" size={18} color="#0F73F7" />
                  <Text style={styles.menuTitle}>Payout MoMo / Bank Settings</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.light.textMuted} />
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/settings')}>
                <View style={styles.menuLeft}>
                  <Ionicons name="settings-outline" size={18} color={Colors.light.text} />
                  <Text style={styles.menuTitle}>Settings &amp; Security</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.light.textMuted} />
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/logout')}>
                <View style={styles.menuLeft}>
                  <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                  <Text style={[styles.menuTitle, { color: '#EF4444' }]}>Sign Out</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#EF4444" />
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/delete-account')}>
                <View style={styles.menuLeft}>
                  <Ionicons name="trash-outline" size={18} color="#DC2626" />
                  <Text style={[styles.menuTitle, { color: '#DC2626' }]}>Delete Account</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#DC2626" />
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
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF3FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.light.text,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF3FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 110,
  },
  profileHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF3FA',
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
    color: Colors.light.text,
  },
  userTitle: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EFF6FF',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  editProfileBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F73F7',
  },
  roleSwitchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EBF4FE',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#D4E6FC',
  },
  roleSwitchText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  boldRole: {
    fontWeight: '800',
    color: '#0F73F7',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF3FA',
  },
  statVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F73F7',
  },
  statLabel: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  sectionBlock: {
    marginTop: 22,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.light.text,
    marginBottom: 10,
  },
  skillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF3FA',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  skillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.text,
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addPortfolioText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F73F7',
  },
  portfolioGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  portfolioCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEF3FA',
  },
  portfolioImg: {
    width: '100%',
    height: 100,
  },
  portfolioContent: {
    padding: 10,
  },
  portfolioTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F73F7',
  },
  portfolioTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.text,
    marginTop: 2,
  },
  menuBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#EEF3FA',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.text,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verifiedTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
});
