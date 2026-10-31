import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useRole } from '@/contexts/RoleContext';
import { FloatingTabBar } from '@/components/floating-tab-bar';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const router = useRouter();
  const { isDark, colors } = useTheme();
  const { isClient, toggleRole } = useRole();

  // State for the interactive Availability & Booking Modal (Screens 2 & 3 in Image 2)
  const [isAvailabilityModalVisible, setIsAvailabilityModalVisible] = useState(false);
  const [modalTab, setModalTab] = useState<'Stays' | 'Experience'>('Stays');
  const [selectedDestination, setSelectedDestination] = useState<string>("I'm Flexible");
  const [dateMode, setDateMode] = useState<'Dates' | 'Month' | 'Flexible'>('Dates');
  const [selectedDates, setSelectedDates] = useState<number[]>([1, 8]);
  const [flexibility, setFlexibility] = useState<string>('Exact dates');

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const calendarDays = [
    null, null, null, null, 1, 2, 3,
    4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17,
    18, 19, 20, 21, 22, 23, 24,
    25, 26, 27, 28, 29, 30, null,
  ];

  const handleDatePress = (day: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDates((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleRoleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleRole();
  };

  return (
    <View style={[styles.screen, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top Header matching Image 2 */}
        <View style={styles.headerRow}>
          <View style={{ width: 36 }} />
          <Text style={[styles.headerTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            Profile
          </Text>
          <TouchableOpacity
            style={styles.notificationBtn}
            onPress={() => router.push('/notifications')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color={isDark ? '#F8FAFC' : '#0F172A'}
            />
            <View style={styles.notificationPinkDot} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Main Profile Avatar & Identity Card matching Image 2 */}
          <View
            style={[
              styles.profileHeroCard,
              {
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                borderColor: isDark ? '#334155' : '#F1F5F9',
              },
            ]}>
            {/* Avatar with Pink Verification Checkmark Pill */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarGlowRing}>
                <Image
                  source={{
                    uri: isClient
                      ? 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=240'
                      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240',
                  }}
                  style={styles.avatarImage}
                />
                {/* Pink checkmark badge floating at top-left of avatar ring */}
                <View style={styles.pinkCheckmarkBadge}>
                  <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                </View>
              </View>

              {/* Name & Role Row with Edit Pencil */}
              <View style={styles.nameRow}>
                <Text style={[styles.userName, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  {isClient ? 'Maria Barry' : 'Kwame Mensah'}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.editPencilBtn,
                    { backgroundColor: isDark ? '#334155' : '#F1F5F9' },
                  ]}
                  onPress={() => router.push('/edit-profile')}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="pencil" size={13} color={isDark ? '#F8FAFC' : '#0F172A'} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.userRoleSubtitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                {isClient ? 'Guest • Client Employer' : 'Verified Senior Developer'}
              </Text>
            </View>

            {/* Identity Verification Progress Bar (76%) */}
            <View style={styles.verificationBarSection}>
              <View style={styles.verificationTextRow}>
                <Text
                  style={[
                    styles.verificationLabel,
                    { color: isDark ? '#94A3B8' : '#475569' },
                  ]}>
                  Identity Verification
                </Text>
                <Text
                  style={[
                    styles.verificationPercent,
                    { color: isDark ? '#F8FAFC' : '#0F172A' },
                  ]}>
                  76%
                </Text>
              </View>

              {/* Sleek Dark Progress Pill */}
              <TouchableOpacity
                onPress={() => router.push('/kyc')}
                activeOpacity={0.85}
                style={[
                  styles.progressTrack,
                  { backgroundColor: isDark ? '#334155' : '#E2E8F0' },
                ]}>
                <View style={styles.progressFill} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Twin Side-by-Side Feature Cards matching Image 2 */}
          <View style={styles.featureCardsRow}>
            {/* Left Card: "November release features" with New badge & arrow */}
            <TouchableOpacity
              style={[
                styles.featureCard,
                {
                  backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                  borderColor: isDark ? '#334155' : '#F1F5F9',
                },
              ]}
              onPress={() => router.push('/earnings')}
              activeOpacity={0.85}>
              <View style={styles.featureCardTop}>
                <View style={styles.newBadgePill}>
                  <Text style={styles.newBadgeText}>New</Text>
                </View>
                <View
                  style={[
                    styles.arrowCircle,
                    { backgroundColor: isDark ? '#334155' : '#F8FAFC' },
                  ]}>
                  <Ionicons
                    name="arrow-up-outline"
                    size={14}
                    color={isDark ? '#F8FAFC' : '#0F172A'}
                    style={{ transform: [{ rotate: '45deg' }] }}
                  />
                </View>
              </View>
              <Text style={[styles.featureCardTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                November{'\n'}release features
              </Text>
            </TouchableOpacity>

            {/* Right Card: Switch Role / Host card with subtitle */}
            <TouchableOpacity
              style={[
                styles.featureCard,
                {
                  backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                  borderColor: isDark ? '#334155' : '#F1F5F9',
                },
              ]}
              onPress={handleRoleToggle}
              activeOpacity={0.85}>
              <View style={styles.featureCardTopRight}>
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: isDark ? '#334155' : '#F8FAFC' },
                  ]}>
                  <Ionicons
                    name={isClient ? 'briefcase-outline' : 'business-outline'}
                    size={15}
                    color={isDark ? '#F8FAFC' : '#0F172A'}
                  />
                </View>
              </View>
              <Text style={[styles.featureCardTitleRight, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                {isClient ? 'Switch to Developer' : 'Omostate your place'}
              </Text>
              <Text
                style={[
                  styles.featureCardSubRight,
                  { color: isDark ? '#94A3B8' : '#94A3B8' },
                ]}>
                Its simple to get set up and start earning.
              </Text>
            </TouchableOpacity>
          </View>

          {/* Availability / Schedule Banner matching Screen 2 & 3 */}
          <TouchableOpacity
            style={[
              styles.availabilityTriggerCard,
              {
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                borderColor: isDark ? '#334155' : '#F1F5F9',
              },
            ]}
            onPress={() => setIsAvailabilityModalVisible(true)}
            activeOpacity={0.85}>
            <View style={styles.availLeft}>
              <View style={styles.availIconWrap}>
                <Ionicons name="calendar" size={18} color="#E11D48" />
              </View>
              <View>
                <Text style={[styles.availTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  Schedule & Availability Filter
                </Text>
                <Text style={[styles.availSub, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Set project destinations, dates & booking criteria
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={isDark ? '#64748B' : '#94A3B8'} />
          </TouchableOpacity>

          {/* "Setting" Section matching Image 2 */}
          <View style={styles.settingsSection}>
            <Text style={[styles.settingSectionTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              Setting
            </Text>

            <View
              style={[
                styles.settingsCardGroup,
                {
                  backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                  borderColor: isDark ? '#334155' : '#F1F5F9',
                },
              ]}>
              {/* Row 1: Personal information */}
              <TouchableOpacity
                style={styles.settingItemRow}
                onPress={() => router.push('/edit-profile')}
                activeOpacity={0.75}>
                <View style={styles.settingItemLeft}>
                  <Ionicons
                    name="person-outline"
                    size={19}
                    color={isDark ? '#94A3B8' : '#0F172A'}
                    style={{ marginRight: 12 }}
                  />
                  <Text style={[styles.settingItemText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                    Personal information
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={isDark ? '#64748B' : '#94A3B8'} />
              </TouchableOpacity>

              <View
                style={[
                  styles.settingDivider,
                  { backgroundColor: isDark ? '#334155' : '#F1F5F9' },
                ]}
              />

              {/* Row 2: Ghana Card Verification */}
              <TouchableOpacity
                style={styles.settingItemRow}
                onPress={() => router.push('/kyc')}
                activeOpacity={0.75}>
                <View style={styles.settingItemLeft}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={19}
                    color="#10B981"
                    style={{ marginRight: 12 }}
                  />
                  <Text style={[styles.settingItemText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                    Ghana Card (NIA) KYC
                  </Text>
                </View>
                <View style={styles.verifiedMiniBadge}>
                  <Text style={styles.verifiedMiniBadgeText}>Verified</Text>
                </View>
              </TouchableOpacity>

              <View
                style={[
                  styles.settingDivider,
                  { backgroundColor: isDark ? '#334155' : '#F1F5F9' },
                ]}
              />

              {/* Row 3: MoMo Escrow Payouts */}
              <TouchableOpacity
                style={styles.settingItemRow}
                onPress={() => router.push('/withdraw')}
                activeOpacity={0.75}>
                <View style={styles.settingItemLeft}>
                  <Ionicons
                    name="card-outline"
                    size={19}
                    color={isDark ? '#94A3B8' : '#0F172A'}
                    style={{ marginRight: 12 }}
                  />
                  <Text style={[styles.settingItemText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                    Payout Methods & MoMo Wallet
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={isDark ? '#64748B' : '#94A3B8'} />
              </TouchableOpacity>

              <View
                style={[
                  styles.settingDivider,
                  { backgroundColor: isDark ? '#334155' : '#F1F5F9' },
                ]}
              />

              {/* Row 4: Appearance */}
              <TouchableOpacity
                style={styles.settingItemRow}
                onPress={() => router.push('/appearance')}
                activeOpacity={0.75}>
                <View style={styles.settingItemLeft}>
                  <Ionicons
                    name={isDark ? 'moon-outline' : 'sunny-outline'}
                    size={19}
                    color={isDark ? '#94A3B8' : '#0F172A'}
                    style={{ marginRight: 12 }}
                  />
                  <Text style={[styles.settingItemText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                    Appearance & Theme
                  </Text>
                </View>
                <Text style={[styles.settingValueText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  {isDark ? 'Dark Mode' : 'Light Mode'}
                </Text>
              </TouchableOpacity>

              <View
                style={[
                  styles.settingDivider,
                  { backgroundColor: isDark ? '#334155' : '#F1F5F9' },
                ]}
              />

              {/* Row 5: Log out */}
              <TouchableOpacity
                style={styles.settingItemRow}
                onPress={() => router.push('/logout')}
                activeOpacity={0.75}>
                <View style={styles.settingItemLeft}>
                  <Ionicons
                    name="log-out-outline"
                    size={19}
                    color="#EF4444"
                    style={{ marginRight: 12 }}
                  />
                  <Text style={[styles.settingItemText, { color: '#EF4444' }]}>Log out</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Floating Bar */}
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

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* AVAILABILITY & CALENDAR MODAL SHEET (Middle & Right screens in Image 2) */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <Modal
          visible={isAvailabilityModalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setIsAvailabilityModalVisible(false)}>
          <View
            style={[
              styles.modalScreen,
              { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' },
            ]}>
            <SafeAreaView style={{ flex: 1 }}>
              {/* Modal Top Bar */}
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  style={[
                    styles.modalCloseBtn,
                    { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' },
                  ]}
                  onPress={() => setIsAvailabilityModalVisible(false)}>
                  <Ionicons name="close" size={18} color={isDark ? '#F8FAFC' : '#0F172A'} />
                </TouchableOpacity>

                {/* Stays / Experience Pill Switcher matching Image 2 */}
                <View
                  style={[
                    styles.staysExpSwitch,
                    { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' },
                  ]}>
                  <TouchableOpacity
                    style={[
                      styles.switchPill,
                      modalTab === 'Stays' && [
                        styles.switchPillActive,
                        { backgroundColor: isDark ? '#334155' : '#0F172A' },
                      ],
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setModalTab('Stays');
                    }}>
                    <View style={styles.dotIconRow}>
                      <View style={styles.switchDot} />
                      <Text
                        style={[
                          styles.switchPillText,
                          { color: modalTab === 'Stays' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B' },
                        ]}>
                        Stays
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.switchPill,
                      modalTab === 'Experience' && [
                        styles.switchPillActive,
                        { backgroundColor: isDark ? '#334155' : '#0F172A' },
                      ],
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setModalTab('Experience');
                    }}>
                    <Text
                      style={[
                        styles.switchPillText,
                        { color: modalTab === 'Experience' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B' },
                      ]}>
                      Experience
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={{ width: 36 }} />
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalScroll}>
                {/* Section 1: Where Your Destination? */}
                <View
                  style={[
                    styles.modalSectionCard,
                    {
                      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                      borderColor: isDark ? '#334155' : '#F1F5F9',
                    },
                  ]}>
                  <View style={styles.sectionTitleRow}>
                    <Text style={[styles.cardTitleH, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                      Where Your <Text style={{ fontWeight: '800' }}>Destination?</Text>
                    </Text>
                    <Ionicons name="sync-outline" size={17} color={isDark ? '#94A3B8' : '#64748B'} />
                  </View>

                  {/* Destination Pills */}
                  <View style={styles.destPillsRow}>
                    {["I'm Flexible", 'United states', 'France'].map((dest) => {
                      const isSelected = selectedDestination === dest;
                      return (
                        <TouchableOpacity
                          key={dest}
                          style={[
                            styles.destPill,
                            isSelected
                              ? styles.destPillSelected
                              : [
                                  styles.destPillNormal,
                                  {
                                    backgroundColor: isDark ? '#334155' : '#F8FAFC',
                                    borderColor: isDark ? '#475569' : '#E2E8F0',
                                  },
                                ],
                          ]}
                          onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setSelectedDestination(dest);
                          }}>
                          {isSelected && <View style={styles.pinkPillDot} />}
                          <Text
                            style={[
                              styles.destPillText,
                              { color: isSelected ? '#E11D48' : isDark ? '#F8FAFC' : '#0F172A' },
                            ]}>
                            {dest}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Section 2: When? with Calendar Grid matching Image 2 Screen 3 */}
                <View
                  style={[
                    styles.modalSectionCard,
                    {
                      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                      borderColor: isDark ? '#334155' : '#F1F5F9',
                    },
                  ]}>
                  <View style={styles.sectionTitleRow}>
                    <View>
                      <Text style={[styles.cardTitleH, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                        When?
                      </Text>
                      <Text style={[styles.whenSubtitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                        • 20-23 Dec
                      </Text>
                    </View>
                    <Ionicons name="sync-outline" size={17} color={isDark ? '#94A3B8' : '#64748B'} />
                  </View>

                  {/* Dates / Month / Flexible Pills */}
                  <View style={styles.dateModeRow}>
                    {(['Dates', 'Month', 'Flexible'] as const).map((mode) => {
                      const isSelected = dateMode === mode;
                      return (
                        <TouchableOpacity
                          key={mode}
                          style={[
                            styles.dateModePill,
                            isSelected
                              ? styles.dateModeActive
                              : [
                                  styles.dateModeInactive,
                                  {
                                    backgroundColor: isDark ? '#334155' : '#F8FAFC',
                                    borderColor: isDark ? '#475569' : '#E2E8F0',
                                  },
                                ],
                          ]}
                          onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setDateMode(mode);
                          }}>
                          <Text
                            style={[
                              styles.dateModeText,
                              { color: isSelected ? '#E11D48' : isDark ? '#94A3B8' : '#64748B' },
                            ]}>
                            {mode}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Calendar Grid matching Image 2 Screen 3 */}
                  <View style={styles.calendarContainer}>
                    {/* Day Headers: S M T W T F S */}
                    <View style={styles.calendarHeaderRow}>
                      {daysOfWeek.map((day, idx) => (
                        <Text
                          key={idx}
                          style={[
                            styles.calendarHeaderDay,
                            { color: isDark ? '#94A3B8' : '#94A3B8' },
                          ]}>
                          {day}
                        </Text>
                      ))}
                    </View>

                    {/* Days Grid */}
                    <View style={styles.calendarGrid}>
                      {calendarDays.map((dayNum, idx) => {
                        if (dayNum === null) {
                          return <View key={idx} style={styles.calendarDayCell} />;
                        }
                        const isPinkSelected = selectedDates.includes(dayNum);
                        return (
                          <TouchableOpacity
                            key={idx}
                            style={[
                              styles.calendarDayCell,
                              isPinkSelected && styles.calendarDaySelected,
                            ]}
                            onPress={() => handleDatePress(dayNum)}>
                            <Text
                              style={[
                                styles.calendarDayText,
                                isPinkSelected
                                  ? styles.calendarDayTextSelected
                                  : { color: isDark ? '#F8FAFC' : '#1E293B' },
                              ]}>
                              {dayNum}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  {/* Flexibility Pills Row (Exact dates, 1 days +, 2 days +) */}
                  <View style={styles.flexibilityRow}>
                    {['Exact dates', '1 days +', '2 days +', '3 days +'].map((f) => {
                      const isSelected = flexibility === f;
                      return (
                        <TouchableOpacity
                          key={f}
                          style={[
                            styles.flexPill,
                            isSelected
                              ? [
                                  styles.flexPillSelected,
                                  { backgroundColor: isDark ? '#334155' : '#F8FAFC' },
                                ]
                              : [
                                  styles.flexPillNormal,
                                  { borderColor: isDark ? '#334155' : '#E2E8F0' },
                                ],
                          ]}
                          onPress={() => setFlexibility(f)}>
                          <Text
                            style={[
                              styles.flexPillText,
                              { color: isSelected ? '#0F172A' : isDark ? '#94A3B8' : '#64748B' },
                              isSelected && { fontWeight: '700' },
                            ]}>
                            {f}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Section 3: Who? */}
                <View
                  style={[
                    styles.modalSectionCard,
                    {
                      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                      borderColor: isDark ? '#334155' : '#F1F5F9',
                    },
                  ]}>
                  <View style={styles.sectionTitleRow}>
                    <View>
                      <Text style={[styles.cardTitleH, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                        Who
                      </Text>
                      <Text style={[styles.whenSubtitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                        • 4 Guest • Full-Stack Dev Team
                      </Text>
                    </View>
                    <Ionicons name="sync-outline" size={17} color={isDark ? '#94A3B8' : '#64748B'} />
                  </View>
                </View>
              </ScrollView>

              {/* Bottom Sticky Action Bar: Clear All & Bright Pink Search */}
              <View
                style={[
                  styles.modalBottomBar,
                  {
                    backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                    borderTopColor: isDark ? '#1E293B' : '#F1F5F9',
                  },
                ]}>
                <TouchableOpacity
                  style={[
                    styles.clearAllBtn,
                    { backgroundColor: isDark ? '#1E293B' : '#F8FAFC' },
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedDates([]);
                  }}>
                  <Text style={[styles.clearAllText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                    Clear All
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.searchPinkBtn}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    setIsAvailabilityModalVisible(false);
                  }}
                  activeOpacity={0.88}>
                  <Text style={styles.searchPinkBtnText}>Search</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </View>
        </Modal>
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
  headerRow: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  notificationBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationPinkDot: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E11D48',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 110,
    gap: 14,
  },

  // Profile Hero Card matching Image 2
  profileHeroCard: {
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    alignItems: 'center',
  },
  avatarSection: {
    alignItems: 'center',
  },
  avatarGlowRing: {
    position: 'relative',
    padding: 6,
    borderRadius: 56,
    backgroundColor: 'rgba(225, 29, 72, 0.08)',
    marginBottom: 12,
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  pinkCheckmarkBadge: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E11D48',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  userName: {
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  editPencilBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userRoleSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 3,
  },
  verificationBarSection: {
    width: '100%',
    marginTop: 20,
  },
  verificationTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  verificationLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  verificationPercent: {
    fontSize: 14,
    fontWeight: '800',
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    width: '76%',
    height: '100%',
    borderRadius: 5,
    backgroundColor: '#0F172A',
  },

  // Twin Side-by-Side Feature Cards matching Image 2
  featureCardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  featureCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  featureCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  newBadgePill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F172A',
  },
  arrowCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 19,
    marginTop: 10,
  },
  featureCardTopRight: {
    alignItems: 'flex-end',
  },
  iconBox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureCardTitleRight: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 4,
  },
  featureCardSubRight: {
    fontSize: 10,
    lineHeight: 14,
    marginTop: 4,
  },

  // Availability Trigger Card
  availabilityTriggerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  availLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  availIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(225, 29, 72, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  availTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  availSub: {
    fontSize: 11,
    marginTop: 2,
  },

  // Settings Section
  settingsSection: {
    marginTop: 6,
    gap: 10,
  },
  settingSectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  settingsCardGroup: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  settingItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemText: {
    fontSize: 14,
    fontWeight: '600',
  },
  settingValueText: {
    fontSize: 12,
    fontWeight: '500',
  },
  settingDivider: {
    height: 1,
    marginLeft: 48,
  },
  verifiedMiniBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  verifiedMiniBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#10B981',
  },

  // Modal Styles matching Screen 2 & 3 in Image 2
  modalScreen: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  staysExpSwitch: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 3,
  },
  switchPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 17,
  },
  switchPillActive: {},
  dotIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  switchDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E11D48',
  },
  switchPillText: {
    fontSize: 13,
    fontWeight: '700',
  },
  modalScroll: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
    gap: 14,
  },
  modalSectionCard: {
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  cardTitleH: {
    fontSize: 17,
    fontWeight: '600',
  },
  whenSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  destPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  destPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    gap: 6,
  },
  destPillNormal: {
    borderWidth: 1,
  },
  destPillSelected: {
    borderWidth: 1.5,
    borderColor: '#E11D48',
    backgroundColor: 'rgba(225, 29, 72, 0.05)',
  },
  pinkPillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E11D48',
  },
  destPillText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Calendar
  dateModeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  dateModePill: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateModeNormal: {},
  dateModeActive: {
    borderWidth: 1.5,
    borderColor: '#E11D48',
    backgroundColor: 'rgba(225, 29, 72, 0.05)',
  },
  dateModeInactive: {
    borderWidth: 1,
  },
  dateModeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  calendarContainer: {
    marginBottom: 16,
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  calendarHeaderDay: {
    width: 38,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  calendarDayCell: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 3,
  },
  calendarDaySelected: {
    backgroundColor: '#E11D48',
  },
  calendarDayText: {
    fontSize: 13,
    fontWeight: '600',
  },
  calendarDayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  flexibilityRow: {
    flexDirection: 'row',
    gap: 6,
  },
  flexPill: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexPillNormal: {
    borderWidth: 1,
  },
  flexPillSelected: {},
  flexPillText: {
    fontSize: 10,
  },

  // Modal Bottom Bar matching Image 2
  modalBottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 12,
  },
  clearAllBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: '700',
  },
  searchPinkBtn: {
    flex: 1.4,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E11D48',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  searchPinkBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
