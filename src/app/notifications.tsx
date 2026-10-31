import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useRole } from '@/contexts/RoleContext';
import Animated, {
  FadeInRight,
  FadeOutLeft,
} from 'react-native-reanimated';
import { NotificationSkeleton } from '@/components/skeleton';

export interface NotificationItem {
  id: string;
  category: 'escrow' | 'contract' | 'system' | 'message';
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  amount?: string;
  actionLabel?: string;
  actionRoute?: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { isDark, colors } = useTheme();
  const { isClient } = useRole();

  const [activeTab, setActiveTab] = useState<'all' | 'escrow' | 'contract' | 'system'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  const clientNotifications: NotificationItem[] = [
    {
      id: 'n_c1',
      category: 'escrow',
      title: 'Milestone 2 Submitted for Review',
      description: 'Kwame Mensah (Senior Dev) submitted Milestone 2 deliverables. GitHub PR #42 & live demo attached. Review and release escrow.',
      time: '15m ago',
      isRead: false,
      amount: 'GH₵ 2,000.00',
      actionLabel: 'Review & Release',
      actionRoute: '/contracts/review',
      icon: 'shield-checkmark',
      iconBg: '#ECFDF5',
      iconColor: '#10B981',
    },
    {
      id: 'n_c2',
      category: 'contract',
      title: '3 New Proposals on Job Post',
      description: '3 Ghana Card verified mobile engineers submitted proposals for "Senior React Native Engineer". Compare proposals and hire.',
      time: '1h ago',
      isRead: false,
      amount: 'GH₵ 4,500.00',
      actionLabel: 'Compare Proposals',
      actionRoute: '/job/applicants',
      icon: 'people',
      iconBg: '#F3E8FF',
      iconColor: '#9333EA',
    },
    {
      id: 'n_c3',
      category: 'escrow',
      title: 'MTN MoMo Escrow Deposit Confirmed',
      description: 'GH₵ 5,000.00 has been credited to your corporate escrow vault via MTN MoMo Business. BoG compliance receipt generated.',
      time: '3h ago',
      isRead: false,
      amount: '+GH₵ 5,000.00',
      actionLabel: 'Escrow Vault',
      actionRoute: '/earnings',
      icon: 'wallet',
      iconBg: '#EBF3FE',
      iconColor: '#0F73F7',
    },
    {
      id: 'n_c4',
      category: 'system',
      title: 'Business TIN Registration Verified',
      description: 'TechCorp Africa Ltd (TIN: C0028192847) has been validated by GRA. High-volume escrow funding is active.',
      time: '1d ago',
      isRead: true,
      actionLabel: 'Company Profile',
      actionRoute: '/profile',
      icon: 'checkmark-circle',
      iconBg: '#ECFDF5',
      iconColor: '#059669',
    },
    {
      id: 'n_c5',
      category: 'system',
      title: 'Security Alert: New Sign-in',
      description: 'New login detected from iPhone 15 Pro in Accra, Ghana. If this was not you, lock your escrow payouts immediately.',
      time: '3d ago',
      isRead: true,
      actionLabel: 'Security Settings',
      actionRoute: '/settings',
      icon: 'lock-closed',
      iconBg: '#FEE2E2',
      iconColor: '#EF4444',
    },
  ];

  const freelancerNotifications: NotificationItem[] = [
    {
      id: 'n_1',
      category: 'escrow',
      title: 'Milestone 2 Escrow Funded',
      description: 'Google Africa deposited GH₵ 2,000.00 into secure escrow. You may now commence milestone deliverables safely.',
      time: '15m ago',
      isRead: false,
      amount: 'GH₵ 2,000.00',
      actionLabel: 'View Contract',
      actionRoute: '/contracts',
      icon: 'shield-checkmark',
      iconBg: '#EBF3FE',
      iconColor: '#0F73F7',
    },
    {
      id: 'n_2',
      category: 'contract',
      title: 'New Contract Offer Received',
      description: 'Paystack Ghana offered you "Payment Webhook Architecture" fixed milestone contract with escrow guarantee.',
      time: '1h ago',
      isRead: false,
      amount: 'GH₵ 5,000.00',
      actionLabel: 'Review Offer',
      actionRoute: '/job/3',
      icon: 'document-text',
      iconBg: '#F3E8FF',
      iconColor: '#9333EA',
    },
    {
      id: 'n_3',
      category: 'escrow',
      title: 'MoMo Payout Processed',
      description: 'GH₵ 1,850.00 has been sent to your MTN Mobile Money account (024 123 4567). Reference: DEV-MOMO-8821.',
      time: '3h ago',
      isRead: false,
      amount: '+GH₵ 1,850.00',
      actionLabel: 'View Wallet',
      actionRoute: '/earnings',
      icon: 'wallet',
      iconBg: '#ECFDF5',
      iconColor: '#10B981',
    },
    {
      id: 'n_4',
      category: 'system',
      title: 'Ghana Card ID Verified',
      description: 'Your NIA Ghana Card (GHA-729481029-4) verification was approved. You now hold the Trusted Freelancer Badge.',
      time: '1d ago',
      isRead: true,
      actionLabel: 'View Profile',
      actionRoute: '/profile',
      icon: 'checkmark-circle',
      iconBg: '#ECFDF5',
      iconColor: '#059669',
    },
    {
      id: 'n_5',
      category: 'contract',
      title: 'Deliverable Review Approved',
      description: 'Telecel Digital Labs accepted Milestone 1 Figma prototypes. GH₵ 1,600.00 has moved to your Available Balance.',
      time: '2d ago',
      isRead: true,
      amount: 'GH₵ 1,600.00',
      actionLabel: 'View Contracts',
      actionRoute: '/contracts',
      icon: 'ribbon-outline',
      iconBg: '#FEF3C7',
      iconColor: '#D97706',
    },
    {
      id: 'n_6',
      category: 'system',
      title: 'Security Alert: New Sign-in',
      description: 'New login detected from iPhone 15 Pro in Accra, Ghana. If this was not you, lock your escrow payouts immediately.',
      time: '3d ago',
      isRead: true,
      actionLabel: 'Security Settings',
      actionRoute: '/settings',
      icon: 'lock-closed',
      iconBg: '#FEE2E2',
      iconColor: '#EF4444',
    },
  ];

  const [notifications, setNotifications] = useState<NotificationItem[]>(
    isClient ? clientNotifications : freelancerNotifications
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleClearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === 'all') return true;
    return item.category === activeTab;
  });

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top Header */}
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}
            onPress={() => router.back()}
            activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.headerTitleWrap}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
            {unreadCount > 0 && (
              <View style={styles.unreadChip}>
                <Text style={styles.unreadChipText}>{unreadCount} new</Text>
              </View>
            )}
          </View>

          {unreadCount > 0 ? (
            <TouchableOpacity onPress={handleMarkAllRead} activeOpacity={0.7}>
              <Text style={styles.markReadText}>Mark read</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 40 }} />
          )}
        </View>

        {/* Category Tabs */}
        <View style={[styles.tabsContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScroll}>
            {[
              { id: 'all', label: 'All' },
              { id: 'escrow', label: 'Escrow & Payouts' },
              { id: 'contract', label: 'Contracts' },
              { id: 'system', label: 'System & Security' },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  style={[
                    styles.tabChip,
                    { backgroundColor: colors.backgroundElement },
                    isSelected && styles.activeTabChip,
                  ]}
                  onPress={() => setActiveTab(tab.id as any)}
                  activeOpacity={0.8}>
                  <Text
                    style={[
                      styles.tabChipText,
                      { color: colors.textSecondary },
                      isSelected && styles.activeTabChipText,
                    ]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Notifications Feed */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#0F73F7"
              colors={['#0F73F7', '#38BDF8']}
            />
          }>
          {isLoading ? (
            <View style={{ gap: 12 }}>
              <NotificationSkeleton />
              <NotificationSkeleton />
              <NotificationSkeleton />
              <NotificationSkeleton />
            </View>
          ) : filteredNotifications.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="notifications-off-outline" size={32} color={Colors.light.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>No Notifications</Text>
              <Text style={styles.emptySubtitle}>
                You have no notifications in this category. Important updates about your escrow milestones will appear here.
              </Text>
            </View>
          ) : (
          filteredNotifications.map((item, index) => (
              <Animated.View
                key={item.id}
                entering={FadeInRight.delay(index * 60).springify().damping(18).stiffness(120)}
                exiting={FadeOutLeft.duration(220)}
                style={[
                  styles.notificationCard,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  !item.isRead && (isDark ? styles.unreadCardDark : styles.unreadCard),
                ]}>
                <View style={styles.cardHeader}>
                  <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
                    <Ionicons name={item.icon} size={20} color={item.iconColor} />
                  </View>

                  <View style={styles.cardMeta}>
                    <View style={styles.titleRow}>
                      <Text style={[styles.notificationTitle, { color: colors.text }]}>{item.title}</Text>
                      {!item.isRead && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={[styles.notificationTime, { color: colors.textMuted }]}>{item.time}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.dismissBtn}
                    onPress={() => handleClearNotification(item.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name="close" size={16} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>

                <Text style={[styles.notificationDesc, { color: colors.textSecondary }]}>{item.description}</Text>

                {/* Amount Pill or Action Button */}
                <View style={styles.cardFooter}>
                  {item.amount && (
                    <View style={[styles.amountPill, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' }]}>
                      <Ionicons name="cash-outline" size={13} color="#0F73F7" />
                      <Text style={styles.amountText}>{item.amount}</Text>
                    </View>
                  )}

                  {item.actionLabel && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {
                        if (item.actionRoute) {
                          router.push(item.actionRoute as any);
                        }
                      }}
                      activeOpacity={0.85}>
                      <Text style={styles.actionButtonText}>{item.actionLabel}</Text>
                      <Ionicons name="chevron-forward" size={14} color="#0F73F7" />
                    </TouchableOpacity>
                  )}
                </View>
              </Animated.View>
            ))
          )}
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
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.light.text,
  },
  unreadChip: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  unreadChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F73F7',
  },
  markReadText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F73F7',
  },
  tabsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF3FA',
  },
  tabsScroll: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  tabChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  activeTabChip: {
    backgroundColor: '#0F73F7',
  },
  tabChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  activeTabChipText: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 20,
    gap: 12,
    paddingBottom: 40,
  },
  notificationCard: {
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 18,
    elevation: 4,
  },
  unreadCard: {
    borderColor: 'rgba(225, 29, 72, 0.25)',
    backgroundColor: '#FFFFFF',
  },
  unreadCardDark: {
    borderColor: 'rgba(225, 29, 72, 0.4)',
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardMeta: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#0F73F7',
  },
  notificationTime: {
    fontSize: 12,
    color: Colors.light.textMuted,
    marginTop: 2,
  },
  dismissBtn: {
    padding: 4,
  },
  notificationDesc: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.light.textSecondary,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  amountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  amountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F73F7',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginLeft: 'auto',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F73F7',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
