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
import { useTheme } from '@/contexts/ThemeContext';
import { useRole } from '@/contexts/RoleContext';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { SuccessOverlay } from '@/components/success-overlay';

export default function KycScreen() {
  const router = useRouter();
  const { isDark, colors } = useTheme();
  const { isClient } = useRole();

  // Freelancer state
  const [ghanaCardPin, setGhanaCardPin] = useState('GHA-729481029-4');
  const [cardName, setCardName] = useState('Kwame Mensah');

  // Client state
  const [businessName, setBusinessName] = useState('TechCorp Africa Ltd');
  const [tinNumber, setTinNumber] = useState('C0028192847');
  const [directorCardPin, setDirectorCardPin] = useState('GHA-882910394-1');

  const [frontUri, setFrontUri] = useState<string | null>(null);
  const [backUri, setBackUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerifiedOverlay, setShowVerifiedOverlay] = useState(false);

  const handlePickDocument = async (side: 'front' | 'back') => {
    const docLabel = isClient
      ? side === 'front'
        ? 'Certificate of Incorporation'
        : "Director's Ghana Card"
      : `Ghana Card (${side === 'front' ? 'Front' : 'Back'})`;

    Alert.alert(`Upload ${docLabel}`, 'Select upload source', [
      {
        text: 'Take Photo with Camera',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Camera access is required to photograph your document.');
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
    if (isClient) {
      if (!businessName.trim() || !tinNumber.trim()) {
        Alert.alert('Required', 'Please enter your Registered Business Name and GRA TIN Number.');
        return;
      }
    } else {
      if (!ghanaCardPin.trim()) {
        Alert.alert('Required', 'Please enter your Ghana Card PIN (e.g. GHA-123456789-0).');
        return;
      }
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Top Header */}
        <View style={styles.topNav}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => router.back()}
            activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace('/')}>
            <Text style={[styles.skipText, { color: colors.textSecondary }]}>Skip for now</Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <View style={[styles.badgeWrapper, { backgroundColor: isDark ? '#1E293B' : '#EBF4FE', borderColor: colors.border }]}>
            <Ionicons
              name={isClient ? 'business-outline' : 'card-outline'}
              size={26}
              color={colors.primary}
            />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            {isClient ? 'Business Registration & TIN Verification' : 'Ghana Card Verification'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {isClient
              ? "Verify your corporate identity with the Registrar General's Department (RGD) & Ghana Revenue Authority (GRA) to unlock unlimited escrow funding."
              : 'To protect milestone payments and unlock proposal submissions, verify your identity using your official Ghana Card.'}
          </Text>
        </View>

        {/* Trust Alert Box */}
        <View
          style={[
            styles.trustBox,
            {
              backgroundColor: isDark ? 'rgba(16, 185, 129, 0.12)' : '#F0FDF4',
              borderColor: isDark ? 'rgba(16, 185, 129, 0.25)' : '#DCFCE7',
            },
          ]}>
          <Ionicons name="shield-checkmark" size={18} color="#10B981" />
          <Text style={[styles.trustText, { color: isDark ? '#34D399' : '#166534' }]}>
            {isClient
              ? 'Corporate data is verified against GRA & Bank of Ghana regulatory frameworks. High-volume escrow funding is fully protected.'
              : 'Identity data is verified through authorized partners. Your sensitive identity information is encrypted and protected.'}
          </Text>
        </View>

        {/* Form Fields: Dual Mode */}
        <View style={styles.form}>
          {isClient ? (
            /* ========================================================================= */
            /* CLIENT KYC FIELDS                                                         */
            /* ========================================================================= */
            <>
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Registered Business Name</Text>
                <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Ionicons name="business-outline" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
                  <TextInput
                    style={[styles.textInput, { color: colors.text }]}
                    placeholder="e.g. TechCorp Africa Ltd"
                    placeholderTextColor={colors.textMuted}
                    value={businessName}
                    onChangeText={setBusinessName}
                  />
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Ghana Revenue Authority TIN / RGD Cert No.</Text>
                <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Ionicons name="receipt-outline" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
                  <TextInput
                    style={[styles.textInput, { color: colors.text }]}
                    placeholder="C0028192847"
                    placeholderTextColor={colors.textMuted}
                    autoCapitalize="characters"
                    value={tinNumber}
                    onChangeText={setTinNumber}
                  />
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Managing Director Ghana Card PIN</Text>
                <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Ionicons name="id-card-outline" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
                  <TextInput
                    style={[styles.textInput, { color: colors.text }]}
                    placeholder="GHA-123456789-0"
                    placeholderTextColor={colors.textMuted}
                    autoCapitalize="characters"
                    value={directorCardPin}
                    onChangeText={setDirectorCardPin}
                  />
                </View>
              </View>

              {/* Document Upload Cards */}
              <Text style={[styles.fieldLabel, { color: colors.text, marginTop: 10 }]}>Corporate Documents</Text>

              <View style={styles.uploadRow}>
                {/* Incorporation Upload */}
                <TouchableOpacity
                  style={[
                    styles.uploadBox,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                    frontUri && styles.uploadBoxDone,
                  ]}
                  onPress={() => handlePickDocument('front')}
                  activeOpacity={0.85}>
                  {frontUri ? (
                    <Image source={{ uri: frontUri }} style={styles.previewCardImg} />
                  ) : (
                    <Ionicons name="document-text-outline" size={26} color={colors.primary} />
                  )}
                  <Text style={[styles.uploadTitle, { color: colors.text }]}>RGD Certificate</Text>
                  <Text style={[styles.uploadSub, { color: colors.textSecondary }]}>
                    {frontUri ? 'Document Attached ✓' : 'Tap to upload PDF/Photo'}
                  </Text>
                </TouchableOpacity>

                {/* Director ID Upload */}
                <TouchableOpacity
                  style={[
                    styles.uploadBox,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                    backUri && styles.uploadBoxDone,
                  ]}
                  onPress={() => handlePickDocument('back')}
                  activeOpacity={0.85}>
                  {backUri ? (
                    <Image source={{ uri: backUri }} style={styles.previewCardImg} />
                  ) : (
                    <Ionicons name="camera-outline" size={26} color={colors.primary} />
                  )}
                  <Text style={[styles.uploadTitle, { color: colors.text }]}>Director&apos;s ID</Text>
                  <Text style={[styles.uploadSub, { color: colors.textSecondary }]}>
                    {backUri ? 'Photo Selected ✓' : 'Tap to photograph'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            /* ========================================================================= */
            /* FREELANCER KYC FIELDS                                                     */
            /* ========================================================================= */
            <>
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Name on Ghana Card</Text>
                <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Ionicons name="person-outline" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
                  <TextInput
                    style={[styles.textInput, { color: colors.text }]}
                    placeholder="e.g. Kwame Mensah"
                    placeholderTextColor={colors.textMuted}
                    value={cardName}
                    onChangeText={setCardName}
                  />
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Ghana Card PIN</Text>
                <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Ionicons name="id-card-outline" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
                  <TextInput
                    style={[styles.textInput, { color: colors.text }]}
                    placeholder="GHA-123456789-0"
                    placeholderTextColor={colors.textMuted}
                    autoCapitalize="characters"
                    value={ghanaCardPin}
                    onChangeText={setGhanaCardPin}
                  />
                </View>
              </View>

              {/* Document Upload Cards */}
              <Text style={[styles.fieldLabel, { color: colors.text, marginTop: 10 }]}>Document Photos</Text>

              <View style={styles.uploadRow}>
                {/* Front Upload */}
                <TouchableOpacity
                  style={[
                    styles.uploadBox,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                    frontUri && styles.uploadBoxDone,
                  ]}
                  onPress={() => handlePickDocument('front')}
                  activeOpacity={0.85}>
                  {frontUri ? (
                    <Image source={{ uri: frontUri }} style={styles.previewCardImg} />
                  ) : (
                    <Ionicons name="camera-outline" size={26} color={colors.primary} />
                  )}
                  <Text style={[styles.uploadTitle, { color: colors.text }]}>Card Front</Text>
                  <Text style={[styles.uploadSub, { color: colors.textSecondary }]}>
                    {frontUri ? 'Photo Selected ✓' : 'Tap to photograph'}
                  </Text>
                </TouchableOpacity>

                {/* Back Upload */}
                <TouchableOpacity
                  style={[
                    styles.uploadBox,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                    backUri && styles.uploadBoxDone,
                  ]}
                  onPress={() => handlePickDocument('back')}
                  activeOpacity={0.85}>
                  {backUri ? (
                    <Image source={{ uri: backUri }} style={styles.previewCardImg} />
                  ) : (
                    <Ionicons name="camera-outline" size={26} color={colors.primary} />
                  )}
                  <Text style={[styles.uploadTitle, { color: colors.text }]}>Card Back</Text>
                  <Text style={[styles.uploadSub, { color: colors.textSecondary }]}>
                    {backUri ? 'Photo Selected ✓' : 'Tap to photograph'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

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
        title={isClient ? 'Company Verified! 🏢' : 'Identity Verified! 🎉'}
        subtitle={
          isClient
            ? 'Your business registration and GRA TIN have been successfully validated. High-value escrow funding and verified hiring are now fully active.'
            : 'Your Ghana Card (NIA) has been successfully verified. The Trusted Freelancer badge is now active on your DevPay profile.'
        }
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
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  titleSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  badgeWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 12,
  },
  trustBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginTop: 20,
  },
  trustText: {
    flex: 1,
    fontSize: 12,
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
    marginBottom: 8,
  },
  inputWrapper: {
    height: 52,
    borderWidth: 1,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
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
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  uploadBoxDone: {
    borderColor: '#10B981',
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
    marginTop: 8,
  },
  uploadSub: {
    fontSize: 11,
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
