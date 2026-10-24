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
import { Colors } from '@/constants/theme';
import { FloatingTabBar } from '@/components/floating-tab-bar';

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
      name: 'Google Africa (Hiring Lead)',
      avatar: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120',
      lastMessage: 'Awesome. Once submitted I will review and release...',
      time: '10:35 AM',
      unreadCount: 1,
      isOnline: true,
      project: 'UI/UX Redesign',
    },
    {
      id: 't_2',
      name: 'Telecel Digital Labs',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120',
      lastMessage: 'Can you adjust the MoMo fee breakdown on the review screen?',
      time: 'Yesterday',
      unreadCount: 0,
      isOnline: false,
      project: 'Checkout Prototype',
    },
    {
      id: 't_3',
      name: 'Paystack Partner Team',
      avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=120',
      lastMessage: 'Contract proposal accepted! Milestone 1 pre-funded.',
      time: '20 Oct',
      unreadCount: 0,
      isOnline: true,
      project: 'Payment Webhook Architecture',
    },
  ];

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        sender: 'me',
        text: inputText,
        time: 'Just now',
      },
    ]);
    setInputText('');
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* If inside thread */}
        {selectedThread ? (
          <View style={styles.chatContainer}>
            {/* Thread Header */}
            <View style={styles.chatHeader}>
              <TouchableOpacity
                style={styles.chatBackBtn}
                onPress={() => setSelectedThread(null)}>
                <Ionicons name="chevron-back" size={20} color={Colors.light.text} />
              </TouchableOpacity>

              <View style={styles.chatRecipient}>
                <Image source={{ uri: selectedThread.avatar }} style={styles.chatAvatar} />
                <View>
                  <Text style={styles.chatName}>{selectedThread.name}</Text>
                  <Text style={styles.chatProject}>{selectedThread.project}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.chatOptionBtn}>
                <Ionicons name="ellipsis-vertical" size={18} color={Colors.light.text} />
              </TouchableOpacity>
            </View>

            {/* Escrow Milestone Alert Banner in Chat */}
            <View style={styles.escrowBanner}>
              <Ionicons name="shield-checkmark" size={14} color="#0F73F7" />
              <Text style={styles.escrowBannerText}>
                Milestone 2 is pre-funded in escrow. Never share bank/MoMo details in chat.
              </Text>
            </View>

            {/* Messages Scroll */}
            <ScrollView
              contentContainerStyle={styles.messagesList}
              showsVerticalScrollIndicator={false}>
              {messages.map((m) => {
                const isMe = m.sender === 'me';
                return (
                  <View
                    key={m.id}
                    style={[styles.messageBubble, isMe ? styles.myBubble : styles.theirBubble]}>
                    <Text style={[styles.messageText, isMe && styles.myMessageText]}>
                      {m.text}
                    </Text>
                    <Text style={[styles.messageTime, isMe && styles.myMessageTime]}>
                      {m.time}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>

            {/* Input Bar */}
            <View style={styles.inputBar}>
              <TouchableOpacity style={styles.attachBtn}>
                <Ionicons name="attach-outline" size={22} color={Colors.light.textSecondary} />
              </TouchableOpacity>
              <TextInput
                style={styles.chatInput}
                placeholder="Type your message..."
                placeholderTextColor={Colors.light.textMuted}
                value={inputText}
                onChangeText={setInputText}
              />
              <TouchableOpacity
                style={styles.sendBtn}
                onPress={handleSendMessage}
                activeOpacity={0.85}>
                <Ionicons name="send" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* Threads List View */
          <View style={{ flex: 1 }}>
            <View style={styles.listHeader}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
                activeOpacity={0.8}>
                <Ionicons name="chevron-back" size={20} color={Colors.light.text} />
              </TouchableOpacity>
              <Text style={styles.listTitle}>Messages</Text>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.push('/chat/new')}
                activeOpacity={0.8}>
                <Ionicons name="create-outline" size={20} color="#0F73F7" />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.threadsScroll}
              showsVerticalScrollIndicator={false}>
              {threads.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={styles.threadCard}
                  onPress={() => router.push(`/chat/${t.id}` as any)}
                  activeOpacity={0.88}>
                  <View style={styles.avatarWrapper}>
                    <Image source={{ uri: t.avatar }} style={styles.threadAvatar} />
                    {t.isOnline && <View style={styles.onlineDot} />}
                  </View>

                  <View style={styles.threadDetails}>
                    <View style={styles.threadTopRow}>
                      <Text style={styles.threadName}>{t.name}</Text>
                      <Text style={styles.threadTime}>{t.time}</Text>
                    </View>
                    <Text style={styles.threadProjectTag}>{t.project}</Text>
                    <Text style={styles.threadSnippet} numberOfLines={1}>
                      {t.lastMessage}
                    </Text>
                  </View>

                  {t.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadCountText}>{t.unreadCount}</Text>
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
            />
          </View>
        )}
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
  listHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF3FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.light.text,
  },
  threadsScroll: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 110,
  },
  threadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEF3FA',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  threadAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E2E8F0',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  threadDetails: {
    flex: 1,
  },
  threadTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  threadName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  threadTime: {
    fontSize: 11,
    color: Colors.light.textMuted,
  },
  threadProjectTag: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0F73F7',
    marginTop: 2,
  },
  threadSnippet: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0F73F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  unreadCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF3FA',
  },
  chatBackBtn: {
    padding: 6,
  },
  chatRecipient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chatAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  chatName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.text,
  },
  chatProject: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  chatOptionBtn: {
    padding: 6,
  },
  escrowBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EBF4FE',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  escrowBannerText: {
    fontSize: 11,
    color: '#0F73F7',
    fontWeight: '600',
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    marginBottom: 10,
  },
  myBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#0F73F7',
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF3FA',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.light.text,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 10,
    color: Colors.light.textMuted,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  myMessageTime: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEF3FA',
  },
  attachBtn: {
    padding: 6,
    marginRight: 6,
  },
  chatInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#F8FAFC',
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 14,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: '#EEF3FA',
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0F73F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
