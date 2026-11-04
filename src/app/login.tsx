import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components/ui-text';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { AuthShell, OrDivider, PhoneField } from '@/components/auth-shell';
import { Avatar, Button, Field, Segmented } from '@/components/ds';
import { useAppLock } from '@/contexts/AppLockContext';
import { Radius } from '@/constants/theme';

type Method = 'phone' | 'email';

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { signIn, signInWithBiometrics, lastUser, biometricEnabled } = useAuth();
  const [method, setMethod] = useState<Method>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  // Signing in flips the auth guard, which takes the user into the app.
  const handleLogin = async () => {
    const id = method === 'phone' ? phone : email;
    if (!id.trim()) return setError(method === 'phone' ? 'Enter your phone number.' : 'Enter your email.');
    if (!password) return setError('Enter your password.');
    setBusy(true);
    const err = await signIn(id, password);
    setBusy(false);
    if (err) {
      setError(err);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    }
  };

  // Real device biometrics only: no camera-based sign-in, so a photo can't open an account.
  const { biometricLabel, authenticate } = useAppLock();
  const canUseFace = biometricEnabled && !!lastUser && !!biometricLabel;
  const faceish = biometricLabel === 'Face ID' || biometricLabel === 'Face unlock';

  const bioSignIn = async () => {
    if (!lastUser) return;
    if (!(await authenticate(`Sign in as ${lastUser.name.split(' ')[0]}`))) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    const err = signInWithBiometrics();
    if (err) setError(err);
  };

  // Offer Face ID / fingerprint as soon as the screen opens, once.
  const prompted = useRef(false);
  useEffect(() => {
    if (!canUseFace || prompted.current) return;
    prompted.current = true;
    const t = setTimeout(bioSignIn, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canUseFace]);

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage your contracts, escrow and payouts."
      footer={
        <Pressable onPress={() => router.push('/choose-role')} style={styles.footer} accessibilityRole="link">
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            {"Don't have an account? "}
            <Text style={{ color: colors.text, fontWeight: '600' }}>Sign Up</Text>
          </Text>
        </Pressable>
      }>
      {canUseFace && (
        <Pressable
          onPress={bioSignIn}
          accessibilityRole="button"
          accessibilityLabel={`Continue as ${lastUser!.name} with ${biometricLabel}`}
          style={[styles.quick, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Avatar uri={lastUser!.avatar} size={44} ring={false} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.quickName, { color: colors.text }]}>{lastUser!.name}</Text>
            <Text style={[styles.quickSub, { color: colors.textSecondary }]}>
              {lastUser!.role === 'client' ? 'Client' : 'Freelancer'} account · tap to use {biometricLabel}
            </Text>
          </View>
          <View style={[styles.bioIcon, { backgroundColor: colors.action }]}>
            {faceish ? (
              <Ionicons name="scan-circle" size={22} color="#FFFFFF" />
            ) : (
              <Ionicons name="finger-print" size={24} color="#FFFFFF" />
            )}
          </View>
        </Pressable>
      )}

      <Segmented<Method>
        value={method}
        onChange={(m) => {
          setMethod(m);
          setError(undefined);
        }}
        options={[
          { value: 'phone', label: 'Phone', icon: 'phone-portrait-outline' },
          { value: 'email', label: 'Email', icon: 'mail-outline' },
        ]}
      />

      {method === 'phone' ? (
        <PhoneField
          value={phone}
          onChangeText={(t) => {
            setPhone(t);
            setError(undefined);
          }}
        />
      ) : (
        <Field
          label="Email address"
          icon="mail-outline"
          placeholder="you@domain.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            setError(undefined);
          }}
        />
      )}

      <View>
        <Field
          label="Password"
          icon="lock-closed-outline"
          placeholder="Enter your password"
          secureTextEntry={!showPassword}
          autoComplete="password"
          value={password}
          onChangeText={(t) => {
            setPassword(t);
            setError(undefined);
          }}
          onSubmitEditing={handleLogin}
          error={error}
          right={
            <Pressable
              onPress={() => setShowPassword((s) => !s)}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textSecondary} />
            </Pressable>
          }
        />
        <Pressable onPress={() => router.push('/forgot-password')} style={styles.forgot} accessibilityRole="link" hitSlop={8}>
          <Text style={[styles.forgotText, { color: colors.primaryText }]}>Forgot password?</Text>
        </Pressable>
      </View>

      <Button label="Sign In" loading={busy} onPress={handleLogin} />
      {!canUseFace && (
        <Button
          label="Sign in with Face ID"
          variant="light"
          icon={<Ionicons name="scan-circle" size={19} color={colors.primaryText} />}
          onPress={bioSignIn}
        />
      )}

      <View style={[styles.demo, { backgroundColor: colors.primaryWash }]}>
        <Ionicons name="information-circle-outline" size={16} color={colors.primaryText} />
        <Text style={[styles.demoText, { color: colors.textSecondary }]}>
          Demo accounts (password devpay123): freelancer 24 123 4567 · client 20 555 0101
        </Text>
      </View>

      <OrDivider />

      <View style={styles.social}>
        <Button
          label="Google"
          variant="light"
          size="md"
          style={{ flex: 1, height: 52 }}
          icon={<Ionicons name="logo-google" size={18} color="#EA4335" />}
          onPress={() => setError('Google sign-in isn’t connected yet. Use your phone or email.')}
        />
        <Button
          label="Apple"
          variant="light"
          size="md"
          style={{ flex: 1, height: 52 }}
          icon={<Ionicons name="logo-apple" size={19} color={colors.text} />}
          onPress={() => setError('Apple sign-in isn’t connected yet. Use your phone or email.')}
        />
      </View>

    </AuthShell>
  );
}

const styles = StyleSheet.create({
  quick: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: Radius.lg, borderWidth: 1 },
  bioIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  quickName: { fontSize: 15, fontWeight: '600' },
  quickSub: { fontSize: 12, marginTop: 2 },
  forgot: { alignSelf: 'flex-end', marginTop: 10, marginRight: 6 },
  forgotText: { fontSize: 13, fontWeight: '500' },
  demo: { flexDirection: 'row', gap: 8, padding: 12, borderRadius: Radius.md, alignItems: 'center' },
  demoText: { flex: 1, fontSize: 12, lineHeight: 17 },
  social: { flexDirection: 'row', gap: 12 },
  footer: { alignItems: 'center', paddingVertical: 10 },
  footerText: { fontSize: 13 },
});
