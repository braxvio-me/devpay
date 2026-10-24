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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const { defaultRole } = useLocalSearchParams();
  const [role, setRole] = useState<'freelancer' | 'client'>(
    defaultRole === 'client' ? 'client' : 'freelancer'
  );
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(true);

  const handleRegister = () => {
    // In production sends OTP via Supabase Auth / Hubtel SMS
    router.push({
      pathname: '/verify-otp',
      params: { phone, role },
    });
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
            <Text style={styles.title}>Join DevPay Africa</Text>
            <Text style={styles.subtitle}>
              Create your account to start collaborating with verified African talent and clients.
            </Text>
          </View>

          {/* Role Selector Card */}
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[styles.roleCard, role === 'freelancer' && styles.activeRoleCard]}
              onPress={() => setRole('freelancer')}
              activeOpacity={0.85}>
              <View style={[styles.roleIconCircle, role === 'freelancer' && styles.activeRoleIconCircle]}>
                <Ionicons
                  name="laptop-outline"
                  size={20}
                  color={role === 'freelancer' ? '#FFFFFF' : '#0F73F7'}
                />
              </View>
              <Text style={[styles.roleTitle, role === 'freelancer' && styles.activeRoleTitle]}>
                Work as Freelancer
              </Text>
              <Text style={styles.roleSub}>Find jobs &amp; get paid in MoMo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleCard, role === 'client' && styles.activeRoleCard]}
              onPress={() => setRole('client')}
              activeOpacity={0.85}>
              <View style={[styles.roleIconCircle, role === 'client' && styles.activeRoleIconCircle]}>
                <Ionicons
                  name="briefcase-outline"
                  size={20}
                  color={role === 'client' ? '#FFFFFF' : '#0F73F7'}
                />
              </View>
              <Text style={[styles.roleTitle, role === 'client' && styles.activeRoleTitle]}>
                Hire as Client
              </Text>
              <Text style={styles.roleSub}>Post jobs &amp; fund milestones</Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Full Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Full Legal Name</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={18} color={Colors.light.textMuted} style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Kwame Mensah"
                  placeholderTextColor={Colors.light.textMuted}
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
            </View>

            {/* Ghana Phone Number */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Ghana Phone Number (MoMo)</Text>
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

            {/* Email Address */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={18} color={Colors.light.textMuted} style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.textInput}
                  placeholder="kwame@example.com"
                  placeholderTextColor={Colors.light.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={18} color={Colors.light.textMuted} style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.textInput}
                  placeholder="At least 8 characters"
                  placeholderTextColor={Colors.light.textMuted}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>

            {/* Terms Agreement */}
            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => setAgreed(!agreed)}
              activeOpacity={0.8}>
              <Ionicons
                name={agreed ? 'checkbox' : 'square-outline'}
                size={20}
                color={agreed ? '#0F73F7' : Colors.light.textMuted}
              />
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.linkText}>Terms of Service</Text> and{' '}
                <Text style={styles.linkText}>Milestone Escrow Policy</Text>.
              </Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleRegister}
              activeOpacity={0.88}>
              <LinearGradient
                colors={['#0F73F7', '#38BDF8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}>
                <Text style={styles.submitButtonText}>Create Account</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Footer Link */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.signInLink}>Sign In</Text>
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
  },
  header: {
    marginTop: 18,
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
  roleContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  roleCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#EEF3FA',
    borderRadius: 18,
    padding: 14,
  },
  activeRoleCard: {
    borderColor: '#0F73F7',
    backgroundColor: '#F0F7FF',
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  roleIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EBF4FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  activeRoleIconCircle: {
    backgroundColor: '#0F73F7',
  },
  roleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.text,
  },
  activeRoleTitle: {
    color: '#0F73F7',
  },
  roleSub: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  formContainer: {
    marginTop: 20,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
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
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
    marginBottom: 16,
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  linkText: {
    color: '#0F73F7',
    fontWeight: '700',
  },
  submitButton: {
    height: 54,
    borderRadius: 27,
    overflow: 'hidden',
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
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },
  footerText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  signInLink: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F73F7',
  },
});
