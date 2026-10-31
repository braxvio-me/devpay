import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { AuthShell, PhoneField } from '@/components/auth-shell';
import { Avatar, Button, Chip, Field } from '@/components/ds';
import { CurrentUser } from '@/constants/media';
import { pickImage } from '@/hooks/pick-image';

const CATEGORIES = ['Tech & Dev', 'UI/UX Design', 'Mobile Apps', 'Writing', 'Marketing', 'Fintech'];
const SKILLS = ['React Native', 'TypeScript', 'Expo', 'UI/UX Design', 'Figma', 'Next.js', 'MoMo APIs', 'Supabase', 'Flutter', 'Node.js'];

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [avatarUri, setAvatarUri] = useState(CurrentUser.avatar);
  const [headline, setHeadline] = useState('');
  const [category, setCategory] = useState('Tech & Dev');
  const [hourlyRate, setHourlyRate] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>(['React Native', 'TypeScript']);
  const [momo, setMomo] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleSkill = (s: string) => setSkills((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const finish = () => {
    setSubmitted(true);
    if (!headline.trim()) return;
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert('Profile created', 'Verify your Ghana Card next to earn the Trusted badge.', [
        { text: 'Verify Ghana Card', onPress: () => router.push('/kyc') },
        { text: 'Go to Home', onPress: () => router.replace('/'), style: 'cancel' },
      ]);
    }, 800);
  };

  return (
    <AuthShell
      title="Set up your profile"
      subtitle="Clients see this when you apply. You can edit it later."
      right={
        <Pressable onPress={() => router.replace('/')} hitSlop={10} accessibilityRole="button">
          <Text style={[styles.skip, { color: colors.textSecondary }]}>Skip</Text>
        </Pressable>
      }
      footer={<Button label="Finish Setup" loading={isSaving} onPress={finish} />}>
      <View style={styles.avatarRow}>
        <View>
          <Avatar uri={avatarUri} size={92} />
          <Pressable
            onPress={async () => {
              const uri = await pickImage('Profile photo');
              if (uri) setAvatarUri(uri);
            }}
            accessibilityRole="button"
            accessibilityLabel="Change profile photo"
            style={[styles.camera, { backgroundColor: colors.primary, borderColor: colors.surface }]}>
            <Ionicons name="camera" size={15} color={colors.onPrimary} />
          </Pressable>
        </View>
      </View>

      <Field
        label="Headline"
        icon="sparkles-outline"
        placeholder="e.g. Senior React Native Engineer"
        value={headline}
        onChangeText={setHeadline}
        error={submitted && !headline.trim() ? 'Add a headline so clients know what you do.' : undefined}
      />

      <View style={{ gap: 10 }}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Main category</Text>
        <View style={styles.wrap}>
          {CATEGORIES.map((c) => (
            <Chip key={c} label={c} size="sm" selected={category === c} onPress={() => setCategory(c)} />
          ))}
        </View>
      </View>

      <Field
        label="Hourly rate (GH₵)"
        icon="cash-outline"
        placeholder="e.g. 150"
        keyboardType="number-pad"
        value={hourlyRate}
        onChangeText={(t) => setHourlyRate(t.replace(/\D/g, ''))}
      />

      <Field
        label="About you"
        placeholder="What you build, who you’ve worked with, what you’re great at."
        multiline
        value={bio}
        onChangeText={setBio}
      />

      <View style={{ gap: 10 }}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Skills · {skills.length} selected</Text>
        <View style={styles.wrap}>
          {SKILLS.map((s) => (
            <Chip
              key={s}
              label={s}
              size="sm"
              icon={skills.includes(s) ? 'checkmark' : undefined}
              selected={skills.includes(s)}
              onPress={() => toggleSkill(s)}
            />
          ))}
        </View>
      </View>

      <PhoneField label="Mobile Money number for payouts" value={momo} onChangeText={setMomo} />
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  skip: { fontSize: 14, fontWeight: '500' },
  avatarRow: { alignItems: 'center' },
  camera: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 13, fontWeight: '500' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
