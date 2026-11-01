/** App-wide facts. Replace placeholders before launch. */
export const SUPPORT_EMAIL = 'support@devpay.example'; // TODO: real support inbox

export const FAQ: { q: string; a: string }[] = [
  {
    q: 'How does escrow protect me?',
    a: 'Clients fund each milestone before work starts. The money is held until the client approves the work, or released automatically 7 days after submission if they don’t respond.',
  },
  {
    q: 'When do I get paid?',
    a: 'As soon as a milestone is released, the money lands in your DevPay wallet. Withdraw to MTN MoMo, Telecel Cash or your bank from Earnings.',
  },
  {
    q: 'Why should I get verified?',
    a: 'Verified accounts show the Verified badge, can apply to verified-only jobs (freelancers) or hire (clients), and rank higher in search.',
  },
  {
    q: 'Can one account be both a client and a freelancer?',
    a: 'No. Each account has one role. To use the other role, sign up again with a different phone number.',
  },
  {
    q: 'What if a client won’t release payment?',
    a: 'Request a release from the project. If the client still doesn’t respond, the milestone releases automatically after 7 days. You can also open a dispute.',
  },
  {
    q: 'How do I turn on Face ID or fingerprint lock?',
    a: 'Go to Settings › App lock and switch on “Lock app with Face ID” (or Fingerprint). You can choose how quickly it locks.',
  },
];

/** Open-source libraries shown on the About screen. */
export const LICENSES = [
  'Expo & Expo Router (MIT)',
  'React & React Native (MIT)',
  'React Native Reanimated (MIT)',
  'React Native Gesture Handler (MIT)',
  'Ionicons & Material Community Icons (MIT / Apache 2.0)',
  'Inter typeface (SIL Open Font License)',
  'Photos from Unsplash (Unsplash License)',
];
