import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { GlassCard, ScreenBackground, TopBar } from '@/components/ds';
import { Layout, Radius } from '@/constants/theme';

/** Plain-language summaries. Placeholder until the final legal text is supplied. */
const DOCS = {
  terms: {
    title: 'Terms of Service',
    sections: [
      { h: 'Using DevPay', p: 'Clients post milestone-based jobs and freelancers apply. Both sides agree to the scope, price and deadline of each milestone before work starts.' },
      { h: 'Escrow', p: 'A client funds each milestone before the freelancer starts it. Funds are released when the client approves the work, or automatically 7 days after submission if the client doesn’t respond.' },
      { h: 'Revisions and disputes', p: 'Each milestone includes up to two revision requests. If you can’t agree, either side can open a dispute and DevPay reviews the contract, chat and submitted work.' },
      { h: 'Verification', p: 'Some features need a verified account. Verification checks your Ghana Card or business documents and has a one-time fee.' },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    sections: [
      { h: 'What we collect', p: 'Your name, phone number, email, profile details, payout accounts, and the documents you submit for verification.' },
      { h: 'How we use it', p: 'To run your account, process escrow payments and payouts, verify identities, and keep the marketplace safe.' },
      { h: 'Who sees it', p: 'Clients and freelancers see your public profile. Payment partners see what they need to move money. Identity documents are used only for verification.' },
      { h: 'Your choices', p: 'You can edit your profile anytime and delete your account from Settings once you have no active escrow.' },
    ],
  },
};

export default function LegalScreen() {
  const { doc } = useLocalSearchParams<{ doc?: string }>();
  const { colors } = useTheme();
  const d = doc === 'privacy' ? DOCS.privacy : DOCS.terms;

  return (
    <View style={{ flex: 1 }}>
      <ScreenBackground />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <TopBar title={d.title} />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={[styles.note, { backgroundColor: colors.amberSoft }]}>
            <Ionicons name="information-circle" size={18} color={colors.accentAmber} />
            <Text style={[styles.noteText, { color: colors.text }]}>Draft summary. The full legal text will replace this before launch.</Text>
          </View>
          <GlassCard style={{ gap: 18 }}>
            {d.sections.map((s) => (
              <View key={s.h} style={{ gap: 6 }}>
                <Text style={[styles.h, { color: colors.text }]} accessibilityRole="header">
                  {s.h}
                </Text>
                <Text style={[styles.p, { color: colors.textSecondary }]}>{s.p}</Text>
              </View>
            ))}
          </GlassCard>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Layout.margin, paddingTop: 8, paddingBottom: 48, gap: 14 },
  note: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: Radius.md },
  noteText: { flex: 1, fontSize: 13, lineHeight: 18 },
  h: { fontSize: 15, fontWeight: '600' },
  p: { fontSize: 14, lineHeight: 21 },
});
