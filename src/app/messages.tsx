import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
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
  unreadCount?: number;
  isRead?: boolean;
  isGroup?: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'them' | 'me';
  text: string;
  time: string;
  reaction?: string;
}

export default function MessagesScreen() {
  const router = useRouter();
  const { isDark, colors } = useTheme();
  const { isClient } = useRole();

  const [activeFilter, setActiveFilter] = useState<'All' | 'Unread' | 'Groups'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);
  const [inputText, setInputText] = useState('');

  // Initial messages matching Image 1 (Phone 2)
  const [conversation, setConversation] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'them',
      text: 'vacation?',
      time: '9:18 AM',
    },
    {
      id: 'm2',
      sender: 'me',
      text: 'Yeah, I was thinking we could explore the West Coast this year.',
      time: '9:18 AM',
    },
    {
      id: 'm3',
      sender: 'them',
      text: 'Hey Olivia! have you thought about our tour plan for the summer vacation?',
      time: '9:17 AM',
    },
    {
      id: 'm4',
      sender: 'me',
      text: 'Yeah, I was thinking we could explore the West Coast this year.',
      time: '9:17 AM',
    },
    {
      id: 'm5',
      sender: 'them',
      text: "That sounds awesome! I've always wanted to see the Golden Gate Bridge",
      time: '9:17 AM',
    },
    {
      id: 'm6',
      sender: 'me',
      text: "Besides the Golden Gate Bridge, we should definitely visit Alcatraz, Fisherman's Wharf.",
      time: '9:16 AM',
    },
    {
      id: 'm7',
      sender: 'them',
      text: 'That sounds perfect. What do you want to do in Sans Fransisco?',
      time: '9:16 AM',
      reaction: '❤️',
    },
  ]);

  // Threads list matching Image 1 (Phone 1)
  const threads: ChatThread[] = [
    {
      id: 't_1',
      name: 'Friends Tour ✈️',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
      lastMessage: 'Olivia sent a photo',
      time: '10:42 PM',
      unreadCount: 6,
      isGroup: true,
    },
    {
      id: 't_2',
      name: 'Wade Warren',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
      lastMessage: 'When you coming home? 🐾',
      time: '4 hours ago',
      isRead: true,
    },
    {
      id: 't_3',
      name: 'Design Hackathon 2026',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120',
      lastMessage: 'Olivia sent a photo',
      time: '5 hours ago',
      isRead: true,
      isGroup: true,
    },
    {
      id: 't_4',
      name: 'Cameron Williamson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120',
      lastMessage: "Let's meet tomorrow at 09:00 PM",
      time: 'Yesterday',
      isRead: true,
    },
    {
      id: 't_5',
      name: 'Brooklyn Simmons',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120',
      lastMessage: 'Olivia sent a photo',
      time: '23/05/2024',
    },
    {
      id: 't_6',
      name: 'Leslie Alexander',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120',
      lastMessage: 'Olivia sent a photo',
      time: '23/05/2024',
    },
    {
      id: 't_7',
      name: 'Theresa Webb',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
      lastMessage: 'Olivia sent a photo',
      time: '2 hours ago',
      unreadCount: 2,
    },
    {
      id: 't_8',
      name: 'Floyd Miles',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120',
      lastMessage: 'Olivia sent a photo',
      time: '2 hours ago',
      unreadCount: 2,
    },
  ];

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const now = new Date();
    const hours = now.getHours() % 12 || 12;
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    const timeStr = `${hours}:${minutes} ${ampm}`;

    setConversation((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        sender: 'me',
        text: inputText.trim(),
        time: timeStr,
      },
    ]);
    setInputText('');
  };

  const filteredThreads = threads.filter((thread) => {
    const matchesSearch =
      !searchQuery.trim() ||
      thread.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === 'Unread') {
      return matchesSearch && !!thread.unreadCount && thread.unreadCount > 0;
    }
    if (activeFilter === 'Groups') {
      return matchesSearch && !!thread.isGroup;
    }
    return matchesSearch;
  });

  // ───────────────────────────────────────────────────────────────────────────
  // VIEW B: CONVERSATION SCREEN (Right Mockup in Image 1)
  // ───────────────────────────────────────────────────────────────────────────
  if (selectedThread) {
    return (
      <View style={[styles.screen, { backgroundColor: isDark ? '#0F172A' : '#FAFAFA' }]}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
          {/* Header */}
          <View style={[styles.headerBar, { borderBottomColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
            <TouchableOpacity
              style={styles.backBtnTouch}
              onPress={() => setSelectedThread(null)}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <Ionicons name="chevron-back" size={22} color={isDark ? '#F8FAFC' : '#0F172A'} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              Messages
            </Text>
            <View style={{ width: 36 }} />
          </View>

          {/* Conversation Stream */}
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.chatScrollContent}>
              {conversation.map((msg) => {
                const isMe = msg.sender === 'me';
                return (
                  <View key={msg.id} style={styles.bubbleRowContainer}>
                    <View
                      style={[
                        styles.messageRow,
                        isMe ? styles.messageRowRight : styles.messageRowLeft,
                      ]}>
                      {!isMe && (
                        <Image
                          source={{ uri: selectedThread.avatar }}
                          style={styles.messageAvatar}
                        />
                      )}
                      <View style={{ maxWidth: '78%' }}>
                        <View
                          style={[
                            styles.chatBubble,
                            isMe
                              ? styles.chatBubbleMe
                              : [
                                  styles.chatBubbleThem,
                                  {
                                    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                                    borderColor: isDark ? '#334155' : '#F1F5F9',
                                  },
                                ],
                          ]}>
                          <Text
                            style={[
                              styles.bubbleText,
                              { color: isMe ? '#FFFFFF' : isDark ? '#F8FAFC' : '#1E293B' },
                            ]}>
                            {msg.text}
                          </Text>
                          {msg.reaction && (
                            <View style={styles.reactionBadge}>
                              <Text style={styles.reactionText}>{msg.reaction}</Text>
                            </View>
                          )}
                        </View>
                        <Text
                          style={[
                            styles.bubbleTimestamp,
                            isMe ? styles.timestampRight : styles.timestampLeft,
                            { color: isDark ? '#64748B' : '#94A3B8' },
                          ]}>
                          {msg.time}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            {/* Bottom Input Row matching Image 1 */}
            <View
              style={[
                styles.bottomInputBar,
                {
                  backgroundColor: isDark ? '#0F172A' : '#FAFAFA',
                  borderTopColor: isDark ? '#1E293B' : '#F1F5F9',
                },
              ]}>
              {/* Plus (+) Button */}
              <TouchableOpacity
                style={[
                  styles.plusBtn,
                  { backgroundColor: isDark ? '#334155' : '#0F172A' },
                ]}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                activeOpacity={0.85}>
                <Ionicons name="add" size={20} color="#FFFFFF" />
              </TouchableOpacity>

              {/* Text Input with Microphone */}
              <View
                style={[
                  styles.inputFieldWrap,
                  {
                    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                    borderColor: isDark ? '#334155' : '#E2E8F0',
                  },
                ]}>
                <TextInput
                  style={[styles.chatInput, { color: isDark ? '#FFFFFF' : '#0F172A' }]}
                  placeholder="Type here..."
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  value={inputText}
                  onChangeText={setInputText}
                  onSubmitEditing={handleSendMessage}
                  returnKeyType="send"
                />
                <TouchableOpacity
                  style={styles.micBtn}
                  onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                  <Ionicons name="mic-outline" size={18} color={isDark ? '#94A3B8' : '#64748B'} />
                </TouchableOpacity>
              </View>

              {/* Send Button */}
              <TouchableOpacity
                style={styles.sendBtn}
                onPress={handleSendMessage}
                activeOpacity={0.85}>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // VIEW A: MESSAGES LIST SCREEN (Left Mockup in Image 1)
  // ───────────────────────────────────────────────────────────────────────────
  return (
    <View style={[styles.screen, { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.backBtnTouch}
            onPress={() => router.back()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Ionicons name="chevron-back" size={22} color={isDark ? '#F8FAFC' : '#0F172A'} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            Messages
          </Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Search Bar Pill */}
        <View style={styles.searchContainer}>
          <View
            style={[
              styles.searchPill,
              {
                backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                borderColor: isDark ? '#334155' : '#EEF2F6',
              },
            ]}>
            <Ionicons
              name="search"
              size={18}
              color={isDark ? '#64748B' : '#94A3B8'}
              style={{ marginRight: 8 }}
            />
            <TextInput
              style={[styles.searchInput, { color: isDark ? '#FFFFFF' : '#0F172A' }]}
              placeholder="Search..."
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
              autoCapitalize="none"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color={isDark ? '#64748B' : '#94A3B8'} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter Segmented Pills (All, Unread, Groups) */}
        <View style={styles.filterTabsRow}>
          {(['All', 'Unread', 'Groups'] as const).map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.filterTabPill,
                  isActive
                    ? [
                        styles.filterTabActive,
                        { backgroundColor: isDark ? '#38BDF8' : '#0F172A' },
                      ]
                    : [
                        styles.filterTabInactive,
                        { backgroundColor: isDark ? '#1E293B' : '#F8FAFC' },
                      ],
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setActiveFilter(tab);
                }}
                activeOpacity={0.8}>
                <Text
                  style={[
                    styles.filterTabText,
                    {
                      color: isActive
                        ? '#FFFFFF'
                        : isDark
                        ? '#94A3B8'
                        : '#64748B',
                      fontWeight: isActive ? '700' : '500',
                    },
                  ]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Messages List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.threadListScroll}>
          {filteredThreads.map((thread) => (
            <TouchableOpacity
              key={thread.id}
              style={[
                styles.threadRow,
                { borderBottomColor: isDark ? '#1E293B' : '#F1F5F9' },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedThread(thread);
              }}
              activeOpacity={0.75}>
              {/* Avatar Column */}
              <View style={styles.avatarWrap}>
                <Image source={{ uri: thread.avatar }} style={styles.threadAvatar} />
                {thread.isGroup && (
                  <View style={styles.groupBadgeOverlay}>
                    <Text style={styles.groupBadgeText}>5</Text>
                  </View>
                )}
              </View>

              {/* Info Column */}
              <View style={styles.threadContent}>
                <Text style={[styles.threadName, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  {thread.name}
                </Text>
                <Text
                  style={[styles.threadSnippet, { color: isDark ? '#94A3B8' : '#64748B' }]}
                  numberOfLines={1}>
                  {thread.lastMessage}
                </Text>
              </View>

              {/* Status / Timestamp Column */}
              <View style={styles.threadMeta}>
                <Text style={[styles.threadTime, { color: isDark ? '#64748B' : '#94A3B8' }]}>
                  {thread.time}
                </Text>
                {thread.unreadCount ? (
                  <View style={styles.unreadCounter}>
                    <Text style={styles.unreadCounterText}>{thread.unreadCount}</Text>
                  </View>
                ) : thread.isRead ? (
                  <View style={styles.doubleCheckRow}>
                    <Ionicons name="checkmark-done" size={17} color="#E11D48" />
                  </View>
                ) : null}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Bottom Floating Bar */}
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
  headerBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  backBtnTouch: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 12,
  },
  searchPill: {
    height: 44,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  filterTabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 8,
  },
  filterTabPill: {
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabActive: {},
  filterTabInactive: {},
  filterTabText: {
    fontSize: 13,
  },
  threadListScroll: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  threadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  avatarWrap: {
    position: 'relative',
    marginRight: 14,
  },
  threadAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  groupBadgeOverlay: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E11D48',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  groupBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  threadContent: {
    flex: 1,
    justifyContent: 'center',
  },
  threadName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },
  threadSnippet: {
    fontSize: 13,
  },
  threadMeta: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 6,
    minWidth: 70,
  },
  threadTime: {
    fontSize: 11,
    fontWeight: '500',
  },
  unreadCounter: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E11D48',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  unreadCounterText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  doubleCheckRow: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Conversation Screen Styles (Phone 2)
  chatScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  bubbleRowContainer: {
    marginBottom: 14,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  messageRowLeft: {
    justifyContent: 'flex-start',
  },
  messageRowRight: {
    justifyContent: 'flex-end',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 16,
  },
  chatBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'relative',
  },
  chatBubbleThem: {
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  chatBubbleMe: {
    borderRadius: 18,
    borderBottomRightRadius: 4,
    backgroundColor: '#E11D48',
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  reactionBadge: {
    position: 'absolute',
    bottom: -8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reactionText: {
    fontSize: 11,
  },
  bubbleTimestamp: {
    fontSize: 10,
    marginTop: 4,
  },
  timestampLeft: {
    textAlign: 'left',
    marginLeft: 4,
  },
  timestampRight: {
    textAlign: 'right',
    marginRight: 4,
  },

  // Bottom Input Bar
  bottomInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 10,
  },
  plusBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputFieldWrap: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  chatInput: {
    flex: 1,
    fontSize: 14,
  },
  micBtn: {
    padding: 4,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E11D48',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
});
