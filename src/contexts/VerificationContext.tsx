/**
 * VerificationContext — the signed-in user's verification state (frontend only, persisted locally).
 *
 * identity: Ghana Card / business documents submitted (KYC screen).
 * paid:     verification fee paid (Verification screen).
 * verified: both done — unlocks verified-only features.
 */
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const STORAGE_KEY = 'devpay_verification';
const EMPTY: VerificationState = { identity: false, paid: false };

const VerificationContext = createContext<VerificationValue>({
  ...EMPTY,
  verified: false,
  completeIdentity: () => {},
  completePayment: () => {},
  reset: () => {},
});

export function VerificationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<VerificationState>(EMPTY);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => raw && setState({ ...EMPTY, ...JSON.parse(raw) }))
      .catch(() => {});
  }, []);

  const update = useCallback((patch: Partial<VerificationState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

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
