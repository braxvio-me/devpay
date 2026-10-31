import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthShell, PhoneField } from '@/components/auth-shell';
import { Button, Field, Segmented } from '@/components/ds';

type Method = 'phone' | 'email';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [method, setMethod] = useState<Method>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleRequestOtp = () => {
    if (method === 'phone' && !phone.trim()) return setError('Enter your Ghana mobile number.');
    if (method === 'email' && !email.trim()) return setError('Enter your email address.');
    setError(undefined);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('verify');
    }, 600);
  };

  const handleResetPassword = () => {
    if (otpCode.length < 6) return setError('Enter the 6-digit code.');
    if (newPassword.length < 8) return setError('Use at least 8 characters for your password.');
    if (newPassword !== confirmPassword) return setError('The two passwords don’t match.');
    setError(undefined);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Password updated', 'Sign in with your new password.', [
        { text: 'Sign In', onPress: () => router.replace('/login') },
      ]);
    }, 700);
  };

  const destination = method === 'phone' ? `+233 ${phone}` : email;

  return step === 'request' ? (
    <AuthShell
      title="Forgot your password?"
      subtitle="Enter your phone number or email and we’ll send a recovery code."
      footer={<Button label="Send Recovery Code" loading={isLoading} onPress={handleRequestOtp} />}>
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
        <PhoneField value={phone} onChangeText={setPhone} error={error} />
      ) : (
        <Field
          label="Email address"
          icon="mail-outline"
          placeholder="kwame@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          error={error}
        />
      )}
    </AuthShell>
  ) : (
    <AuthShell
      title="Set a new password"
      subtitle={`Enter the 6-digit code sent to ${destination}, then choose a new password.`}
      onBack={() => setStep('request')}
      footer={<Button label="Reset & Sign In" loading={isLoading} onPress={handleResetPassword} />}>
      <Field
        label="6-digit code"
        icon="keypad-outline"
        placeholder="e.g. 583921"
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        maxLength={6}
        value={otpCode}
        onChangeText={setOtpCode}
      />
      <Field
        label="New password"
        icon="lock-closed-outline"
        placeholder="At least 8 characters"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <Field
        label="Confirm new password"
        icon="lock-closed-outline"
        placeholder="Type it again"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        error={error}
      />
    </AuthShell>
  );
}
