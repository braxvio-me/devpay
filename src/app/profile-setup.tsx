import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
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

export default function ProfileSetupScreen() {
  const router = useRouter();

  const [avatarUri, setAvatarUri] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
  );
  const [headline, setHeadline] = useState('Senior Mobile & React Native Engineer');

  const handlePickImage = async () => {
    Alert.alert('Upload Profile Photo', 'Select image source', [
      {
        text: 'Take Photo with Camera',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Camera permission is required to take a profile photo.');
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.85,
          });
          if (!result.canceled && result.assets?.[0]?.uri) {
            setAvatarUri(result.assets[0].uri);
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        },
      },
      {
        text: 'Choose from Photo Library',
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Media library permission is required to select a photo.');
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.85,
          });
          if (!result.canceled && result.assets?.[0]?.uri) {
            setAvatarUri(result.assets[0].uri);
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };
  const [category, setCategory] = useState('Tech & Dev');
  const [hourlyRate, setHourlyRate] = useState('150');
  const [bio, setBio] = useState(
    'Specialized in building high-performance cross-platform fintech apps with React Native, Expo SDK 58, and Mobile Money gateway integrations.'
  );
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'React Native',
    'TypeScript',
    'UI/UX Design',
    'Mobile Money APIs',
  ]);
  const [momoNumber, setMomoNumber] = useState('024 123 4567');
  const [isSaving, setIsSaving] = useState(false);

  const categories = [
    'Tech & Dev',
    'UI/UX Design',
    'Mobile Apps',
    'Writing',
    'Marketing',
    'Fintech',
  ];

  const suggestedSkills = [
    'React Native',
    'TypeScript',
    'Expo SDK 58',
    'UI/UX Design',
    'Figma',
    'Next.js',
    'Mobile Money APIs',
    'Supabase',
    'Flutter',
    'Node.js',
  ];

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleFinishSetup = () => {
    if (!headline.trim()) {
      Alert.alert('Required', 'Please enter your professional headline.');
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert(
        'Profile Created! 🎉',
        'Your freelancer profile is ready. Now link your Ghana Card ID to get the Trusted Freelancer verification badge.',
        [
          {
            text: 'Verify Ghana Card',
            onPress: () => router.push('/kyc'),
          },
          {
            text: 'Go to Dashboard',
            onPress: () => router.replace('/'),
            style: 'cancel',
          },
        ]
      );
    }, 800);
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color={Colors.light.text} />
          </TouchableOpacity>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>Step 3 of 3</Text>
          </View>
          <TouchableOpacity onPress={() => router.replace('/')} activeOpacity={0.8}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Headline */}
          <View style={styles.introBlock}>
            <Text style={styles.title}>Fill Out Your Profile</Text>
            <Text style={styles.subtitle}>
              Tell African clients about your engineering &amp; design skills to start receiving milestone offers.
            </Text>
          </View>

          {/* Avatar Upload */}
          <View style={styles.avatarWrap}>
            <View style={styles.avatarCircle}>
              <Image
                source={{
                  uri: avatarUri,
                }}
                style={styles.avatarImg}
              />
              <TouchableOpacity
                style={styles.cameraIconBadge}
                onPress={handlePickImage}
                activeOpacity={0.85}>
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.avatarHint}>Tap camera to change photo</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Professional Headline</Text>
            <TextInput
              style={styles.input}
              value={headline}
              onChangeText={setHeadline}
              placeholder="e.g. Senior Mobile & React Native Engineer"
              placeholderTextColor={Colors.light.textMuted}
            />
          </View>

          {/* Primary Category Pills */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Primary Category</Text>
            <View style={styles.categoriesRow}>
              {categories.map((cat) => {
                const isSelected = category === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
                    onPress={() => setCategory(cat)}
                    activeOpacity={0.8}>
                    <Text
                      style={[
                        styles.categoryPillText,
                        isSelected && styles.categoryPillTextActive,
                      ]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Hourly Rate */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Hourly Rate (GH₵)</Text>
            <View style={styles.rateInputRow}>
              <View style={styles.currencyPrefix}>
                <Text style={styles.currencyPrefixText}>GH₵</Text>
              </View>
              <TextInput
                style={styles.rateInput}
                value={hourlyRate}
                onChangeText={setHourlyRate}
                placeholder="150"
                keyboardType="numeric"
                placeholderTextColor={Colors.light.textMuted}
              />
              <Text style={styles.rateSuffix}>/ hour</Text>
            </View>
          </View>

          {/* Bio */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Professional Summary &amp; Bio</Text>
            <TextInput
              style={styles.bioInput}
              value={bio}
              onChangeText={setBio}
              placeholder="Highlight your previous milestone deliverables, tech stack, and experience..."
              placeholderTextColor={Colors.light.textMuted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Skills Picker */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Select Skills &amp; Frameworks</Text>
            <View style={styles.skillsWrapper}>
              {suggestedSkills.map((skill) => {
                const isPicked = selectedSkills.includes(skill);
                return (
                  <TouchableOpacity
                    key={skill}
                    style={[styles.skillChip, isPicked && styles.skillChipPicked]}
                    onPress={() => toggleSkill(skill)}
                    activeOpacity={0.8}>
                    {isPicked && (
                      <Ionicons name="checkmark" size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
                    )}
                    <Text
                      style={[
                        styles.skillChipText,
                        isPicked && styles.skillChipTextPicked,
                      ]}>
                      {skill}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Mobile Money Payout Phone */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Payout MTN MoMo / Telecel Cash Number</Text>
            <View style={styles.phoneInputWrap}>
              <View style={styles.phoneCodeBox}>
                <Text style={styles.flag}>🇬🇭</Text>
                <Text style={styles.codeText}>+233</Text>
              </View>
              <TextInput
                style={styles.phoneTextInput}
                value={momoNumber}
                onChangeText={setMomoNumber}
                placeholder="24 123 4567"
                keyboardType="phone-pad"
                placeholderTextColor={Colors.light.textMuted}
              />
            </View>
            <Text style={styles.fieldHint}>
              Milestone payouts will be released directly to this Mobile Money account.
            </Text>
          </View>

          {/* Submit CTA */}
          <TouchableOpacity
            style={styles.saveBtnWrapper}
            onPress={handleFinishSetup}
            disabled={isSaving}
            activeOpacity={0.9}>
            <LinearGradient
              colors={['#0F73F7', '#38BDF8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveGradient}>
              <Text style={styles.saveBtnText}>
                {isSaving ? 'Creating Profile...' : 'Complete Profile & Continue'}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </LinearGradient>
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
  stepBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  stepBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F73F7',
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  scrollContent: {
    padding: 20,
    gap: 18,
    paddingBottom: 40,
  },
  introBlock: {
    gap: 6,
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
  },
  avatarWrap: {
    alignItems: 'center',
    marginVertical: 4,
  },
  avatarCircle: {
    position: 'relative',
  },
  avatarImg: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#E2E8F0',
  },
  cameraIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0F73F7',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarHint: {
    fontSize: 12,
    color: Colors.light.textMuted,
    marginTop: 6,
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
  input: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEF3FA',
    paddingHorizontal: 14,
    fontSize: 14,
    color: Colors.light.text,
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF3FA',
  },
  categoryPillActive: {
    backgroundColor: '#0F73F7',
    borderColor: '#0F73F7',
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
  },
  rateInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEF3FA',
    paddingHorizontal: 14,
    height: 48,
  },
  currencyPrefix: {
    marginRight: 6,
  },
  currencyPrefixText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F73F7',
  },
  rateInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
  },
  rateSuffix: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  bioInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEF3FA',
    padding: 14,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.light.text,
    minHeight: 90,
  },
  skillsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF3FA',
  },
  skillChipPicked: {
    backgroundColor: '#0F73F7',
    borderColor: '#0F73F7',
  },
  skillChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  skillChipTextPicked: {
    color: '#FFFFFF',
  },
  phoneInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEF3FA',
    height: 48,
    overflow: 'hidden',
  },
  phoneCodeBox: {
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
  phoneTextInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 14,
    color: Colors.light.text,
  },
  fieldHint: {
    fontSize: 11,
    color: Colors.light.textMuted,
    marginTop: 2,
    marginLeft: 2,
  },
  saveBtnWrapper: {
    borderRadius: 27,
    overflow: 'hidden',
    marginTop: 10,
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  saveGradient: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
