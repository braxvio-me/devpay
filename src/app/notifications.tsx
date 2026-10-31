import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Layout } from '@/constants/theme';
import { Chip, GlassCard, IconButton, ScreenBackground, TopBar } from '@/components/ds';
import { useTheme } from '@/contexts/ThemeContext';
import { useRole } from '@/contexts/RoleContext';
import Animated, { FadeInDown, FadeOutLeft } from 'react-native-reanimated';
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
  const { colors } = useTheme();
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
      iconBg: '#E5F6EF',
      iconColor: '#1FAE7A',
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
      iconBg: '#E3F2FA',
      iconColor: '#3B7493',
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
      iconBg: '#E3F2FA',
      iconColor: '#2C88B4',
    },
    {
      id: 'n_c4',
      category: 'system',
      title: 'Business TIN Registration Verified',
      description: 'Kente Labs Ltd (TIN: C0028192847) has been validated by GRA. High-volume escrow funding is active.',
      time: '1d ago',
      isRead: true,
      actionLabel: 'Company Profile',
      actionRoute: '/profile',
      icon: 'checkmark-circle',
      iconBg: '#E5F6EF',
      iconColor: '#178F64',
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
      iconBg: '#FCEBEC',
      iconColor: '#E5484D',
    },
  ];

  const freelancerNotifications: NotificationItem[] = [
    {
      id: 'n_1',
      category: 'escrow',
      title: 'Milestone 2 Escrow Funded',
      description: 'Volta Pay deposited GH₵ 2,000.00 into secure escrow. You may now commence milestone deliverables safely.',
      time: '15m ago',
      isRead: false,
      amount: 'GH₵ 2,000.00',
      actionLabel: 'View Contract',
      actionRoute: '/contracts',
      icon: 'shield-checkmark',
      iconBg: '#E3F2FA',
      iconColor: '#2C88B4',
    },
    {
      id: 'n_2',
      category: 'contract',
      title: 'New Contract Offer Received',
      description: 'Kente Labs offered you "Payment Webhook Architecture" fixed milestone contract with escrow guarantee.',
      time: '1h ago',
      isRead: false,
      amount: 'GH₵ 5,000.00',
      actionLabel: 'Review Offer',
      actionRoute: '/job/3',
      icon: 'document-text',
      iconBg: '#E3F2FA',
      iconColor: '#3B7493',
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
      iconBg: '#E5F6EF',
      iconColor: '#1FAE7A',
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
      iconBg: '#E5F6EF',
      iconColor: '#178F64',
    },
    {
      id: 'n_5',
      category: 'contract',
      title: 'Deliverable Review Approved',
      description: 'Sankofa Studio accepted Milestone 1 Figma prototypes. GH₵ 1,600.00 has moved to your Available Balance.',
      time: '2d ago',
      isRead: true,
      amount: 'GH₵ 1,600.00',
      actionLabel: 'View Contracts',
      actionRoute: '/contracts',
      icon: 'ribbon-outline',
      iconBg: '#FDF3E1',
      iconColor: '#C27A0E',
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
      iconBg: '#FCEBEC',
      iconColor: '#E5484D',
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
    <View style={{ flex: 1 }}>
      <ScreenBackground />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <TopBar
          title="Notifications"
          subtitle={unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          right={
            unreadCount > 0 ? (
              <IconButton icon="checkmark-done" accessibilityLabel="Mark all as read" onPress={handleMarkAllRead} />
            ) : undefined
          }
        />

        <View style={styles.tabsWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          {[
            { id: 'all', label: 'All' },
            { id: 'escrow', label: 'Payments' },
            { id: 'contract', label: 'Contracts' },
            { id: 'system', label: 'Security' },
          ].map((tab) => (
            <Chip key={tab.id} label={tab.label} selected={activeTab === tab.id} onPress={() => setActiveTab(tab.id as typeof activeTab)} />
          ))}
        </ScrollView>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.feed}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
          }>
          {isLoading ? (
            <View style={{ gap: 12 }}>
              <NotificationSkeleton />
              <NotificationSkeleton />
              <NotificationSkeleton />
            </View>
          ) : filteredNotifications.length === 0 ? (
            <GlassCard style={styles.empty}>
              <View style={[styles.emptyIcon, { backgroundColor: colors.primaryWash }]}>
                <Ionicons name="notifications-off-outline" size={26} color={colors.primary} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>Nothing here</Text>
              <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
                Updates about escrow, payouts and contracts will show up here.
              </Text>
            </GlassCard>
          ) : (
            filteredNotifications.map((item, index) => (
              <Animated.View
                key={item.id}
                entering={FadeInDown.delay(index * 40).duration(320)}
                exiting={FadeOutLeft.duration(200)}>
                <GlassCard style={!item.isRead && { borderWidth: 1, borderColor: colors.primarySoft }}>
                  <View style={styles.cardTop}>
                    <View style={[styles.icon, { backgroundColor: `${item.iconColor}1F` }]}>
                      <Ionicons name={item.icon} size={20} color={item.iconColor} />
                    </View>
                    <View style={{ flex: 1, gap: 2 }}>
                      <View style={styles.titleRow}>
                        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
                          {item.title}
                        </Text>
                        {!item.isRead && <View style={[styles.dot, { backgroundColor: colors.accentCoral }]} />}
                      </View>
                      <Text style={[styles.time, { color: colors.textMuted }]}>{item.time}</Text>
                    </View>
                    <Pressable
                      onPress={() => handleClearNotification(item.id)}
                      hitSlop={10}
                      accessibilityRole="button"
                      accessibilityLabel="Dismiss">
                      <Ionicons name="close" size={18} color={colors.textMuted} />
                    </Pressable>
                  </View>
                  <Text style={[styles.desc, { color: colors.textSecondary }]}>{item.description}</Text>
                  {(item.amount || item.actionLabel) && (
                    <View style={styles.footer}>
                      {item.amount ? (
                        <Text style={[styles.amount, { color: item.amount.startsWith('+') ? colors.accentGreen : colors.text }]}>{item.amount}</Text>
                      ) : (
                        <View />
                      )}
                      {item.actionLabel && item.actionRoute && (
                        <Pressable
                          onPress={() => {
                            setNotifications((prev) => prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n)));
                            router.push(item.actionRoute as any);
                          }}
                          accessibilityRole="link"
                          style={styles.action}
                          hitSlop={8}>
                          <Text style={[styles.actionText, { color: colors.primaryText }]}>{item.actionLabel}</Text>
                          <Ionicons name="arrow-forward" size={14} color={colors.primaryText} />
                        </Pressable>
                      )}
                    </View>
                  )}
                </GlassCard>
              </Animated.View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabsWrap: { height: 56, justifyContent: 'center' },
  tabs: { gap: 10, paddingHorizontal: Layout.margin, alignItems: 'center' },
  feed: { paddingHorizontal: Layout.margin, paddingTop: 10, paddingBottom: 48, gap: 12 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  icon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { flexShrink: 1, fontSize: 15, fontWeight: '600' },
  dot: { width: 8, height: 8, borderRadius: 4 },
  time: { fontSize: 12 },
  desc: { fontSize: 13, lineHeight: 19, marginTop: 10 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  amount: { fontSize: 15, fontWeight: '600', fontVariant: ['tabular-nums'] },
  action: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionText: { fontSize: 13, fontWeight: '600' },
  empty: { alignItems: 'center', paddingVertical: 32, gap: 6 },
  emptyIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  emptyTitle: { fontSize: 17, fontWeight: '600' },
  emptySub: { fontSize: 13, textAlign: 'center', maxWidth: 260, lineHeight: 19 },
});
