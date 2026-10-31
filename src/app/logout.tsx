import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Avatar, Button, GlassCard, ScreenBackground, TopBar } from '@/components/ds';
import { CurrentUser } from '@/constants/media';
import { Layout, Radius } from '@/constants/theme';

export default function LogoutScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [busy, setBusy] = useState(false);

  const logout = () => {
    setBusy(true);
    setTimeout(() => router.replace('/login'), 800);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScreenBackground height={500} />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <TopBar title="Sign out" />
        <View style={styles.body}>
          <Avatar uri={CurrentUser.avatar} size={96} />
          <Text style={[styles.title, { color: colors.text }]}>Sign out of DevPay?</Text>
          <Text style={[styles.sub, { color: colors.textSecondary }]}>
            You’re signed in as {CurrentUser.name}. You’ll need your phone number and password to get back in.
          </Text>

          <GlassCard style={styles.note}>
            <View style={[styles.noteIcon, { backgroundColor: colors.greenSoft }]}>
              <Ionicons name="shield-checkmark" size={20} color={colors.accentGreen} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.noteTitle, { color: colors.text }]}>Your escrow stays safe</Text>
              <Text style={[styles.noteSub, { color: colors.textSecondary }]}>
                Funded milestones and pending payouts keep running while you’re away.
              </Text>
            </View>
          </GlassCard>
        </View>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Button label="Sign Out" variant="danger" loading={busy} onPress={logout} />
          <Button label="Stay signed in" variant="ghost" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, alignItems: 'center', paddingHorizontal: Layout.margin, paddingTop: 36 },
  title: { fontSize: 24, fontWeight: '600', letterSpacing: -0.5, marginTop: 20 },
  sub: { fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 8, maxWidth: 320 },
  note: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 28, alignSelf: 'stretch', borderRadius: Radius.lg },
  noteIcon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  noteTitle: { fontSize: 15, fontWeight: '600' },
  noteSub: { fontSize: 13, lineHeight: 18, marginTop: 2 },
  footer: { paddingHorizontal: Layout.margin, gap: 6 },
});
