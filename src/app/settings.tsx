import React, { ReactNode, useState } from 'react';
import { View, StyleSheet, ScrollView, Platform, Linking } from 'react-native';
import { Dialog } from '@/lib/dialog';
import { Text } from '@/components/ui-text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppLock, type LockTimeout } from '@/contexts/AppLockContext';
import { useWalletLock } from '@/contexts/WalletLockContext';
import { PinSheet } from '@/components/pin-sheet';
import { notificationsEnabled, requestPermission, setNotificationsEnabled } from '@/lib/notify';
import { useVerification } from '@/contexts/VerificationContext';
import {
  Avatar,
  GlassCard,
  ListRow,
  PressableScale,
  ScreenBackground,
  TopBar,
  Switch,
  Sheet,
  Field,
  Button,
} from '@/components/ds';
import { useAuth, useCurrentUser } from '@/contexts/AuthContext';
import { Layout, Radius, Shadows } from '@/constants/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const { isDark, toggleTheme, colors } = useTheme();
  const { verified, identity } = useVerification();
  const { biometricEnabled: biometrics, setBiometricEnabled: setBiometrics } = useAuth();
  const me = useCurrentUser();
  const lock = useAppLock();
  const wallet = useWalletLock();
  const [pinSheet, setPinSheet] = useState(false);
  const [timeoutSheet, setTimeoutSheet] = useState(false);
  const [passwordSheet, setPasswordSheet] = useState(false);
  const [lockPassword, setLockPassword] = useState('');
  const [lockError, setLockError] = useState<string>();

  const toggleAppLock = async (on: boolean) => {
    if (on && !lock.biometricLabel) return setPasswordSheet(true);
    const err = await lock.setEnabled(on);
    if (err) Dialog.alert('App lock', err);
  };

  const confirmPasswordLock = async () => {
    const err = await lock.setEnabled(true, lockPassword);
    if (err) return setLockError(err);
    setPasswordSheet(false);
    setLockPassword('');
    setLockError(undefined);
  };
  const [twoFactor, setTwoFactor] = useState(true);
  const [push, setPushState] = useState(notificationsEnabled());
  const setPush = async (on: boolean) => {
    if (on && !(await requestPermission())) {
      Dialog.alert('Notifications are off', Platform.OS === 'web' ? 'Notifications work in the mobile app.' : 'Allow notifications for DevPay in your phone’s Settings.', [
        { text: 'Not now', style: 'cancel' },
        ...(Platform.OS !== 'web' ? [{ text: 'Open Settings', onPress: () => Linking.openSettings() }] : []),
      ]);
      return;
    }
    setPushState(on);
    setNotificationsEnabled(on);
  };
  const [sms, setSms] = useState(true);
  const [email, setEmail] = useState(false);

  const toggleBiometrics = async (value: boolean) => {
    if (!value) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      return setBiometrics(false);
    }
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!hasHardware || !isEnrolled) {
        Dialog.alert('Biometrics unavailable', 'Set up Face ID or a fingerprint on this device first.');
        return;
      }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Confirm to turn on biometric sign-in',
        fallbackLabel: 'Use DevPay PIN',
      });
      Haptics.notificationAsync(result.success ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error).catch(() => {});
      if (result.success) setBiometrics(true);
    } catch {
      setBiometrics(value);
    }
  };

  const toggle = (value: boolean, set: (v: boolean) => void, label: string) => (
    <Switch
      value={value}
      onValueChange={set}
      trackColor={{ true: colors.primary, false: colors.backgroundSelected }}
      thumbColor="#FFFFFF"
      accessibilityLabel={label}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <ScreenBackground />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <TopBar title="Settings" />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <GlassCard onPress={() => router.push('/edit-profile')} style={styles.me} accessibilityLabel="Edit profile">
            <Avatar uri={me.avatar} size={52} ring={false} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.meName, { color: colors.text }]}>{me.name}</Text>
              <Text style={[styles.meSub, { color: colors.textSecondary }]}>{me.phone}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </GlassCard>

          <PressableScale onPress={() => router.push('/premium')} style={[styles.pro, Shadows.lifted]} accessibilityLabel="Upgrade to DevPay Pro">
            <View style={[styles.proInner, { backgroundColor: colors.feature }]}>
              <Ionicons name="diamond" size={22} color="#FFFFFF" />
              <View style={{ flex: 1 }}>
                <Text style={styles.proTitle}>DevPay Pro</Text>
                <Text style={styles.proSub}>Lower fees and featured proposals</Text>
              </View>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </View>
          </PressableScale>

          <Group title="Display">
            <ListRow icon="moon-outline" label="Dark mode" right={toggle(isDark, () => toggleTheme(), 'Dark mode')} />
            <ListRow icon="contrast-outline" label="Theme options" onPress={() => router.push('/appearance')} last />
          </Group>

          <Group title="Account">
            <ListRow icon="person-outline" label="Edit profile" onPress={() => router.push('/edit-profile')} />
            <ListRow
              icon="id-card-outline"
              label="Verification"
              value={verified ? 'Verified' : identity ? 'Fee due' : 'Not verified'}
              onPress={() => router.push('/verification')}
            />
            <ListRow
              icon="call-outline"
              label="Phone & email"
              onPress={() => Dialog.alert('Contact details', `${me.phone}${me.email ? `\n${me.email}` : ''}\nVerified by one-time code.`)}
              last
            />
          </Group>

          <Group title="Payments">
            <ListRow icon="phone-portrait-outline" label="Payout accounts" value="MTN MoMo" onPress={() => router.push('/withdraw')} />
            <ListRow icon="receipt-outline" label="Receipts" onPress={() => router.push('/receipts')} />
            <ListRow icon="cash-outline" label="Currency" value="GH₵" onPress={() => Dialog.alert('Currency', 'Your default currency is the Ghanaian cedi.')} />
            <ListRow
              icon="time-outline"
              label="Auto-release window"
              value="7 days"
              onPress={() => Dialog.alert('Auto-release', 'If a client doesn’t respond within 7 days of submission, the milestone releases to you automatically.')}
              last
            />
          </Group>

          <Group title="App lock">
            <ListRow
              icon={lock.biometricLabel?.startsWith('Face') ? 'scan-outline' : 'finger-print-outline'}
              label={`Lock app with ${lock.biometricLabel ?? 'password'}`}
              right={toggle(lock.enabled, toggleAppLock, 'App lock')}
              last={!lock.enabled}
            />
            {lock.enabled && (
              <>
                <ListRow icon="timer-outline" label="Require unlock" value={LOCK_LABEL[lock.timeout]} onPress={() => setTimeoutSheet(true)} />
                <ListRow icon="lock-closed-outline" label="Lock now" onPress={lock.lockNow} last />
              </>
            )}
          </Group>

          <Group title="Security">
            <ListRow
              icon="keypad-outline"
              label={wallet.hasPin ? 'Change wallet PIN' : 'Set wallet PIN'}
              value={wallet.hasPin ? 'On' : 'Not set'}
              onPress={() => setPinSheet(true)}
            />
            <ListRow icon="log-in-outline" label={`${lock.biometricLabel ?? 'Biometric'} sign-in`} right={toggle(biometrics, toggleBiometrics, 'Biometric sign-in')} />
            <ListRow icon="shield-checkmark-outline" label="Two-step verification" right={toggle(twoFactor, setTwoFactor, 'Two-step verification')} last />
          </Group>

          <Group title="Notifications">
            <ListRow icon="notifications-outline" label="Push notifications" right={toggle(push, setPush, 'Push notifications')} />
            <ListRow icon="chatbox-outline" label="SMS when escrow is funded" right={toggle(sms, setSms, 'SMS alerts')} />
            <ListRow icon="mail-outline" label="Weekly earnings email" right={toggle(email, setEmail, 'Weekly email')} last />
          </Group>

          <Group title="Support">
            <ListRow icon="help-circle-outline" label="Help & support" onPress={() => router.push('/help')} />
            <ListRow icon="document-text-outline" label="Policies" onPress={() => router.push('/legal')} />
            <ListRow icon="information-circle-outline" label="About DevPay" onPress={() => router.push('/about')} last />
          </Group>

          <Group>
            <ListRow icon="log-out-outline" label="Sign out" danger onPress={() => router.push('/logout')} />
            <ListRow icon="trash-outline" label="Delete account" danger onPress={() => router.push('/delete-account')} last />
          </Group>

          <Text style={[styles.version, { color: colors.textMuted }]}>DevPay 1.0.0</Text>
        </ScrollView>
      </SafeAreaView>

      <Sheet visible={timeoutSheet} onClose={() => setTimeoutSheet(false)} title="Require unlock">
        {([0, 60_000, 300_000] as LockTimeout[]).map((t, i) => (
          <ListRow
            key={t}
            icon="time-outline"
            label={LOCK_LABEL[t]}
            last={i === 2}
            right={lock.timeout === t ? <Ionicons name="checkmark-circle" size={20} color={colors.primary} /> : undefined}
            onPress={() => {
              lock.setTimeoutMs(t);
              setTimeoutSheet(false);
            }}
          />
        ))}
      </Sheet>

      <Sheet visible={passwordSheet} onClose={() => setPasswordSheet(false)} title="Turn on app lock">
        <Text style={[styles.sheetText, { color: colors.textSecondary }]}>
          This device has no Face ID or fingerprint set up, so DevPay will ask for your password instead.
        </Text>
        <Field
          icon="lock-closed-outline"
          placeholder="Your password"
          secureTextEntry
          value={lockPassword}
          onChangeText={(t) => {
            setLockPassword(t);
            setLockError(undefined);
          }}
          error={lockError}
          style={{ marginTop: 14 }}
        />
        <Button label="Turn on" onPress={confirmPasswordLock} style={{ marginTop: 14 }} />
      </Sheet>
      <PinSheet visible={pinSheet} mode={wallet.hasPin ? 'change' : 'create'} onClose={() => setPinSheet(false)} />
    </View>
  );
}

const LOCK_LABEL: Record<LockTimeout, string> = { 0: 'Immediately', 60_000: 'After 1 minute', 300_000: 'After 5 minutes' };

function Group({ title, children }: { title?: string; children: ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={{ marginTop: Layout.sectionGap }}>
      {title && <Text style={[styles.groupTitle, { color: colors.textSecondary }]}>{title}</Text>}
      <GlassCard padded={false} style={{ paddingHorizontal: 16 }}>
        {children}
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Layout.margin, paddingTop: 8, paddingBottom: 48 },
  me: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  meName: { fontSize: 16, fontWeight: '600' },
  meSub: { fontSize: 13, marginTop: 2 },
  pro: { marginTop: 14, borderRadius: Radius.lg },
  proInner: { borderRadius: Radius.lg, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 },
  proTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  proSub: { color: '#FFFFFF', fontSize: 12, fontWeight: '500', marginTop: 2 },
  groupTitle: { fontSize: 13, fontWeight: '500', marginBottom: 8, marginLeft: 4 },
  sheetText: { fontSize: 13, lineHeight: 19 },
  version: { textAlign: 'center', fontSize: 12, marginTop: 28 },
});
