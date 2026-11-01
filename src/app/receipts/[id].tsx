import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Text } from '@/components/ui-text';
import { useTheme } from '@/contexts/ThemeContext';
import { useReceipts } from '@/contexts/ReceiptsContext';
import { Button, GlassCard, IconButton, ScreenBackground, TopBar } from '@/components/ds';
import { DevPayMark } from '@/components/devpay-mark';
import { Dialog } from '@/lib/dialog';
import { RECEIPT_ICON, cedis, downloadReceipt, printReceipt, receiptDate } from '@/lib/receipt-pdf';
import { Layout, Radius } from '@/constants/theme';

/** Paper colour stays white in dark mode, like a real receipt. */
const PAPER = '#FFFFFF';
const INK = '#15181B';
const MUTED = '#5F6B73';
const LINE = '#E3E8EB';

function Perforation({ color }: { color: string }) {
  return (
    <View style={styles.perf} pointerEvents="none">
      {Array.from({ length: 22 }, (_, i) => (
        <View key={i} style={[styles.hole, { backgroundColor: color }]} />
      ))}
    </View>
  );
}

export default function ReceiptScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { getReceipt } = useReceipts();
  const r = getReceipt(String(id));
  const [busy, setBusy] = useState(false);

  if (!r) {
    return (
      <View style={{ flex: 1 }}>
        <ScreenBackground />
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <TopBar title="Receipt" />
          <GlassCard style={{ margin: Layout.margin, alignItems: 'center', gap: 8 }}>
            <Ionicons name="receipt-outline" size={28} color={colors.textMuted} />
            <Text style={{ color: colors.textSecondary }}>This receipt isn’t on this device.</Text>
          </GlassCard>
        </SafeAreaView>
      </View>
    );
  }

  const download = async () => {
    setBusy(true);
    const err = await downloadReceipt(r);
    setBusy(false);
    if (err) return Dialog.alert('Receipt', err);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  };

  const rows: [string, string][] = [
    ['Paid by', r.from],
    ['Paid to', r.to],
    ['Method', r.method],
    ['Date', receiptDate(r.createdAt)],
    ['Reference', r.ref],
  ];
  const green = r.status !== 'Held in escrow';

  return (
    <View style={{ flex: 1 }}>
      <ScreenBackground />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <TopBar
          title="Receipt"
          right={Platform.OS !== 'web' ? <IconButton icon="print-outline" accessibilityLabel="Print receipt" onPress={() => printReceipt(r)} /> : undefined}
        />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(380)} style={[styles.paper, { borderColor: colors.border }]}>
            <View style={styles.head}>
              <View style={styles.brand}>
                <DevPayMark size={20} />
                <Text style={styles.brandText}>DevPay</Text>
              </View>
              <Text style={styles.kicker}>RECEIPT</Text>
            </View>

            <View style={styles.hero}>
              <View style={[styles.kindIcon, { backgroundColor: green ? '#178A60' : '#B26A00' }]}>
                <Ionicons name={RECEIPT_ICON[r.kind]} size={22} color="#FFFFFF" />
              </View>
              <Text style={styles.amount} accessibilityRole="header">
                {cedis(r.amount)}
              </Text>
              <Text style={styles.title}>{r.title}</Text>
              <View style={[styles.stamp, { borderColor: green ? '#178A60' : '#B26A00' }]}>
                <Ionicons name={green ? 'checkmark-circle' : 'time'} size={13} color={green ? '#178A60' : '#B26A00'} />
                <Text style={[styles.stampText, { color: green ? '#178A60' : '#B26A00' }]}>{r.status.toUpperCase()}</Text>
              </View>
            </View>

            <View style={styles.dash} />

            {rows.map(([k, v]) => (
              <View key={k} style={styles.row}>
                <Text style={styles.k}>{k}</Text>
                <Text style={styles.v} numberOfLines={2}>
                  {v}
                </Text>
              </View>
            ))}

            <View style={styles.dash} />
            <View style={styles.row}>
              <Text style={styles.k}>Amount</Text>
              <Text style={styles.v}>{cedis(r.amount)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.k}>Fees</Text>
              <Text style={styles.v}>{r.fee ? cedis(r.fee) : 'Free'}</Text>
            </View>
            <View style={[styles.row, styles.totalRow]}>
              <Text style={styles.total}>Total</Text>
              <Text style={styles.total}>{cedis(r.amount + r.fee)}</Text>
            </View>
            <Perforation color={colors.background} />
          </Animated.View>

          <Text style={[styles.note, { color: colors.textMuted }]}>Quote {r.ref} if you contact support about this payment.</Text>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Button label="Download PDF" loading={busy} icon={<Ionicons name="download-outline" size={18} color="#FFFFFF" />} onPress={download} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Layout.margin, paddingTop: 8, paddingBottom: 32 },
  paper: { backgroundColor: PAPER, borderRadius: Radius.xl, borderWidth: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 30, overflow: 'hidden' },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  brandText: { color: INK, fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
  kicker: { color: MUTED, fontSize: 11, fontWeight: '700', letterSpacing: 2 },
  hero: { alignItems: 'center', paddingVertical: 22 },
  kindIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  amount: { color: INK, fontSize: 34, fontWeight: '800', letterSpacing: -1, marginTop: 14, fontVariant: ['tabular-nums'] },
  title: { color: MUTED, fontSize: 14, marginTop: 4, textAlign: 'center' },
  stamp: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 14, borderWidth: 1.5, borderRadius: 7, paddingHorizontal: 10, height: 26 },
  stampText: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  dash: { borderTopWidth: 1.5, borderStyle: 'dashed', borderColor: LINE, marginVertical: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 16, paddingVertical: 8 },
  k: { color: MUTED, fontSize: 13 },
  v: { color: INK, fontSize: 13, fontWeight: '600', flexShrink: 1, textAlign: 'right' },
  totalRow: { marginTop: 4, paddingTop: 12, borderTopWidth: 2, borderTopColor: INK },
  total: { color: INK, fontSize: 16, fontWeight: '800', fontVariant: ['tabular-nums'] },
  perf: { position: 'absolute', left: 0, right: 0, bottom: -7, flexDirection: 'row', justifyContent: 'space-around' },
  hole: { width: 14, height: 14, borderRadius: 7 },
  note: { fontSize: 12, textAlign: 'center', marginTop: 14 },
  footer: { paddingHorizontal: Layout.margin, paddingTop: 10 },
});
