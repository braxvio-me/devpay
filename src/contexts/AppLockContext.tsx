/**
 * App lock — Face ID / fingerprint (or password) to open DevPay.
 *
 * - Locks on launch and when the app returns after `timeout` in the background.
 * - Shows a privacy cover whenever the app is not active, so balances never appear in the app switcher.
 * - Settings are per device.
 */
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { useAuth } from '@/contexts/AuthContext';

export type LockTimeout = 0 | 60_000 | 300_000;

interface Settings {
  enabled: boolean;
  timeout: LockTimeout;
}

interface AppLockValue extends Settings {
  locked: boolean;
  covered: boolean;
  /** "Face ID", "Touch ID", "Fingerprint", "Face unlock" — or null when the device has none. */
  biometricLabel: string | null;
  unlockWithBiometrics: () => Promise<boolean>;
  /** Runs the system Face ID / fingerprint prompt. False when the device has none or it fails. */
  authenticate: (promptMessage: string) => Promise<boolean>;
  unlockWithPassword: (password: string) => Promise<boolean>;
  /** Turning on requires a successful biometric (or password) check. */
  setEnabled: (on: boolean, password?: string) => Promise<string | null>;
  setTimeoutMs: (t: LockTimeout) => void;
  /** Sign out from the lock screen and clear the lock for whoever signs in next. */
  signOutFromLock: () => void;
  lockNow: () => void;
}

const KEY = 'devpay_app_lock';
const DEFAULTS: Settings = { enabled: false, timeout: 0 };

const AppLockContext = createContext<AppLockValue | null>(null);

async function detectBiometric(): Promise<string | null> {
  if (Platform.OS === 'web') return null;
  try {
    if (!(await LocalAuthentication.hasHardwareAsync()) || !(await LocalAuthentication.isEnrolledAsync())) return null;
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    const face = types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);
    const finger = types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT);
    if (Platform.OS === 'ios') return face ? 'Face ID' : finger ? 'Touch ID' : null;
    return finger ? 'Fingerprint' : face ? 'Face unlock' : null;
  } catch {
    return null;
  }
}

export function AppLockProvider({ children }: { children: ReactNode }) {
  const { user, ready, verifyPassword, signOut } = useAuth();
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);
  const [locked, setLocked] = useState(false);
  const [covered, setCovered] = useState(false);
  const [biometricLabel, setBiometricLabel] = useState<string | null>(null);
  const backgroundedAt = useRef<number | null>(null);
  const lockedOnLaunch = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => raw && setSettings({ ...DEFAULTS, ...JSON.parse(raw) }))
      .catch(() => {})
      .finally(() => setLoaded(true));
    detectBiometric().then(setBiometricLabel);
  }, []);

  // Lock once on launch when a signed-in user has app lock on (scheduled, not set during the effect).
  useEffect(() => {
    if (!ready || !loaded || lockedOnLaunch.current) return;
    lockedOnLaunch.current = true;
    if (!user || !settings.enabled) return;
    setTimeout(() => setLocked(true), 0);
  }, [loaded, ready, settings.enabled, user]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        setCovered(false);
        const away = backgroundedAt.current ? Date.now() - backgroundedAt.current : 0;
        backgroundedAt.current = null;
        if (settings.enabled && user && away >= settings.timeout && away > 0) setLocked(true);
      } else {
        if (settings.enabled && user) setCovered(true);
        if (state === 'background' && backgroundedAt.current === null) backgroundedAt.current = Date.now();
      }
    });
    return () => sub.remove();
  }, [settings.enabled, settings.timeout, user]);

  const save = useCallback((next: Settings) => {
    setSettings(next);
    AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const authenticate = useCallback(
    async (promptMessage: string) => {
      if (!biometricLabel) return false;
      const r = await LocalAuthentication.authenticateAsync({
        promptMessage,
        cancelLabel: 'Cancel',
        fallbackLabel: '',
        disableDeviceFallback: true,
        biometricsSecurityLevel: 'strong',
      }).catch(() => ({ success: false }));
      return r.success;
    },
    [biometricLabel]
  );

  const unlockWithBiometrics = useCallback(async () => {
    const ok = await authenticate('Unlock DevPay');
    if (ok) setLocked(false);
    return ok;
  }, [authenticate]);

  const unlockWithPassword = useCallback(
    async (password: string) => {
      const ok = await verifyPassword(password);
      if (ok) setLocked(false);
      return ok;
    },
    [verifyPassword]
  );

  const value = useMemo<AppLockValue>(
    () => ({
      ...settings,
      // A lock only applies while someone is signed in.
      locked: locked && !!user,
      covered: covered && !(locked && !!user),
      biometricLabel,
      unlockWithBiometrics,
      authenticate,
      unlockWithPassword,
      setEnabled: async (on, password) => {
        if (!on) {
          save({ ...settings, enabled: false });
          return null;
        }
        if (biometricLabel) {
          if (!(await authenticate(`Turn on ${biometricLabel}`))) return `${biometricLabel} wasn’t confirmed, so app lock stays off.`;
        } else if (!password || !(await verifyPassword(password))) {
          return 'Enter your password to turn on app lock.';
        }
        save({ ...settings, enabled: true });
        return null;
      },
      setTimeoutMs: (timeout) => save({ ...settings, timeout }),
      lockNow: () => setLocked(true),
      signOutFromLock: () => {
        setLocked(false);
        signOut();
      },
    }),
    [authenticate, biometricLabel, covered, locked, save, settings, signOut, unlockWithBiometrics, unlockWithPassword, user, verifyPassword]
  );

  return <AppLockContext.Provider value={value}>{children}</AppLockContext.Provider>;
}

export function useAppLock() {
  const ctx = useContext(AppLockContext);
  if (!ctx) throw new Error('useAppLock must be used inside AppLockProvider');
  return ctx;
}
