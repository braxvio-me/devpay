import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui-text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { FloatingTabBar, TabType } from '@/components/floating-tab-bar';
import { SearchBar } from '@/components/search-bar';
import {
  Appear,
  Avatar,
  Chip,
  CompanyLogo,
  IconButton,
  ScreenBackground,
  useNavClearance,
} from '@/components/ds';
import { Threads, Thread } from '@/constants/threads';
import { Layout } from '@/constants/theme';

type Filter = 'All' | 'Unread' | 'Clients' | 'Freelancers';

export default function MessagesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
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
    if (tab === 'jobs') router.push('/contracts');
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

          {/* Flat list like WhatsApp / Telegram: full-width rows, dividers start under the text. */}
          <View style={styles.list}>
            {list.map((t, i) => (
              <Appear key={t.id} index={i}>
                <ThreadRow thread={t} last={i === list.length - 1} onPress={() => router.push(`/chat/${t.id}` as any)} />
              </Appear>
            ))}
            {list.length === 0 && (
              <Text style={[styles.empty, { color: colors.textSecondary }]}>No conversations match.</Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      <FloatingTabBar activeTab="chats" onSelectTab={onTab} onCenterActionPress={() => router.push('/assistant')} />
    </View>
  );
}

function ThreadRow({ thread, last, onPress }: { thread: Thread; last: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  const unread = thread.unread > 0;
  const mine = thread.lastMessage.startsWith('You:');
  const preview = mine ? thread.lastMessage.replace(/^You:\s*/, '') : thread.lastMessage;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${thread.name}, ${thread.project}. ${thread.lastMessage}${unread ? `. ${thread.unread} unread` : ''}`}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.backgroundElement }]}>
      {thread.company ? (
        <CompanyLogo mark={thread.company.mark} size={AVATAR} />
      ) : (
        <Avatar uri={thread.avatar!} size={AVATAR} ring={false} online={thread.online} />
      )}
      <View style={[styles.body, !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}>
        <View style={styles.rowTop}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {thread.name}
          </Text>
          <Text style={[styles.time, { color: unread ? colors.action : colors.textMuted, fontWeight: unread ? '600' : '400' }]}>{thread.time}</Text>
        </View>
        <View style={styles.rowTop}>
          <View style={styles.previewRow}>
            {mine && <Ionicons name="checkmark-done" size={16} color={colors.action} />}
            <Text style={[styles.preview, { color: colors.textSecondary }]} numberOfLines={1}>
              <Text style={{ color: colors.action, fontWeight: '500' }}>{thread.project}: </Text>
              <Text style={{ color: unread ? colors.text : colors.textSecondary, fontWeight: unread ? '500' : '400' }}>{preview}</Text>
            </Text>
          </View>
          {unread && (
            <View style={[styles.badge, { backgroundColor: colors.action }]}>
              <Text style={styles.badgeText}>{thread.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const AVATAR = 52;

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
  list: { marginHorizontal: -Layout.margin, marginTop: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingLeft: Layout.margin },
  body: { flex: 1, gap: 4, paddingVertical: 14, paddingRight: Layout.margin },
  rowTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  name: { flex: 1, fontSize: 16, fontWeight: '600' },
  time: { fontSize: 12 },
  previewRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4 },
  preview: { flex: 1, fontSize: 14 },
  badge: { minWidth: 22, height: 22, borderRadius: 11, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
  empty: { textAlign: 'center', paddingVertical: 28, fontSize: 14 },
});
