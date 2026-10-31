import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { useRole } from '@/contexts/RoleContext';
import { useVerification } from '@/contexts/VerificationContext';
import { AuthShell } from '@/components/auth-shell';
import { Button, Field } from '@/components/ds';
import { SuccessOverlay } from '@/components/success-overlay';
import { pickImage } from '@/hooks/pick-image';
import { Radius } from '@/constants/theme';

const PIN = /^GHA-\d{9}-\d$/;

export default function KycScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isClient } = useRole();
  const { completeIdentity } = useVerification();
  const { from } = useLocalSearchParams<{ from?: string }>();

  const [cardName, setCardName] = useState('');
  const [ghanaCardPin, setGhanaCardPin] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [tinNumber, setTinNumber] = useState('');
  const [directorCardPin, setDirectorCardPin] = useState('');
  const [frontUri, setFrontUri] = useState<string | null>(null);
  const [backUri, setBackUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [done, setDone] = useState(false);

  const errors = isClient
    ? {
        businessName: !businessName.trim() ? 'Enter your registered business name.' : undefined,
        tin: !tinNumber.trim() ? 'Enter your GRA TIN.' : undefined,
        pin: directorCardPin && !PIN.test(directorCardPin) ? 'Format: GHA-123456789-0' : undefined,
      }
    : {
        name: !cardName.trim() ? 'Enter the name exactly as on your card.' : undefined,
        pin: !PIN.test(ghanaCardPin) ? 'Format: GHA-123456789-0' : undefined,
      };
  const valid = Object.values(errors).every((e) => !e);

  const submit = () => {
    setSubmitted(true);
    if (!valid) return;
    setIsSubmitting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setTimeout(() => {
      setIsSubmitting(false);
      completeIdentity();
      setDone(true);
    }, 1100);
  };

  const pinInput = (t: string) => t.toUpperCase().replace(/[^A-Z0-9-]/g, '');

  return (
    <>
      <AuthShell
        title={isClient ? 'Verify your business' : 'Verify your Ghana Card'}
        subtitle={
          isClient
            ? 'We check your registration with the RGD and GRA before you can fund large escrows.'
            : 'Verified freelancers get the Trusted badge and can send proposals.'
        }
        right={
          <Pressable onPress={() => router.replace('/')} hitSlop={10} accessibilityRole="button">
            <Text style={[styles.skip, { color: colors.textSecondary }]}>Later</Text>
          </Pressable>
        }
        footer={<Button label="Submit for Verification" loading={isSubmitting} onPress={submit} />}>
        <View style={[styles.note, { backgroundColor: colors.greenSoft }]}>
          <Ionicons name="shield-checkmark" size={18} color={colors.accentGreen} />
          <Text style={[styles.noteText, { color: colors.text }]}>
            Your documents are encrypted and only used for verification.
          </Text>
        </View>

        {isClient ? (
          <>
            <Field
              label="Registered business name"
              icon="business-outline"
              placeholder="e.g. Kente Labs Ltd"
              value={businessName}
              onChangeText={setBusinessName}
              error={submitted ? errors.businessName : undefined}
            />
            <Field
              label="GRA TIN"
              icon="receipt-outline"
              placeholder="C0028192847"
              autoCapitalize="characters"
              value={tinNumber}
              onChangeText={(t) => setTinNumber(t.toUpperCase())}
              error={submitted ? errors.tin : undefined}
            />
            <Field
              label="Director’s Ghana Card PIN"
              icon="id-card-outline"
              placeholder="GHA-123456789-0"
              autoCapitalize="characters"
              value={directorCardPin}
              onChangeText={(t) => setDirectorCardPin(pinInput(t))}
              error={submitted ? errors.pin : undefined}
            />
          </>
        ) : (
          <>
            <Field
              label="Name on card"
              icon="person-outline"
              placeholder="e.g. Kwame Mensah"
              value={cardName}
              onChangeText={setCardName}
              error={submitted ? errors.name : undefined}
            />
            <Field
              label="Ghana Card PIN"
              icon="id-card-outline"
              placeholder="GHA-123456789-0"
              autoCapitalize="characters"
              value={ghanaCardPin}
              onChangeText={(t) => setGhanaCardPin(pinInput(t))}
              error={submitted ? errors.pin : undefined}
            />
          </>
        )}

        <Text style={[styles.label, { color: colors.textSecondary }]}>Document photos</Text>
        <View style={styles.uploads}>
          <Upload
            uri={frontUri}
            title={isClient ? 'Incorporation cert.' : 'Card front'}
            onPress={async () => setFrontUri((await pickImage(isClient ? 'Certificate of incorporation' : 'Ghana Card front', [16, 10])) ?? frontUri)}
          />
          <Upload
            uri={backUri}
            title={isClient ? 'Director’s ID' : 'Card back'}
            onPress={async () => setBackUri((await pickImage(isClient ? 'Director’s Ghana Card' : 'Ghana Card back', [16, 10])) ?? backUri)}
          />
        </View>
      </AuthShell>

      <SuccessOverlay
        visible={done}
        type="verified"
        title={isClient ? 'Documents approved' : 'Ghana Card approved'}
        subtitle="Step 1 is done. Pay the one-time fee to finish verification."
        onDismiss={() => {
          setDone(false);
          if (from === 'verification' && router.canGoBack()) router.back();
          else router.replace('/verification');
        }}
        dismissLabel="Continue"
      />
    </>
  );
}

function Upload({ uri, title, onPress }: { uri: string | null; title: string; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}${uri ? ', photo added' : ''}`}
      style={[
        styles.upload,
        { borderColor: uri ? colors.accentGreen : colors.backgroundSelected, backgroundColor: uri ? colors.greenSoft : colors.surface },
      ]}>
      {uri ? (
        <Image source={{ uri }} contentFit="cover" style={styles.preview} />
      ) : (
        <View style={[styles.uploadIcon, { backgroundColor: colors.primaryWash }]}>
          <Ionicons name="camera-outline" size={22} color={colors.primary} />
        </View>
      )}
      <Text style={[styles.uploadTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.uploadSub, { color: uri ? colors.accentGreen : colors.textSecondary }]}>
        {uri ? 'Photo added' : 'Tap to add'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  skip: { fontSize: 14, fontWeight: '500' },
  note: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: Radius.md },
  noteText: { flex: 1, fontSize: 13, lineHeight: 18 },
  label: { fontSize: 13, fontWeight: '500', marginBottom: -8 },
  uploads: { flexDirection: 'row', gap: 12 },
  upload: {
    flex: 1,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  uploadIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  preview: { width: '100%', height: 64, borderRadius: Radius.sm, marginBottom: 6 },
  uploadTitle: { fontSize: 13, fontWeight: '600' },
  uploadSub: { fontSize: 12 },
});
