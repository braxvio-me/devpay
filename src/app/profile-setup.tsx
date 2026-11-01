import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components/ui-text';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { SlideInLeft, SlideInRight } from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth, useCurrentUser } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { AuthShell, PhoneField } from '@/components/auth-shell';
import { Avatar, Button, Chip, Field, Segmented, Switch } from '@/components/ds';
import { SuccessOverlay } from '@/components/success-overlay';
import { pickImage } from '@/hooks/pick-image';

const CITIES = ['Accra', 'Kumasi', 'Tema', 'Takoradi', 'Cape Coast', 'Tamale', 'Remote'];
const CATEGORIES = ['Tech & Dev', 'UI/UX Design', 'Mobile Apps', 'Writing', 'Marketing', 'Data'];
const SKILLS = ['React Native', 'TypeScript', 'Expo', 'Figma', 'Next.js', 'Node.js', 'MoMo APIs', 'Supabase', 'Flutter', 'Copywriting', 'SEO'];
const NETWORKS = ['MTN MoMo', 'Telecel Cash', 'AT Money'];
const INDUSTRIES = ['Fintech', 'E-commerce', 'Education', 'Health', 'Logistics', 'Media', 'Other'];
const TEAM = ['Just me', '2–10', '11–50', '50+'];
const BUDGETS = ['Under GH₵ 1k', 'GH₵ 1k–5k', 'GH₵ 5k–20k', 'GH₵ 20k+'];
const PAY = ['Mobile Money', 'Card', 'Bank transfer'];

type Level = 'Entry' | 'Mid-level' | 'Senior';
type Kind = 'Individual' | 'Company';

const STEPS = {
  freelancer: [
    { title: 'Tell us about you', sub: 'Clients see this first when you apply.' },
    { title: 'Your work', sub: 'Help us match you with the right jobs.' },
    { title: 'Getting paid', sub: 'Where your released milestones go.' },
  ],
  client: [
    { title: 'Tell us about you', sub: 'Freelancers see this when you invite them.' },
    { title: 'Your business', sub: 'Good context gets you better proposals.' },
    { title: 'What you hire for', sub: 'We’ll suggest talent that fits.' },
  ],
};

function Label({ children, hint }: { children: string; hint?: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.labelRow}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{children}</Text>
      {hint && <Text style={[styles.hint, { color: colors.textMuted }]}>{hint}</Text>}
    </View>
  );
}

function ChipGroup({ options, value, onChange, multi }: { options: string[]; value: string[]; onChange: (v: string[]) => void; multi?: boolean }) {
  return (
    <View style={styles.wrap}>
      {options.map((o) => {
        const on = value.includes(o);
        return (
          <Chip
            key={o}
            label={o}
            size="sm"
            icon={multi && on ? 'checkmark' : undefined}
            selected={on}
            onPress={() => onChange(multi ? (on ? value.filter((x) => x !== o) : [...value, o]) : [o])}
          />
        );
      })}
    </View>
  );
}

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { role, isClient } = useRole();
  const { updateProfile, markSetupDone } = useAuth();
  const me = useCurrentUser();

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [tried, setTried] = useState(false);
  const [done, setDone] = useState(false);

  // shared
  const [avatar, setAvatar] = useState(me.avatar);
  const [name, setName] = useState(me.name);
  const [city, setCity] = useState<string[]>([]);
  // freelancer
  const [headline, setHeadline] = useState('');
  const [category, setCategory] = useState<string[]>([]);
  const [level, setLevel] = useState<Level>('Mid-level');
  const [skills, setSkills] = useState<string[]>([]);
  const [rate, setRate] = useState('');
  const [bio, setBio] = useState('');
  const [network, setNetwork] = useState<string[]>(['MTN MoMo']);
  const [momo, setMomo] = useState('');
  const [available, setAvailable] = useState(true);
  // client
  const [kind, setKind] = useState<Kind>('Individual');
  const [industry, setIndustry] = useState<string[]>([]);
  const [team, setTeam] = useState<string[]>([]);
  const [about, setAbout] = useState('');
  const [website, setWebsite] = useState('');
  const [hireFor, setHireFor] = useState<string[]>([]);
  const [budget, setBudget] = useState<string[]>([]);
  const [pay, setPay] = useState<string[]>(['Mobile Money']);

  /** Errors for the current step only. */
  const errors: Record<string, string | undefined> = isClient
    ? [
        {
          name: name.trim().length < 2 ? (kind === 'Company' ? 'Enter your company name.' : 'Enter your full name.') : undefined,
          city: city.length === 0 ? 'Pick where you’re based.' : undefined,
        },
        {
          industry: industry.length === 0 ? 'Pick an industry.' : undefined,
          team: team.length === 0 ? 'Pick a team size.' : undefined,
          about: about.trim().length < 20 ? 'Write at least 20 characters.' : undefined,
        },
        {
          hireFor: hireFor.length === 0 ? 'Pick at least one kind of work.' : undefined,
          budget: budget.length === 0 ? 'Pick a typical budget.' : undefined,
        },
      ][step]
    : [
        {
          name: name.trim().length < 2 ? 'Enter your full name.' : undefined,
          headline: headline.trim().length < 4 ? 'Add a short headline, like “React Native developer”.' : undefined,
          city: city.length === 0 ? 'Pick where you’re based.' : undefined,
        },
        {
          category: category.length === 0 ? 'Pick your main category.' : undefined,
          skills: skills.length < 2 ? 'Pick at least 2 skills.' : undefined,
          rate: !Number(rate) ? 'Enter your hourly rate.' : undefined,
          bio: bio.trim().length < 40 ? `Write at least 40 characters (${bio.trim().length}/40).` : undefined,
        },
        {
          momo: momo.replace(/\s/g, '').length < 9 ? 'Enter a 9-digit Mobile Money number.' : undefined,
        },
      ][step];
  const err = (k: string) => (tried ? errors[k] : undefined);

  const next = () => {
    setTried(true);
    if (Object.values(errors).some(Boolean)) return;
    setTried(false);
    if (step < 2) {
      setDir(1);
      setStep(step + 1);
      return;
    }
    updateProfile({
      name: name.trim(),
      avatar,
      location: city[0],
      headline: isClient ? `${industry[0]} · ${kind}` : headline.trim(),
      details: isClient
        ? { kind, industry: industry[0], team: team[0], about: about.trim(), website: website.trim(), hireFor, budget: budget[0], payment: pay[0] }
        : { category: category[0], level, skills, rate, bio: bio.trim(), network: network[0], momo, available },
    });
    markSetupDone();
    setDone(true);
  };

  const back = () => {
    setTried(false);
    if (step === 0) {
      markSetupDone();
      router.back();
      return;
    }
    setDir(-1);
    setStep(step - 1);
  };

  const s = STEPS[role][step];

  return (
    <AuthShell
      title={s.title}
      subtitle={s.sub}
      step={{ index: step + 1, total: 3 }}
      onBack={back}
      right={
        <Pressable
          onPress={() => {
            markSetupDone();
            router.back();
          }}
          hitSlop={10}
          accessibilityRole="button">
          <Text style={[styles.skip, { color: colors.textSecondary }]}>Skip</Text>
        </Pressable>
      }
      footer={<Button label={step < 2 ? 'Continue' : 'Finish'} onPress={next} />}>
      <Animated.View key={step} entering={(dir === 1 ? SlideInRight : SlideInLeft).duration(260)} style={{ gap: 18 }}>
        {step === 0 && (
          <>
            <View style={styles.avatarRow}>
              <View>
                <Avatar uri={avatar} size={92} />
                <Pressable
                  onPress={async () => setAvatar((await pickImage(isClient ? 'Logo or photo' : 'Profile photo')) ?? avatar)}
                  accessibilityRole="button"
                  accessibilityLabel="Change photo"
                  style={[styles.camera, { backgroundColor: colors.action, borderColor: colors.surface }]}>
                  <Ionicons name="camera" size={15} color="#FFFFFF" />
                </Pressable>
              </View>
              <Text style={[styles.photoHint, { color: colors.textSecondary }]}>{isClient ? 'Add your logo or a photo' : 'A clear photo of your face builds trust'}</Text>
            </View>
            {isClient && (
              <Segmented<Kind>
                value={kind}
                onChange={setKind}
                options={[
                  { value: 'Individual', label: 'Individual', icon: 'person-outline' },
                  { value: 'Company', label: 'Company', icon: 'business-outline' },
                ]}
              />
            )}
            <Field
              label={isClient && kind === 'Company' ? 'Company name' : 'Full name'}
              icon={isClient && kind === 'Company' ? 'business-outline' : 'person-outline'}
              value={name}
              onChangeText={setName}
              error={err('name')}
            />
            {!isClient && (
              <Field label="Headline" icon="briefcase-outline" placeholder="e.g. React Native developer" value={headline} onChangeText={setHeadline} error={err('headline')} />
            )}
            <View>
              <Label>Where are you based?</Label>
              <ChipGroup options={CITIES} value={city} onChange={setCity} />
              {err('city') && <Text style={[styles.err, { color: colors.accentCoral }]}>{err('city')}</Text>}
            </View>
          </>
        )}

        {step === 1 && !isClient && (
          <>
            <View>
              <Label>Main category</Label>
              <ChipGroup options={CATEGORIES} value={category} onChange={setCategory} />
              {err('category') && <Text style={[styles.err, { color: colors.accentCoral }]}>{err('category')}</Text>}
            </View>
            <View>
              <Label>Experience</Label>
              <Segmented<Level>
                value={level}
                onChange={setLevel}
                options={[
                  { value: 'Entry', label: 'Entry' },
                  { value: 'Mid-level', label: 'Mid-level' },
                  { value: 'Senior', label: 'Senior' },
                ]}
              />
            </View>
            <View>
              <Label hint={`${skills.length} selected`}>Skills</Label>
              <ChipGroup options={SKILLS} value={skills} onChange={setSkills} multi />
              {err('skills') && <Text style={[styles.err, { color: colors.accentCoral }]}>{err('skills')}</Text>}
            </View>
            <Field label="Hourly rate (GH₵)" icon="cash-outline" placeholder="e.g. 120" keyboardType="number-pad" value={rate} onChangeText={(t) => setRate(t.replace(/\D/g, ''))} error={err('rate')} />
            <Field label="About you" placeholder="What you build, who you’ve worked with, what you’re great at." multiline value={bio} onChangeText={setBio} error={err('bio')} />
          </>
        )}

        {step === 2 && !isClient && (
          <>
            <View>
              <Label>Payout network</Label>
              <ChipGroup options={NETWORKS} value={network} onChange={setNetwork} />
            </View>
            <PhoneField label={`${network[0]} number`} value={momo} onChangeText={setMomo} error={err('momo')} />
            <View style={[styles.switchRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.switchTitle, { color: colors.text }]}>Open to new work</Text>
                <Text style={[styles.switchSub, { color: colors.textSecondary }]}>Clients can invite you to jobs</Text>
              </View>
              <Switch value={available} onValueChange={setAvailable} accessibilityLabel="Open to new work" />
            </View>
          </>
        )}

        {step === 1 && isClient && (
          <>
            <View>
              <Label>Industry</Label>
              <ChipGroup options={INDUSTRIES} value={industry} onChange={setIndustry} />
              {err('industry') && <Text style={[styles.err, { color: colors.accentCoral }]}>{err('industry')}</Text>}
            </View>
            <View>
              <Label>Team size</Label>
              <ChipGroup options={TEAM} value={team} onChange={setTeam} />
              {err('team') && <Text style={[styles.err, { color: colors.accentCoral }]}>{err('team')}</Text>}
            </View>
            <Field label={kind === 'Company' ? 'About the company' : 'About you'} placeholder="What you do and the kind of people you like to work with." multiline value={about} onChangeText={setAbout} error={err('about')} />
            <Field label="Website (optional)" icon="globe-outline" placeholder="https://" autoCapitalize="none" keyboardType="url" value={website} onChangeText={setWebsite} />
          </>
        )}

        {step === 2 && isClient && (
          <>
            <View>
              <Label hint={`${hireFor.length} selected`}>What do you hire for?</Label>
              <ChipGroup options={CATEGORIES} value={hireFor} onChange={setHireFor} multi />
              {err('hireFor') && <Text style={[styles.err, { color: colors.accentCoral }]}>{err('hireFor')}</Text>}
            </View>
            <View>
              <Label>Typical project budget</Label>
              <ChipGroup options={BUDGETS} value={budget} onChange={setBudget} />
              {err('budget') && <Text style={[styles.err, { color: colors.accentCoral }]}>{err('budget')}</Text>}
            </View>
            <View>
              <Label>How you’ll fund escrow</Label>
              <ChipGroup options={PAY} value={pay} onChange={setPay} />
            </View>
            <View style={[styles.note, { backgroundColor: colors.primaryWash }]}>
              <Ionicons name="shield-checkmark-outline" size={18} color={colors.primary} />
              <Text style={[styles.noteText, { color: colors.text }]}>Every milestone is held in escrow and only released when you approve the work.</Text>
            </View>
          </>
        )}
      </Animated.View>

      <SuccessOverlay
        visible={done}
        title="Your profile is ready"
        subtitle={isClient ? 'Get verified next so you can hire and fund escrow.' : 'Get verified next to earn the Verified badge.'}
        dismissLabel="Get verified"
        onDismiss={() => {
          setDone(false);
          router.replace('/verification');
        }}
      />
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  skip: { fontSize: 14, fontWeight: '500' },
  avatarRow: { alignItems: 'center', gap: 10 },
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
  photoHint: { fontSize: 12 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  label: { fontSize: 13, fontWeight: '500' },
  hint: { fontSize: 12 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  err: { fontSize: 12, marginTop: 8, marginLeft: 4 },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 20, borderWidth: 1 },
  switchTitle: { fontSize: 15, fontWeight: '600' },
  switchSub: { fontSize: 12, marginTop: 2 },
  note: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: 16, alignItems: 'flex-start' },
  noteText: { flex: 1, fontSize: 13, lineHeight: 19 },
});
