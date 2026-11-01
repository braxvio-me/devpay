/**
 * Role comes from the signed-in account. One account = one role; there is no switching.
 */
import { useAuth, Role } from '@/contexts/AuthContext';

export type UserRole = Role;

export function useRole() {
  const { user, pending } = useAuth();
  const role: UserRole = user?.role ?? pending?.role ?? 'freelancer';
  return { role, isClient: role === 'client', isFreelancer: role === 'freelancer' };
}
