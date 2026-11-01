/**
 * Payment receipts, one list per account on this device.
 * Every completed payment (escrow funding, release, payout, verification fee, Pro plan) adds one.
 * The backend becomes the source of truth later; see docs/BACKEND_HANDOFF.md.
 */
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/contexts/AuthContext';

export type ReceiptKind = 'escrow_funding' | 'release' | 'payout' | 'verification' | 'subscription' | 'earning';

export interface Receipt {
  id: string;
  /** Payment reference shown to the user and support. */
  ref: string;
  kind: ReceiptKind;
  title: string;
  /** Who paid and who was paid. */
  from: string;
  to: string;
  method: string;
  amount: number;
  fee: number;
  /** ms since epoch */
  createdAt: number;
  status: 'Paid' | 'Held in escrow' | 'Sent';
}

export type NewReceipt = Omit<Receipt, 'id' | 'ref' | 'createdAt' | 'fee' | 'status'> & Partial<Pick<Receipt, 'ref' | 'fee' | 'status'>>;

const PREFIX: Record<ReceiptKind, string> = {
  escrow_funding: 'ESC-FND',
  release: 'ESC-REL',
  payout: 'MOMO-WD',
  verification: 'KYC-FEE',
  subscription: 'PRO-SUB',
  earning: 'DEV-MS',
};

const day = 86_400_000;
const T0 = Date.UTC(2026, 9, 31, 14, 30);

/** Demo history so the list isn't empty on first run. */
function seed(role: 'client' | 'freelancer', name: string): Receipt[] {
  const base = (r: Omit<Receipt, 'id'>): Receipt => ({ ...r, id: r.ref });
  return role === 'client'
    ? [
        base({ ref: 'ESC-REL-8831', kind: 'release', title: 'Released · Milestone 2, MoMo checkout', from: name, to: 'Kwame Mensah', method: 'DevPay escrow', amount: 2000, fee: 0, createdAt: T0, status: 'Sent' }),
        base({ ref: 'ESC-FND-1029', kind: 'escrow_funding', title: 'Escrow funding · Booking app', from: name, to: 'DevPay escrow', method: 'MTN MoMo · 024 ••• 4567', amount: 5000, fee: 0, createdAt: T0 - day, status: 'Held in escrow' }),
        base({ ref: 'ESC-REL-8210', kind: 'release', title: 'Released · Learning dashboard', from: name, to: 'Akosua Serwaa', method: 'DevPay escrow', amount: 1500, fee: 0, createdAt: T0 - 19 * day, status: 'Sent' }),
      ]
    : [
        base({ ref: 'DEV-MS-8831', kind: 'earning', title: 'Milestone 2 approved · Volta Pay', from: 'Abena Boateng', to: name, method: 'DevPay escrow', amount: 1200, fee: 0, createdAt: T0, status: 'Paid' }),
        base({ ref: 'MOMO-WD-1029', kind: 'payout', title: 'Payout to MTN MoMo', from: 'DevPay wallet', to: name, method: 'MTN MoMo · 024 ••• 4567', amount: 850, fee: 1.5, createdAt: T0 - day, status: 'Sent' }),
        base({ ref: 'DEV-MS-8210', kind: 'earning', title: 'Milestone 3 approved · Kente Labs', from: 'Kente Labs', to: name, method: 'DevPay escrow', amount: 1500, fee: 0, createdAt: T0 - 19 * day, status: 'Paid' }),
      ];
}

interface ReceiptsValue {
  receipts: Receipt[];
  addReceipt: (r: NewReceipt) => Receipt;
  getReceipt: (id: string) => Receipt | undefined;
}

const ReceiptsContext = createContext<ReceiptsValue | null>(null);

export function ReceiptsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [saved, setSaved] = useState<Receipt[]>([]);
  const key = user ? `devpay_receipts_${user.id}` : null;

  useEffect(() => {
    let cancelled = false;
    if (!key) {
      setTimeout(() => !cancelled && setSaved([]), 0);
    } else {
      AsyncStorage.getItem(key)
        .then((raw) => !cancelled && setSaved(raw ? JSON.parse(raw) : []))
        .catch(() => {});
    }
    return () => {
      cancelled = true;
    };
  }, [key]);

  const receipts = useMemo(
    () => (user ? [...saved, ...seed(user.role, user.name)].sort((a, b) => b.createdAt - a.createdAt) : []),
    [saved, user]
  );

  const addReceipt = useCallback(
    (input: NewReceipt) => {
      const ref = input.ref ?? `${PREFIX[input.kind]}-${Math.floor(100000 + Math.random() * 900000)}`;
      const r: Receipt = { fee: 0, status: 'Paid', ...input, ref, id: ref, createdAt: Date.now() };
      setSaved((prev) => {
        const next = [r, ...prev].slice(0, 200);
        if (key) AsyncStorage.setItem(key, JSON.stringify(next)).catch(() => {});
        return next;
      });
      return r;
    },
    [key]
  );

  const value = useMemo<ReceiptsValue>(
    () => ({ receipts, addReceipt, getReceipt: (id) => receipts.find((r) => r.id === id) }),
    [addReceipt, receipts]
  );

  return <ReceiptsContext.Provider value={value}>{children}</ReceiptsContext.Provider>;
}

export function useReceipts() {
  const ctx = useContext(ReceiptsContext);
  if (!ctx) throw new Error('useReceipts must be used inside ReceiptsProvider');
  return ctx;
}
