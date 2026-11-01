/**
 * AuthContext — accounts and session (frontend only until the backend exists).
 *
 * Rules:
 * - One account = one role. A phone number or email can belong to one account only,
 *   so the same person needs a second number/email to hold the other role.
 * - Passwords are stored as salted SHA-256 hashes on the device. Demo-grade only:
 *   the real backend must own credentials.
 */
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { CurrentUser, Portraits } from '@/constants/media';
import { POLICY_VERSION } from '@/constants/legal';

export type Role = 'freelancer' | 'client';

export interface Account {
  id: string;
  name: string;
  phone: string; // national digits, e.g. 241234567
  email?: string;
  role: Role;
  passwordHash: string;
  avatar: string;
  location: string;
  headline: string;
  createdAt: number;
  /** First sign-in after sign-up; drives profile setup. */
  isNew?: boolean;
  /** Answers from the first-time profile form. */
  details?: Record<string, string | string[] | boolean>;
  /** Policy version the user accepted, and when. */
  acceptedPolicies?: { version: string; at: number };
}

export interface SignUpDetails {
  name: string;
  phone: string;
  email?: string;
  password: string;
  role: Role;
}

interface AuthValue {
  ready: boolean;
  user: Account | null;
  /** Last account signed in on this device (for Face ID unlock). */
  lastUser: Pick<Account, 'id' | 'name' | 'avatar' | 'role'> | null;
  pending: Omit<SignUpDetails, 'password'> | null;
  biometricEnabled: boolean;
  setBiometricEnabled: (on: boolean) => void;
  signIn: (identifier: string, password: string) => Promise<string | null>;
  signInWithBiometrics: () => string | null;
  startSignUp: (details: SignUpDetails) => Promise<string | null>;
  completeSignUp: () => Promise<string | null>;
  findAccount: (identifier: string) => Account | undefined;
  /** Checks the signed-in user's password (app lock fallback). */
  verifyPassword: (password: string) => Promise<boolean>;
  resetPassword: (identifier: string, password: string) => Promise<string | null>;
  updateProfile: (patch: Partial<Pick<Account, 'name' | 'avatar' | 'location' | 'headline' | 'email' | 'details'>>) => void;
  markSetupDone: () => void;
  /** Record acceptance of the current policy version. */
  acceptPolicies: () => void;
  signOut: () => void;
  deleteAccount: () => void;
}

const K = {
  accounts: 'devpay_accounts',
  session: 'devpay_session',
  last: 'devpay_last_user',
  bio: 'devpay_biometric',
};

export const normalizePhone = (raw: string) => {
  let d = raw.replace(/\D/g, '');
  if (d.startsWith('233')) d = d.slice(3);
  if (d.startsWith('0')) d = d.slice(1);
  return d;
};

const hash = (phone: string, password: string) =>
  Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `devpay:${phone}:${password}`);

/** Demo accounts so both roles can be tried: password `devpay123`. */
async function seedAccounts(): Promise<Account[]> {
  return [
    {
      id: 'acc_freelancer',
      name: CurrentUser.name,
      phone: '241234567',
      email: 'kwame@example.com',
      role: 'freelancer',
      passwordHash: await hash('241234567', 'devpay123'),
      avatar: CurrentUser.avatar,
      location: CurrentUser.location,
      headline: 'Senior React Native Engineer',
      createdAt: Date.now(),
    },
    {
      id: 'acc_client',
      name: 'Abena Boateng',
      phone: '205550101',
      email: 'abena@kentelabs.example',
      role: 'client',
      passwordHash: await hash('205550101', 'devpay123'),
      avatar: Portraits.naomi,
      location: 'Airport City, Accra',
      headline: 'Hiring for Kente Labs',
      createdAt: Date.now(),
    },
  ];
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [lastId, setLastId] = useState<string | null>(null);
  const [biometricEnabled, setBio] = useState(true);
  const [pending, setPending] = useState<(SignUpDetails & { passwordHash: string }) | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [rawAccounts, session, last, bio] = await Promise.all([
          AsyncStorage.getItem(K.accounts),
          AsyncStorage.getItem(K.session),
          AsyncStorage.getItem(K.last),
          AsyncStorage.getItem(K.bio),
        ]);
        let list: Account[] = rawAccounts ? JSON.parse(rawAccounts) : [];
        if (list.length === 0) {
          list = await seedAccounts();
          await AsyncStorage.setItem(K.accounts, JSON.stringify(list));
        }
        setAccounts(list);
        if (session && list.some((a) => a.id === session)) setSessionId(session);
        if (last && list.some((a) => a.id === last)) setLastId(last);
        if (bio !== null) setBio(bio === '1');
      } catch {
        setAccounts(await seedAccounts().catch(() => []));
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const saveAccounts = useCallback((next: Account[]) => {
    setAccounts(next);
    AsyncStorage.setItem(K.accounts, JSON.stringify(next)).catch(() => {});
  }, []);

  const startSession = useCallback((id: string) => {
    setSessionId(id);
    setLastId(id);
    AsyncStorage.multiSet([
      [K.session, id],
      [K.last, id],
    ]).catch(() => {});
  }, []);

  const findAccount = useCallback(
    (identifier: string) => {
      const id = identifier.trim().toLowerCase();
      if (id.includes('@')) return accounts.find((a) => a.email?.toLowerCase() === id);
      const phone = normalizePhone(id);
      return accounts.find((a) => a.phone === phone);
    },
    [accounts]
  );

  const signIn = useCallback(
    async (identifier: string, password: string) => {
      const acc = findAccount(identifier);
      if (!acc) return 'No account uses that number or email. Create one first.';
      if ((await hash(acc.phone, password)) !== acc.passwordHash) return 'Wrong password. Try again or reset it.';
      startSession(acc.id);
      return null;
    },
    [findAccount, startSession]
  );

  const signInWithBiometrics = useCallback(() => {
    if (!biometricEnabled) return 'Face ID sign-in is turned off in Settings.';
    if (!lastId) return 'Sign in with your password once to turn on Face ID.';
    startSession(lastId);
    return null;
  }, [biometricEnabled, lastId, startSession]);

  const startSignUp = useCallback(
    async (d: SignUpDetails) => {
      const phone = normalizePhone(d.phone);
      const byPhone = accounts.find((a) => a.phone === phone);
      if (byPhone) {
        return `This number already has a ${byPhone.role} account. Each number can hold one account, so use a different number for a ${d.role} account, or sign in.`;
      }
      const email = d.email?.trim().toLowerCase();
      if (email && accounts.some((a) => a.email?.toLowerCase() === email)) {
        return 'This email is already linked to another account.';
      }
      setPending({ ...d, phone, email, passwordHash: await hash(phone, d.password) });
      return null;
    },
    [accounts]
  );

  const completeSignUp = useCallback(async () => {
    if (!pending) return 'Your sign-up expired. Start again.';
    if (accounts.some((a) => a.phone === pending.phone)) return 'This number was just registered. Sign in instead.';
    const acc: Account = {
      id: `acc_${Date.now()}`,
      name: pending.name.trim(),
      phone: pending.phone,
      email: pending.email,
      role: pending.role,
      passwordHash: pending.passwordHash,
      avatar: CurrentUser.avatar,
      location: 'Accra',
      headline: pending.role === 'client' ? 'Hiring on DevPay' : 'Freelancer on DevPay',
      createdAt: Date.now(),
      isNew: true,
      // No acceptedPolicies yet: the policy pages (PolicyGate) open right after sign-up.
    };
    saveAccounts([...accounts, acc]);
    setPending(null);
    startSession(acc.id);
    return null;
  }, [accounts, pending, saveAccounts, startSession]);

  const resetPassword = useCallback(
    async (identifier: string, password: string) => {
      const acc = findAccount(identifier);
      if (!acc) return 'No account uses that number or email.';
      const passwordHash = await hash(acc.phone, password);
      saveAccounts(accounts.map((a) => (a.id === acc.id ? { ...a, passwordHash } : a)));
      return null;
    },
    [accounts, findAccount, saveAccounts]
  );

  const patchUser = useCallback(
    (patch: Partial<Account>) => {
      if (!sessionId) return;
      saveAccounts(accounts.map((a) => (a.id === sessionId ? { ...a, ...patch } : a)));
    },
    [accounts, saveAccounts, sessionId]
  );

  const signOut = useCallback(() => {
    setSessionId(null);
    AsyncStorage.removeItem(K.session).catch(() => {});
  }, []);

  const deleteAccount = useCallback(() => {
    if (!sessionId) return;
    saveAccounts(accounts.filter((a) => a.id !== sessionId));
    setSessionId(null);
    setLastId(null);
    AsyncStorage.multiRemove([K.session, K.last, `devpay_verification_${sessionId}`]).catch(() => {});
  }, [accounts, saveAccounts, sessionId]);

  const value = useMemo<AuthValue>(() => {
    const user = accounts.find((a) => a.id === sessionId) ?? null;
    const last = accounts.find((a) => a.id === lastId);
    return {
      ready,
      user,
      lastUser: last ? { id: last.id, name: last.name, avatar: last.avatar, role: last.role } : null,
      pending: pending ? { name: pending.name, phone: pending.phone, email: pending.email, role: pending.role } : null,
      biometricEnabled,
      setBiometricEnabled: (on) => {
        setBio(on);
        AsyncStorage.setItem(K.bio, on ? '1' : '0').catch(() => {});
      },
      signIn,
      signInWithBiometrics,
      startSignUp,
      completeSignUp,
      findAccount,
      verifyPassword: async (password) => {
        if (!user) return false;
        return (await hash(user.phone, password)) === user.passwordHash;
      },
      resetPassword,
      updateProfile: (patch) => patchUser(patch),
      markSetupDone: () => patchUser({ isNew: false }),
      acceptPolicies: () => patchUser({ acceptedPolicies: { version: POLICY_VERSION, at: Date.now() } }),
      signOut,
      deleteAccount,
    };
  }, [accounts, biometricEnabled, completeSignUp, deleteAccount, findAccount, lastId, patchUser, pending, ready, resetPassword, sessionId, signIn, signInWithBiometrics, signOut, startSignUp]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

/** Signed-in user's display fields, with demo fallbacks for screens rendered during sign-out. */
export function useCurrentUser() {
  const { user } = useAuth();
  return {
    name: user?.name ?? CurrentUser.name,
    avatar: user?.avatar ?? CurrentUser.avatar,
    location: user?.location ?? CurrentUser.location,
    headline: user?.headline ?? '',
    phone: user ? `+233 ${user.phone.replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3')}` : '',
    email: user?.email ?? '',
  };
}
