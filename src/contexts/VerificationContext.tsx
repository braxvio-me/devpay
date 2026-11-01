/**
 * VerificationContext — the signed-in user's verification state (frontend only, persisted locally).
 *
 * identity: Ghana Card / business documents submitted (KYC screen).
 * paid:     verification fee paid (Verification screen).
 * verified: both done — unlocks verified-only features.
 */
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/contexts/AuthContext';

interface VerificationState {
  identity: boolean;
  paid: boolean;
}

interface VerificationValue extends VerificationState {
  verified: boolean;
  completeIdentity: () => void;
  completePayment: () => void;
  reset: () => void;
}

/** Stored per account. */
const keyFor = (accountId: string) => `devpay_verification_${accountId}`;
const EMPTY: VerificationState = { identity: false, paid: false };

const VerificationContext = createContext<VerificationValue>({
  ...EMPTY,
  verified: false,
  completeIdentity: () => {},
  completePayment: () => {},
  reset: () => {},
});

export function VerificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const accountId = user?.id ?? null;
  const [byAccount, setByAccount] = useState<Record<string, VerificationState>>({});
  const state = (accountId && byAccount[accountId]) || EMPTY;

  useEffect(() => {
    if (!accountId) return;
    AsyncStorage.getItem(keyFor(accountId))
      .then((raw) => setByAccount((m) => ({ ...m, [accountId]: raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY })))
      .catch(() => {});
  }, [accountId]);

  const update = useCallback(
    (patch: Partial<VerificationState>) => {
      if (!accountId) return;
      setByAccount((m) => {
        const next = { ...(m[accountId] ?? EMPTY), ...patch };
        AsyncStorage.setItem(keyFor(accountId), JSON.stringify(next)).catch(() => {});
        return { ...m, [accountId]: next };
      });
    },
    [accountId]
  );

  return (
    <VerificationContext.Provider
      value={{
        ...state,
        verified: state.identity && state.paid,
        completeIdentity: () => update({ identity: true }),
        completePayment: () => update({ paid: true }),
        reset: () => update(EMPTY),
      }}>
      {children}
    </VerificationContext.Provider>
  );
}

export function useVerification() {
  return useContext(VerificationContext);
}
