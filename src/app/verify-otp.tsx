import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Pressable, TextInputKeyPressEvent } from 'react-native';
import { Text, TextInput } from '@/components/ui-text';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { AuthShell } from '@/components/auth-shell';
import { Button } from '@/components/ds';
import { Radius, Shadows } from '@/constants/theme';

export default function VerifyOtpScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { pending, completeSignUp } = useAuth();
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const phone = pending ? pending.phone.replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3') : '';
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);
  const [focused, setFocused] = useState(0);
  const inputs = useRef<(React.ComponentRef<typeof TextInput> | null)[]>([]);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const setDigit = (text: string, i: number) => {
    const digits = text.replace(/\D/g, '');
    const next = [...code];
    if (digits.length > 1) {
      // pasted code
      digits.slice(0, 6 - i).split('').forEach((d, k) => (next[i + k] = d));
      setCode(next);
      inputs.current[Math.min(5, i + digits.length)]?.focus();
      return;
    }
    next[i] = digits;
    setCode(next);
    if (digits && i < 5) inputs.current[i + 1]?.focus();
  };

  const onKey = (e: TextInputKeyPressEvent, i: number) => {
    if (e.nativeEvent.key === 'Backspace' && code[i] === '' && i > 0) inputs.current[i - 1]?.focus();
  };

  const complete = code.every((d) => d !== '');
  const verify = async () => {
    setBusy(true);
    const err = await completeSignUp();
    setBusy(false);
    if (err) setError(err);
  };

  return (
    <AuthShell
      title="Verify your number"
      subtitle={pending ? `Enter the 6-digit code we sent by SMS to +233 ${phone}. (Demo: any 6 digits.)` : 'Your sign-up expired. Go back and start again.'}
      step={{ index: 3, total: 3 }}
      footer={<Button label="Verify & Create Account" loading={busy} onPress={verify} disabled={!complete || !pending} />}>
      <View style={styles.row}>
        {code.map((d, i) => (
          <TextInput
            key={i}
            ref={(r) => {
              inputs.current[i] = r;
            }}
            value={d}
            onChangeText={(t) => setDigit(t, i)}
            onKeyPress={(e) => onKey(e, i)}
            onFocus={() => setFocused(i)}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete={i === 0 ? 'sms-otp' : 'off'}
            maxLength={i === 0 ? 6 : 1}
            selectTextOnFocus
            selectionColor={colors.primary}
            accessibilityLabel={`Digit ${i + 1}`}
            style={[
              styles.box,
              {
                color: colors.text,
                backgroundColor: colors.surface,
                borderColor: focused === i ? colors.primary : d ? colors.primarySoft : isDark ? colors.border : 'transparent',
              },
              !isDark && Shadows.button,
            ]}
          />
        ))}
      </View>
      {error && <Text style={[styles.resendText, { color: colors.accentCoral, textAlign: 'center' }]}>{error}</Text>}
      <View style={styles.resend}>
        {timer > 0 ? (
          <Text style={[styles.resendText, { color: colors.textSecondary }]}>
            Resend code in <Text style={{ color: colors.text, fontWeight: '600', fontVariant: ['tabular-nums'] }}>{timer}s</Text>
          </Text>
        ) : (
          <Pressable onPress={() => setTimer(45)} accessibilityRole="button" hitSlop={8}>
            <Text style={[styles.resendText, { color: colors.primaryText, fontWeight: '600' }]}>Resend code</Text>
          </Pressable>
        )}
      </View>
      <Pressable onPress={() => router.back()} accessibilityRole="link" style={{ alignSelf: 'center' }} hitSlop={8}>
        <Text style={[styles.resendText, { color: colors.textSecondary }]}>Wrong number? Change it</Text>
      </Pressable>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  box: {
    flex: 1,
    minWidth: 0,
    width: 0,
    height: 58,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '600',
  },
  resend: { alignItems: 'center', marginTop: 4 },
  resendText: { fontSize: 14 },
});
