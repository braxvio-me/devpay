import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

export type UserRole = 'freelancer' | 'client';

interface RoleContextValue {
  role: UserRole;
  setRole: (role: UserRole) => void;
  toggleRole: () => void;
  isClient: boolean;
  isFreelancer: boolean;
}

const STORAGE_KEY = 'devpay_active_role';

const RoleContext = createContext<RoleContextValue>({
  role: 'freelancer',
  setRole: () => {},
  toggleRole: () => {},
  isClient: false,
  isFreelancer: true,
});

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('freelancer');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === 'freelancer' || saved === 'client') {
        setRoleState(saved);
      }
    });
  }, []);

  const setRole = useCallback((newRole: UserRole) => {
    setRoleState(newRole);
    AsyncStorage.setItem(STORAGE_KEY, newRole);
  }, []);

  const toggleRole = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setRoleState((prev) => {
      const next: UserRole = prev === 'freelancer' ? 'client' : 'freelancer';
      AsyncStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        toggleRole,
        isClient: role === 'client',
        isFreelancer: role === 'freelancer',
      }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
