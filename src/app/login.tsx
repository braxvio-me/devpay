import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Haptics from 'expo-haptics';

export default function LoginScreen() {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticatingBiometrics, setIsAuthenticatingBiometrics] = useState(false);

  const handleLogin = () => {
    if (authMethod === 'phone') {
      router.push({
        pathname: '/verify-otp',
        params: { phone: phone || '24 123 4567', role: 'freelancer' },
      });
    } else {
      router.replace('/');
    }
  };

  const handleBiometricLogin = async () => {
    try {
      setIsAuthenticatingBiometrics(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        // Fallback for emulator / non-enrolled: simulate prompt
        Alert.alert(
          'Biometric Verification',
          'Simulating DevPay Face ID biometric scan for Kwame Mensah.',
          [
            {
              text: 'Simulate Success',
              onPress: async () => {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                router.replace('/');
              },
            },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Sign in to DevPay Africa with Face ID',
        fallbackLabel: 'Use Mobile Number & Password',
      });

      if (result.success) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace('/');
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch (e) {
      Alert.alert('Authentication Error', 'Biometric login could not be initiated.');
    } finally {
      setIsAuthenticatingBiometrics(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Top Back Nav */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color={Colors.light.text} />
          </TouchableOpacity>

          {/* Heading */}
          <View style={styles.header}>
            <View style={styles.logoPill}>
              <Ionicons name="shield-checkmark" size={20} color="#0F73F7" />
              <Text style={styles.logoText}>DevPay Africa</Text>
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to manage your freelance contracts, milestone escrow, and payouts.
            </Text>
          </View>

          {/* Method Segmented Tab (Phone vs Email) */}
          <View style={styles.methodToggle}>
            <TouchableOpacity
              style={[styles.methodBtn, authMethod === 'phone' && styles.activeMethodBtn]}
              onPress={() => setAuthMethod('phone')}>
              <Ionicons
                name="phone-portrait-outline"
                size={16}
                color={authMethod === 'phone' ? '#0F73F7' : Colors.light.textSecondary}
              />
              <Text style={[styles.methodText, authMethod === 'phone' && styles.activeMethodText]}>
                Ghana Phone (MoMo)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.methodBtn, authMethod === 'email' && styles.activeMethodBtn]}
              onPress={() => setAuthMethod('email')}>
              <Ionicons
                name="mail-outline"
                size={16}
                color={authMethod === 'email' ? '#0F73F7' : Colors.light.textSecondary}
              />
              <Text style={[styles.methodText, authMethod === 'email' && styles.activeMethodText]}>
                Email Address
              </Text>
            </TouchableOpacity>
          </View>

          {/* Input Fields */}
          <View style={styles.formContainer}>
            {authMethod === 'phone' ? (
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Mobile Number</Text>
                <View style={styles.phoneInputRow}>
                  <View style={styles.countryCodeBox}>
                    <Text style={styles.flagText}>🇬🇭</Text>
                    <Text style={styles.countryCodeText}>+233</Text>
                  </View>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="24 123 4567"
                    placeholderTextColor={Colors.light.textMuted}
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={18} color={Colors.light.textMuted} style={{ marginRight: 10 }} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="you@domain.com"
                    placeholderTextColor={Colors.light.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>
            )}

            <View style={styles.fieldGroup}>
              <View style={styles.passwordLabelRow}>
                <Text style={styles.fieldLabel}>Password</Text>
                <TouchableOpacity
                  onPress={() => router.push('/forgot-password')}
                  activeOpacity={0.8}>
                  <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={18} color={Colors.light.textMuted} style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your password"
                  placeholderTextColor={Colors.light.textMuted}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={Colors.light.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Primary Action Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleLogin}
              activeOpacity={0.88}>
              <LinearGradient
                colors={['#0F73F7', '#38BDF8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}>
                <Text style={styles.submitButtonText}>Sign In</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>

            {/* Quick Biometrics Button */}
            <TouchableOpacity
              style={styles.biometricBtn}
              onPress={handleBiometricLogin}
              activeOpacity={0.85}
              disabled={isAuthenticatingBiometrics}>
              <View style={styles.biometricIconCircle}>
                <Ionicons name="scan-outline" size={20} color="#0F73F7" />
              </View>
              <Text style={styles.biometricBtnText}>
                {isAuthenticatingBiometrics ? 'Scanning...' : 'Sign in with Face ID / Biometrics'}
              </Text>
            </TouchableOpacity>

            {/* Social Auth Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Buttons */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn} activeOpacity={0.85}>
                <Ionicons name="logo-google" size={18} color="#EA4335" />
                <Text style={styles.socialBtnText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialBtn} activeOpacity={0.85}>
                <Ionicons name="logo-apple" size={18} color="#000000" />
                <Text style={styles.socialBtnText}>Apple</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer Signup Link */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF3FA',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    marginTop: 20,
  },
  logoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EBF4FE',
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 12,
  },
  logoText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F73F7',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.light.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.light.textSecondary,
    marginTop: 6,
  },
  methodToggle: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginTop: 22,
  },
  methodBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 11,
  },
  activeMethodBtn: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  methodText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  activeMethodText: {
    color: '#0F73F7',
    fontWeight: '700',
  },
  formContainer: {
    marginTop: 20,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  forgotPasswordText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F73F7',
  },
  phoneInputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  countryCodeBox: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF3FA',
    borderRadius: 16,
    paddingHorizontal: 12,
  },
  flagText: {
    fontSize: 18,
  },
  countryCodeText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  phoneInput: {
    flex: 1,
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF3FA',
    borderRadius: 16,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.text,
  },
  inputWrapper: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF3FA',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '500',
  },
  submitButton: {
    height: 54,
    borderRadius: 27,
    overflow: 'hidden',
    marginTop: 10,
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  gradientButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  biometricBtn: {
    marginTop: 12,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 16,
  },
  biometricIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  biometricBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F73F7',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#EEF3FA',
  },
  dividerText: {
    fontSize: 12,
    color: Colors.light.textMuted,
    paddingHorizontal: 12,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF3FA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  socialBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.text,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 26,
  },
  footerText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  signUpLink: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F73F7',
  },
});
