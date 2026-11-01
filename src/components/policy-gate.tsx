import React, { useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeOut, SlideInLeft, SlideInRight, ZoomIn } from 'react-native-reanimated';
import { Text } from '@/components/ui-text';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAppLock } from '@/contexts/AppLockContext';
import { Button } from '@/components/ds';
import { Dialog } from '@/lib/dialog';
import { LegalDocs, POLICY_VERSION } from '@/constants/legal';
import { Layout } from '@/constants/theme';

/**
 * Blocks the app until the signed-in user accepts the current policy version.
 * One policy per page: read it, tick the box, Next. Shown right after sign-up and when policies change.
 */
export function PolicyGate() {
  const { colors } = useTheme();
  const { user, acceptPolicies, signOut } = useAuth();
  const { locked } = useAppLock();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [agreed, setAgreed] = useState<Record<string, boolean>>({});
  const scroll = useRef<React.ComponentRef<typeof ScrollView>>(null);

  if (!user || locked || user.acceptedPolicies?.version === POLICY_VERSION) return null;
  const firstTime = !user.acceptedPolicies;
  const total = LegalDocs.length;
  const doc = LegalDocs[step];
  const ok = !!agreed[doc.id];
  const last = step === total - 1;

  const go = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
    scroll.current?.scrollTo({ y: 0, animated: false });
  };

  const next = () => {
    if (!ok) return;
    if (last) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      acceptPolicies();
      setStep(0);
      setAgreed({});
      return;
    }
    go(step + 1);
  };

  const decline = () =>
    Dialog.alert('Decline the policies?', 'You need to accept them to use DevPay. Declining signs you out.', [
      { text: 'Keep reading', style: 'cancel' },
      { text: 'Decline & sign out', style: 'destructive', onPress: signOut },
    ]);

  return (
    <Animated.View entering={FadeIn.duration(220)} exiting={FadeOut.duration(200)} style={[StyleSheet.absoluteFill, styles.root, { backgroundColor: colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.top}>
          {step > 0 ? (
            <Pressable onPress={() => go(step - 1)} hitSlop={10} accessibilityRole="button" accessibilityLabel="Previous policy" style={[styles.back, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name="chevron-back" size={20} color={colors.text} />
            </Pressable>
          ) : (
            <View style={styles.back} />
          )}
          <View style={styles.progress} accessibilityLabel={`Policy ${step + 1} of ${total}`}>
            {LegalDocs.map((d, i) => (
              <View key={d.id} style={[styles.seg, { backgroundColor: i <= step ? colors.action : colors.backgroundSelected }]} />
            ))}
          </View>
          <Pressable onPress={decline} hitSlop={10} accessibilityRole="button">
            <Text style={[styles.decline, { color: colors.textSecondary }]}>Decline</Text>
          </Pressable>
        </View>

        <ScrollView ref={scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View key={doc.id} entering={(dir === 1 ? SlideInRight : SlideInLeft).duration(260)}>
            <Text style={[styles.kicker, { color: colors.action }]}>
              {firstTime ? 'Before you start' : 'Updated policies'} · {step + 1} of {total}
            </Text>
            <View style={styles.titleRow}>
              <View style={[styles.icon, { backgroundColor: colors.action }]}>
                <Ionicons name={doc.icon} size={20} color="#FFFFFF" />
              </View>
              <Text style={[styles.title, { color: colors.text }]} accessibilityRole="header">
                {doc.title}
              </Text>
            </View>
            <Text style={[styles.summary, { color: colors.textSecondary }]}>{doc.summary}</Text>

            <View style={[styles.rule, { backgroundColor: colors.border }]} />

            {doc.sections.map((s, i) => (
              <View key={s.h} style={styles.section}>
                <Text style={[styles.h, { color: colors.text }]}>
                  {i + 1}. {s.h}
                </Text>
                <Text style={[styles.p, { color: colors.textSecondary }]}>{s.p}</Text>
              </View>
            ))}
            <Text style={[styles.version, { color: colors.textMuted }]}>Version {POLICY_VERSION}</Text>
          </Animated.View>
        </ScrollView>

        <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
          <Pressable
            onPress={() => setAgreed((a) => ({ ...a, [doc.id]: !a[doc.id] }))}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: ok }}
            style={styles.agree}>
            <View style={[styles.box, { borderColor: ok ? colors.action : colors.textMuted, backgroundColor: ok ? colors.action : 'transparent' }]}>
              {ok && (
                <Animated.View entering={ZoomIn.duration(160)}>
                  <Ionicons name="checkmark" size={15} color="#FFFFFF" />
                </Animated.View>
              )}
            </View>
            <Text style={[styles.agreeText, { color: colors.text }]}>I have read and agree to the {doc.title}.</Text>
          </Pressable>
          <Button label={last ? 'Accept & continue' : 'Next'} disabled={!ok} onPress={next} />
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { zIndex: 1400 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: Layout.margin, paddingTop: 8, paddingBottom: 6 },
  back: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'transparent' },
  progress: { flex: 1, flexDirection: 'row', gap: 5 },
  seg: { flex: 1, height: 4, borderRadius: 2 },
  decline: { fontSize: 14, fontWeight: '500' },
  content: { paddingHorizontal: Layout.margin, paddingTop: 18, paddingBottom: 24 },
  kicker: { fontSize: 12, fontWeight: '700', letterSpacing: 0.4, textTransform: 'uppercase' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12 },
  icon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 26, fontWeight: '700', letterSpacing: -0.6 },
  summary: { fontSize: 15, lineHeight: 22, marginTop: 10 },
  rule: { height: StyleSheet.hairlineWidth, marginVertical: 20 },
  section: { marginBottom: 18, gap: 6 },
  h: { fontSize: 15, fontWeight: '600' },
  p: { fontSize: 14, lineHeight: 22 },
  version: { fontSize: 11, marginTop: 4 },
  footer: { paddingHorizontal: Layout.margin, paddingTop: 12, paddingBottom: 8, gap: 12, borderTopWidth: StyleSheet.hairlineWidth },
  agree: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 2 },
  box: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  agreeText: { flex: 1, fontSize: 14, lineHeight: 19 },
});
