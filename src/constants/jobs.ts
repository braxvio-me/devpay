/**
 * Demo jobs (synthetic). Shared by Home, Explore and Job detail so they agree.
 */
import { Companies, Company } from '@/constants/companies';
import { ApplicantFaces, Portraits } from '@/constants/media';

export interface Job {
  id: string;
  company: Company;
  title: string;
  budget: string;
  period: string;
  tags: string[];
  category: string;
  type: string;
  hours: string;
  workplace: string;
  experience: string;
  location: string;
  applicants: readonly string[];
  applicantExtra: number;
  bookmarked: boolean;
  description: string;
  about: string;
  postedAgo: string;
  /** Only verified freelancers can apply. */
  verifiedOnly?: boolean;
}

export const Jobs: Job[] = [
  {
    id: '1',
    company: Companies.volta,
    title: 'Jr. UI/UX Designer',
    budget: 'GH₵ 3,500 - 5,000',
    period: 'Milestone',
    tags: ['Fixed-Price', 'Remote', 'Milestone'],
    category: 'UI/UX Design',
    type: 'Fixed-Price',
    hours: 'Flexible',
    workplace: 'Hybrid',
    experience: '2 – 4 Years',
    location: 'Accra',
    applicants: ApplicantFaces,
    applicantExtra: 12,
    bookmarked: true,
    description:
      'Looking for a UI/UX designer to create intuitive, scalable, user-centred flows for our MoMo checkout across web and mobile. You will work closely with product managers and engineers on wireframes, prototypes, and design-system components, delivered over three funded milestones.',
    about:
      'Volta Pay builds payment links and MoMo checkout for small Ghanaian merchants. 40-person team in Osu, Accra.',
    postedAgo: '2h ago',
  },
  {
    id: '2',
    company: Companies.sankofa,
    title: 'React Native Engineer',
    budget: 'GH₵ 4,000 - 6,500',
    period: 'Milestone',
    tags: ['Fixed-Price', 'Remote', 'Expo'],
    category: 'Tech & Dev',
    type: 'Fixed-Price',
    hours: '9AM - 5PM',
    workplace: 'Remote',
    experience: '3 – 5 Years',
    location: 'Kumasi',
    applicants: [Portraits.yaw, Portraits.akosua, Portraits.esi],
    applicantExtra: 8,
    bookmarked: false,
    description:
      'Ship the next version of our booking app in Expo: offline-first lists, push notifications, and Paystack card payments. Milestone 1 is funded on hire.',
    about: 'Sankofa Studio is a product studio in Kumasi building apps for West African retailers.',
    postedAgo: '5h ago',
  },
  {
    id: '3',
    company: Companies.kente,
    title: 'Jr. UI/UX Designer',
    budget: 'GH₵ 2,500 - 4,000',
    period: 'Month',
    tags: ['Full-time', 'On-Site', 'Internship'],
    category: 'UI/UX Design',
    type: 'Full-Time',
    hours: '10AM - 6PM',
    workplace: 'Hybrid',
    experience: '2 – 4 Years',
    location: 'Accra',
    applicants: [Portraits.daniel, Portraits.naomi, Portraits.samuel],
    applicantExtra: 14,
    bookmarked: true,
    description:
      'Join our design team to shape learning tools used by 200,000 students across Ghana. You will run quick research sessions, design flows in Figma, and hand off clean specs to engineers.',
    about: 'Kente Labs builds education software for Ghanaian schools. Offices in Airport City, Accra.',
    postedAgo: '1d ago',
    verifiedOnly: true,
  },
  {
    id: '4',
    company: Companies.adinkra,
    title: 'Senior Product Designer',
    budget: 'GH₵ 6,000 - 9,000',
    period: 'Month',
    tags: ['Full-time', 'Hybrid'],
    category: 'UI/UX Design',
    type: 'Full-Time',
    hours: '9AM - 5PM',
    workplace: 'Hybrid',
    experience: '5+ Years',
    location: 'Takoradi',
    applicants: [Portraits.ama, Portraits.kofi, Portraits.efua],
    applicantExtra: 6,
    bookmarked: false,
    description:
      'Lead design for a telehealth app connecting patients to clinics in the Western Region. Own the end-to-end experience from appointment booking to MoMo payment.',
    about: 'Adinkra Health runs telehealth for 30 partner clinics in the Western Region.',
    postedAgo: '2d ago',
    verifiedOnly: true,
  },
  {
    id: '5',
    company: Companies.akwaaba,
    title: 'Content Writer (Logistics)',
    budget: 'GH₵ 1,200 - 2,000',
    period: 'Milestone',
    tags: ['Fixed-Price', 'Remote'],
    category: 'Writing',
    type: 'Fixed-Price',
    hours: 'Flexible',
    workplace: 'Remote',
    experience: '1 – 2 Years',
    location: 'Tema',
    applicants: [Portraits.naomi, Portraits.yaw, Portraits.esi],
    applicantExtra: 3,
    bookmarked: false,
    description:
      'Write 12 help-centre articles and onboarding emails for drivers and shippers using our freight app. Paid per milestone of four articles.',
    about: 'Akwaaba Logistics matches shippers with trucks across Tema port.',
    postedAgo: '3d ago',
  },
];

export const JobCategories = ['See All', 'Tech & Dev', 'UI/UX Design', 'Writing', 'Marketing'];

export function getJob(id?: string | string[]) {
  const key = Array.isArray(id) ? id[0] : id;
  return Jobs.find((j) => j.id === key) ?? Jobs[0];
}
