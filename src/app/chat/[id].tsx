import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

interface ChatMessage {
  id: string;
  sender: 'me' | 'client';
  text: string;
  time: string;
  type?: 'text' | 'milestone_funded' | 'deliverable' | 'payment_released';
  amount?: string;
  attachmentName?: string;
}

export default function ChatDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Mock thread lookup based on id
  const threadMap: Record<
    string,
    { name: string; avatar: string; project: string; escrowStatus: string; escrowAmount: string }
  > = {
    t_1: {
      name: 'Google Africa (Hiring Lead)',
      avatar: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120',
      project: 'Mobile App UI/UX Redesign',
      escrowStatus: 'Milestone 2 Funded in Escrow',
      escrowAmount: 'GH₵ 2,000.00',
    },
    t_2: {
      name: 'Telecel Digital Labs',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120',
      project: 'MoMo Payment Checkout Flow',
      escrowStatus: 'Milestone 1 In Client Review',
      escrowAmount: 'GH₵ 1,600.00',
    },
    t_3: {
      name: 'Paystack Partner Team',
      avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=120',
      project: 'Payment Webhook Architecture',
      escrowStatus: 'Contract Proposal Pre-funded',
      escrowAmount: 'GH₵ 5,000.00',
    },
  };

  const currentThread = threadMap[String(id)] || {
    name: 'Google Africa (Hiring Lead)',
    avatar: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120',
    project: 'Mobile App UI/UX Redesign',
    escrowStatus: 'Milestone 2 Funded in Escrow',
    escrowAmount: 'GH₵ 2,000.00',
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm_1',
      sender: 'client',
      text: 'Hi Kwame, we funded Milestone 2 in escrow today! Looking forward to reviewing the mobile design tokens and Figma prototype.',
      time: '10:15 AM',
      type: 'text',
    },
    {
      id: 'm_2',
      sender: 'client',
      text: 'Milestone 2 Escrow Deposit Confirmed: GH₵ 2,000.00',
      time: '10:16 AM',
      type: 'milestone_funded',
      amount: 'GH₵ 2,000.00',
    },
    {
      id: 'm_3',
      sender: 'me',
      text: 'Good morning! Thank you. I have finalized the color tokens on the 390px baseline grid and integrated the MoMo breakdown screen.',
      time: '10:28 AM',
      type: 'text',
    },
    {
      id: 'm_4',
      sender: 'me',
      text: 'Deliverable submitted: devpay-design-tokens-v2.fig',
      time: '10:30 AM',
      type: 'deliverable',
      attachmentName: 'devpay-design-tokens-v2.fig',
    },
    {
      id: 'm_5',
      sender: 'client',
      text: 'Reviewing the prototype now. Looks super clean and matches our Ghana brand specs! Will authorize release shortly.',
      time: '10:35 AM',
      type: 'text',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [actionSheetVisible, setActionSheetVisible] = useState(false);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        sender: 'me',
        text: text.trim(),
        time: 'Just now',
        type: 'text',
      },
    ]);
    setInputText('');
  };

  const handleAttachDeliverable = () => {
    setActionSheetVisible(false);
    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        sender: 'me',
        text: 'Submitted Deliverable Package: milestone2-deliverables.zip',
        time: 'Just now',
        type: 'deliverable',
        attachmentName: 'milestone2-deliverables.zip',
      },
    ]);
    Alert.alert('Deliverable Sent', 'Client has been notified to review your deliverable.');
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Chat Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color={Colors.light.text} />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <View style={styles.avatarWrap}>
              <Image source={{ uri: currentThread.avatar }} style={styles.headerAvatar} />
              <View style={styles.onlineBadge} />
            </View>
            <View style={styles.headerTextWrap}>
              <View style={styles.nameRow}>
                <Text style={styles.headerName} numberOfLines={1}>
                  {currentThread.name}
                </Text>
                <Ionicons name="checkmark-circle" size={14} color="#0F73F7" />
              </View>
              <Text style={styles.headerProject} numberOfLines={1}>
                {currentThread.project}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.headerOptionBtn}
            onPress={() => router.push('/contracts')}
            activeOpacity={0.8}>
            <Ionicons name="briefcase-outline" size={20} color="#0F73F7" />
          </TouchableOpacity>
        </View>

        {/* Escrow Milestone Live Banner */}
        <View style={styles.escrowBanner}>
          <View style={styles.escrowIconCircle}>
            <Ionicons name="shield-checkmark" size={16} color="#0F73F7" />
          </View>
          <View style={styles.escrowBannerTextWrap}>
            <Text style={styles.escrowBannerTitle}>{currentThread.escrowStatus}</Text>
            <Text style={styles.escrowBannerDesc}>
              {currentThread.escrowAmount} secured. Protected by DevPay arbitration.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.escrowActionBtn}
            onPress={() => router.push('/contracts')}
            activeOpacity={0.85}>
            <Text style={styles.escrowActionText}>Contract</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Suggestion Pills */}
        <View style={styles.quickPillsRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickPillsScroll}>
            {[
              'Deliverable submitted!',
              'Working on review comments.',
              'Updated Figma file.',
              'Ready for milestone release.',
            ].map((pill, i) => (
              <TouchableOpacity
                key={i}
                style={styles.quickPill}
                onPress={() => handleSend(pill)}
                activeOpacity={0.8}>
                <Text style={styles.quickPillText}>{pill}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Message Stream */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messagesScroll}>
            {messages.map((m) => {
              const isMe = m.sender === 'me';

              if (m.type === 'milestone_funded') {
                return (
                  <View key={m.id} style={styles.milestoneEventCard}>
                    <View style={styles.milestoneEventIconBox}>
                      <Ionicons name="shield-checkmark" size={18} color="#10B981" />
                    </View>
                    <View style={styles.milestoneEventContent}>
                      <Text style={styles.milestoneEventTitle}>Escrow Funded by Client</Text>
                      <Text style={styles.milestoneEventAmount}>{m.amount}</Text>
                      <Text style={styles.milestoneEventTime}>{m.time}</Text>
                    </View>
                  </View>
                );
              }

              if (m.type === 'deliverable') {
                return (
                  <View
                    key={m.id}
                    style={[
                      styles.deliverableBubble,
                      isMe ? styles.myDeliverable : styles.theirDeliverable,
                    ]}>
                    <View style={styles.deliverableHeader}>
                      <Ionicons name="document-attach-outline" size={20} color={isMe ? '#FFFFFF' : '#0F73F7'} />
                      <Text
                        style={[
                          styles.deliverableTitle,
                          isMe && { color: '#FFFFFF' },
                        ]}>
                        Deliverable Submitted
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.deliverableFile,
                        isMe && { color: '#E0F2FE' },
                      ]}>
                      {m.attachmentName}
                    </Text>
                    <Text
                      style={[
                        styles.bubbleTime,
                        isMe && styles.myBubbleTime,
                        { marginTop: 6 },
                      ]}>
                      {m.time} • In Client Review
                    </Text>
                  </View>
                );
              }

              return (
                <View
                  key={m.id}
                  style={[
                    styles.messageBubble,
                    isMe ? styles.myBubble : styles.theirBubble,
                  ]}>
                  <Text style={[styles.messageText, isMe && styles.myMessageText]}>
                    {m.text}
                  </Text>
                  <View style={styles.bubbleFooter}>
                    <Text style={[styles.bubbleTime, isMe && styles.myBubbleTime]}>
                      {m.time}
                    </Text>
                    {isMe && (
                      <Ionicons name="checkmark-done" size={14} color="#BFDBFE" />
                    )}
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Bottom Chat Input Bar */}
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.attachBtn}
              onPress={() => setActionSheetVisible(true)}
              activeOpacity={0.8}>
              <Ionicons name="add-circle" size={26} color="#0F73F7" />
            </TouchableOpacity>

            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder={`Message ${currentThread.name.split(' ')[0]}...`}
              placeholderTextColor={Colors.light.textMuted}
              multiline
            />

            <TouchableOpacity
              style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
              onPress={() => handleSend()}
              disabled={!inputText.trim()}
              activeOpacity={0.85}>
              <Ionicons name="send" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        {/* Action Sheet Modal for Deliverables & Invoices */}
        <Modal
          visible={actionSheetVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setActionSheetVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.sheetModal}>
              <View style={styles.sheetHandle} />
              <Text style={styles.sheetTitle}>Escrow Actions & Attachments</Text>

              <TouchableOpacity
                style={styles.sheetItem}
                onPress={handleAttachDeliverable}
                activeOpacity={0.75}>
                <View style={[styles.sheetIconWrap, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="cloud-upload-outline" size={20} color="#0F73F7" />
                </View>
                <View style={styles.sheetItemText}>
                  <Text style={styles.sheetItemTitle}>Submit Milestone Deliverables</Text>
                  <Text style={styles.sheetItemSub}>Upload zip, link, or prototype for client review</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sheetItem}
                onPress={() => {
                  setActionSheetVisible(false);
                  router.push('/contracts');
                }}
                activeOpacity={0.75}>
                <View style={[styles.sheetIconWrap, { backgroundColor: '#ECFDF5' }]}>
                  <Ionicons name="cash-outline" size={20} color="#10B981" />
                </View>
                <View style={styles.sheetItemText}>
                  <Text style={styles.sheetItemTitle}>Request Milestone Payout Release</Text>
                  <Text style={styles.sheetItemSub}>Notify client to authorize GH₵ 2,000 release</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sheetItem}
                onPress={() => {
                  setActionSheetVisible(false);
                  Alert.alert('Attach Document', 'Choose deliverable specification document or invoice PDF.');
                }}
                activeOpacity={0.75}>
                <View style={[styles.sheetIconWrap, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="document-text-outline" size={20} color="#D97706" />
                </View>
                <View style={styles.sheetItemText}>
                  <Text style={styles.sheetItemTitle}>Attach PDF / Contract Addendum</Text>
                  <Text style={styles.sheetItemSub}>Share documentation securely inside escrow chat</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeSheetBtn}
                onPress={() => setActionSheetVisible(false)}
                activeOpacity={0.8}>
                <Text style={styles.closeSheetBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF3FA',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#EEF3FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginLeft: 10,
  },
  avatarWrap: {
    position: 'relative',
  },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E2E8F0',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headerTextWrap: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerName: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.light.text,
  },
  headerProject: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  headerOptionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  escrowBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
    gap: 10,
  },
  escrowIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  escrowBannerTextWrap: {
    flex: 1,
  },
  escrowBannerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F73F7',
  },
  escrowBannerDesc: {
    fontSize: 11,
    color: '#1E40AF',
  },
  escrowActionBtn: {
    backgroundColor: '#0F73F7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  escrowActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  quickPillsRow: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF3FA',
  },
  quickPillsScroll: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  quickPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  quickPillText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  messagesScroll: {
    padding: 16,
    gap: 12,
    paddingBottom: 24,
  },
  messageBubble: {
    maxWidth: '82%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  theirBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF3FA',
    borderBottomLeftRadius: 4,
  },
  myBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#0F73F7',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  bubbleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 4,
  },
  bubbleTime: {
    fontSize: 11,
    color: Colors.light.textMuted,
  },
  myBubbleTime: {
    color: '#BFDBFE',
  },
  milestoneEventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 16,
    padding: 12,
    gap: 12,
    marginVertical: 4,
  },
  milestoneEventIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneEventContent: {
    flex: 1,
  },
  milestoneEventTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
  },
  milestoneEventAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: '#059669',
  },
  milestoneEventTime: {
    fontSize: 10,
    color: '#047857',
    marginTop: 2,
  },
  deliverableBubble: {
    maxWidth: '82%',
    padding: 14,
    borderRadius: 18,
  },
  theirDeliverable: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  myDeliverable: {
    alignSelf: 'flex-end',
    backgroundColor: '#1E40AF',
  },
  deliverableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  deliverableTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F73F7',
  },
  deliverableFile: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEF3FA',
    gap: 10,
  },
  attachBtn: {
    padding: 2,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EEF3FA',
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    color: Colors.light.text,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0F73F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  sheetModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 14,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginBottom: 8,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.light.text,
    marginBottom: 4,
  },
  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 10,
  },
  sheetIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetItemText: {
    flex: 1,
  },
  sheetItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  sheetItemSub: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  closeSheetBtn: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  closeSheetBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.textSecondary,
  },
});
