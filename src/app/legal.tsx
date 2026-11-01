import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '@/components/ui-text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Appear, GlassCard, ListRow, ScreenBackground, TopBar } from '@/components/ds';
import { getDoc, LegalDocs, POLICY_VERSION } from '@/constants/legal';
import { Layout, Radius } from '@/constants/theme';

/** /legal lists every policy; /legal?doc=terms shows one. */
export default function LegalScreen() {
  const { doc } = useLocalSearchParams<{ doc?: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();
  const d = getDoc(doc);
  const accepted = user?.acceptedPolicies;

  return (
    <View style={{ flex: 1 }}>
      <ScreenBackground />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <TopBar title={d ? d.title : 'Policies'} />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={[styles.note, { backgroundColor: colors.amberSoft }]}>
            <Ionicons name="information-circle" size={18} color={colors.accentAmber} />
            <Text style={[styles.noteText, { color: colors.text }]}>Draft summary for review. Final legal text replaces this before launch.</Text>
          </View>

          {d ? (
            <Animated.View entering={FadeInDown.duration(280)}>
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
              <Text style={[styles.meta, { color: colors.textMuted }]}>Version {POLICY_VERSION}</Text>
            </Animated.View>
          ) : (
            <>
              <GlassCard padded={false} style={{ paddingHorizontal: 16 }}>
                {LegalDocs.map((x, i) => (
                  <Appear key={x.id} index={i}>
                    <ListRow
                      icon={x.icon}
                      label={x.title}
                      last={i === LegalDocs.length - 1}
                      onPress={() => router.push({ pathname: '/legal', params: { doc: x.id } })}
                    />
                  </Appear>
                ))}
              </GlassCard>
              <Text style={[styles.meta, { color: colors.textMuted }]}>
                {accepted
                  ? `You accepted version ${accepted.version} on ${new Date(accepted.at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}.`
                  : `Current version ${POLICY_VERSION}.`}
              </Text>
            </>
          )}
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
  meta: { fontSize: 12, textAlign: 'center', marginTop: 12 },
});
