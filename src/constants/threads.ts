/** Demo chat threads (synthetic), shared by Messages and Chat. */
import { Portraits } from '@/constants/media';
import { Companies, Company } from '@/constants/companies';

export interface Thread {
  id: string;
  name: string;
  avatar?: string;
  company?: Company;
  project: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  escrowStatus: string;
  escrowAmount: string;
}

export const Threads: Thread[] = [
  {
    id: 't_1',
    name: 'Volta Pay',
    company: Companies.volta,
    project: 'MoMo checkout redesign',
    lastMessage: 'Reviewing the prototype now, looks clean!',
    time: '10:35',
    unread: 2,
    online: true,
    escrowStatus: 'Milestone 2 funded',
    escrowAmount: 'GH₵ 2,000.00',
  },
  {
    id: 't_2',
    name: 'Ama Owusu',
    avatar: Portraits.ama,
    project: 'Booking app (Expo)',
    lastMessage: 'Can we move the demo to Thursday?',
    time: '09:12',
    unread: 1,
    online: true,
    escrowStatus: 'Milestone 1 in review',
    escrowAmount: 'GH₵ 1,600.00',
  },
  {
    id: 't_3',
    name: 'Kente Labs',
    company: Companies.kente,
    project: 'Learning dashboard',
    lastMessage: 'You: Sent the updated Figma link',
    time: 'Yesterday',
    unread: 0,
    online: false,
    escrowStatus: 'Proposal pre-funded',
    escrowAmount: 'GH₵ 5,000.00',
  },
  {
    id: 't_4',
    name: 'Kofi Darko',
    avatar: Portraits.kofi,
    project: 'Webhook service',
    lastMessage: 'Payment released. Thanks for the quick turnaround.',
    time: 'Mon',
    unread: 0,
    online: false,
    escrowStatus: 'Milestone 3 released',
    escrowAmount: 'GH₵ 3,200.00',
  },
  {
    id: 't_5',
    name: 'Adinkra Health',
    company: Companies.adinkra,
    project: 'Telehealth booking',
    lastMessage: 'Shared the brand guidelines PDF',
    time: '28 Oct',
    unread: 0,
    online: false,
    escrowStatus: 'Awaiting funding',
    escrowAmount: 'GH₵ 6,000.00',
  },
];

export function getThread(id?: string | string[]) {
  const key = Array.isArray(id) ? id[0] : id;
  return Threads.find((t) => t.id === key) ?? Threads[0];
}
