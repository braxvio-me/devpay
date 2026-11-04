import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { Text } from '@/components/ui-text';
import { useTheme } from '@/contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth, useCurrentUser } from '@/contexts/AuthContext';
import { useAppLock } from '@/contexts/AppLockContext';
import { Avatar, Button, Field, Sheet } from '@/components/ds';
import { Dialog } from '@/lib/dialog';
import { POLICY_VERSION } from '@/constants/legal';
import { DevPayMark } from '@/components/devpay-mark';
import { Layout } from '@/constants/theme';

/** Full-screen app lock. Rendered above the app while `locked`. */
export function LockScreen() {
  const { colors } = useTheme();
  const me = useCurrentUser();
  const { locked, covered, biometricLabel, unlockWithBiometrics, unlockWithPassword, signOutFromLock } = useAppLock();
  const [usePassword, setUsePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const shake = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.get() }] }));

  // Ask for biometrics as soon as the lock appears.
  useEffect(() => {
    if (!locked || !biometricLabel) return;
    const t = setTimeout(() => unlockWithBiometrics(), 350);
    return () => clearTimeout(t);
  }, [biometricLabel, locked, unlockWithBiometrics]);

  if (covered) {
    return (
      <Animated.View entering={FadeIn.duration(120)} exiting={FadeOut.duration(150)} style={[StyleSheet.absoluteFill, styles.cover]}>
        <DevPayMark size={70} />
      </Animated.View>
    );
  }
  if (!locked) return null;

  const tryPassword = async () => {
    if (!password) return setError('Enter your password.');
    setBusy(true);
    const ok = await unlockWithPassword(password);
    setBusy(false);
    if (ok) {
      setPassword('');
      setError(undefined);
      setUsePassword(false);
      return;
    }
    setError('That password isn’t right.');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    shake.set(withSequence(withTiming(-10, { duration: 50 }), withTiming(10, { duration: 50 }), withTiming(-6, { duration: 50 }), withTiming(0, { duration: 50 })));
  };

  const faceish = biometricLabel === 'Face ID' || biometricLabel === 'Face unlock';

  return (
    <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(220)} style={[StyleSheet.absoluteFill, styles.root, { backgroundColor: colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={styles.body} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <DevPayMark size={28} />
          <View style={styles.center}>
            <Avatar uri={me.avatar} size={88} />
            <Text style={[styles.title, { color: colors.text }]} accessibilityRole="header">
              Welcome back, {me.name.split(' ')[0]}
            </Text>
            <Text style={[styles.sub, { color: colors.textSecondary }]}>DevPay is locked to keep your money safe.</Text>

            {!usePassword && biometricLabel ? (
              <Pressable
                onPress={() => unlockWithBiometrics()}
                accessibilityRole="button"
                accessibilityLabel={`Unlock with ${biometricLabel}`}
                style={({ pressed }) => [styles.bioBtn, { backgroundColor: colors.action, opacity: pressed ? 0.85 : 1 }]}>
                {faceish ? (
                  <Ionicons name="scan-circle" size={40} color="#FFFFFF" />
                ) : (
                  <Ionicons name="finger-print" size={42} color="#FFFFFF" />
                )}
              </Pressable>
            ) : (
              <Animated.View style={[styles.passwordBox, shakeStyle]}>
                <Field
                  icon="lock-closed-outline"
                  placeholder="Your DevPay password"
                  secureTextEntry
                  autoFocus
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t);
                    setError(undefined);
                  }}
                  onSubmitEditing={tryPassword}
                  error={error}
                />
                <Button label="Unlock" loading={busy} onPress={tryPassword} style={{ marginTop: 14 }} />
              </Animated.View>
            )}
          </View>

          <View style={styles.footer}>
            {biometricLabel && (
              <Pressable onPress={() => setUsePassword((v) => !v)} hitSlop={8} accessibilityRole="button">
                <Text style={[styles.link, { color: colors.primaryText }]}>
                  {usePassword ? `Use ${biometricLabel}` : 'Use password instead'}
                </Text>
              </Pressable>
            )}
            <Pressable onPress={signOutFromLock} hitSlop={8} accessibilityRole="button">
              <Text style={[styles.link, { color: colors.textSecondary }]}>Not you? Sign out</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { zIndex: 1500 },
  cover: { zIndex: 1500, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, alignItems: 'center', paddingHorizontal: Layout.margin, paddingTop: 24, paddingBottom: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch' },
  title: { fontSize: 24, fontWeight: '700', letterSpacing: -0.5, marginTop: 18 },
  sub: { fontSize: 14, marginTop: 6, textAlign: 'center' },
  bioBtn: { width: 92, height: 92, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginTop: 36 },
  passwordBox: { alignSelf: 'stretch', marginTop: 32 },
  footer: { alignItems: 'center', gap: 16 },
  link: { fontSize: 14, fontWeight: '500' },
});

/**
 * Once per account on this device, after sign-in, offer to lock DevPay with Face ID / fingerprint
 * so the app asks for it every time it opens.
 */
export function BiometricOffer() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { biometricLabel, enabled, locked, setEnabled } = useAppLock();
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const key = user ? `devpay_lock_offer_${user.id}` : null;
  const eligible = !!user && !user.isNew && user.acceptedPolicies?.version === POLICY_VERSION && !!biometricLabel && !enabled && !locked;

  useEffect(() => {
    if (!eligible || !key) return;
    let cancelled = false;
    AsyncStorage.getItem(key)
      .then((seen) => {
        if (!seen && !cancelled) setTimeout(() => !cancelled && setShow(true), 1200);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [eligible, key]);

  const close = () => {
    setShow(false);
    if (key) AsyncStorage.setItem(key, '1').catch(() => {});
  };

  const turnOn = async () => {
    setBusy(true);
    const err = await setEnabled(true);
    setBusy(false);
    if (err) return Dialog.alert('App lock', err);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    close();
  };

  if (!biometricLabel) return null;
  const faceish = biometricLabel === 'Face ID' || biometricLabel === 'Face unlock';

  return (
    <Sheet visible={show && eligible} onClose={close}>
      <View style={offerStyles.offer}>
        <View style={[offerStyles.offerIcon, { backgroundColor: colors.action }]}>
          {faceish ? (
            <Ionicons name="scan-circle" size={38} color="#FFFFFF" />
          ) : (
            <Ionicons name="finger-print" size={42} color="#FFFFFF" />
          )}
        </View>
        <Text style={[offerStyles.offerTitle, { color: colors.text }]} accessibilityRole="header">
          Unlock DevPay with {biometricLabel}
        </Text>
        <Text style={[offerStyles.offerSub, { color: colors.textSecondary }]}>
          Your escrow and payouts stay private. DevPay will ask for {biometricLabel} each time it opens. Change this anytime in Settings.
        </Text>
      </View>
      <Button label={`Turn on ${biometricLabel}`} loading={busy} onPress={turnOn} />
      <Button label="Not now" variant="ghost" onPress={close} style={{ marginTop: 4 }} />
    </Sheet>
  );
}

const offerStyles = StyleSheet.create({
  offer: { alignItems: 'center', paddingTop: 8, paddingBottom: 22 },
  offerIcon: { width: 84, height: 84, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  offerTitle: { fontSize: 20, fontWeight: '700', letterSpacing: -0.3, marginTop: 18, textAlign: 'center' },
  offerSub: { fontSize: 14, lineHeight: 20, marginTop: 8, textAlign: 'center', paddingHorizontal: 8 },
});
