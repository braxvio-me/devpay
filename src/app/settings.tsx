import React, { ReactNode, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { useVerification } from '@/contexts/VerificationContext';
import { Avatar, GlassCard, ListRow, PressableScale, ScreenBackground, TopBar } from '@/components/ds';
import { CurrentUser } from '@/constants/media';
import { Gradients, Layout, Radius, Shadows } from '@/constants/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const { isDark, toggleTheme, colors } = useTheme();
  const { verified, identity } = useVerification();
  const [biometrics, setBiometrics] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);
  const [push, setPush] = useState(true);
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
        Alert.alert('Biometrics unavailable', 'Set up Face ID or a fingerprint on this device first.');
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
            <Avatar uri={CurrentUser.avatar} size={52} ring={false} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.meName, { color: colors.text }]}>{CurrentUser.name}</Text>
              <Text style={[styles.meSub, { color: colors.textSecondary }]}>+233 24 123 4567</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </GlassCard>

          <PressableScale onPress={() => router.push('/premium')} style={[styles.pro, Shadows.lifted]} accessibilityLabel="Upgrade to DevPay Pro">
            <LinearGradient colors={Gradients.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.proInner}>
              <Ionicons name="diamond" size={22} color="#FFFFFF" />
              <View style={{ flex: 1 }}>
                <Text style={styles.proTitle}>DevPay Pro</Text>
                <Text style={styles.proSub}>Lower fees and featured proposals</Text>
              </View>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </LinearGradient>
          </PressableScale>

          <Group title="Display">
            <ListRow icon="moon-outline" label="Dark mode" right={toggle(isDark, () => toggleTheme(), 'Dark mode')} />
            <ListRow icon="contrast-outline" label="Theme options" onPress={() => router.push('/appearance')} last />
          </Group>

          <Group title="Account">
            <ListRow icon="person-outline" label="Edit profile" onPress={() => router.push('/edit-profile')} />
            <ListRow
              icon="shield-checkmark-outline"
              label="Verification"
              value={verified ? 'Verified' : identity ? 'Fee due' : 'Not verified'}
              onPress={() => router.push('/verification')}
            />
            <ListRow
              icon="call-outline"
              label="Phone & email"
              onPress={() => Alert.alert('Contact details', '+233 24 123 4567\nkwame@example.com\nBoth verified by one-time code.')}
              last
            />
          </Group>

          <Group title="Payments">
            <ListRow icon="phone-portrait-outline" label="Payout accounts" value="MTN MoMo" onPress={() => router.push('/withdraw')} />
            <ListRow icon="cash-outline" label="Currency" value="GH₵" onPress={() => Alert.alert('Currency', 'Your default currency is the Ghanaian cedi.')} />
            <ListRow
              icon="time-outline"
              label="Auto-release window"
              value="7 days"
              onPress={() => Alert.alert('Auto-release', 'If a client doesn’t respond within 7 days of submission, the milestone releases to you automatically.')}
              last
            />
          </Group>

          <Group title="Security">
            <ListRow
              icon="keypad-outline"
              label="Transaction PIN"
              onPress={() => Alert.alert('Transaction PIN', 'Your 4-digit PIN authorises escrow releases and MoMo withdrawals.')}
            />
            <ListRow icon="scan-outline" label="Face ID / fingerprint" right={toggle(biometrics, toggleBiometrics, 'Biometric sign-in')} />
            <ListRow icon="shield-checkmark-outline" label="Two-step verification" right={toggle(twoFactor, setTwoFactor, 'Two-step verification')} last />
          </Group>

          <Group title="Notifications">
            <ListRow icon="notifications-outline" label="Push notifications" right={toggle(push, setPush, 'Push notifications')} />
            <ListRow icon="chatbox-outline" label="SMS when escrow is funded" right={toggle(sms, setSms, 'SMS alerts')} />
            <ListRow icon="mail-outline" label="Weekly earnings email" right={toggle(email, setEmail, 'Weekly email')} last />
          </Group>

          <Group title="Support">
            <ListRow
              icon="help-buoy-outline"
              label="Disputes & arbitration"
              onPress={() => Alert.alert('Disputes', 'DevPay reviews submitted work, the contract and chat history to resolve milestone disputes.')}
            />
            <ListRow icon="document-text-outline" label="Terms of Service" onPress={() => router.push({ pathname: '/legal', params: { doc: 'terms' } })} />
            <ListRow icon="lock-closed-outline" label="Privacy Policy" onPress={() => router.push({ pathname: '/legal', params: { doc: 'privacy' } })} last />
          </Group>

          <Group>
            <ListRow icon="log-out-outline" label="Sign out" danger onPress={() => router.push('/logout')} />
            <ListRow icon="trash-outline" label="Delete account" danger onPress={() => router.push('/delete-account')} last />
          </Group>

          <Text style={[styles.version, { color: colors.textMuted }]}>DevPay 1.0.0</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

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
  version: { textAlign: 'center', fontSize: 12, marginTop: 28 },
});
