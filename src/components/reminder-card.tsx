import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Radius } from '@/constants/theme';

interface ReminderCardProps {
  title?: string;
  subtitle?: string;
  countdown?: string;
  onPress?: () => void;
  /** Rendered inside the panel under the reminder row (the search bar in the reference). */
  children?: ReactNode;
}

export function ReminderCard({
  title = 'Reminder',
  subtitle = 'Milestone 2 due in 2 hours',
  countdown = '945',
  onPress,
  children,
}: ReminderCardProps) {
  const { colors, isDark } = useTheme();
  const digits = countdown.replace(/\D/g, '').split('');

  return (
    <LinearGradient
      colors={isDark ? ['#15303D', '#13242D'] : ['#DCEEF8', '#EAF6FD']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.panel, { borderColor: isDark ? colors.border : 'rgba(255,255,255,0.8)' }]}>
      <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${title}. ${subtitle}`} style={styles.row}>
        <View style={[styles.icon, { backgroundColor: isDark ? colors.primarySoft : '#FFFFFF' }]}>
          <Ionicons name="stopwatch-outline" size={24} color={colors.primary} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.sub, { color: colors.textSecondary }]} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
        <View style={styles.timer} accessibilityLabel={`Countdown ${countdown}`}>
          {digits.map((d, i) => (
            <React.Fragment key={i}>
              {i === 1 && <Text style={[styles.colon, { color: colors.text }]}>:</Text>}
              <View style={[styles.digit, { backgroundColor: isDark ? colors.backgroundElement : 'rgba(255,255,255,0.75)' }]}>
                <Text style={[styles.digitText, { color: colors.text }]}>{d}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>
      </Pressable>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  panel: { borderRadius: Radius.xl, padding: 12, gap: 12, borderWidth: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 4, paddingTop: 2 },
  icon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 14, fontWeight: '600' },
  sub: { fontSize: 12 },
  timer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  digit: { width: 24, height: 30, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  digitText: { fontSize: 16, fontWeight: '500', fontVariant: ['tabular-nums'] },
  colon: { fontSize: 15, fontWeight: '600', marginHorizontal: 1 },
});
