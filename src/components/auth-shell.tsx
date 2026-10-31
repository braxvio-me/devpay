import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { Field, IconButton, ScreenBackground } from '@/components/ds';
import { Layout } from '@/constants/theme';

/** Shared frame for onboarding and auth: back button, title block, form, pinned footer. */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  step,
  back = true,
  onBack,
  right,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** e.g. { index: 1, total: 3 } draws a progress row. */
  step?: { index: number; total: number };
  back?: boolean;
  onBack?: () => void;
  right?: ReactNode;
}) {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <ScreenBackground height={420} />
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.bar}>
            {back ? (
              <IconButton
                icon="chevron-back"
                accessibilityLabel="Go back"
                onPress={onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/welcome')))}
              />
            ) : (
              <View style={{ width: 44 }} />
            )}
            {step && (
              <View style={styles.steps} accessibilityLabel={`Step ${step.index} of ${step.total}`}>
                {Array.from({ length: step.total }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.step,
                      { backgroundColor: i < step.index ? colors.primary : colors.backgroundSelected, width: i === step.index - 1 ? 28 : 14 },
                    ]}
                  />
                ))}
              </View>
            )}
            <View style={{ width: 44, alignItems: 'flex-end' }}>{right}</View>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}>
            <Text style={[styles.title, { color: colors.text }]} accessibilityRole="header">
              {title}
            </Text>
            {subtitle && <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
            <View style={{ marginTop: 28, gap: 18 }}>{children}</View>
          </ScrollView>

          {footer && <View style={styles.footer}>{footer}</View>}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

/** +233 phone input used by sign-in, sign-up and payouts. */
export function PhoneField({
  value,
  onChangeText,
  label = 'Mobile number',
  error,
}: {
  value: string;
  onChangeText: (v: string) => void;
  label?: string;
  error?: string;
}) {
  const { colors } = useTheme();
  return (
    <Field
      label={label}
      value={value}
      onChangeText={(t) => onChangeText(t.replace(/[^\d ]/g, ''))}
      placeholder="24 123 4567"
      keyboardType="phone-pad"
      textContentType="telephoneNumber"
      autoComplete="tel"
      maxLength={12}
      error={error}
      accessibilityLabel={label}
      prefix={
        <View style={[styles.prefix, { borderRightColor: colors.border }]}>
          <View style={[styles.flag, { backgroundColor: colors.primarySoft }]}>
            <Text style={[styles.flagText, { color: colors.primaryText }]}>GH</Text>
          </View>
          <Text style={[styles.prefixText, { color: colors.text }]}>+233</Text>
        </View>
      }
    />
  );
}

export function OrDivider({ label = 'or continue with' }: { label?: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.or}>
      <View style={[styles.orLine, { backgroundColor: colors.border }]} />
      <Text style={[styles.orText, { color: colors.textMuted }]}>{label}</Text>
      <View style={[styles.orLine, { backgroundColor: colors.border }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  prefix: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingRight: 10, borderRightWidth: 1 },
  flag: { paddingHorizontal: 6, height: 20, borderRadius: 5, justifyContent: 'center' },
  flagText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.2 },
  prefixText: { fontSize: 15, fontWeight: '500' },
  or: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  orLine: { flex: 1, height: 1 },
  orText: { fontSize: 12 },
  bar: {
    height: Layout.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.margin,
  },
  steps: { flexDirection: 'row', gap: 6 },
  step: { height: 6, borderRadius: 3 },
  content: { paddingHorizontal: Layout.margin, paddingTop: 16, paddingBottom: 32 },
  title: { fontSize: 28, fontWeight: '600', letterSpacing: -0.7 },
  subtitle: { fontSize: 15, lineHeight: 22, marginTop: 8 },
  footer: { paddingHorizontal: Layout.margin, paddingTop: 8, paddingBottom: 8, gap: 12 },
});
