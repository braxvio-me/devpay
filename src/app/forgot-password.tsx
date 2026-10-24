import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestOtp = () => {
    if (method === 'phone' && !phone.trim()) {
      Alert.alert('Required', 'Please enter your Ghana mobile number.');
      return;
    }
    if (method === 'email' && !email.trim()) {
      Alert.alert('Required', 'Please enter your email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('verify');
      Alert.alert(
        'Code Sent',
        `A 6-digit verification code has been dispatched to ${method === 'phone' ? `+233 ${phone}` : email}.`
      );
    }, 600);
  };

  const handleResetPassword = () => {
    if (otpCode.length < 6) {
      Alert.alert('Invalid Code', 'Please enter the 6-digit OTP code.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Mismatch', 'Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Password Updated', 'Your password has been reset. Please sign in.', [
        {
          text: 'Sign In',
          onPress: () => router.replace('/login'),
        },
      ]);
    }, 700);
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => (step === 'verify' ? setStep('request') : router.back())}
            activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reset Password</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.iconCircle}>
            <Ionicons name="key-outline" size={32} color="#0F73F7" />
          </View>

          <Text style={styles.title}>
            {step === 'request' ? 'Forgot Your Password?' : 'Enter Code & New Password'}
          </Text>
          <Text style={styles.subtitle}>
            {step === 'request'
              ? 'No worries! Enter your registered phone number or email to receive a recovery code.'
              : 'Enter the 6-digit code received via SMS/Email and create your new password.'}
          </Text>

          {step === 'request' ? (
            <>
              {/* Method Switcher */}
              <View style={styles.methodToggle}>
                <TouchableOpacity
                  style={[styles.methodBtn, method === 'phone' && styles.methodBtnActive]}
                  onPress={() => setMethod('phone')}
                  activeOpacity={0.8}>
                  <Ionicons
                    name="phone-portrait-outline"
                    size={16}
                    color={method === 'phone' ? '#0F73F7' : Colors.light.textSecondary}
                  />
                  <Text style={[styles.methodBtnText, method === 'phone' && styles.methodBtnTextActive]}>
                    Ghana Phone (MoMo)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.methodBtn, method === 'email' && styles.methodBtnActive]}
                  onPress={() => setMethod('email')}
                  activeOpacity={0.8}>
                  <Ionicons
                    name="mail-outline"
                    size={16}
                    color={method === 'email' ? '#0F73F7' : Colors.light.textSecondary}
                  />
                  <Text style={[styles.methodBtnText, method === 'email' && styles.methodBtnTextActive]}>
                    Email Address
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Input */}
              {method === 'phone' ? (
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Mobile Phone Number</Text>
                  <View style={styles.phoneInputRow}>
                    <View style={styles.codeBox}>
                      <Text style={styles.flag}>🇬🇭</Text>
                      <Text style={styles.codeText}>+233</Text>
                    </View>
                    <TextInput
                      style={styles.phoneInput}
                      value={phone}
                      onChangeText={setPhone}
                      placeholder="24 123 4567"
                      keyboardType="phone-pad"
                      placeholderTextColor={Colors.light.textMuted}
                    />
                  </View>
                </View>
              ) : (
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Registered Email</Text>
                  <TextInput
                    style={styles.singleInput}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="kwame@devpay.africa"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor={Colors.light.textMuted}
                  />
                </View>
              )}

              {/* Request Code CTA */}
              <TouchableOpacity
                style={styles.primaryBtnWrapper}
                onPress={handleRequestOtp}
                disabled={isLoading}
                activeOpacity={0.9}>
                <LinearGradient
                  colors={['#0F73F7', '#38BDF8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientBtn}>
                  <Text style={styles.primaryBtnText}>
                    {isLoading ? 'Sending Code...' : 'Send Recovery Code'}
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Step 2: Verification Code & New Password */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>6-Digit OTP Code</Text>
                <TextInput
                  style={styles.singleInput}
                  value={otpCode}
                  onChangeText={setOtpCode}
                  placeholder="e.g. 583921"
                  keyboardType="number-pad"
                  maxLength={6}
                  placeholderTextColor={Colors.light.textMuted}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>New Password</Text>
                <TextInput
                  style={styles.singleInput}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="At least 6 characters"
                  secureTextEntry
                  placeholderTextColor={Colors.light.textMuted}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Confirm New Password</Text>
                <TextInput
                  style={styles.singleInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Re-type new password"
                  secureTextEntry
                  placeholderTextColor={Colors.light.textMuted}
                />
              </View>

              <TouchableOpacity
                style={styles.primaryBtnWrapper}
                onPress={handleResetPassword}
                disabled={isLoading}
                activeOpacity={0.9}>
                <LinearGradient
                  colors={['#0F73F7', '#38BDF8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientBtn}>
                  <Text style={styles.primaryBtnText}>
                    {isLoading ? 'Updating Password...' : 'Reset & Sign In'}
                  </Text>
                  <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}

          {/* Back to Login */}
          <TouchableOpacity
            style={styles.backToLogin}
            onPress={() => router.replace('/login')}
            activeOpacity={0.8}>
            <Text style={styles.backToLoginText}>
              Remember your password? <Text style={styles.boldBlue}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF3FA',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#EEF3FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.light.text,
  },
  scrollContent: {
    padding: 24,
    gap: 16,
    paddingBottom: 40,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.light.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  methodToggle: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: '#EEF3FA',
    marginVertical: 6,
  },
  methodBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  methodBtnActive: {
    backgroundColor: '#EFF6FF',
  },
  methodBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  methodBtnTextActive: {
    color: '#0F73F7',
    fontWeight: '700',
  },
  formGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.text,
    marginLeft: 2,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEF3FA',
    height: 48,
    overflow: 'hidden',
  },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: '#EEF3FA',
  },
  flag: {
    fontSize: 16,
  },
  codeText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 14,
    color: Colors.light.text,
  },
  singleInput: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEF3FA',
    paddingHorizontal: 14,
    fontSize: 14,
    color: Colors.light.text,
  },
  primaryBtnWrapper: {
    borderRadius: 27,
    overflow: 'hidden',
    marginTop: 10,
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  gradientBtn: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  backToLogin: {
    alignItems: 'center',
    marginTop: 12,
  },
  backToLoginText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  boldBlue: {
    fontWeight: '800',
    color: '#0F73F7',
  },
});
