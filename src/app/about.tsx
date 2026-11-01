import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '@/components/ui-text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';
import { GlassCard, ListRow, ScreenBackground, SectionHeader, TopBar } from '@/components/ds';
import { DevPayMark } from '@/components/devpay-mark';
import { LegalDocs } from '@/constants/legal';
import { LICENSES } from '@/constants/app';
import { Layout } from '@/constants/theme';

export default function AboutScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <View style={{ flex: 1 }}>
      <ScreenBackground />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <TopBar title="About DevPay" />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.hero}>
            <Animated.View entering={ZoomIn.springify().damping(12)}>
              <DevPayMark size={64} />
            </Animated.View>
            <Text style={[styles.name, { color: colors.text }]}>DevPay</Text>
            <Text style={[styles.tag, { color: colors.textSecondary }]}>Freelance work, paid safely.</Text>
            <Text style={[styles.version, { color: colors.textMuted }]}>Version {version}</Text>
          </View>

          <SectionHeader title="Policies" />
          <GlassCard padded={false} style={{ paddingHorizontal: 16 }}>
            {LegalDocs.map((d, i) => (
              <ListRow
                key={d.id}
                icon={d.icon}
                label={d.title}
                last={i === LegalDocs.length - 1}
                onPress={() => router.push({ pathname: '/legal', params: { doc: d.id } })}
              />
            ))}
          </GlassCard>

          <SectionHeader title="Open-source software" style={styles.gap} />
          <GlassCard style={{ gap: 10 }}>
            {LICENSES.map((l) => (
              <Text key={l} style={[styles.license, { color: colors.textSecondary }]}>
                {l}
              </Text>
            ))}
          </GlassCard>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Layout.margin, paddingTop: 8, paddingBottom: 48 },
  hero: { alignItems: 'center', paddingVertical: 24, gap: 4 },
  name: { fontSize: 26, fontWeight: '700', letterSpacing: -0.6, marginTop: 12 },
  tag: { fontSize: 14 },
  version: { fontSize: 12, marginTop: 6 },
  gap: { marginTop: Layout.sectionGap },
  license: { fontSize: 13 },
});
