import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, KeyboardAvoidingView, Platform, Modal, Linking } from 'react-native';
import { Dialog } from '@/lib/dialog';
import { Text } from '@/components/ui-text';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';
import { useOnline, offlineAlert } from '@/hooks/use-online';
import { useTheme } from '@/contexts/ThemeContext';
import { Avatar, CompanyLogo, ListRow, Sheet } from '@/components/ds';
import { ChatWallpaper } from '@/components/chat/wallpaper';
import {
  ChatMessage,
  DayPill,
  EventPill,
  FileBubble,
  ImageBubble,
  TextBubble,
  TypingBubble,
  VoiceBubble,
} from '@/components/chat/bubbles';
import { Composer } from '@/components/chat/composer';
import { getThread } from '@/constants/threads';
import { Layout } from '@/constants/theme';

type AttachId = 'camera' | 'gallery' | 'deliverable' | 'release';

const ATTACH: { id: AttachId; icon: keyof typeof Ionicons.glyphMap; label: string; bg: string }[] = [
  { id: 'camera', icon: 'camera', label: 'Camera', bg: '#E5484D' },
  { id: 'gallery', icon: 'images', label: 'Gallery', bg: '#7A5AF8' },
  { id: 'deliverable', icon: 'cloud-upload', label: 'Deliverable', bg: '#2C88B4' },
  { id: 'release', icon: 'cash', label: 'Request pay', bg: '#1FAE7A' },
];

const REPLIES = [
  'Got it, thanks! I’ll take a look now.',
  'Looks good. Can you also share the mobile version?',
  'Perfect. I’ll approve the milestone after our review.',
  'Thanks for the quick update!',
  'Received. Give me an hour to go through it.',
];

const now = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export default function ChatDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const online = useOnline();
  const thread = getThread(id);
  const scroll = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const replyIndex = useRef(0);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'm1', sender: 'them', kind: 'text', text: `Hi Kwame, we funded ${thread.escrowStatus.split(' ').slice(0, 2).join(' ')} today. Looking forward to the prototype.`, time: '10:15' },
    { id: 'm2', sender: 'system', kind: 'event', text: `Client funded escrow · ${thread.escrowAmount}`, time: '10:16' },
    { id: 'm3', sender: 'me', kind: 'text', text: 'Thank you! Colour tokens are final and the MoMo breakdown screen is in.', time: '10:28', status: 'read' },
    { id: 'm4', sender: 'me', kind: 'file', text: 'Deliverable submitted', fileName: 'checkout-prototype-v2.fig', time: '10:30', status: 'read' },
    { id: 'm5', sender: 'them', kind: 'text', text: thread.lastMessage.replace(/^You: /, ''), time: '10:35' },
  ]);
  const [typing, setTyping] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [viewer, setViewer] = useState<string | null>(null);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };

  const scrollEnd = () => later(() => scroll.current?.scrollToEnd({ animated: true }), 60);

  /** Simulated client: delivered → typing… → reply → read. */
  const simulateReply = () => {
    later(() => setMessages((prev) => prev.map((m) => (m.sender === 'me' && m.status === 'sent' ? { ...m, status: 'delivered' } : m))), 500);
    later(() => {
      setTyping(true);
      scrollEnd();
    }, 1100);
    later(() => {
      setTyping(false);
      const text = REPLIES[replyIndex.current++ % REPLIES.length];
      setMessages((prev) => [
        ...prev.map((m) => (m.sender === 'me' ? { ...m, status: 'read' as const } : m)),
        { id: `r${Date.now()}`, sender: 'them', kind: 'text', text, time: now(), fresh: true },
      ]);
      Haptics.selectionAsync().catch(() => {});
      scrollEnd();
    }, 2900);
  };

  const push = (m: Omit<ChatMessage, 'id' | 'time' | 'sender' | 'status' | 'fresh'>) => {
    if (!online) return offlineAlert('send messages');
    setMessages((prev) => [...prev, { ...m, id: `m${Date.now()}${Math.random()}`, sender: 'me', time: now(), status: 'sent', fresh: true }]);
    scrollEnd();
    simulateReply();
  };

  const openCamera = async () => {
    setSheet(false);
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Dialog.alert('Camera access needed', 'Allow camera access to take photos in chat.', [
        { text: 'Not now', style: 'cancel' },
        ...(Platform.OS !== 'web' ? [{ text: 'Open Settings', onPress: () => Linking.openSettings() }] : []),
      ]);
      return;
    }
    const r = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    const a = !r.canceled ? r.assets?.[0] : undefined;
    if (a) push({ kind: 'image', uri: a.uri, width: a.width, height: a.height });
  };

  const openGallery = async () => {
    setSheet(false);
    const r = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.8,
    });
    if (r.canceled) return;
    r.assets.forEach((a) => push({ kind: 'image', uri: a.uri, width: a.width, height: a.height }));
  };

  const onAttach = (id: AttachId) => {
    if (id === 'camera') return openCamera();
    if (id === 'gallery') return openGallery();
    setSheet(false);
    if (id === 'deliverable') push({ kind: 'file', text: 'Deliverable submitted', fileName: 'milestone-deliverables.zip' });
    else push({ kind: 'text', text: `Requesting release of ${thread.escrowAmount} for ${thread.escrowStatus.toLowerCase()}.` });
  };

  const confirmDelete = (m: ChatMessage) =>
    m.sender === 'me' &&
    Dialog.alert('Delete message?', 'It will be removed for you.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setMessages((prev) => prev.filter((x) => x.id !== m.id)) },
    ]);

  const renderMessage = (m: ChatMessage, i: number) => {
    if (m.kind === 'event') return <EventPill msg={m} />;
    const next = messages[i + 1];
    const tail = !next || next.sender !== m.sender || next.kind === 'event';
    switch (m.kind) {
      case 'image':
        return <ImageBubble msg={m} tail={tail} onOpen={setViewer} />;
      case 'voice':
        return <VoiceBubble msg={m} tail={tail} />;
      case 'file':
        return <FileBubble msg={m} tail={tail} />;
      default:
        return <TextBubble msg={m} tail={tail} onLongPress={() => confirmDelete(m)} />;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.surface }}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable onPress={() => router.back()} hitSlop={10} accessibilityRole="button" accessibilityLabel="Go back" style={styles.back}>
            <Ionicons name="chevron-back" size={26} color={colors.primaryText} />
          </Pressable>
          <Pressable style={styles.who} accessibilityRole="button" accessibilityLabel={`${thread.name} details`} onPress={() => router.push('/contracts')}>
            {thread.company ? <CompanyLogo mark={thread.company.mark} size={40} /> : <Avatar uri={thread.avatar!} size={40} ring={false} online={thread.online} />}
            <View style={{ flexShrink: 1 }}>
              <View style={styles.row4}>
                <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
                  {thread.name}
                </Text>
                <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
              </View>
              {typing ? (
                <Animated.View key="typing" entering={FadeIn.duration(150)}>
                  <Text style={[styles.sub, { color: colors.primaryText }]}>typing…</Text>
                </Animated.View>
              ) : (
                <Animated.View key="status" entering={FadeIn.duration(150)}>
                  <Text style={[styles.sub, { color: colors.textSecondary }]} numberOfLines={1}>
                  {thread.online ? 'online' : 'last seen recently'}
                  </Text>
                </Animated.View>
              )}
            </View>
          </Pressable>
          <Pressable onPress={() => router.push('/contracts')} hitSlop={8} accessibilityRole="button" accessibilityLabel="Open contract" style={styles.headerIcon}>
            <Ionicons name="briefcase-outline" size={22} color={colors.primaryText} />
          </Pressable>
        </View>

        <Pressable
          onPress={() => router.push('/contracts')}
          accessibilityRole="button"
          style={[styles.pinned, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
          <View style={[styles.pinIcon, { backgroundColor: colors.greenSoft }]}>
            <Ionicons name="lock-closed" size={15} color={colors.accentGreen} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.pinTitle, { color: colors.primaryText }]}>Pinned · {thread.escrowStatus}</Text>
            <Text style={[styles.pinSub, { color: colors.text }]} numberOfLines={1}>
              {thread.escrowAmount} held in escrow · {thread.project}
            </Text>
          </View>
          <Ionicons name="pin-outline" size={18} color={colors.textMuted} />
        </Pressable>
      </SafeAreaView>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ flex: 1 }}>
          <ChatWallpaper />
          <ScrollView
            ref={scroll}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.stream}
            onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: false })}>
            <DayPill label="Today" />
            {messages.map((m, i) => {
              const prev = messages[i - 1];
              const grouped = prev && prev.sender === m.sender && prev.kind !== 'event' && m.kind !== 'event';
              return (
                <Animated.View
                  key={m.id}
                  layout={LinearTransition.duration(200)}
                  entering={m.fresh ? FadeInDown.duration(240) : undefined}
                  style={{ marginTop: grouped ? 2 : 8 }}>
                  {renderMessage(m, i)}
                </Animated.View>
              );
            })}
            {typing && (
              <Animated.View entering={FadeInDown.duration(200)} exiting={FadeOut.duration(150)} style={{ marginTop: 8 }}>
                <TypingBubble />
              </Animated.View>
            )}
          </ScrollView>
        </View>

        <View style={{ backgroundColor: colors.surface, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border }}>
          <Composer
            bottomInset={insets.bottom}
            onSendText={(text) => push({ kind: 'text', text })}
            onSendVoice={(uri, durationMs) => push({ kind: 'voice', uri, durationMs })}
            onAttach={() => setSheet(true)}
            onCamera={openCamera}
          />
        </View>
      </KeyboardAvoidingView>

      <Sheet visible={sheet} onClose={() => setSheet(false)} title="Share">
        <View style={styles.attachGrid}>
          {ATTACH.map((a) => (
            <Pressable key={a.id} onPress={() => onAttach(a.id)} style={styles.attachItem} accessibilityRole="button" accessibilityLabel={a.label}>
              <View style={[styles.attachIcon, { backgroundColor: a.bg }]}>
                <Ionicons name={a.icon} size={24} color="#FFFFFF" />
              </View>
              <Text style={[styles.attachLabel, { color: colors.text }]}>{a.label}</Text>
            </Pressable>
          ))}
        </View>
        <ListRow icon="information-circle-outline" label="Files you share here are kept with the contract" last />
      </Sheet>

      <Modal visible={!!viewer} transparent animationType="fade" onRequestClose={() => setViewer(null)} statusBarTranslucent>
        <View style={styles.viewer}>
          {viewer && <Image source={{ uri: viewer }} contentFit="contain" style={StyleSheet.absoluteFill} />}
          <Pressable
            onPress={() => setViewer(null)}
            accessibilityRole="button"
            accessibilityLabel="Close photo"
            style={[styles.viewerClose, { top: insets.top + 12 }]}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: Layout.margin - 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  who: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  row4: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  name: { fontSize: 16, fontWeight: '600', flexShrink: 1 },
  sub: { fontSize: 12, marginTop: 1 },
  headerIcon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  pinned: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: Layout.margin - 4,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  pinIcon: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  pinTitle: { fontSize: 12, fontWeight: '600' },
  pinSub: { fontSize: 13, marginTop: 1 },
  stream: { paddingHorizontal: 14, paddingTop: 8, paddingBottom: 12 },
  attachGrid: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, marginBottom: 6 },
  attachItem: { alignItems: 'center', gap: 8, width: 76 },
  attachIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  attachLabel: { fontSize: 12 },
  viewer: { flex: 1, backgroundColor: '#000000' },
  viewerClose: {
    position: 'absolute',
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
