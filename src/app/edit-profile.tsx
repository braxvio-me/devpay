import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/ui-text';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { useRole } from '@/contexts/RoleContext';
import { Avatar, Button, Field, ScreenBackground, SectionHeader, TopBar } from '@/components/ds';
import { useAuth, useCurrentUser } from '@/contexts/AuthContext';
import { pickImage } from '@/hooks/pick-image';
import { SuccessOverlay } from '@/components/success-overlay';
import { Layout, Radius } from '@/constants/theme';

export default function EditProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isClient } = useRole();
  const insets = useSafeAreaInsets();

  const { updateProfile } = useAuth();
  const me = useCurrentUser();
  const [avatarUri, setAvatarUri] = useState(me.avatar);
  const [name, setName] = useState(me.name);
  const [headline, setHeadline] = useState(me.headline);
  const [rate, setRate] = useState('150');
  const [location, setLocation] = useState(me.location);
  const [bio, setBio] = useState(
    isClient
      ? 'We build learning tools used by 200,000 students across Ghana and hire verified engineers and designers for milestone projects.'
      : 'I build fast, reliable fintech apps with React Native and Expo, including MoMo checkout and payout flows. Six years shipping consumer apps across West Africa.'
  );
  const [tin, setTin] = useState('C0028192847');
  const [website, setWebsite] = useState('https://kentelabs.example');
  const [skills, setSkills] = useState(isClient ? ['React Native', 'UI/UX Design', 'NestJS'] : ['React Native', 'Expo', 'TypeScript', 'MoMo APIs', 'Supabase']);
  const [newSkill, setNewSkill] = useState('');
  const [github, setGithub] = useState('https://github.com/kwamemensah');
  const [portfolio, setPortfolio] = useState('https://kwamemensah.dev');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [nameError, setNameError] = useState<string>();
  const [skillError, setSkillError] = useState<string>();

  const addSkill = () => {
    const s = newSkill.trim();
    if (!s) return;
    if (skills.includes(s)) return setSkillError('Already on your profile.');
    setSkills([...skills, s]);
    setNewSkill('');
    setSkillError(undefined);
  };

  const save = () => {
    if (!name.trim()) return setNameError(isClient ? 'Enter your company name.' : 'Enter your full name.');
    setSaving(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setTimeout(() => {
      setSaving(false);
      updateProfile({ name: name.trim(), headline: headline.trim(), location: location.trim(), avatar: avatarUri });
      setSaved(true);
    }, 600);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScreenBackground />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <TopBar title={isClient ? 'Company profile' : 'Edit profile'} />
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.avatar}>
            <View>
              <Avatar uri={avatarUri} size={96} />
              <Pressable
                onPress={async () => {
                  const uri = await pickImage(isClient ? 'Company logo' : 'Profile photo');
                  if (uri) setAvatarUri(uri);
                }}
                accessibilityRole="button"
                accessibilityLabel="Change photo"
                style={[styles.camera, { backgroundColor: colors.primary, borderColor: colors.surface }]}>
                <Ionicons name="camera" size={15} color={colors.onPrimary} />
              </Pressable>
            </View>
          </View>

          <View style={styles.form}>
            <Field
              label={isClient ? 'Company name' : 'Full name'}
              icon={isClient ? 'business-outline' : 'person-outline'}
              value={name}
              onChangeText={(t) => {
                setName(t);
                setNameError(undefined);
              }}
              error={nameError}
            />
            <Field label={isClient ? 'What you do' : 'Headline'} icon="briefcase-outline" value={headline} onChangeText={setHeadline} />
            <View style={styles.two}>
              {!isClient && (
                <Field
                  label="Rate (GH₵/hr)"
                  icon="cash-outline"
                  keyboardType="number-pad"
                  value={rate}
                  onChangeText={(t) => setRate(t.replace(/\D/g, ''))}
                  style={{ flex: 1 }}
                />
              )}
              <Field label="Location" icon="location-outline" value={location} onChangeText={setLocation} style={{ flex: isClient ? 1 : 1.4 }} />
            </View>
            <Field label={isClient ? 'About the company' : 'About you'} multiline value={bio} onChangeText={setBio} />
          </View>

          <SectionHeader title={isClient ? 'Stacks you hire for' : 'Skills'} style={styles.gap} />
          <View style={styles.skills}>
            {skills.map((s) => (
              <Pressable
                key={s}
                onPress={() => setSkills(skills.filter((x) => x !== s))}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${s}`}
                style={[styles.skill, { backgroundColor: colors.primarySoft }]}>
                <Text style={[styles.skillText, { color: colors.primaryText }]}>{s}</Text>
                <Ionicons name="close" size={14} color={colors.primaryText} />
              </Pressable>
            ))}
          </View>
          <Field
            placeholder="Add a skill"
            icon="add"
            value={newSkill}
            onChangeText={(t) => {
              setNewSkill(t);
              setSkillError(undefined);
            }}
            onSubmitEditing={addSkill}
            returnKeyType="done"
            error={skillError}
            style={{ marginTop: 12 }}
            right={
              newSkill.trim() ? (
                <Pressable onPress={addSkill} hitSlop={8} accessibilityRole="button">
                  <Text style={[styles.add, { color: colors.primaryText }]}>Add</Text>
                </Pressable>
              ) : undefined
            }
          />

          <SectionHeader title={isClient ? 'Business details' : 'Links'} style={styles.gap} />
          <View style={styles.form}>
            {isClient ? (
              <>
                <Field label="GRA TIN" icon="receipt-outline" autoCapitalize="characters" value={tin} onChangeText={setTin} />
                <Field label="Website" icon="globe-outline" autoCapitalize="none" keyboardType="url" value={website} onChangeText={setWebsite} />
              </>
            ) : (
              <>
                <Field label="GitHub" icon="logo-github" autoCapitalize="none" keyboardType="url" value={github} onChangeText={setGithub} />
                <Field label="Portfolio" icon="globe-outline" autoCapitalize="none" keyboardType="url" value={portfolio} onChangeText={setPortfolio} />
              </>
            )}
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Button label="Save changes" loading={saving} onPress={save} />
        </View>
      </SafeAreaView>
      <SuccessOverlay visible={saved} title="Profile saved" autoClose={1100} onDismiss={() => {
        setSaved(false);
        router.back();
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Layout.margin, paddingTop: 8, paddingBottom: 32 },
  avatar: { alignItems: 'center', marginBottom: 20 },
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
  form: { gap: 16 },
  two: { flexDirection: 'row', gap: 12 },
  gap: { marginTop: Layout.sectionGap },
  skills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skill: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 32, paddingHorizontal: 12, borderRadius: Radius.pill },
  skillText: { fontSize: 13, fontWeight: '500' },
  add: { fontSize: 14, fontWeight: '600' },
  footer: { paddingHorizontal: Layout.margin, paddingTop: 10 },
});
