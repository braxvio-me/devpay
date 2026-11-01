/** Site-wide facts. Fill the placeholders before launch. */

/** Direct link to the signed Android APK. Empty until the first EAS build is published. */
export const APK_URL = process.env.NEXT_PUBLIC_APK_URL ?? '';
export const APK_VERSION = process.env.NEXT_PUBLIC_APK_VERSION ?? '1.0.0';

/** Same placeholder as the app (src/constants/app.ts); replace with the real inbox. */
export const SUPPORT_EMAIL = 'support@devpay.example';

export const TAGLINE = 'Freelance work, paid safely.';

/** Same answers the app shows in Help & support. */
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
    a: 'Verified accounts show the Verified badge, can apply to verified-only jobs (freelancers) or hire (clients), and rank higher in search. You upload your Ghana Card, then a short face scan matches you to it.',
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
    q: 'Is it safe to install the APK?',
    a: 'Download it only from this site. Android will ask you to allow installs from your browser the first time; that’s normal for apps outside Google Play. DevPay is coming to Google Play and the App Store.',
  },
];
