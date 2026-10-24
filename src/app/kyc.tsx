import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { SuccessOverlay } from '@/components/success-overlay';

export default function KycScreen() {
  const router = useRouter();
  const [ghanaCardPin, setGhanaCardPin] = useState('GHA-729481029-4');
  const [cardName, setCardName] = useState('Kwame Mensah');
  const [frontUri, setFrontUri] = useState<string | null>(null);
  const [backUri, setBackUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerifiedOverlay, setShowVerifiedOverlay] = useState(false);

  const handlePickDocument = async (side: 'front' | 'back') => {
    Alert.alert(`Upload Ghana Card (${side === 'front' ? 'Front' : 'Back'})`, 'Select photo method', [
      {
        text: 'Take Photo of ID Card',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Camera access is required to photograph your ID card.');
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [16, 10],
            quality: 0.9,
          });
          if (!result.canceled && result.assets?.[0]?.uri) {
            if (side === 'front') setFrontUri(result.assets[0].uri);
            else setBackUri(result.assets[0].uri);
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        },
      },
      {
        text: 'Choose from Photo Library',
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Media library access is required.');
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [16, 10],
            quality: 0.9,
          });
          if (!result.canceled && result.assets?.[0]?.uri) {
            if (side === 'front') setFrontUri(result.assets[0].uri);
            else setBackUri(result.assets[0].uri);
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSubmit = async () => {
    if (!ghanaCardPin.trim()) {
      Alert.alert('Required', 'Please enter your Ghana Card PIN (e.g. GHA-123456789-0).');
      return;
    }
    setIsSubmitting(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setTimeout(async () => {
      setIsSubmitting(false);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowVerifiedOverlay(true);
    }, 1100);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Top Header */}
        <View style={styles.topNav}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color={Colors.light.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace('/')}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <View style={styles.badgeWrapper}>
            <Ionicons name="card-outline" size={26} color="#0F73F7" />
          </View>
          <Text style={styles.title}>Ghana Card Verification</Text>
          <Text style={styles.subtitle}>
            To protect milestone payments and unlock proposal submissions, verify your identity using your official Ghana Card.
          </Text>
        </View>

        {/* Trust Alert Box */}
        <View style={styles.trustBox}>
          <Ionicons name="shield-checkmark" size={18} color="#10B981" />
          <Text style={styles.trustText}>
            Identity data is verified through authorized partners. Your sensitive identity information is encrypted and protected.
          </Text>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Name on Ghana Card</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={18} color={Colors.light.textMuted} style={{ marginRight: 8 }} />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Kwame Mensah"
                placeholderTextColor={Colors.light.textMuted}
                value={cardName}
                onChangeText={setCardName}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Ghana Card PIN</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="id-card-outline" size={18} color={Colors.light.textMuted} style={{ marginRight: 8 }} />
              <TextInput
                style={styles.textInput}
                placeholder="GHA-123456789-0"
                placeholderTextColor={Colors.light.textMuted}
                autoCapitalize="characters"
                value={ghanaCardPin}
                onChangeText={setGhanaCardPin}
              />
            </View>
          </View>

          {/* Document Upload Cards */}
          <Text style={[styles.fieldLabel, { marginTop: 10 }]}>Document Photos</Text>

          <View style={styles.uploadRow}>
            {/* Front Upload */}
            <TouchableOpacity
              style={[styles.uploadBox, frontUri && styles.uploadBoxDone]}
              onPress={() => handlePickDocument('front')}
              activeOpacity={0.85}>
              {frontUri ? (
                <Image source={{ uri: frontUri }} style={styles.previewCardImg} />
              ) : (
                <Ionicons name="camera-outline" size={26} color="#0F73F7" />
              )}
              <Text style={styles.uploadTitle}>Card Front</Text>
              <Text style={styles.uploadSub}>
                {frontUri ? 'Photo Selected ✓' : 'Tap to photograph'}
              </Text>
            </TouchableOpacity>

            {/* Back Upload */}
            <TouchableOpacity
              style={[styles.uploadBox, backUri && styles.uploadBoxDone]}
              onPress={() => handlePickDocument('back')}
              activeOpacity={0.85}>
              {backUri ? (
                <Image source={{ uri: backUri }} style={styles.previewCardImg} />
              ) : (
                <Ionicons name="camera-outline" size={26} color="#0F73F7" />
              )}
              <Text style={styles.uploadTitle}>Card Back</Text>
              <Text style={styles.uploadSub}>
                {backUri ? 'Photo Selected ✓' : 'Tap to photograph'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.88}>
            <LinearGradient
              colors={['#0F73F7', '#38BDF8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientBtn}>
              <Text style={styles.submitBtnText}>
                {isSubmitting ? 'Verifying with Partner...' : 'Submit Verification'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Verification Approval Overlay */}
      <SuccessOverlay
        visible={showVerifiedOverlay}
        type="verified"
        title="Identity Verified! 🎉"
        subtitle="Your Ghana Card (NIA) has been successfully verified. The Trusted Freelancer badge is now active on your DevPay profile."
        onDismiss={() => {
          setShowVerifiedOverlay(false);
          router.replace('/');
        }}
        dismissLabel="Go to Dashboard"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  skipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  titleSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  badgeWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EBF4FE',
    borderWidth: 1.5,
    borderColor: '#D4E6FC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
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
    lineHeight: 19,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 12,
  },
  trustBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    borderRadius: 14,
    padding: 12,
    marginTop: 20,
  },
  trustText: {
    flex: 1,
    fontSize: 12,
    color: '#166534',
    lineHeight: 17,
  },
  form: {
    marginTop: 22,
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
  uploadRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  uploadBox: {
    flex: 1,
    height: 120,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  uploadBoxDone: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
    borderStyle: 'solid',
  },
  previewCardImg: {
    width: 48,
    height: 32,
    borderRadius: 6,
    marginBottom: 4,
  },
  uploadTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.text,
    marginTop: 8,
  },
  uploadSub: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  submitBtn: {
    height: 54,
    borderRadius: 27,
    overflow: 'hidden',
    marginTop: 28,
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  gradientBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
