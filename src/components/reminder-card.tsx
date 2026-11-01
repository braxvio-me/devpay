import React, { ReactNode, useEffect, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Text } from '@/components/ui-text';
import { useTheme } from '@/contexts/ThemeContext';
import { formatDue, type Reminder } from '@/constants/projects';
import { Radius } from '@/constants/theme';

interface ReminderCardProps {
  reminder: Reminder | null;
  onPress?: () => void;
  /** Rendered inside the panel under the reminder row (the search bar in the reference). */
  children?: ReactNode;
}

/** Re-renders every second while mounted. */
function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** Countdown parts: H:M:S under a day, otherwise D:H:M. */
function parts(ms: number): { value: string; unit: string }[] {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return [{ value: String(d), unit: 'd' }, { value: pad(h), unit: 'h' }, { value: pad(m), unit: 'm' }];
  return [{ value: pad(h), unit: 'h' }, { value: pad(m), unit: 'm' }, { value: pad(s % 60), unit: 's' }];
}

export function ReminderCard({ reminder, onPress, children }: ReminderCardProps) {
  const { colors } = useTheme();
  const now = useNow();
  const left = reminder ? reminder.dueAt - now : 0;
  const overdue = !!reminder && left <= 0;
  const urgent = !!reminder && left > 0 && left < 3_600_000;
  const tileBg = overdue ? colors.coralSoft : urgent ? colors.amberSoft : colors.backgroundElement;
  const tileFg = overdue ? colors.accentCoral : urgent ? colors.accentAmber : colors.text;

  const label = !reminder
    ? 'No deadlines coming up'
    : overdue
      ? `${reminder.title}. Overdue.`
      : `${reminder.title}. ${reminder.subtitle}. Due ${formatDue(reminder.dueAt)}.`;

  return (
    <View style={[styles.panel, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Pressable onPress={onPress} disabled={!reminder} accessibilityRole="button" accessibilityLabel={label} style={styles.row}>
        <View style={[styles.icon, { backgroundColor: colors.primaryWash }]}>
          <Ionicons name={overdue ? 'alert-circle-outline' : 'stopwatch-outline'} size={24} color={overdue ? colors.accentCoral : colors.primary} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={[styles.title, { color: colors.text }]}>{reminder ? reminder.title : 'All caught up'}</Text>
          <Text style={[styles.sub, { color: colors.textSecondary }]} numberOfLines={1}>
            {reminder ? reminder.subtitle : 'No deadlines coming up'}
          </Text>
          {reminder && (
            <Text style={[styles.due, { color: overdue ? colors.accentCoral : colors.textSecondary }]} numberOfLines={1}>
              {overdue ? 'Overdue' : `Due ${formatDue(reminder.dueAt)}`}
            </Text>
          )}
        </View>
        {reminder && !overdue && (
          <View style={styles.timer} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
            {parts(left).map((p, i) => (
              <React.Fragment key={p.unit}>
                {i > 0 && (
                  <Text style={[styles.colon, { color: tileFg }]} maxFontSizeMultiplier={1.2}>
                    :
                  </Text>
                )}
                <View style={[styles.digit, { backgroundColor: tileBg }]}>
                  <Animated.View key={p.value} entering={FadeIn.duration(180)}>
                    <Text style={[styles.digitText, { color: tileFg }]} maxFontSizeMultiplier={1.2}>
                      {p.value}
                    </Text>
                  </Animated.View>
                  <Text style={[styles.unit, { color: tileFg }]} maxFontSizeMultiplier={1.2}>
                    {p.unit}
                  </Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        )}
      </Pressable>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { borderRadius: Radius.xl, padding: 12, gap: 12, borderWidth: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 4, paddingTop: 2 },
  icon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 14, fontWeight: '600' },
  sub: { fontSize: 12 },
  due: { fontSize: 11, fontWeight: '500' },
  timer: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  digit: { minWidth: 30, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  digitText: { fontSize: 15, fontWeight: '600', fontVariant: ['tabular-nums'] },
  unit: { fontSize: 9, fontWeight: '500', marginTop: -2, opacity: 0.7 },
  colon: { fontSize: 14, fontWeight: '600' },
});
