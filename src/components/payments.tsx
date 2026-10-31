import React from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { Chip, GlassCard } from '@/components/ds';
import { Radius } from '@/constants/theme';

export type MethodId = 'momo' | 'telecel' | 'at' | 'bank' | 'card' | 'wallet';

export interface PayMethod {
  id: MethodId;
  name: string;
  detail: string;
  badge?: string;
}

/** Network brand tints for the method icons. */
const LOOK: Record<MethodId, { icon: keyof typeof Ionicons.glyphMap; bg: string; fg: string }> = {
  momo: { icon: 'phone-portrait', bg: '#FFF3C4', fg: '#8A6100' },
  telecel: { icon: 'flash', bg: '#FCEBEC', fg: '#D93E43' },
  at: { icon: 'radio', bg: '#E3EEFB', fg: '#2F6CB5' },
  bank: { icon: 'business', bg: '#EEF1F3', fg: '#4F5B63' },
  card: { icon: 'card', bg: '#E3F2FA', fg: '#2479A6' },
  wallet: { icon: 'wallet', bg: '#E5F6EF', fg: '#1FAE7A' },
};

export function PayMethods({
  methods,
  value,
  onChange,
}: {
  methods: PayMethod[];
  value: MethodId;
  onChange: (id: MethodId) => void;
}) {
  const { colors } = useTheme();
  return (
    <GlassCard padded={false} style={{ paddingHorizontal: 14 }}>
      {methods.map((m, i) => {
        const selected = m.id === value;
        const look = LOOK[m.id];
        return (
          <Pressable
            key={m.id}
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              onChange(m.id);
            }}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={`${m.name}, ${m.detail}`}
            style={[styles.row, i < methods.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}>
            <View style={[styles.icon, { backgroundColor: look.bg }]}>
              <Ionicons name={look.icon} size={18} color={look.fg} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <View style={styles.nameRow}>
                <Text style={[styles.name, { color: colors.text }]}>{m.name}</Text>
                {m.badge && (
                  <View style={[styles.badge, { backgroundColor: colors.primarySoft }]}>
                    <Text style={[styles.badgeText, { color: colors.primaryText }]}>{m.badge}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.detail, { color: colors.textSecondary }]}>{m.detail}</Text>
            </View>
            <View style={[styles.radio, { borderColor: selected ? colors.primary : colors.backgroundSelected }]}>
              {selected && <View style={[styles.dot, { backgroundColor: colors.primary }]} />}
            </View>
          </Pressable>
        );
      })}
    </GlassCard>
  );
}

export function AmountInput({
  value,
  onChange,
  quick,
  max,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  quick: number[];
  max?: number;
  error?: string;
}) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: 12 }}>
      <GlassCard style={[styles.amountCard, error && { borderWidth: 1.5, borderColor: colors.accentCoral }]}>
        <Text style={[styles.cur, { color: colors.textSecondary }]}>GH₵</Text>
        <TextInput
          value={value}
          onChangeText={(t) => onChange(t.replace(/[^\d.]/g, ''))}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.primary}
          accessibilityLabel="Amount in cedis"
          style={[styles.amount, { color: colors.text }]}
        />
      </GlassCard>
      {error && <Text style={[styles.err, { color: colors.accentCoral }]}>{error}</Text>}
      <View style={styles.quick}>
        {quick.map((q) => (
          <Chip key={q} size="sm" label={`GH₵ ${q.toLocaleString()}`} selected={Number(value) === q} onPress={() => onChange(String(q))} />
        ))}
        {max != null && <Chip size="sm" label="Max" selected={Number(value) === max} onPress={() => onChange(String(max))} />}
      </View>
    </View>
  );
}

export function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={styles.sumRow}>
      <Text style={[styles.sumLabel, { color: strong ? colors.text : colors.textSecondary, fontWeight: strong ? '600' : '400' }]}>{label}</Text>
      <Text style={[styles.sumValue, { color: colors.text, fontWeight: strong ? '600' : '500' }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  icon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontSize: 15, fontWeight: '600' },
  badge: { paddingHorizontal: 8, height: 20, borderRadius: Radius.pill, justifyContent: 'center' },
  badgeText: { fontSize: 11, fontWeight: '600' },
  detail: { fontSize: 12 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5 },
  amountCard: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 18 },
  cur: { fontSize: 20, fontWeight: '500' },
  amount: { flex: 1, fontSize: 34, fontWeight: '600', letterSpacing: -1, paddingVertical: 0, fontVariant: ['tabular-nums'] },
  err: { fontSize: 12, marginLeft: 6, marginTop: -4 },
  quick: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  sumLabel: { fontSize: 14 },
  sumValue: { fontSize: 14, fontVariant: ['tabular-nums'] },
});
