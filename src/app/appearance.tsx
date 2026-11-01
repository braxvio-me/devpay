import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/ui-text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import {
  GlassCard,
  ListRow,
  ScreenBackground,
  SectionHeader,
  TopBar,
  Switch,
} from '@/components/ds';
import { Colors, Layout, Radius } from '@/constants/theme';

type Mode = 'light' | 'dark' | 'system';

const MODES: { id: Mode; label: string }[] = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'system', label: 'System' },
];

function Preview({ mode }: { mode: Mode }) {
  const p = mode === 'dark' ? Colors.dark : Colors.light;
  const half = mode === 'system';
  return (
    <View style={[styles.preview, { backgroundColor: p.background }]}>
      {half && <View style={[StyleSheet.absoluteFill, { left: '50%', backgroundColor: Colors.dark.background }]} />}
      <View style={[styles.pBar, { backgroundColor: p.surface }]} />
      <View style={[styles.pCard, { backgroundColor: p.primary }]} />
      <View style={[styles.pLine, { backgroundColor: p.surface }]} />
      <View style={[styles.pLine, { backgroundColor: p.surface, width: '55%' }]} />
    </View>
  );
}

export default function AppearanceScreen() {
  const { mode, colors, setMode } = useTheme();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compact, setCompact] = useState(false);
  const [boldText, setBoldText] = useState(false);

  const toggle = (value: boolean, set: (v: boolean) => void, label: string) => (
    <Switch
      value={value}
      onValueChange={set}
      trackColor={{ true: colors.primary, false: colors.backgroundSelected }}
      thumbColor="#FFFFFF"
      accessibilityLabel={label}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <ScreenBackground />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <TopBar title="Appearance" />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <SectionHeader title="Theme" />
          <View style={styles.modes}>
            {MODES.map((m) => {
              const selected = mode === m.id;
              return (
                <Pressable
                  key={m.id}
                  onPress={() => {
                    Haptics.selectionAsync().catch(() => {});
                    setMode(m.id);
                  }}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`${m.label} theme`}
                  style={styles.mode}>
                  <View style={[styles.frame, { borderColor: selected ? colors.primary : 'transparent' }]}>
                    <Preview mode={m.id} />
                  </View>
                  <View style={styles.modeLabel}>
                    <Ionicons
                      name={selected ? 'checkmark-circle' : 'ellipse-outline'}
                      size={18}
                      color={selected ? colors.primary : colors.textMuted}
                    />
                    <Text style={[styles.modeText, { color: colors.text }]}>{m.label}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
          <Text style={[styles.hint, { color: colors.textSecondary }]}>System follows your phone’s light or dark setting.</Text>

          <SectionHeader title="Accessibility" style={{ marginTop: Layout.sectionGap }} />
          <GlassCard padded={false} style={{ paddingHorizontal: 16 }}>
            <ListRow icon="pause-circle-outline" label="Reduce motion" right={toggle(reducedMotion, setReducedMotion, 'Reduce motion')} />
            <ListRow icon="contract-outline" label="Compact lists" right={toggle(compact, setCompact, 'Compact lists')} />
            <ListRow icon="text-outline" label="Bolder text" right={toggle(boldText, setBoldText, 'Bolder text')} last />
          </GlassCard>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Layout.margin, paddingTop: 8, paddingBottom: 48 },
  modes: { flexDirection: 'row', gap: 12 },
  mode: { flex: 1, gap: 10 },
  frame: { borderRadius: Radius.lg, borderWidth: 2, padding: 3 },
  preview: { height: 150, borderRadius: Radius.md, padding: 10, gap: 8, overflow: 'hidden' },
  pBar: { height: 14, borderRadius: 7 },
  pCard: { height: 50, borderRadius: 10 },
  pLine: { height: 10, borderRadius: 5 },
  modeLabel: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  modeText: { fontSize: 14, fontWeight: '500' },
  hint: { fontSize: 12, marginTop: 12, textAlign: 'center' },
});
