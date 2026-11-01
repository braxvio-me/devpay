import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui-text';
import { useTheme } from '@/contexts/ThemeContext';
import { useReceipts, type Receipt } from '@/contexts/ReceiptsContext';
import { Appear, GlassCard, PressableScale, ScreenBackground, TopBar } from '@/components/ds';
import { RECEIPT_ICON, cedis, receiptDate } from '@/lib/receipt-pdf';
import { Layout } from '@/constants/theme';


/** Money leaving the account shows with a minus. */
const outgoing = (r: Receipt) => r.kind !== 'earning';

export default function ReceiptsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { receipts } = useReceipts();

  return (
    <View style={{ flex: 1 }}>
      <ScreenBackground />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <TopBar title="Receipts" subtitle="Tap any payment to download its PDF" />
        <FlatList
          data={receipts}
          keyExtractor={(r) => r.id}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <GlassCard style={styles.empty}>
              <Ionicons name="receipt-outline" size={28} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Receipts for your payments will appear here.</Text>
            </GlassCard>
          }
          renderItem={({ item: r, index }) => (
            <Appear index={index}>
              <PressableScale
                onPress={() => router.push(`/receipts/${r.id}`)}
                accessibilityLabel={`${r.title}, ${cedis(r.amount)}, ${receiptDate(r.createdAt)}`}
                style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.icon, { backgroundColor: outgoing(r) ? colors.backgroundElement : colors.accentGreen }]}>
                  <Ionicons name={RECEIPT_ICON[r.kind]} size={18} color={outgoing(r) ? colors.text : '#FFFFFF'} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                    {r.title}
                  </Text>
                  <Text style={[styles.sub, { color: colors.textSecondary }]} numberOfLines={1}>
                    {receiptDate(r.createdAt)} · {r.ref}
                  </Text>
                </View>
                <Text style={[styles.amount, { color: outgoing(r) ? colors.text : colors.accentGreen }]}>
                  {outgoing(r) ? '−' : '+'}
                  {cedis(r.amount)}
                </Text>
              </PressableScale>
            </Appear>
          )}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Layout.margin, paddingTop: 8, paddingBottom: 48, gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 18, borderWidth: 1 },
  icon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 14, fontWeight: '600' },
  sub: { fontSize: 12, marginTop: 2 },
  amount: { fontSize: 14, fontWeight: '700', fontVariant: ['tabular-nums'] },
  empty: { alignItems: 'center', gap: 10, paddingVertical: 32 },
  emptyText: { fontSize: 14, textAlign: 'center' },
});
