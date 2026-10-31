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
import { useTheme } from '@/contexts/ThemeContext';
import { useRole } from '@/contexts/RoleContext';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

export default function EditProfileScreen() {
  const router = useRouter();
  const { isDark, colors } = useTheme();
  const { isClient } = useRole();

  // Freelancer profile state
  const [avatarUri, setAvatarUri] = useState(
    isClient
      ? 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=200'
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
  );
  const [name, setName] = useState(isClient ? 'TechCorp Africa Ltd' : 'Kwame Mensah');
  const [headline, setHeadline] = useState(
    isClient
      ? 'Enterprise Client • Digital Products & Fintech'
      : 'Senior Mobile & React Native Engineer'
  );
  const [rate, setRate] = useState('150');
  const [location, setLocation] = useState(isClient ? 'Airport City, Accra • Ghana' : 'Accra, Ghana');
  const [bio, setBio] = useState(
    isClient
      ? 'TechCorp Africa builds next-generation payment systems and financial infrastructure for West African enterprises. We partner with top-tier verified software engineers to build scalable mobile solutions.'
      : 'Specialized in building high-performance cross-platform fintech apps with React Native, Expo SDK 58, and Mobile Money gateway integrations. Over 6 years shipping consumer apps across Africa.'
  );

  // Client specific fields
  const [tinNumber, setTinNumber] = useState('C0028192847 - Verified');
  const [website, setWebsite] = useState('https://techcorp.africa');
  const [billingPhone, setBillingPhone] = useState('024 123 4567 (MTN MoMo Business)');

  // Freelancer specific fields
  const [skills, setSkills] = useState(
    isClient
      ? ['React Native', 'MoMo API Webhooks', 'UI/UX Design', 'NestJS Backend', 'PostgreSQL']
      : ['React Native', 'Expo SDK 58', 'TypeScript', 'UI/UX Design', 'Mobile Money APIs', 'Supabase']
  );
  const [newSkill, setNewSkill] = useState('');
  const [github, setGithub] = useState('https://github.com/kwamemensah');
  const [portfolioUrl, setPortfolioUrl] = useState('https://kwamemensah.dev');
  const [isSaving, setIsSaving] = useState(false);

  const handlePickImage = async () => {
    Alert.alert('Upload Photo', isClient ? 'Select company logo' : 'Select profile photo', [
      {
        text: 'Take Photo with Camera',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Camera permission is required.');
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
            Alert.alert('Permission Denied', 'Media library permission is required.');
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

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (skills.includes(newSkill.trim())) {
      Alert.alert('Duplicate Item', 'This tag is already on your profile.');
      return;
    }
    setSkills([...skills, newSkill.trim()]);
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Required', isClient ? 'Please enter company name.' : 'Please enter full name.');
      return;
    }
    setIsSaving(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert(
        'Profile Saved',
        isClient
          ? 'Company profile updated and visible to verified developers across DevPay.'
          : 'Your developer profile has been published to clients across DevPay.'
      );
      router.back();
    }, 600);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top Header */}
        <View
          style={[
            styles.header,
            { backgroundColor: colors.surface, borderBottomColor: colors.border },
          ]}>
          <TouchableOpacity
            style={[
              styles.backButton,
              { backgroundColor: colors.backgroundElement, borderColor: colors.border },
            ]}
            onPress={() => router.back()}
            activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {isClient ? 'Edit Company Profile' : 'Edit Developer Profile'}
          </Text>
          <TouchableOpacity
            style={[
              styles.saveBtn,
              { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' },
            ]}
            onPress={handleSave}
            disabled={isSaving}
            activeOpacity={0.8}>
            <Text style={[styles.saveBtnText, { color: colors.primary }]}>
              {isSaving ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Avatar Upload Preview */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrap}>
              <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
              <TouchableOpacity
                style={styles.cameraBadge}
                onPress={handlePickImage}
                activeOpacity={0.8}>
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Text style={[styles.avatarHint, { color: colors.textSecondary }]}>
              {isClient ? 'Tap camera to update company logo' : 'Tap camera to update profile photo'}
            </Text>
          </View>

          {/* Form Fields: Dual Mode */}
          {isClient ? (
            /* ========================================================================= */
            /* CLIENT EDIT PROFILE FIELDS                                                */
            /* ========================================================================= */
            <>
              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Company / Business Name</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. TechCorp Africa Ltd"
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Sector / Business Focus</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                  value={headline}
                  onChangeText={setHeadline}
                  placeholder="e.g. Fintech & Digital Payments"
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              <View style={styles.rowTwo}>
                <View style={[styles.formGroup, { flex: 1.2 }]}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>GRA TIN / Reg. No</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                    value={tinNumber}
                    onChangeText={setTinNumber}
                    placeholder="C0028192847"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>

                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>HQ Location</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                    value={location}
                    onChangeText={setLocation}
                    placeholder="Accra, Ghana"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Company Website</Text>
                <View style={styles.linkInputWrap}>
                  <Ionicons name="globe-outline" size={18} color={colors.primary} style={styles.linkIcon} />
                  <TextInput
                    style={[styles.input, styles.linkInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                    value={website}
                    onChangeText={setWebsite}
                    placeholder="https://company.com"
                    placeholderTextColor={colors.textMuted}
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>MoMo Billing / Corporate Wallet</Text>
                <View style={styles.linkInputWrap}>
                  <Ionicons name="phone-portrait-outline" size={18} color="#10B981" style={styles.linkIcon} />
                  <TextInput
                    style={[styles.input, styles.linkInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                    value={billingPhone}
                    onChangeText={setBillingPhone}
                    placeholder="024 XXX XXXX"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>About Company & Project Mission</Text>
                <TextInput
                  style={[styles.input, styles.bioInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Describe your company and the types of mobile apps or APIs you build..."
                  placeholderTextColor={colors.textMuted}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Preferred Tech Stacks for Hiring</Text>
                <View style={styles.addSkillRow}>
                  <TextInput
                    style={[styles.input, { flex: 1, backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                    value={newSkill}
                    onChangeText={setNewSkill}
                    placeholder="Add technology (e.g. Flutter, Kotlin)..."
                    placeholderTextColor={colors.textMuted}
                    onSubmitEditing={handleAddSkill}
                  />
                  <TouchableOpacity
                    style={styles.addSkillBtn}
                    onPress={handleAddSkill}
                    activeOpacity={0.85}>
                    <Ionicons name="add" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                <View style={styles.skillsChipsWrap}>
                  {skills.map((skill) => (
                    <View
                      key={skill}
                      style={[
                        styles.skillChip,
                        {
                          backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
                          borderColor: isDark ? '#334155' : '#BFDBFE',
                        },
                      ]}>
                      <Text style={[styles.skillChipText, { color: colors.primary }]}>{skill}</Text>
                      <TouchableOpacity
                        onPress={() => handleRemoveSkill(skill)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <Ionicons name="close-circle" size={16} color={colors.textSecondary} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            </>
          ) : (
            /* ========================================================================= */
            /* FREELANCER EDIT PROFILE FIELDS                                            */
            /* ========================================================================= */
            <>
              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Full Name</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Kwame Mensah"
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Professional Headline</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                  value={headline}
                  onChangeText={setHeadline}
                  placeholder="e.g. Senior Mobile & React Native Engineer"
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              <View style={styles.rowTwo}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Hourly Rate (GH₵)</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                    value={rate}
                    onChangeText={setRate}
                    placeholder="150"
                    keyboardType="numeric"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>

                <View style={[styles.formGroup, { flex: 1.2 }]}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Location</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                    value={location}
                    onChangeText={setLocation}
                    placeholder="Accra, Ghana"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Bio / Professional Summary</Text>
                <TextInput
                  style={[styles.input, styles.bioInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Describe your expertise, experience, and past deliverables..."
                  placeholderTextColor={colors.textMuted}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              {/* Skills Management */}
              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Skills & Technologies</Text>
                <View style={styles.addSkillRow}>
                  <TextInput
                    style={[styles.input, { flex: 1, backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                    value={newSkill}
                    onChangeText={setNewSkill}
                    placeholder="Add skill (e.g. Kotlin, Flutter)..."
                    placeholderTextColor={colors.textMuted}
                    onSubmitEditing={handleAddSkill}
                  />
                  <TouchableOpacity
                    style={styles.addSkillBtn}
                    onPress={handleAddSkill}
                    activeOpacity={0.85}>
                    <Ionicons name="add" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                <View style={styles.skillsChipsWrap}>
                  {skills.map((skill) => (
                    <View
                      key={skill}
                      style={[
                        styles.skillChip,
                        {
                          backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
                          borderColor: isDark ? '#334155' : '#BFDBFE',
                        },
                      ]}>
                      <Text style={[styles.skillChipText, { color: colors.primary }]}>{skill}</Text>
                      <TouchableOpacity
                        onPress={() => handleRemoveSkill(skill)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <Ionicons name="close-circle" size={16} color={colors.textSecondary} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>

              {/* Portfolio & Social Links */}
              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>GitHub Profile</Text>
                <View style={styles.linkInputWrap}>
                  <Ionicons name="logo-github" size={18} color={colors.text} style={styles.linkIcon} />
                  <TextInput
                    style={[styles.input, styles.linkInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                    value={github}
                    onChangeText={setGithub}
                    placeholder="https://github.com/..."
                    placeholderTextColor={colors.textMuted}
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Portfolio / Behance / Website</Text>
                <View style={styles.linkInputWrap}>
                  <Ionicons name="globe-outline" size={18} color={colors.primary} style={styles.linkIcon} />
                  <TextInput
                    style={[styles.input, styles.linkInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                    value={portfolioUrl}
                    onChangeText={setPortfolioUrl}
                    placeholder="https://..."
                    placeholderTextColor={colors.textMuted}
                    autoCapitalize="none"
                  />
                </View>
              </View>
            </>
          )}

          {/* Primary Save Button */}
          <TouchableOpacity
            style={styles.primarySaveBtn}
            onPress={handleSave}
            disabled={isSaving}
            activeOpacity={0.85}>
            <Text style={styles.primarySaveBtnText}>
              {isSaving
                ? 'Updating Profile...'
                : isClient
                ? 'Save & Publish Company Profile'
                : 'Save & Publish Profile'}
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
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  saveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
    gap: 18,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 8,
  },
  avatarImg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E2E8F0',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0F73F7',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarHint: {
    fontSize: 12,
  },
  formGroup: {
    gap: 6,
  },
  rowTwo: {
    flexDirection: 'row',
    gap: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 2,
  },
  input: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  bioInput: {
    height: 100,
    paddingTop: 12,
  },
  addSkillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  addSkillBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#0F73F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skillsChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  skillChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  linkInputWrap: {
    position: 'relative',
    justifyContent: 'center',
  },
  linkIcon: {
    position: 'absolute',
    left: 14,
    zIndex: 1,
  },
  linkInput: {
    paddingLeft: 42,
  },
  primarySaveBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#0F73F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#0F73F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  primarySaveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
