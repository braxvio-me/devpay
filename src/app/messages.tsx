import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useRole } from '@/contexts/RoleContext';
import { FloatingTabBar } from '@/components/floating-tab-bar';
import * as Haptics from 'expo-haptics';

interface ChatThread {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isOnline: boolean;
  project: string;
}

export default function MessagesScreen() {
  const router = useRouter();
  const { isDark, colors } = useTheme();
  const { isClient } = useRole();

  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'client',
      text: 'Hi Kwame, how is the milestone 2 design tokens implementation coming along?',
      time: '10:30 AM',
    },
    {
      id: '2',
      sender: 'me',
      text: 'Good morning! Just finalized the color tokens and tested on the 390px baseline grid. Submitting deliverables shortly.',
      time: '10:34 AM',
    },
    {
      id: '3',
      sender: 'client',
      text: 'Awesome. Once submitted I will review and release the GH₵ 2,000 milestone funds!',
      time: '10:35 AM',
    },
  ]);

  const threads: ChatThread[] = [
    {
      id: 't_1',
      name: isClient ? 'Kwame Mensah (Lead Dev)' : 'Google Africa (Hiring Lead)',
      avatar: isClient
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'
        : 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120',
      lastMessage: 'Awesome. Once submitted I will review and release...',
      time: '10:35 AM',
      unreadCount: 1,
      isOnline: true,
      project: 'Mobile App UI/UX Redesign',
    },
    {
      id: 't_2',
      name: isClient ? 'Akosua Serwaa (UI Designer)' : 'Telecel Digital Labs',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120',
      lastMessage: 'Milestone 1 Figma prototype is ready for review.',
      time: 'Yesterday',
      unreadCount: 0,
      isOnline: false,
      project: 'MoMo Payment Checkout',
    },
    {
      id: 't_3',
      name: 'Hubtel Escrow Arbitration',
      avatar: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=120',
      lastMessage: 'Contract milestone dispute resolution team.',
      time: 'Oct 19',
      unreadCount: 0,
      isOnline: true,
      project: 'DevPay Escrow Support',
    },
  ];

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        sender: 'me',
        text: inputText.trim(),
        time: 'Just now',
      },
    ]);
    setInputText('');
  };

  // Detailed Conversation View
  if (selectedThread) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          {/* Conversation Header */}
          <View
            style={[
              styles.chatHeader,
              { backgroundColor: colors.surface, borderBottomColor: colors.border },
            ]}>
            <TouchableOpacity
              style={[
                styles.backButton,
                { backgroundColor: colors.backgroundElement, borderColor: colors.border },
              ]}
              onPress={() => setSelectedThread(null)}
              activeOpacity={0.8}>
              <Ionicons name="chevron-back" size={20} color={colors.text} />
            </TouchableOpacity>

            <View style={styles.chatHeaderInfo}>
              <View style={styles.chatTitleRow}>
                <Text style={[styles.chatHeaderName, { color: colors.text }]}>
                  {selectedThread.name}
                </Text>
                {selectedThread.isOnline && <View style={styles.onlineDot} />}
              </View>
              <Text style={[styles.chatHeaderSub, { color: colors.textSecondary }]}>
                {selectedThread.project}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.backButton,
                { backgroundColor: colors.backgroundElement, borderColor: colors.border },
              ]}
              onPress={() => router.push('/contracts')}
              activeOpacity={0.8}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#10B981" />
            </TouchableOpacity>
          </View>

          {/* Messages Scroll Area */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messageScroll}>
            {messages.map((m) => {
              const isMe = m.sender === 'me';
              return (
                <View
                  key={m.id}
                  style={[
                    styles.messageRow,
                    isMe ? styles.messageRowMe : styles.messageRowThem,
                  ]}>
                  <View
                    style={[
                      styles.bubble,
                      isMe
                        ? styles.bubbleMe
                        : [
                            styles.bubbleThem,
                            {
                              backgroundColor: colors.surface,
                              borderColor: colors.border,
                            },
                          ],
                    ]}>
                    <Text
                      style={[
                        styles.bubbleText,
                        { color: isMe ? '#FFFFFF' : colors.text },
                      ]}>
                      {m.text}
                    </Text>
                    <Text
                      style={[
                        styles.bubbleTime,
                        {
                          color: isMe
                            ? 'rgba(255, 255, 255, 0.7)'
                            : colors.textMuted,
                        },
                      ]}>
                      {m.time}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Input Bar */}
          <View
            style={[
              styles.inputBar,
              { backgroundColor: colors.surface, borderTopColor: colors.border },
            ]}>
            <TextInput
              style={[
                styles.chatInput,
                {
                  backgroundColor: colors.backgroundElement,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              value={inputText}
              placeholder="Type message or paste GitHub PR..."
              placeholderTextColor={colors.textMuted}
              onChangeText={setInputText}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
              activeOpacity={0.85}>
              <Ionicons name="send" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Threads List View
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Messages</Text>
          <TouchableOpacity
            style={[
              styles.backButton,
              { backgroundColor: colors.backgroundElement, borderColor: colors.border },
            ]}
            onPress={() => router.push('/chat/new')}
            activeOpacity={0.8}>
            <Ionicons name="create-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.threadsScroll}>
          {threads.map((thread) => (
            <TouchableOpacity
              key={thread.id}
              style={[
                styles.threadCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={() => setSelectedThread(thread)}
              activeOpacity={0.75}>
              <View style={styles.avatarWrap}>
                <Image source={{ uri: thread.avatar }} style={styles.avatarImg} />
                {thread.isOnline && <View style={styles.threadOnlineDot} />}
              </View>

              <View style={styles.threadBody}>
                <View style={styles.threadTopRow}>
                  <Text style={[styles.threadName, { color: colors.text }]}>
                    {thread.name}
                  </Text>
                  <Text style={[styles.threadTime, { color: colors.textMuted }]}>
                    {thread.time}
                  </Text>
                </View>

                <Text
                  style={[styles.threadProject, { color: colors.primary }]}
                  numberOfLines={1}>
                  {thread.project}
                </Text>

                <Text
                  style={[styles.threadLastMsg, { color: colors.textSecondary }]}
                  numberOfLines={1}>
                  {thread.lastMessage}
                </Text>
              </View>

              {thread.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>{thread.unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <FloatingTabBar
          activeTab="chats"
          onSelectTab={(tab) => {
            if (tab === 'home') router.push('/');
            if (tab === 'jobs') router.push('/contracts');
            if (tab === 'profile') router.push('/profile');
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
  threadsScroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
    gap: 12,
  },
  threadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatarImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E2E8F0',
  },
  threadOnlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  threadBody: {
    flex: 1,
    gap: 2,
  },
  threadTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  threadName: {
    fontSize: 14,
    fontWeight: '700',
  },
  threadTime: {
    fontSize: 11,
  },
  threadProject: {
    fontSize: 11,
    fontWeight: '700',
  },
  threadLastMsg: {
    fontSize: 12,
    marginTop: 1,
  },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0F73F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  // Detailed chat styles
  chatHeader: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chatHeaderName: {
    fontSize: 14,
    fontWeight: '700',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  chatHeaderSub: {
    fontSize: 11,
    marginTop: 1,
  },
  messageScroll: {
    padding: 16,
    gap: 12,
    paddingBottom: 20,
  },
  messageRow: {
    flexDirection: 'row',
  },
  messageRowMe: {
    justifyContent: 'flex-end',
  },
  messageRowThem: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 4,
  },
  bubbleMe: {
    backgroundColor: '#0F73F7',
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  bubbleText: {
    fontSize: 13,
    lineHeight: 19,
  },
  bubbleTime: {
    fontSize: 10,
    alignSelf: 'flex-end',
  },
  inputBar: {
    height: 68,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
    borderTopWidth: 1,
  },
  chatInput: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 13,
    borderWidth: 1,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0F73F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
