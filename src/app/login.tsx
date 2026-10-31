import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { AuthShell, OrDivider, PhoneField } from '@/components/auth-shell';
import { Button, Field, Segmented } from '@/components/ds';
import { FaceScanModal } from '@/components/face-scan';

type Method = 'phone' | 'email';

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [method, setMethod] = useState<Method>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [faceScan, setFaceScan] = useState(false);

  const handleLogin = () => {
    if (method === 'phone') {
      router.push({ pathname: '/verify-otp', params: { phone: phone || '24 123 4567', role: 'freelancer' } });
    } else {
      router.replace('/');
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage your contracts, escrow and payouts."
      footer={
        <Pressable onPress={() => router.push('/register')} style={styles.footer} accessibilityRole="link">
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            {"Don't have an account? "}
            <Text style={{ color: colors.text, fontWeight: '600' }}>Sign Up</Text>
          </Text>
        </Pressable>
      }>
      <Segmented<Method>
        value={method}
        onChange={setMethod}
        options={[
          { value: 'phone', label: 'Phone', icon: 'phone-portrait-outline' },
          { value: 'email', label: 'Email', icon: 'mail-outline' },
        ]}
      />

      {method === 'phone' ? (
        <PhoneField value={phone} onChangeText={setPhone} />
      ) : (
        <Field
          label="Email address"
          icon="mail-outline"
          placeholder="you@domain.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
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
          onChangeText={setPassword}
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

      <Button label="Sign In" onPress={handleLogin} />
      <Button
        label="Sign in with Face ID"
        variant="light"
        icon={<MaterialCommunityIcons name="face-recognition" size={19} color={colors.primary} />}
        onPress={() => setFaceScan(true)}
      />

      <OrDivider />

      <View style={styles.social}>
        <Button
          label="Google"
          variant="light"
          size="md"
          style={{ flex: 1, height: 52 }}
          icon={<Ionicons name="logo-google" size={18} color="#EA4335" />}
          onPress={() => router.replace('/')}
        />
        <Button
          label="Apple"
          variant="light"
          size="md"
          style={{ flex: 1, height: 52 }}
          icon={<Ionicons name="logo-apple" size={19} color={colors.text} />}
          onPress={() => router.replace('/')}
        />
      </View>
      <FaceScanModal
        visible={faceScan}
        onCancel={() => setFaceScan(false)}
        onUsePassword={() => setFaceScan(false)}
        onSuccess={() => {
          setFaceScan(false);
          router.replace('/');
        }}
      />
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  forgot: { alignSelf: 'flex-end', marginTop: 10, marginRight: 6 },
  forgotText: { fontSize: 13, fontWeight: '500' },
  social: { flexDirection: 'row', gap: 12 },
  footer: { alignItems: 'center', paddingVertical: 10 },
  footerText: { fontSize: 13 },
});
