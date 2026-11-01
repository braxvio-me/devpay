/**
 * Wallet PIN. Each account sets its own 4-digit PIN; the wallet card stays closed until it's entered.
 *
 * - The PIN is stored only as a SHA-256 hash (salted with the account id), in the device keychain/keystore
 *   via expo-secure-store (AsyncStorage on web, which has no secure store).
 * - The wallet closes again after 2 minutes, when the app goes to the background, or on sign-out.
 * - Five wrong tries lock PIN entry for 30 seconds.
 * The server must still check the PIN for payouts; see docs/BACKEND_HANDOFF.md.
 */
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { useAuth } from '@/contexts/AuthContext';

export const PIN_LENGTH = 4;
const RELOCK_MS = 120_000;
const MAX_TRIES = 5;
const COOLDOWN_MS = 30_000;

const store = {
  get: (k: string) => (Platform.OS === 'web' ? AsyncStorage.getItem(k) : SecureStore.getItemAsync(k)),
  set: (k: string, v: string) => (Platform.OS === 'web' ? AsyncStorage.setItem(k, v) : SecureStore.setItemAsync(k, v)),
  del: (k: string) => (Platform.OS === 'web' ? AsyncStorage.removeItem(k) : SecureStore.deleteItemAsync(k)),
};

interface WalletLockValue {
  /** null while loading */
  hasPin: boolean | null;
  unlocked: boolean;
  /** ms until PIN entry is allowed again, 0 when allowed */
  cooldownUntil: number;
  createPin: (pin: string) => Promise<void>;
  /** Checks the PIN and opens the wallet. Returns an error message or null. */
  unlock: (pin: string) => Promise<string | null>;
  /** Checks the PIN without opening the wallet (e.g. to approve a payout). */
  checkPin: (pin: string) => Promise<string | null>;
  lock: () => void;
  /** Forgot PIN: confirm the account password, then the user sets a new PIN. */
  resetWithPassword: (password: string) => Promise<string | null>;
}

const WalletLockContext = createContext<WalletLockValue | null>(null);

export function WalletLockProvider({ children }: { children: ReactNode }) {
  const { user, verifyPassword } = useAuth();
  const [hasPin, setHasPin] = useState<boolean | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const tries = useRef(0);
  const relock = useRef<ReturnType<typeof setTimeout> | null>(null);
  const key = user ? `devpay_wallet_pin_${user.id}` : null;

  const hash = useCallback((pin: string) => Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${user?.id}:${pin}`), [user?.id]);

  const lock = useCallback(() => {
    if (relock.current) clearTimeout(relock.current);
    setUnlocked(false);
  }, []);

  const open = useCallback(() => {
    setUnlocked(true);
    if (relock.current) clearTimeout(relock.current);
    relock.current = setTimeout(() => setUnlocked(false), RELOCK_MS);
  }, []);

  useEffect(() => {
    let cancelled = false;
    // Switching accounts always closes the wallet; then load whether this account has a PIN.
    setTimeout(() => !cancelled && lock(), 0);
    const load = key ? store.get(key).then((v) => !!v) : Promise.resolve(false);
    load.catch(() => false).then((has) => !cancelled && setHasPin(has));
    tries.current = 0;
    return () => {
      cancelled = true;
    };
  }, [key, lock]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => s !== 'active' && lock());
    return () => sub.remove();
  }, [lock]);

  const checkPin = useCallback(
    async (pin: string) => {
      if (!key) return 'Sign in first.';
      if (Date.now() < cooldownUntil) return `Too many tries. Wait ${Math.ceil((cooldownUntil - Date.now()) / 1000)} seconds.`;
      const saved = await store.get(key).catch(() => null);
      if (saved && saved === (await hash(pin))) {
        tries.current = 0;
        return null;
      }
      tries.current += 1;
      if (tries.current >= MAX_TRIES) {
        tries.current = 0;
        setCooldownUntil(Date.now() + COOLDOWN_MS);
        return 'Too many wrong tries. Wait 30 seconds.';
      }
      return `Wrong PIN. ${MAX_TRIES - tries.current} ${MAX_TRIES - tries.current === 1 ? 'try' : 'tries'} left.`;
    },
    [cooldownUntil, hash, key]
  );

  const value = useMemo<WalletLockValue>(
    () => ({
      hasPin,
      unlocked,
      cooldownUntil,
      lock,
      checkPin,
      createPin: async (pin) => {
        if (!key) return;
        await store.set(key, await hash(pin));
        setHasPin(true);
        open();
      },
      unlock: async (pin) => {
        const err = await checkPin(pin);
        if (!err) open();
        return err;
      },
      resetWithPassword: async (password) => {
        if (!key) return 'Sign in first.';
        if (!(await verifyPassword(password))) return 'That password isn’t right.';
        await store.del(key).catch(() => {});
        setHasPin(false);
        return null;
      },
    }),
    [checkPin, cooldownUntil, hasPin, hash, key, lock, open, unlocked, verifyPassword]
  );

  return <WalletLockContext.Provider value={value}>{children}</WalletLockContext.Provider>;
}

export function useWalletLock() {
  const ctx = useContext(WalletLockContext);
  if (!ctx) throw new Error('useWalletLock must be used inside WalletLockProvider');
  return ctx;
}
