import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Dialog } from '@/lib/dialog';
import { Text } from '@/components/ui-text';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Chip, Field, GlassCard, ScreenBackground, SectionHeader, TopBar } from '@/components/ds';
import { Layout, Radius } from '@/constants/theme';

const REASONS = [
  'Found work elsewhere',
  'Fees are too high',
  'Taking a break',
  'Privacy concerns',
  'Trouble with Ghana Card check',
  'Other',
];

const CHECKS = [
  { title: 'No active escrow', sub: 'All milestone funds are released or refunded.' },
  { title: 'Wallet is empty', sub: 'No MoMo withdrawals are still processing.' },
];

export default function DeleteAccountScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [reason, setReason] = useState<string>();
  const [feedback, setFeedback] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const { deleteAccount } = useAuth();

  const ready = agreed && confirm.trim().toUpperCase() === 'DELETE';

  const remove = () => {
    if (!ready) return;
    Dialog.alert('Delete your account?', 'This closes your account and frees your number for a new one. It can’t be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setBusy(true);
          setTimeout(deleteAccount, 800);
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScreenBackground />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <TopBar title="Delete account" />
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={[styles.warn, { backgroundColor: colors.coralSoft }]}>
            <Ionicons name="warning" size={20} color={colors.accentCoral} />
            <Text style={[styles.warnText, { color: colors.text }]}>
              Deleting is permanent. Your profile, reviews and contract history will be removed.
            </Text>
          </View>

          <SectionHeader title="Before you go" style={styles.gap} />
          <GlassCard padded={false} style={{ paddingHorizontal: 16 }}>
            {CHECKS.map((c, i) => (
              <View key={c.title} style={[styles.check, i === 0 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}>
                <Ionicons name="checkmark-circle" size={22} color={colors.accentGreen} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.checkTitle, { color: colors.text }]}>{c.title}</Text>
                  <Text style={[styles.checkSub, { color: colors.textSecondary }]}>{c.sub}</Text>
                </View>
              </View>
            ))}
          </GlassCard>

          <SectionHeader title="Why are you leaving?" style={styles.gap} />
          <View style={styles.reasons}>
            {REASONS.map((r) => (
              <Chip key={r} label={r} size="sm" selected={reason === r} onPress={() => setReason(r)} />
            ))}
          </View>
          <Field placeholder="Anything we could do better? (optional)" multiline value={feedback} onChangeText={setFeedback} style={{ marginTop: 14 }} />

          <Pressable
            onPress={() => setAgreed((a) => !a)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: agreed }}
            style={styles.agree}>
            <Ionicons name={agreed ? 'checkbox' : 'square-outline'} size={22} color={agreed ? colors.accentCoral : colors.textMuted} />
            <Text style={[styles.agreeText, { color: colors.text }]}>I understand this can’t be undone.</Text>
          </Pressable>

          <Field
            label="Type DELETE to confirm"
            placeholder="DELETE"
            autoCapitalize="characters"
            value={confirm}
            onChangeText={setConfirm}
            style={{ marginTop: 6 }}
          />
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Button label="Delete my account" variant="danger" disabled={!ready} loading={busy} onPress={remove} />
          <Button label="Keep my account" variant="ghost" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Layout.margin, paddingTop: 8, paddingBottom: 32 },
  warn: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: Radius.md, alignItems: 'center' },
  warnText: { flex: 1, fontSize: 13, lineHeight: 19 },
  gap: { marginTop: Layout.sectionGap },
  check: { flexDirection: 'row', gap: 12, paddingVertical: 14, alignItems: 'center' },
  checkTitle: { fontSize: 14, fontWeight: '600' },
  checkSub: { fontSize: 12, marginTop: 2 },
  reasons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  agree: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 20, paddingHorizontal: 4 },
  agreeText: { fontSize: 14 },
  footer: { paddingHorizontal: Layout.margin, gap: 6 },
});
