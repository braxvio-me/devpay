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
import { Colors } from '@/constants/theme';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

export default function EditProfileScreen() {
  const router = useRouter();

  const [avatarUri, setAvatarUri] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
  );
  const [name, setName] = useState('Kwame Mensah');
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
  const [rate, setRate] = useState('150');
  const [location, setLocation] = useState('Accra, Ghana');
  const [bio, setBio] = useState(
    'Specialized in building high-performance cross-platform fintech apps with React Native, Expo SDK 58, and Mobile Money gateway integrations. Over 6 years shipping consumer apps across Africa.'
  );
  const [skills, setSkills] = useState([
    'React Native',
    'Expo SDK 58',
    'TypeScript',
    'UI/UX Design',
    'Mobile Money APIs',
    'Supabase',
  ]);
  const [newSkill, setNewSkill] = useState('');
  const [github, setGithub] = useState('https://github.com/kwamemensah');
  const [portfolioUrl, setPortfolioUrl] = useState('https://kwamemensah.dev');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (skills.includes(newSkill.trim())) {
      Alert.alert('Duplicate Skill', 'This skill is already on your profile.');
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
      Alert.alert('Required', 'Please enter your full name.');
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert('Profile Saved', 'Your profile updates have been published to clients across DevPay.');
      router.back();
    }, 600);
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            disabled={isSaving}
            activeOpacity={0.8}>
            <Text style={styles.saveBtnText}>{isSaving ? 'Saving...' : 'Save'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Avatar Upload Preview */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrap}>
              <Image
                source={{ uri: avatarUri }}
                style={styles.avatarImg}
              />
              <TouchableOpacity
                style={styles.cameraBadge}
                onPress={handlePickImage}
                activeOpacity={0.8}>
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.avatarHint}>Tap camera to update profile photo</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Kwame Mensah"
              placeholderTextColor={Colors.light.textMuted}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Professional Headline</Text>
            <TextInput
              style={styles.input}
              value={headline}
              onChangeText={setHeadline}
              placeholder="e.g. Senior Mobile & React Native Engineer"
              placeholderTextColor={Colors.light.textMuted}
            />
          </View>

          <View style={styles.rowTwo}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Hourly Rate (GH₵)</Text>
              <TextInput
                style={styles.input}
                value={rate}
                onChangeText={setRate}
                placeholder="150"
                keyboardType="numeric"
                placeholderTextColor={Colors.light.textMuted}
              />
            </View>

            <View style={[styles.formGroup, { flex: 1.2 }]}>
              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="Accra, Ghana"
                placeholderTextColor={Colors.light.textMuted}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Bio / Professional Summary</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={bio}
              onChangeText={setBio}
              placeholder="Describe your expertise, experience, and past deliverables..."
              placeholderTextColor={Colors.light.textMuted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Skills Management */}
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Skills & Technologies</Text>
            <View style={styles.addSkillRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={newSkill}
                onChangeText={setNewSkill}
                placeholder="Add skill (e.g. Kotlin, Flutter)..."
                placeholderTextColor={Colors.light.textMuted}
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
                <View key={skill} style={styles.skillChip}>
                  <Text style={styles.skillChipText}>{skill}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveSkill(skill)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="close-circle" size={16} color={Colors.light.textSecondary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* Portfolio & Social Links */}
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>GitHub Profile</Text>
            <View style={styles.linkInputWrap}>
              <Ionicons name="logo-github" size={18} color={Colors.light.text} style={styles.linkIcon} />
              <TextInput
                style={[styles.input, styles.linkInput]}
                value={github}
                onChangeText={setGithub}
                placeholder="https://github.com/..."
                placeholderTextColor={Colors.light.textMuted}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Portfolio / Behance / Website</Text>
            <View style={styles.linkInputWrap}>
              <Ionicons name="globe-outline" size={18} color="#0F73F7" style={styles.linkIcon} />
              <TextInput
                style={[styles.input, styles.linkInput]}
                value={portfolioUrl}
                onChangeText={setPortfolioUrl}
                placeholder="https://..."
                placeholderTextColor={Colors.light.textMuted}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Primary Save Button */}
          <TouchableOpacity
            style={styles.primarySaveBtn}
            onPress={handleSave}
            disabled={isSaving}
            activeOpacity={0.85}>
            <Text style={styles.primarySaveBtnText}>
              {isSaving ? 'Updating Profile...' : 'Save & Publish Profile'}
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
    borderBottomWidth: 1,
    borderBottomColor: '#EEF3FA',
    backgroundColor: '#FFFFFF',
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
  saveBtn: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F73F7',
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
    color: Colors.light.textMuted,
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
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  skillChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F73F7',
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
