import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Modal, Pressable } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { Text } from '@/components/ui-text';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ds';
import { DialogButton, DialogRequest, subscribeDialogs } from '@/lib/dialog';
import { Radius } from '@/constants/theme';

/** Renders Dialog.alert() requests one at a time, queued in order. */
export function DialogHost() {
  const { colors } = useTheme();
  const [queue, setQueue] = useState<DialogRequest[]>([]);
  const current = queue[0];

  useEffect(() => subscribeDialogs((req) => setQueue((q) => [...q, req])), []);

  const close = (b?: DialogButton) => {
    setQueue((q) => q.slice(1));
    // Let the dialog close before the action runs (it may open another dialog or navigate).
    if (b?.onPress) setTimeout(b.onPress, 120);
  };

  if (!current) return null;
  const cancel = current.buttons.find((b) => b.style === 'cancel');
  const actions = current.buttons.filter((b) => b.style !== 'cancel');
  const stacked = current.buttons.length > 2;

  return (
    <Modal visible transparent animationType="none" onRequestClose={() => close(cancel)} statusBarTranslucent>
      <Animated.View entering={FadeIn.duration(160)} style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => cancel && close(cancel)} accessibilityLabel="Close" />
        <Animated.View
          key={current.id}
          entering={ZoomIn.duration(220).springify().damping(18)}
          style={[styles.card, { backgroundColor: colors.surface }]}
          accessibilityRole="alert">
          <Text style={[styles.title, { color: colors.text }]}>{current.title}</Text>
          {!!current.message && <Text style={[styles.message, { color: colors.textSecondary }]}>{current.message}</Text>}
          <View style={[styles.actions, stacked ? styles.stack : styles.row]}>
            {!stacked && cancel && (
              <Button label={cancel.text ?? 'Cancel'} variant="light" size="md" style={{ flex: 1 }} onPress={() => close(cancel)} />
            )}
            {actions.map((b, i) => (
              <Button
                key={`${b.text}-${i}`}
                label={b.text ?? 'OK'}
                variant={b.style === 'destructive' ? 'danger' : 'primary'}
                size="md"
                style={stacked ? undefined : { flex: 1 }}
                onPress={() => close(b)}
              />
            ))}
            {stacked && cancel && <Button label={cancel.text ?? 'Cancel'} variant="ghost" size="md" onPress={() => close(cancel)} />}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(12, 22, 28, 0.45)', alignItems: 'center', justifyContent: 'center', padding: 28 },
  card: { width: '100%', maxWidth: 360, borderRadius: Radius.xl, padding: 22, boxShadow: '0px 12px 32px rgba(15, 30, 39, 0.22)' },
  title: { fontSize: 18, fontWeight: '600', letterSpacing: -0.3, textAlign: 'center' },
  message: { fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 8 },
  actions: { marginTop: 20, gap: 10 },
  row: { flexDirection: 'row' },
  stack: { flexDirection: 'column' },
});
