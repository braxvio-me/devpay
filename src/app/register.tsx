import React, { useState } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { AuthShell, PhoneField } from '@/components/auth-shell';
import { Button, Field, Segmented } from '@/components/ds';

type Role = 'freelancer' | 'client';

export default function RegisterScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { defaultRole } = useLocalSearchParams();
  const [role, setRole] = useState<Role>(defaultRole === 'client' ? 'client' : 'freelancer');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const errors = {
    fullName: fullName.trim().length < 2 ? 'Enter your full name.' : undefined,
    phone: phone.replace(/\s/g, '').length < 9 ? 'Enter a 9-digit Ghana number.' : undefined,
    password: password.length < 8 ? 'Use at least 8 characters.' : undefined,
  };
  const valid = !errors.fullName && !errors.phone && !errors.password && agreed;

  const handleRegister = () => {
    setSubmitted(true);
    if (!valid) return;
    router.push({ pathname: '/verify-otp', params: { phone, role } });
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Work with verified clients and talent across Ghana."
      step={{ index: 2, total: 3 }}
      footer={
        <>
          <Button label="Create Account" onPress={handleRegister} />
          <Pressable onPress={() => router.push('/login')} style={styles.footer} accessibilityRole="link">
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Already have an account? <Text style={{ color: colors.text, fontWeight: '600' }}>Sign In</Text>
            </Text>
          </Pressable>
        </>
      }>
      <Segmented<Role>
        value={role}
        onChange={setRole}
        options={[
          { value: 'freelancer', label: 'Freelancer', icon: 'laptop-outline' },
          { value: 'client', label: 'Client', icon: 'briefcase-outline' },
        ]}
      />
      <Field
        label="Full name"
        icon="person-outline"
        placeholder="e.g. Kwame Mensah"
        autoComplete="name"
        value={fullName}
        onChangeText={setFullName}
        error={submitted ? errors.fullName : undefined}
      />
      <PhoneField value={phone} onChangeText={setPhone} error={submitted ? errors.phone : undefined} />
      <Field
        label="Email (optional)"
        icon="mail-outline"
        placeholder="kwame@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        value={email}
        onChangeText={setEmail}
      />
      <Field
        label="Password"
        icon="lock-closed-outline"
        placeholder="At least 8 characters"
        secureTextEntry
        autoComplete="new-password"
        value={password}
        onChangeText={setPassword}
        error={submitted ? errors.password : undefined}
      />
      <Pressable
        onPress={() => setAgreed((a) => !a)}
        style={styles.terms}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: agreed }}>
        <Ionicons name={agreed ? 'checkbox' : 'square-outline'} size={20} color={agreed ? colors.primary : colors.textMuted} />
        <Text style={[styles.termsText, { color: colors.textSecondary }]}>
          I agree to the <Text style={{ color: colors.primaryText }}>Terms of Service</Text> and{' '}
          <Text style={{ color: colors.primaryText }}>Escrow Policy</Text>.
        </Text>
      </Pressable>
      {submitted && !agreed && (
        <Text style={[styles.err, { color: colors.accentCoral }]}>Accept the terms to continue.</Text>
      )}
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  terms: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', paddingHorizontal: 4 },
  termsText: { flex: 1, fontSize: 13, lineHeight: 19 },
  err: { fontSize: 12, marginTop: -10, marginLeft: 4 },
  footer: { alignItems: 'center', paddingVertical: 8 },
  footerText: { fontSize: 13 },
});
