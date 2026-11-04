import React, { useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { Dialog } from '@/lib/dialog';
import { Text, TextInput } from '@/components/ui-text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';
import { useRole } from '@/contexts/RoleContext';
import { useCurrentUser } from '@/contexts/AuthContext';
import { FloatingTabBar, TabType } from '@/components/floating-tab-bar';
import { Avatar, Chip, GlassCard, IconButton, useNavClearance } from '@/components/ds';
import { LatestJobCard } from '@/components/latest-job-card';
import { TypingBubble } from '@/components/chat/bubbles';
import { answer, Answer, STARTERS } from '@/lib/assistant';
import { Layout, Radius } from '@/constants/theme';

interface Turn {
  id: string;
  question: string;
  image?: string;
  reply?: Answer;
}

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning,' : h < 17 ? 'Good afternoon,' : 'Good evening,';
};

export default function AssistantScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { role, isClient } = useRole();
  const me = useCurrentUser();
  const navClearance = useNavClearance();
  const scroll = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const [text, setText] = useState('');
  const [turns, setTurns] = useState<Turn[]>([]);
  const [thinking, setThinking] = useState(false);

  const ask = (question: string, image?: string) => {
    const q = question.trim();
    if ((!q && !image) || thinking) return;
    Haptics.selectionAsync().catch(() => {});
    const id = String(Date.now());
    setTurns((t) => [...t, { id, question: q, image }]);
    setText('');
    setThinking(true);
    setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 50);
    setTimeout(() => {
      const reply: Answer = image
        ? {
            text: 'I can’t read photos yet. Tell me what you’re looking for, like a skill, budget or city, and I’ll search for you.',
            followUps: STARTERS[role].slice(0, 2),
          }
        : answer(q, role);
      setTurns((t) => t.map((x) => (x.id === id ? { ...x, reply } : x)));
      setThinking(false);
      setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 80);
    }, 900);
  };

  const attachPhoto = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    const a = !r.canceled ? r.assets?.[0] : undefined;
    if (a) ask(text, a.uri);
  };

  const onTab = (tab: TabType) => {
    if (tab === 'home') router.replace('/');
    if (tab === 'jobs') router.push('/contracts');
    if (tab === 'chats') router.push('/messages');
    if (tab === 'profile') router.push('/profile');
  };

  const hasText = text.trim().length > 0;
  const composer = (
    <View style={[styles.composer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Pressable onPress={attachPhoto} hitSlop={8} accessibilityRole="button" accessibilityLabel="Attach a photo" style={styles.camBtn}>
        <Ionicons name="camera-outline" size={22} color={colors.textSecondary} />
      </Pressable>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Ask anything..."
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.primary}
        returnKeyType="send"
        onSubmitEditing={() => ask(text)}
        style={[styles.input, { color: colors.text }]}
        accessibilityLabel="Ask DevPay"
      />
      <Pressable
        onPress={() => (hasText ? ask(text) : Dialog.alert('Voice', 'Voice questions aren’t available yet. Type your question instead.'))}
        accessibilityRole="button"
        accessibilityLabel={hasText ? 'Send question' : 'Ask by voice'}
        style={[styles.sendBtn, { backgroundColor: colors.action }]}>
        {hasText ? <Ionicons name="arrow-up" size={20} color="#FFFFFF" /> : <Ionicons name="pulse" size={20} color="#FFFFFF" />}
      </Pressable>
    </View>
  );

  const chips = (items: string[]) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips} contentContainerStyle={styles.chipsContent}>
      {items.map((s) => (
        <Chip key={s} label={s} size="sm" icon="search-outline" onPress={() => ask(s)} />
      ))}
    </ScrollView>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={styles.who}>
            <Avatar uri={me.avatar} size={42} ring={false} />
            <View>
              <Text style={[styles.hello, { color: colors.textSecondary }]}>{greeting()}</Text>
              <Text style={[styles.name, { color: colors.text }]}>{me.name}</Text>
            </View>
          </View>
          {turns.length > 0 ? (
            <IconButton icon="refresh" accessibilityLabel="New conversation" onPress={() => setTurns([])} />
          ) : (
            <IconButton icon="notifications-outline" accessibilityLabel="Notifications" onPress={() => router.push('/notifications')} />
          )}
        </View>

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {turns.length === 0 ? (
            <View style={styles.empty}>
              <Animated.View entering={FadeInDown.duration(380)} style={{ alignItems: 'center' }}>
                <Text style={[styles.hero, { color: colors.text }]} accessibilityRole="header">
                  Need anything?
                </Text>
                <Text style={[styles.heroSub, { color: colors.textSecondary }]}>
                  {isClient
                    ? 'DevPay Assistant finds the right freelancers and answers your hiring and escrow questions.'
                    : 'DevPay Assistant finds jobs that fit you and answers your payout and escrow questions.'}
                </Text>
              </Animated.View>
              <Animated.View entering={FadeInDown.delay(80).duration(380)} style={{ alignSelf: 'stretch', marginTop: 28 }}>
                {composer}
                {chips(STARTERS[role])}
              </Animated.View>
            </View>
          ) : (
            <>
              <ScrollView
                ref={scroll}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.thread}>
                {turns.map((t) => (
                  <View key={t.id} style={{ gap: 12 }}>
                    <Animated.View entering={FadeIn.duration(200)} style={[styles.q, { backgroundColor: colors.action }]}>
                      {t.image && <Image source={{ uri: t.image }} style={styles.qImage} contentFit="cover" />}
                      {!!t.question && <Text style={[styles.qText, { color: colors.onInk }]}>{t.question}</Text>}
                    </Animated.View>
                    {t.reply && <Reply reply={t.reply} onFollowUp={ask} />}
                  </View>
                ))}
                {thinking && (
                  <Animated.View entering={FadeIn.duration(150)}>
                    <TypingBubble />
                  </Animated.View>
                )}
              </ScrollView>
              <View style={[styles.docked, { paddingBottom: navClearance - 18 }]}>{composer}</View>
            </>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>

      <FloatingTabBar activeTab="action" onSelectTab={onTab} onCenterActionPress={() => setTurns([])} />
    </View>
  );
}

function Reply({ reply, onFollowUp }: { reply: Answer; onFollowUp: (q: string) => void }) {
  const router = useRouter();
  const { colors } = useTheme();
  return (
    <Animated.View entering={FadeInDown.duration(260)} style={{ gap: 10 }}>
      <View style={styles.aRow}>
        <View style={[styles.aIcon, { backgroundColor: colors.primarySoft }]}>
          <Ionicons name="chatbubble-ellipses" size={14} color={colors.primaryText} />
        </View>
        <Text style={[styles.aText, { color: colors.text }]}>{reply.text}</Text>
      </View>
      {reply.jobs?.map((j) => (
        <LatestJobCard key={j.id} job={j} onPress={() => router.push(`/job/${j.id}` as never)} />
      ))}
      {reply.talent?.map((t) => (
        <GlassCard key={t.id} onPress={() => router.push(`/talent/${t.id}` as never)} style={styles.talent} accessibilityLabel={`${t.name}, ${t.title}`}>
          <Avatar uri={t.avatar} size={44} ring={false} online={t.available} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.tName, { color: colors.text }]}>{t.name}</Text>
            <Text style={[styles.tSub, { color: colors.textSecondary }]} numberOfLines={1}>
              {t.title} · {t.rate}/hr
            </Text>
          </View>
          <View style={styles.rating}>
            <Ionicons name="star" size={13} color={colors.accentAmber} />
            <Text style={[styles.tName, { color: colors.text }]}>{t.rating.toFixed(1)}</Text>
          </View>
        </GlassCard>
      ))}
      <View style={styles.follow}>
        {reply.followUps.map((f) => (
          <Chip key={f} label={f} size="sm" onPress={() => onFollowUp(f)} />
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.margin,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  who: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  hello: { fontSize: 12 },
  name: { fontSize: 15, fontWeight: '600' },
  empty: { flex: 1, justifyContent: 'center', paddingHorizontal: Layout.margin, paddingBottom: 120 },
  hero: { fontSize: 28, fontWeight: '700', letterSpacing: -0.7, textAlign: 'center' },
  heroSub: { fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 10, maxWidth: 300 },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    borderRadius: Radius.pill,
    borderWidth: 1,
    paddingLeft: 8,
    paddingRight: 6,
    gap: 4,
  },
  camBtn: { width: 40, height: 44, alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, fontSize: 15, paddingVertical: 12, ...(Platform.OS === 'web' ? { outlineWidth: 0 } : null) },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  chips: { marginTop: 14, marginHorizontal: -Layout.margin, flexGrow: 0 },
  chipsContent: { gap: 8, paddingHorizontal: Layout.margin },
  thread: { paddingHorizontal: Layout.margin, paddingTop: 16, paddingBottom: 16, gap: 18 },
  q: { alignSelf: 'flex-end', maxWidth: '82%', borderRadius: 18, borderBottomRightRadius: 6, padding: 12, gap: 8 },
  qImage: { width: 180, height: 140, borderRadius: 12 },
  qText: { fontSize: 15, lineHeight: 21 },
  aRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  aIcon: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  aText: { flex: 1, fontSize: 15, lineHeight: 22 },
  talent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  tName: { fontSize: 14, fontWeight: '600' },
  tSub: { fontSize: 12, marginTop: 2 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  follow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginLeft: 38 },
  docked: { paddingHorizontal: Layout.margin, paddingTop: 8 },
});
