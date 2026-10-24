import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const router = useRouter();
  const { isDark } = useTheme();

  // Settings Toggles
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailSummary, setEmailSummary] = useState(false);

  const handleToggleBiometrics = async (value: boolean) => {
    if (value) {
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (!hasHardware || !isEnrolled) {
          Alert.alert(
            'Biometrics Unavailable',
            'No biometric scanner or enrolled credentials found on this device.'
          );
          return;
        }

        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Confirm identity to enable Biometric Login',
          fallbackLabel: 'Use DevPay PIN',
        });

        if (result.success) {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setBiometricsEnabled(true);
        } else {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
      } catch (e) {
        setBiometricsEnabled(value);
      }
    } else {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setBiometricsEnabled(false);
    }
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* User Profile Mini Banner */}
          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => router.push('/edit-profile')}
            activeOpacity={0.85}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' }}
              style={styles.profileAvatar}
            />
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.profileName}>Kwame Mensah</Text>
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                </View>
              </View>
              <Text style={styles.profileSubtitle}>Senior Mobile & React Native Engineer</Text>
              <Text style={styles.profileEmail}>kwame.mensah@devpay.africa</Text>
            </View>
            <View style={styles.editBtn}>
              <Text style={styles.editBtnText}>Edit</Text>
              <Ionicons name="chevron-forward" size={14} color="#0F73F7" />
            </View>
          </TouchableOpacity>

          {/* Section 1: Account & KYC */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account & Verification</Text>
            <View style={styles.menuBox}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/edit-profile')}
                activeOpacity={0.7}>
                <View style={styles.menuLeft}>
                  <View style={[styles.menuIconWrap, { backgroundColor: '#EBF3FE' }]}>
                    <Ionicons name="person-outline" size={18} color="#0F73F7" />
                  </View>
                  <Text style={styles.menuLabel}>Edit Profile Details</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.light.textMuted} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/kyc')}
                activeOpacity={0.7}>
                <View style={styles.menuLeft}>
                  <View style={[styles.menuIconWrap, { backgroundColor: '#ECFDF5' }]}>
                    <Ionicons name="card-outline" size={18} color="#10B981" />
                  </View>
                  <View>
                    <Text style={styles.menuLabel}>Ghana Card (NIA) Verification</Text>
                    <Text style={styles.menuSublabel}>GHA-729481029-4</Text>
                  </View>
                </View>
                <View style={styles.badgeWrap}>
                  <Text style={styles.badgeText}>Verified ✓</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => Alert.alert('Contact Info', 'Phone: +233 24 123 4567\nEmail: kwame.mensah@devpay.africa\nVerified through OTP.')}
                activeOpacity={0.7}>
                <View style={styles.menuLeft}>
                  <View style={[styles.menuIconWrap, { backgroundColor: '#F1F5F9' }]}>
                    <Ionicons name="call-outline" size={18} color={Colors.light.text} />
                  </View>
                  <View>
                    <Text style={styles.menuLabel}>Phone & Contact</Text>
                    <Text style={styles.menuSublabel}>+233 24 123 4567</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.light.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Section 2: Payouts & Escrow */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Escrow & Payout Preferences</Text>
            <View style={styles.menuBox}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/earnings')}
                activeOpacity={0.7}>
                <View style={styles.menuLeft}>
                  <View style={[styles.menuIconWrap, { backgroundColor: '#EFF6FF' }]}>
                    <Ionicons name="wallet-outline" size={18} color="#0F73F7" />
                  </View>
                  <View>
                    <Text style={styles.menuLabel}>Payout MoMo / Bank Accounts</Text>
                    <Text style={styles.menuSublabel}>MTN MoMo (024 123 4567)</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.light.textMuted} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => Alert.alert('Currency', 'Current default currency is GH₵ (Ghanaian Cedi). International client milestones are converted using official BoG mid-rates.')}
                activeOpacity={0.7}>
                <View style={styles.menuLeft}>
                  <View style={[styles.menuIconWrap, { backgroundColor: '#FEF3C7' }]}>
                    <Ionicons name="cash-outline" size={18} color="#D97706" />
                  </View>
                  <Text style={styles.menuLabel}>Default Currency</Text>
                </View>
                <View style={styles.badgeWrapGray}>
                  <Text style={styles.badgeTextGray}>GH₵ (Cedi)</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => Alert.alert('Escrow Review Policy', 'Standard DevPay client review window is 7 days. If the client does not request a revision within 7 days, funds automatically release to you.')}
                activeOpacity={0.7}>
                <View style={styles.menuLeft}>
                  <View style={[styles.menuIconWrap, { backgroundColor: '#F3E8FF' }]}>
                    <Ionicons name="timer-outline" size={18} color="#9333EA" />
                  </View>
                  <Text style={styles.menuLabel}>Auto-Release Window</Text>
                </View>
                <View style={styles.badgeWrapGray}>
                  <Text style={styles.badgeTextGray}>7 Days</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Section 3: Security & Privacy */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security & PIN</Text>
            <View style={styles.menuBox}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => Alert.alert('Transaction PIN', 'Your 4-digit DevPay Security PIN is required for releasing escrow or withdrawing to Mobile Money.')}
                activeOpacity={0.7}>
                <View style={styles.menuLeft}>
                  <View style={[styles.menuIconWrap, { backgroundColor: '#EFF6FF' }]}>
                    <Ionicons name="keypad-outline" size={18} color="#0F73F7" />
                  </View>
                  <View>
                    <Text style={styles.menuLabel}>Change 4-Digit Payout PIN</Text>
                    <Text style={styles.menuSublabel}>Used to authorize MoMo transfers</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.light.textMuted} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <View style={styles.menuItem}>
                <View style={styles.menuLeft}>
                  <View style={[styles.menuIconWrap, { backgroundColor: '#ECFDF5' }]}>
                    <Ionicons name="finger-print-outline" size={18} color="#10B981" />
                  </View>
                  <Text style={styles.menuLabel}>Biometric Face ID / Fingerprint</Text>
                </View>
                <Switch
                  value={biometricsEnabled}
                  onValueChange={handleToggleBiometrics}
                  trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
                  thumbColor={biometricsEnabled ? '#0F73F7' : '#FFFFFF'}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.menuItem}>
                <View style={styles.menuLeft}>
                  <View style={[styles.menuIconWrap, { backgroundColor: '#F3E8FF' }]}>
                    <Ionicons name="shield-outline" size={18} color="#9333EA" />
                  </View>
                  <Text style={styles.menuLabel}>Two-Factor Authentication (SMS)</Text>
                </View>
                <Switch
                  value={twoFactorEnabled}
                  onValueChange={setTwoFactorEnabled}
                  trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
                  thumbColor={twoFactorEnabled ? '#0F73F7' : '#FFFFFF'}
                />
              </View>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/appearance')}
                activeOpacity={0.7}>
                <View style={styles.menuLeft}>
                  <View style={[styles.menuIconWrap, { backgroundColor: isDark ? '#312E81' : '#EEF2FF' }]}>
                    <Ionicons name="moon-outline" size={18} color="#6366F1" />
                  </View>
                  <View>
                    <Text style={[styles.menuLabel, isDark && { color: '#F1F5F9' }]}>Appearance & Theme</Text>
                    <Text style={styles.menuSublabel}>{isDark ? 'Dark Mode active' : 'Light Mode active'}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color={isDark ? '#64748B' : Colors.light.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Section 4: Notifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notification Alerts</Text>
            <View style={styles.menuBox}>
              <View style={styles.menuItem}>
                <View style={styles.menuLeft}>
                  <View style={[styles.menuIconWrap, { backgroundColor: '#EFF6FF' }]}>
                    <Ionicons name="notifications-outline" size={18} color="#0F73F7" />
                  </View>
                  <Text style={styles.menuLabel}>Push Notifications</Text>
                </View>
                <Switch
                  value={pushNotifs}
                  onValueChange={setPushNotifs}
                  trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
                  thumbColor={pushNotifs ? '#0F73F7' : '#FFFFFF'}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.menuItem}>
                <View style={styles.menuLeft}>
                  <View style={[styles.menuIconWrap, { backgroundColor: '#ECFDF5' }]}>
                    <Ionicons name="chatbox-ellipses-outline" size={18} color="#10B981" />
                  </View>
                  <View>
                    <Text style={styles.menuLabel}>SMS Alerts for Escrow Deposit</Text>
                    <Text style={styles.menuSublabel}>Instant SMS when client funds</Text>
                  </View>
                </View>
                <Switch
                  value={smsAlerts}
                  onValueChange={setSmsAlerts}
                  trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
                  thumbColor={smsAlerts ? '#0F73F7' : '#FFFFFF'}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.menuItem}>
                <View style={styles.menuLeft}>
                  <View style={[styles.menuIconWrap, { backgroundColor: '#F1F5F9' }]}>
                    <Ionicons name="mail-outline" size={18} color={Colors.light.text} />
                  </View>
                  <Text style={styles.menuLabel}>Weekly Earnings Report Email</Text>
                </View>
                <Switch
                  value={emailSummary}
                  onValueChange={setEmailSummary}
                  trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
                  thumbColor={emailSummary ? '#0F73F7' : '#FFFFFF'}
                />
              </View>
            </View>
          </View>

          {/* Section 5: Support & Arbitration */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support & Legal</Text>
            <View style={styles.menuBox}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => Alert.alert('DevPay Arbitration', 'DevPay Escrow Dispute Center mediates milestone deliverables using submitted work logs, contracts, and NIA identity verification.')}
                activeOpacity={0.7}>
                <View style={styles.menuLeft}>
                  <View style={[styles.menuIconWrap, { backgroundColor: '#EFF6FF' }]}>
                    <Ionicons name="help-buoy-outline" size={18} color="#0F73F7" />
                  </View>
                  <Text style={styles.menuLabel}>Escrow Dispute & Arbitration</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.light.textMuted} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => Alert.alert('Terms of Service', 'DevPay Africa escrow services operate in compliance with Bank of Ghana Payment Systems and Services Act.')}
                activeOpacity={0.7}>
                <View style={styles.menuLeft}>
                  <View style={[styles.menuIconWrap, { backgroundColor: '#F1F5F9' }]}>
                    <Ionicons name="document-text-outline" size={18} color={Colors.light.text} />
                  </View>
                  <Text style={styles.menuLabel}>Terms of Service</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.light.textMuted} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => Alert.alert('Privacy Policy', 'Your Ghana Card credentials and transaction records are encrypted using AES-256 standard.')}
                activeOpacity={0.7}>
                <View style={styles.menuLeft}>
                  <View style={[styles.menuIconWrap, { backgroundColor: '#F1F5F9' }]}>
                    <Ionicons name="lock-closed-outline" size={18} color={Colors.light.text} />
                  </View>
                  <Text style={styles.menuLabel}>Privacy Policy</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.light.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Section 6: Danger Zone (Logout & Delete Account) */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: '#EF4444' }]}>Danger Zone</Text>
            <View style={[styles.menuBox, styles.dangerBox]}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/logout')}
                activeOpacity={0.7}>
                <View style={styles.menuLeft}>
                  <View style={[styles.menuIconWrap, { backgroundColor: '#FEE2E2' }]}>
                    <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                  </View>
                  <Text style={[styles.menuLabel, { color: '#EF4444' }]}>Sign Out</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#EF4444" />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/delete-account')}
                activeOpacity={0.7}>
                <View style={styles.menuLeft}>
                  <View style={[styles.menuIconWrap, { backgroundColor: '#FEE2E2' }]}>
                    <Ionicons name="trash-outline" size={18} color="#DC2626" />
                  </View>
                  <View>
                    <Text style={[styles.menuLabel, { color: '#DC2626', fontWeight: '700' }]}>
                      Delete Account
                    </Text>
                    <Text style={styles.menuSublabel}>Permanently erase profile & history</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#DC2626" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.versionFooter}>DevPay Africa Mobile • v1.0.0 (SDK 58)</Text>
        </ScrollView>
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
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF3FA',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#EEF3FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.light.text,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: '#EEF3FA',
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#E2E8F0',
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.light.text,
  },
  verifiedBadge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSubtitle: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  profileEmail: {
    fontSize: 11,
    color: Colors.light.textMuted,
    marginTop: 2,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F73F7',
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  menuBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EEF3FA',
    overflow: 'hidden',
  },
  dangerBox: {
    borderColor: '#FECACA',
    backgroundColor: '#FFFBFB',
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
    flex: 1,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  menuSublabel: {
    fontSize: 12,
    color: Colors.light.textMuted,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 64,
  },
  badgeWrap: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
  badgeWrapGray: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeTextGray: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.textSecondary,
  },
  versionFooter: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.light.textMuted,
    marginTop: 10,
  },
});
