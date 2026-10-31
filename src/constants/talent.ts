/** Demo freelancers (synthetic), shared by Explore (client mode), Talent profile and Proposals. */
import { Companies, Company } from '@/constants/companies';
import { Portraits } from '@/constants/media';

export interface Project {
  id: string;
  title: string;
  client: Company;
  summary: string;
  amount: string;
  duration: string;
  rating: number;
  tags: string[];
  completed: string;
}

export interface Review {
  id: string;
  author: string;
  company: Company;
  rating: number;
  text: string;
  date: string;
}

export interface Talent {
  id: string;
  threadId: string;
  name: string;
  title: string;
  city: string;
  avatar: string;
  rating: number;
  reviews: number;
  rate: string;
  skills: string[];
  verified: boolean;
  available: boolean;
  about: string;
  jobsDone: number;
  onTime: string;
  earned: string;
  memberSince: string;
  languages: string[];
  projects: Project[];
  feedback: Review[];
}

export const TalentList: Talent[] = [
  {
    id: 'dev_1',
    threadId: 't_2',
    name: 'Ama Owusu',
    title: 'Senior React Native Engineer',
    city: 'Accra',
    avatar: Portraits.ama,
    rating: 5.0,
    reviews: 28,
    rate: 'GH₵ 120',
    skills: ['React Native', 'Expo', 'TypeScript', 'MoMo API', 'Supabase'],
    verified: true,
    available: true,
    about:
      'I build fast, dependable mobile apps for Ghanaian fintech and retail teams. Six years shipping React Native in production, including MoMo checkout, offline-first lists and push notifications. I deliver in small, testable milestones.',
    jobsDone: 23,
    onTime: '98%',
    earned: 'GH₵ 84k',
    memberSince: 'Mar 2024',
    languages: ['English', 'Twi'],
    projects: [
      {
        id: 'p1',
        title: 'MoMo checkout for 3,000 merchants',
        client: Companies.volta,
        summary: 'Rebuilt the in-app payment flow with MTN MoMo and Telecel Cash prompts, cutting failed payments by a third.',
        amount: 'GH₵ 6,500',
        duration: '5 weeks',
        rating: 5,
        tags: ['React Native', 'MoMo API'],
        completed: 'Sep 2026',
      },
      {
        id: 'p2',
        title: 'Offline booking app',
        client: Companies.sankofa,
        summary: 'Expo app that keeps working on patchy networks and syncs bookings when back online.',
        amount: 'GH₵ 4,200',
        duration: '4 weeks',
        rating: 5,
        tags: ['Expo', 'SQLite'],
        completed: 'Jun 2026',
      },
      {
        id: 'p3',
        title: 'Student progress dashboard',
        client: Companies.kente,
        summary: 'Teacher-facing dashboard with charts and CSV export for 40 partner schools.',
        amount: 'GH₵ 3,800',
        duration: '3 weeks',
        rating: 4.8,
        tags: ['TypeScript', 'Charts'],
        completed: 'Feb 2026',
      },
    ],
    feedback: [
      {
        id: 'r1',
        author: 'Kojo Asante',
        company: Companies.volta,
        rating: 5,
        text: 'Clear updates every milestone and the payment flow just works. We hired Ama again straight away.',
        date: 'Sep 2026',
      },
      {
        id: 'r2',
        author: 'Abena Boateng',
        company: Companies.sankofa,
        rating: 5,
        text: 'Understood our users on slow networks better than we did. Delivered early.',
        date: 'Jun 2026',
      },
    ],
  },
  {
    id: 'dev_2',
    threadId: 't_2',
    name: 'Akosua Serwaa',
    title: 'Product & UI/UX Designer',
    city: 'Kumasi',
    avatar: Portraits.akosua,
    rating: 4.9,
    reviews: 19,
    rate: 'GH₵ 95',
    skills: ['Figma', 'Design Systems', 'Prototyping', 'User Research'],
    verified: true,
    available: true,
    about:
      'Product designer focused on fintech and health apps for West African users. I run quick research, design in Figma, and hand off tidy specs and components.',
    jobsDone: 17,
    onTime: '100%',
    earned: 'GH₵ 52k',
    memberSince: 'Aug 2024',
    languages: ['English', 'Twi', 'French'],
    projects: [
      {
        id: 'p1',
        title: 'Telehealth booking redesign',
        client: Companies.adinkra,
        summary: 'Redesigned appointment booking end to end; bookings completed rose 27%.',
        amount: 'GH₵ 5,000',
        duration: '4 weeks',
        rating: 5,
        tags: ['Figma', 'Research'],
        completed: 'Aug 2026',
      },
      {
        id: 'p2',
        title: 'Design system for learning apps',
        client: Companies.kente,
        summary: 'Tokens, components and documentation shared across three products.',
        amount: 'GH₵ 4,400',
        duration: '6 weeks',
        rating: 4.8,
        tags: ['Design Systems'],
        completed: 'Apr 2026',
      },
    ],
    feedback: [
      {
        id: 'r1',
        author: 'Efua Mensah',
        company: Companies.adinkra,
        rating: 5,
        text: 'Thoughtful, fast and great with patients in research sessions.',
        date: 'Aug 2026',
      },
    ],
  },
  {
    id: 'dev_3',
    threadId: 't_4',
    name: 'Kofi Darko',
    title: 'Full Stack Node.js Engineer',
    city: 'East Legon, Accra',
    avatar: Portraits.kofi,
    rating: 4.9,
    reviews: 31,
    rate: 'GH₵ 140',
    skills: ['NestJS', 'PostgreSQL', 'Docker', 'Webhooks'],
    verified: true,
    available: false,
    about:
      'Back-end engineer for payment and logistics platforms. I design APIs, webhook pipelines and the monitoring that keeps them healthy.',
    jobsDone: 29,
    onTime: '96%',
    earned: 'GH₵ 110k',
    memberSince: 'Jan 2024',
    languages: ['English', 'Ga'],
    projects: [
      {
        id: 'p1',
        title: 'Payment webhook service',
        client: Companies.volta,
        summary: 'Idempotent webhook processing for MoMo callbacks with retries and alerting.',
        amount: 'GH₵ 7,200',
        duration: '5 weeks',
        rating: 5,
        tags: ['NestJS', 'Webhooks'],
        completed: 'Oct 2026',
      },
      {
        id: 'p2',
        title: 'Freight matching API',
        client: Companies.akwaaba,
        summary: 'API that matches shippers to trucks at Tema port in under a second.',
        amount: 'GH₵ 8,000',
        duration: '7 weeks',
        rating: 4.8,
        tags: ['PostgreSQL', 'Docker'],
        completed: 'May 2026',
      },
    ],
    feedback: [
      {
        id: 'r1',
        author: 'Yaw Owusu',
        company: Companies.akwaaba,
        rating: 5,
        text: 'Rock solid. Zero downtime since launch.',
        date: 'May 2026',
      },
    ],
  },
  {
    id: 'dev_4',
    threadId: 't_4',
    name: 'Yaw Adjei',
    title: 'Mobile Security Engineer',
    city: 'Tema',
    avatar: Portraits.yaw,
    rating: 4.8,
    reviews: 15,
    rate: 'GH₵ 110',
    skills: ['Biometrics', 'Ghana Card SDK', 'Security Audits'],
    verified: false,
    available: true,
    about: 'I secure mobile apps: biometric sign-in, key storage and identity checks, plus pre-launch security reviews.',
    jobsDone: 11,
    onTime: '91%',
    earned: 'GH₵ 31k',
    memberSince: 'Nov 2024',
    languages: ['English', 'Ewe'],
    projects: [
      {
        id: 'p1',
        title: 'Biometric sign-in hardening',
        client: Companies.volta,
        summary: 'Added device-bound keys and biometric re-auth for payouts.',
        amount: 'GH₵ 3,600',
        duration: '3 weeks',
        rating: 4.8,
        tags: ['Biometrics'],
        completed: 'Jul 2026',
      },
    ],
    feedback: [],
  },
];

export function getTalent(id?: string | string[]) {
  const key = Array.isArray(id) ? id[0] : id;
  return TalentList.find((t) => t.id === key) ?? TalentList[0];
}
