import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';

export default function VerifyOtpScreen() {
  const router = useRouter();
  const { phone, role } = useLocalSearchParams();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);
  const inputRefs = useRef<any[]>([]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChangeText = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text.length > 0 && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    // If freelancer, guide to Profile Filling setup, otherwise go to home
    if (role === 'freelancer') {
      router.push('/profile-setup');
    } else {
      router.replace('/');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <View style={styles.content}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color={Colors.light.text} />
          </TouchableOpacity>

          {/* Heading */}
          <View style={styles.header}>
            <View style={styles.shieldPill}>
              <Ionicons name="key-outline" size={24} color="#0F73F7" />
            </View>
            <Text style={styles.title}>Enter Verification Code</Text>
            <Text style={styles.subtitle}>
              We sent a 6-digit security code via SMS to{' '}
              <Text style={styles.boldPhone}>+233 {phone || '24 123 4567'}</Text>.
            </Text>
          </View>

          {/* 6 Digit Input Boxes */}
          <View style={styles.otpRow}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={[
                  styles.otpBox,
                  digit !== '' && styles.otpBoxFilled,
                ]}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleChangeText(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Resend Timer */}
          <View style={styles.resendRow}>
            {timer > 0 ? (
              <Text style={styles.resendTimerText}>
                Resend code in <Text style={styles.timerBold}>{timer}s</Text>
              </Text>
            ) : (
              <TouchableOpacity onPress={() => setTimer(45)}>
                <Text style={styles.resendActionText}>Resend Code via SMS</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Primary Action Button */}
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={handleVerify}
            activeOpacity={0.88}>
            <LinearGradient
              colors={['#0F73F7', '#38BDF8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}>
              <Text style={styles.verifyButtonText}>Verify & Continue</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.changePhoneRow}
            onPress={() => router.back()}>
            <Text style={styles.changePhoneText}>Wrong phone number? Change</Text>
          </TouchableOpacity>
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
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
    alignItems: 'center',
    marginTop: 24,
  },
  shieldPill: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EBF4FE',
    borderWidth: 1,
    borderColor: '#D4E6FC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.light.text,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  boldPhone: {
    fontWeight: '700',
    color: Colors.light.text,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    paddingHorizontal: 6,
  },
  otpBox: {
    width: 46,
    height: 54,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#EEF3FA',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
    color: Colors.light.text,
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  otpBoxFilled: {
    borderColor: '#0F73F7',
    backgroundColor: '#F0F7FF',
  },
  resendRow: {
    alignItems: 'center',
    marginTop: 24,
  },
  resendTimerText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  timerBold: {
    fontWeight: '700',
    color: '#0F73F7',
  },
  resendActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F73F7',
  },
  verifyButton: {
    height: 54,
    borderRadius: 27,
    overflow: 'hidden',
    marginTop: 32,
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  gradientButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  changePhoneRow: {
    alignItems: 'center',
    marginTop: 20,
  },
  changePhoneText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
});
