/**
 * Fictional client companies used in demo data.
 * `mark` drives how CompanyLogo draws them.
 */
export type CompanyMark =
  | { kind: 'letter'; letter: string; color: string }
  | { kind: 'tiles'; colors: readonly [string, string, string, string] };

export interface Company {
  id: string;
  name: string;
  city: string;
  verified: boolean;
  mark: CompanyMark;
}

export const Companies = {
  kente: {
    id: 'kente',
    name: 'Kente Labs',
    city: 'Accra',
    verified: true,
    mark: { kind: 'letter', letter: 'K', color: '#C98A12' },
  },
  volta: {
    id: 'volta',
    name: 'Volta Pay',
    city: 'Accra',
    verified: true,
    mark: { kind: 'letter', letter: 'V', color: '#2B9BD2' },
  },
  sankofa: {
    id: 'sankofa',
    name: 'Sankofa Studio',
    city: 'Kumasi',
    verified: true,
    mark: { kind: 'letter', letter: 'S', color: '#17191C' },
  },
  adinkra: {
    id: 'adinkra',
    name: 'Adinkra Health',
    city: 'Takoradi',
    verified: true,
    mark: { kind: 'letter', letter: 'A', color: '#E5484D' },
  },
  akwaaba: {
    id: 'akwaaba',
    name: 'Akwaaba Logistics',
    city: 'Tema',
    verified: false,
    mark: { kind: 'letter', letter: 'A', color: '#1FAE7A' },
  },
} as const satisfies Record<string, Company>;

export type CompanyId = keyof typeof Companies;
