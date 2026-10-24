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

interface Contact {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  isOnline: boolean;
  isVerified: boolean;
  activeContracts: number;
}

export default function NewChatScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'clients' | 'freelancers'>('all');

  const contacts: Contact[] = [
    {
      id: 't_1',
      name: 'Google Africa (Hiring Lead)',
      role: 'Client • Mobile Eng Lead',
      company: 'Google Africa',
      avatar: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120',
      isOnline: true,
      isVerified: true,
      activeContracts: 1,
    },
    {
      id: 't_2',
      name: 'Telecel Digital Labs',
      role: 'Client • Product Operations',
      company: 'Telecel Ghana',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120',
      isOnline: false,
      isVerified: true,
      activeContracts: 1,
    },
    {
      id: 't_3',
      name: 'Paystack Partner Team',
      role: 'Client • Fintech Developer Relations',
      company: 'Paystack Ghana',
      avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=120',
      isOnline: true,
      isVerified: true,
      activeContracts: 0,
    },
    {
      id: 'c_4',
      name: 'Microsoft Ghana ADC',
      role: 'Client • Engineering Manager',
      company: 'Microsoft',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
      isOnline: true,
      isVerified: true,
      activeContracts: 0,
    },
    {
      id: 'c_5',
      name: 'Ama Serwaa',
      role: 'Senior UI/UX & Design Systems',
      company: 'Freelancer Network',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
      isOnline: false,
      isVerified: true,
      activeContracts: 2,
    },
  ];

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase());

    if (filter === 'clients') {
      return matchesSearch && c.role.includes('Client');
    }
    if (filter === 'freelancers') {
      return matchesSearch && !c.role.includes('Client');
    }
    return matchesSearch;
  });

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Conversation</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color={Colors.light.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search verified clients or talent..."
            placeholderTextColor={Colors.light.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={Colors.light.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips */}
        <View style={styles.chipsRow}>
          {[
            { id: 'all', label: 'All Contacts' },
            { id: 'clients', label: 'Clients' },
            { id: 'freelancers', label: 'Talent Network' },
          ].map((item) => {
            const isSelected = filter === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.chip, isSelected && styles.activeChip]}
                onPress={() => setFilter(item.id as any)}
                activeOpacity={0.8}>
                <Text style={[styles.chipText, isSelected && styles.activeChipText]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Contacts List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}>
          <Text style={styles.sectionHeading}>Active Collaborators & Verified Accounts</Text>

          {filteredContacts.map((contact) => (
            <TouchableOpacity
              key={contact.id}
              style={styles.contactCard}
              onPress={() => router.push(`/chat/${contact.id}` as any)}
              activeOpacity={0.85}>
              <View style={styles.avatarWrap}>
                <Image source={{ uri: contact.avatar }} style={styles.avatar} />
                {contact.isOnline && <View style={styles.onlineBadge} />}
              </View>

              <View style={styles.contactDetails}>
                <View style={styles.nameRow}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  {contact.isVerified && (
                    <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                  )}
                </View>
                <Text style={styles.contactRole}>{contact.role}</Text>
                {contact.activeContracts > 0 && (
                  <View style={styles.contractBadge}>
                    <Ionicons name="shield-checkmark" size={11} color="#0F73F7" />
                    <Text style={styles.contractBadgeText}>
                      {contact.activeContracts} Active Escrow Contract
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.messageBtn}>
                <Ionicons name="chatbubble-ellipses" size={18} color="#0F73F7" />
              </View>
            </TouchableOpacity>
          ))}
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
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.light.text,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEF3FA',
    paddingHorizontal: 14,
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.text,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  activeChip: {
    backgroundColor: '#0F73F7',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  activeChipText: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 10,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EEF3FA',
    gap: 12,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E2E8F0',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  contactDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  contactRole: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  contractBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  contractBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F73F7',
  },
  messageBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
