import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { Text } from '@/components/ui-text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import Constants from 'expo-constants';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth, useCurrentUser } from '@/contexts/AuthContext';
import { Button, Chip, Field, GlassCard, ListRow, ScreenBackground, SectionHeader, Sheet, TopBar } from '@/components/ds';
import { Dialog } from '@/lib/dialog';
import { FAQ, SUPPORT_EMAIL } from '@/constants/app';
import { Layout } from '@/constants/theme';

const TOPICS = ['Payments', 'Escrow', 'Verification', 'Account', 'Bug', 'Other'];

export default function HelpScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();
  const me = useCurrentUser();
  const [open, setOpen] = useState<number | null>(0);
  const [reportOpen, setReportOpen] = useState(false);
  const [topic, setTopic] = useState('Bug');
  const [details, setDetails] = useState('');
  const [error, setError] = useState<string>();

  const sendReport = async () => {
    if (details.trim().length < 10) return setError('Tell us a little more so we can help.');
    const body = [
      details.trim(),
      '',
      '---',
      `Account: ${me.name} (${user?.role ?? 'unknown'})`,
      `App version: ${Constants.expoConfig?.version ?? 'unknown'}`,
    ].join('\n');
    const url = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`[${topic}] DevPay problem report`)}&body=${encodeURIComponent(body)}`;
    const ok = await Linking.canOpenURL(url).catch(() => false);
    if (!ok) return Dialog.alert('No email app', `Email us at ${SUPPORT_EMAIL} and include what happened.`);
    setReportOpen(false);
    setDetails('');
    Linking.openURL(url);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScreenBackground />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <TopBar title="Help & support" />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <SectionHeader title="Common questions" />
          <GlassCard padded={false} style={{ paddingHorizontal: 16 }}>
            {FAQ.map((f, i) => {
              const expanded = open === i;
              return (
                <Animated.View
                  key={f.q}
                  layout={LinearTransition.duration(220)}
                  style={i < FAQ.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }}>
                  <Pressable onPress={() => setOpen(expanded ? null : i)} accessibilityRole="button" accessibilityState={{ expanded }} style={styles.q}>
                    <Text style={[styles.qText, { color: colors.text }]}>{f.q}</Text>
                    <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textMuted} />
                  </Pressable>
                  {expanded && (
                    <Animated.View entering={FadeInDown.duration(200)}>
                      <Text style={[styles.a, { color: colors.textSecondary }]}>{f.a}</Text>
                    </Animated.View>
                  )}
                </Animated.View>
              );
            })}
          </GlassCard>

          <SectionHeader title="Still need help?" style={styles.gap} />
          <GlassCard padded={false} style={{ paddingHorizontal: 16 }}>
            <ListRow icon="search-outline" label="Ask DevPay" onPress={() => router.push('/assistant')} />
            <ListRow icon="bug-outline" label="Report a problem" onPress={() => setReportOpen(true)} />
            <ListRow icon="mail-outline" label="Email" value={SUPPORT_EMAIL} onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)} />
            <ListRow icon="help-buoy-outline" label="Open a dispute" onPress={() => router.push('/contracts')} last />
          </GlassCard>
        </ScrollView>
      </SafeAreaView>

      <Sheet visible={reportOpen} onClose={() => setReportOpen(false)} title="Report a problem">
        <Text style={[styles.sheetText, { color: colors.textSecondary }]}>Pick a topic and describe what happened. This opens an email to support with your details filled in.</Text>
        <View style={styles.topics}>
          {TOPICS.map((t) => (
            <Chip key={t} label={t} size="sm" selected={topic === t} onPress={() => setTopic(t)} />
          ))}
        </View>
        <Field
          placeholder="What happened, and what did you expect?"
          multiline
          value={details}
          onChangeText={(t) => {
            setDetails(t);
            setError(undefined);
          }}
          error={error}
        />
        <Button label="Continue to email" onPress={sendReport} style={{ marginTop: 14 }} />
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Layout.margin, paddingTop: 8, paddingBottom: 48 },
  gap: { marginTop: Layout.sectionGap },
  q: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 16 },
  qText: { flex: 1, fontSize: 15, fontWeight: '500' },
  a: { fontSize: 14, lineHeight: 21, paddingBottom: 16 },
  sheetText: { fontSize: 13, lineHeight: 19 },
  topics: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 14 },
});
