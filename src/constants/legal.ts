/**
 * Policy documents. DRAFT plain-language summaries: a lawyer must review and replace
 * these before launch. Bump POLICY_VERSION whenever any document changes; every user
 * is asked to accept the new version on their next visit.
 */
export const POLICY_VERSION = '2026-11-01';

export type DocId = 'terms' | 'privacy' | 'escrow' | 'refunds' | 'community';

export interface LegalDoc {
  id: DocId;
  title: string;
  summary: string;
  icon: 'document-text-outline' | 'lock-closed-outline' | 'shield-checkmark-outline' | 'refresh-outline' | 'people-outline';
  sections: { h: string; p: string }[];
}

export const LegalDocs: LegalDoc[] = [
  {
    id: 'terms',
    title: 'Terms of Service',
    summary: 'The rules for using DevPay as a client or freelancer.',
    icon: 'document-text-outline',
    sections: [
      { h: 'Your account', p: 'You must be 18 or older and give accurate details. Each account has one role, client or freelancer, and one phone number or email can hold only one account.' },
      { h: 'Using DevPay', p: 'Clients post milestone-based jobs and freelancers apply. Both sides agree to the scope, price and deadline of each milestone before work starts.' },
      { h: 'Fees', p: 'Fees depend on your plan and are shown before you pay. Mobile Money network fees are passed through as shown at checkout.' },
      { h: 'Ending your account', p: 'You can delete your account in Settings once you have no active escrow. We may suspend accounts that break these terms or the Community Guidelines.' },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    summary: 'What we collect, why, and the choices you have.',
    icon: 'lock-closed-outline',
    sections: [
      { h: 'What we collect', p: 'Your name, phone number, email, profile details, payout accounts, chat messages, and the documents you submit for verification.' },
      { h: 'How we use it', p: 'To run your account, process escrow payments and payouts, verify identities, prevent fraud, and keep the marketplace safe.' },
      { h: 'Who sees it', p: 'Other users see your public profile. Payment partners see what they need to move money. Identity documents are used only for verification.' },
      { h: 'On your device', p: 'Face ID or fingerprint checks happen on your phone; DevPay never receives your biometric data.' },
      { h: 'Your choices', p: 'You can edit your profile, turn notifications off, and delete your account from Settings.' },
    ],
  },
  {
    id: 'escrow',
    title: 'Escrow & Payments Policy',
    summary: 'How milestone money is held, released and paid out.',
    icon: 'shield-checkmark-outline',
    sections: [
      { h: 'Funding', p: 'A client funds each milestone before the freelancer starts it. The money is held in escrow and neither side can spend it until the milestone is settled.' },
      { h: 'Release', p: 'The client releases a milestone after approving the work. If the client does not respond within 7 days of submission, it releases automatically.' },
      { h: 'Payouts', p: 'Released money reaches the freelancer’s DevPay wallet. Withdrawals go to the Mobile Money or bank account on file.' },
    ],
  },
  {
    id: 'refunds',
    title: 'Refunds & Disputes',
    summary: 'What happens when a milestone goes wrong.',
    icon: 'refresh-outline',
    sections: [
      { h: 'Revisions', p: 'Each milestone includes up to two revision requests before a dispute can be opened.' },
      { h: 'Disputes', p: 'Either side can open a dispute from the project. DevPay reviews the contract, chat history and submitted work and decides how the escrowed money is split.' },
      { h: 'Refunds', p: 'Unstarted, funded milestones can be cancelled and refunded to the client. Refunds go back to the original payment method.' },
    ],
  },
  {
    id: 'community',
    title: 'Community Guidelines',
    summary: 'How we expect everyone on DevPay to behave.',
    icon: 'people-outline',
    sections: [
      { h: 'Be honest', p: 'Use your real identity, describe your skills and jobs accurately, and only submit work you have the right to deliver.' },
      { h: 'Stay on DevPay', p: 'Keep payments inside escrow. Asking to pay or be paid outside DevPay removes your protection and can lead to suspension.' },
      { h: 'Be respectful', p: 'No harassment, discrimination or spam. Report anything that feels wrong from the chat or profile.' },
    ],
  },
];

export const getDoc = (id?: string | string[]) => {
  const key = Array.isArray(id) ? id[0] : id;
  return LegalDocs.find((d) => d.id === key);
};
