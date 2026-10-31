import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useRole } from '@/contexts/RoleContext';
import { FloatingTabBar, TabType } from '@/components/floating-tab-bar';
import { SearchBar } from '@/components/search-bar';
import {
  Appear,
  Avatar,
  Chip,
  CompanyLogo,
  GlassCard,
  IconButton,
  PressableScale,
  ScreenBackground,
  useNavClearance,
} from '@/components/ds';
import { Threads, Thread } from '@/constants/threads';
import { Layout } from '@/constants/theme';

type Filter = 'All' | 'Unread' | 'Clients' | 'Freelancers';

export default function MessagesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isClient } = useRole();
  const navClearance = useNavClearance();
  const [filter, setFilter] = useState<Filter>('All');
  const [query, setQuery] = useState('');

  const list = Threads.filter((t) => {
    const q = query.toLowerCase().trim();
    if (q && !`${t.name} ${t.project} ${t.lastMessage}`.toLowerCase().includes(q)) return false;
    if (filter === 'Unread') return t.unread > 0;
    if (filter === 'Clients') return !!t.company;
    if (filter === 'Freelancers') return !t.company;
    return true;
  });

  const onTab = (tab: TabType) => {
    if (tab === 'home') router.replace('/');
    if (tab === 'jobs') router.push(isClient ? '/explore' : '/contracts');
    if (tab === 'profile') router.push('/profile');
  };

  return (
    <View style={{ flex: 1 }}>
      <ScreenBackground />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <IconButton
              icon="chevron-back"
              accessibilityLabel="Go back"
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            />
            <Text style={[styles.title, { color: colors.text }]} accessibilityRole="header">
              Chats
            </Text>
          </View>
          <IconButton icon="create-outline" accessibilityLabel="New message" onPress={() => router.push('/chat/new')} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: Layout.margin, paddingBottom: navClearance }}>
          <SearchBar value={query} onChangeText={setQuery} placeholder="Search chats..." />

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips} contentContainerStyle={styles.chipsContent}>
            {(['All', 'Unread', 'Clients', 'Freelancers'] as Filter[]).map((f) => (
              <Chip key={f} label={f} selected={filter === f} onPress={() => setFilter(f)} />
            ))}
          </ScrollView>

          <GlassCard padded={false} style={{ marginTop: 18, paddingHorizontal: 16 }}>
            {list.map((t, i) => (
              <Appear key={t.id} index={i}>
                <ThreadRow thread={t} last={i === list.length - 1} onPress={() => router.push(`/chat/${t.id}` as any)} />
              </Appear>
            ))}
            {list.length === 0 && (
              <Text style={[styles.empty, { color: colors.textSecondary }]}>No conversations match.</Text>
            )}
          </GlassCard>
        </ScrollView>
      </SafeAreaView>

      <FloatingTabBar activeTab="chats" onSelectTab={onTab} onCenterActionPress={() => router.push(isClient ? '/job/create' : '/explore')} />
    </View>
  );
}

function ThreadRow({ thread, last, onPress }: { thread: Thread; last: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  const unread = thread.unread > 0;
  return (
    <PressableScale
      onPress={onPress}
      haptic={false}
      scaleTo={0.985}
      accessibilityLabel={`${thread.name}. ${thread.lastMessage}${unread ? `. ${thread.unread} unread` : ''}`}
      style={[styles.row, !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}>
      {thread.company ? (
        <CompanyLogo mark={thread.company.mark} size={50} />
      ) : (
        <Avatar uri={thread.avatar!} size={50} ring={false} online={thread.online} />
      )}
      <View style={{ flex: 1, gap: 3 }}>
        <View style={styles.rowTop}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {thread.name}
          </Text>
          <Text style={[styles.time, { color: unread ? colors.primaryText : colors.textMuted }]}>{thread.time}</Text>
        </View>
        <Text style={[styles.project, { color: colors.navActive }]} numberOfLines={1}>
          {thread.project}
        </Text>
        <View style={styles.rowTop}>
          <Text
            style={[styles.preview, { color: unread ? colors.text : colors.textSecondary, fontWeight: unread ? '500' : '400' }]}
            numberOfLines={1}>
            {thread.lastMessage}
          </Text>
          {unread && (
            <View style={[styles.badge, { backgroundColor: colors.primary }]}>
              <Text style={styles.badgeText}>{thread.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  header: {
    height: Layout.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.margin,
    marginBottom: 6,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { fontSize: 26, fontWeight: '600', letterSpacing: -0.6 },
  chips: { marginHorizontal: -Layout.margin, marginTop: 16, flexGrow: 0 },
  chipsContent: { gap: 10, paddingHorizontal: Layout.margin },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  rowTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  name: { flex: 1, fontSize: 15, fontWeight: '600' },
  time: { fontSize: 12 },
  project: { fontSize: 12, fontWeight: '500' },
  preview: { flex: 1, fontSize: 13 },
  badge: { minWidth: 20, height: 20, borderRadius: 10, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
  empty: { textAlign: 'center', paddingVertical: 28, fontSize: 14 },
});
