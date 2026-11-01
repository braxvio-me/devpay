import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '@/components/ui-text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { SearchBar } from '@/components/search-bar';
import { Avatar, Chip, CompanyLogo, GlassCard, PressableScale, ScreenBackground, TopBar } from '@/components/ds';
import { Threads } from '@/constants/threads';
import { Layout } from '@/constants/theme';

type Filter = 'all' | 'clients' | 'freelancers';

export default function NewChatScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const contacts = Threads.filter((t) => {
    const q = search.toLowerCase().trim();
    if (q && !`${t.name} ${t.project}`.toLowerCase().includes(q)) return false;
    if (filter === 'clients') return !!t.company;
    if (filter === 'freelancers') return !t.company;
    return true;
  });

  return (
    <View style={{ flex: 1 }}>
      <ScreenBackground />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <TopBar title="New message" />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: Layout.margin, paddingBottom: 40 }}>
          <SearchBar value={search} onChangeText={setSearch} placeholder="Search people and companies..." autoFocus />
          <View style={styles.chips}>
            {(['all', 'clients', 'freelancers'] as Filter[]).map((f) => (
              <Chip key={f} label={f[0].toUpperCase() + f.slice(1)} selected={filter === f} onPress={() => setFilter(f)} />
            ))}
          </View>

          <Text style={[styles.section, { color: colors.textSecondary }]}>People you work with</Text>
          <GlassCard padded={false} style={{ paddingHorizontal: 16 }}>
            {contacts.map((c, i) => (
              <PressableScale
                key={c.id}
                haptic={false}
                scaleTo={0.985}
                onPress={() => router.replace(`/chat/${c.id}` as any)}
                accessibilityLabel={`Message ${c.name}`}
                style={[styles.row, i < contacts.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}>
                {c.company ? <CompanyLogo mark={c.company.mark} size={46} /> : <Avatar uri={c.avatar!} size={46} ring={false} online={c.online} />}
                <View style={{ flex: 1 }}>
                  <View style={styles.nameRow}>
                    <Text style={[styles.name, { color: colors.text }]}>{c.name}</Text>
                    <MaterialCommunityIcons name="check-decagram" size={14} color={colors.primary} />
                  </View>
                  <Text style={[styles.sub, { color: colors.textSecondary }]}>
                    {c.company ? 'Client' : 'Freelancer'} · {c.project}
                  </Text>
                </View>
              </PressableScale>
            ))}
            {contacts.length === 0 && <Text style={[styles.empty, { color: colors.textSecondary }]}>Nobody matches “{search}”.</Text>}
          </GlassCard>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', gap: 10, marginTop: 16 },
  section: { fontSize: 13, fontWeight: '500', marginTop: 22, marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  name: { fontSize: 15, fontWeight: '600' },
  sub: { fontSize: 13, marginTop: 2 },
  empty: { textAlign: 'center', paddingVertical: 24 },
});
