/**
 * Stock portraits (Unsplash, free licence). Replace with real user photos later.
 */
const u = (id: string, size = 200) =>
  `https://images.unsplash.com/photo-${id}?w=${size}&h=${size}&fit=crop&crop=faces&q=80`;

export const Portraits = {
  kwame: u('1522529599102-193c0d76b5b6'),
  ama: u('1531123897727-8f129e1688ce'),
  kofi: u('1506277886164-e25aa3f4ef7f'),
  efua: u('1507152832244-10d45c7eda57'),
  yaw: u('1531384441138-2736e62e0919'),
  akosua: u('1523824921871-d6f1a15151f1'),
  esi: u('1573497019940-1c28c88b4f3e'),
  daniel: u('1531427186611-ecfd6d936c79'),
  naomi: u('1580489944761-15a19d654956'),
  samuel: u('1500648767791-00dcc994a43e'),
} as const;

/** Signed-in demo user. */
export const CurrentUser = {
  name: 'Kwame Mensah',
  handle: '@kwame.dev',
  avatar: Portraits.kwame,
  location: 'East Legon, Accra',
};

export const ApplicantFaces = [Portraits.ama, Portraits.kofi, Portraits.efua] as const;

export const WelcomeFaces = {
  // outer arc, left → right
  arc: [
    u('1573497019940-1c28c88b4f3e', 320),
    u('1531123897727-8f129e1688ce', 320),
    u('1506277886164-e25aa3f4ef7f', 320),
    u('1523824921871-d6f1a15151f1', 320),
    u('1531384441138-2736e62e0919', 320),
    u('1522529599102-193c0d76b5b6', 320),
  ],
} as const;
