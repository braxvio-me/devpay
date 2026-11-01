/** Demo projects (synthetic): contracts between a client company and a freelancer. */
import { Companies, Company } from '@/constants/companies';
import { Portraits } from '@/constants/media';

// Live deadlines are set relative to app start so the demo always has something counting down.
const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const START = Date.now();
const at = (ms: number) => START + ms;

/** "Today, 18:40", "Tomorrow, 09:00" or "Tue 4 Nov, 13:00". */
export function formatDue(ts: number) {
  const d = new Date(ts);
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const today = new Date();
  const dayDiff = Math.round((new Date(d.toDateString()).getTime() - new Date(today.toDateString()).getTime()) / DAY);
  if (dayDiff === 0) return `Today, ${time}`;
  if (dayDiff === 1) return `Tomorrow, ${time}`;
  return `${d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}, ${time}`;
}

const live = (ms: number) => ({ dueAt: at(ms), due: formatDue(at(ms)) });

export type ProjectStatus = 'active' | 'review' | 'completed';
export type MilestoneStatus = 'released' | 'in_progress' | 'submitted' | 'funded' | 'upcoming';

export interface ProjectMilestone {
  id: string;
  title: string;
  amount: number;
  status: MilestoneStatus;
  due: string;
  /** Exact deadline (ms). For a submitted milestone this is the auto-release time. */
  dueAt?: number;
}

export interface ProjectEvent {
  id: string;
  text: string;
  date: string;
  icon: 'lock-closed' | 'cloud-upload' | 'cash' | 'refresh' | 'flag' | 'chatbubble-ellipses';
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  category: string;
  company: Company;
  freelancer: { name: string; avatar: string; talentId: string };
  status: ProjectStatus;
  started: string;
  deadline: string;
  threadId: string;
  files: { name: string; size: string }[];
  milestones: ProjectMilestone[];
  activity: ProjectEvent[];
}

export const Projects: Project[] = [
  {
    id: 'p1',
    title: 'MoMo checkout redesign',
    summary:
      'Redesign the in-app checkout so merchants can take MTN MoMo and Telecel Cash payments in two taps, with a reusable design system for the rest of the app.',
    category: 'UI/UX Design',
    company: Companies.volta,
    freelancer: { name: 'Kwame Mensah', avatar: Portraits.kwame, talentId: 'dev_1' },
    status: 'active',
    started: '2 Oct 2026',
    deadline: '15 Nov 2026',
    threadId: 't_1',
    files: [
      { name: 'checkout-research.pdf', size: '2.4 MB' },
      { name: 'checkout-prototype-v2.fig', size: '18 MB' },
    ],
    milestones: [
      { id: 'm1', title: 'Research & user flows', amount: 1000, status: 'released', due: '12 Oct' },
      { id: 'm2', title: 'Design system & tokens', amount: 2000, status: 'in_progress', ...live(2 * HOUR + 15 * MINUTE) },
      { id: 'm3', title: 'Final screens & handoff', amount: 1500, status: 'upcoming', due: '15 Nov' },
    ],
    activity: [
      { id: 'a1', text: 'Milestone 2 funded · GH₵ 2,000', date: '24 Oct', icon: 'lock-closed' },
      { id: 'a2', text: 'Milestone 1 released · GH₵ 1,000', date: '12 Oct', icon: 'cash' },
      { id: 'a3', text: 'Research report submitted', date: '10 Oct', icon: 'cloud-upload' },
      { id: 'a4', text: 'Contract started', date: '2 Oct', icon: 'flag' },
    ],
  },
  {
    id: 'p2',
    title: 'Booking app checkout',
    summary: 'Build the Paystack card checkout and booking confirmation flow for an Expo booking app, including offline retry.',
    category: 'Tech & Dev',
    company: Companies.sankofa,
    freelancer: { name: 'Akosua Serwaa', avatar: Portraits.akosua, talentId: 'dev_2' },
    status: 'review',
    started: '14 Oct 2026',
    deadline: '20 Nov 2026',
    threadId: 't_2',
    files: [{ name: 'checkout-flow-demo.mp4', size: '9.1 MB' }],
    milestones: [
      { id: 'm1', title: 'Prototype & checkout flow', amount: 1600, status: 'submitted', ...live(3 * DAY + 4 * HOUR) },
      { id: 'm2', title: 'Payments integration', amount: 1600, status: 'upcoming', due: '20 Nov' },
    ],
    activity: [
      { id: 'a1', text: 'Milestone 1 submitted for review', date: '28 Oct', icon: 'cloud-upload' },
      { id: 'a2', text: 'Revision requested: button states', date: '25 Oct', icon: 'refresh' },
      { id: 'a3', text: 'Milestone 1 funded · GH₵ 1,600', date: '14 Oct', icon: 'lock-closed' },
    ],
  },
  {
    id: 'p3',
    title: 'Telehealth booking flow',
    summary: 'Design appointment booking and MoMo payment for a clinic network, from first visit to reminders.',
    category: 'UI/UX Design',
    company: Companies.adinkra,
    freelancer: { name: 'Ama Owusu', avatar: Portraits.ama, talentId: 'dev_1' },
    status: 'active',
    started: '29 Oct 2026',
    deadline: '10 Dec 2026',
    threadId: 't_5',
    files: [{ name: 'brand-guidelines.pdf', size: '4.8 MB' }],
    milestones: [
      { id: 'm1', title: 'Discovery & wireframes', amount: 2000, status: 'funded', ...live(11 * DAY) },
      { id: 'm2', title: 'High-fidelity designs', amount: 2500, status: 'upcoming', due: '28 Nov' },
      { id: 'm3', title: 'Prototype & handoff', amount: 1500, status: 'upcoming', due: '10 Dec' },
    ],
    activity: [
      { id: 'a1', text: 'Milestone 1 funded · GH₵ 2,000', date: '29 Oct', icon: 'lock-closed' },
      { id: 'a2', text: 'Contract started', date: '29 Oct', icon: 'flag' },
    ],
  },
  {
    id: 'p4',
    title: 'Learning dashboard',
    summary: 'Teacher dashboard with progress charts and CSV export for 40 partner schools.',
    category: 'Tech & Dev',
    company: Companies.kente,
    freelancer: { name: 'Kofi Darko', avatar: Portraits.kofi, talentId: 'dev_3' },
    status: 'completed',
    started: '1 Aug 2026',
    deadline: '12 Oct 2026',
    threadId: 't_3',
    files: [
      { name: 'dashboard-source.zip', size: '32 MB' },
      { name: 'handoff-notes.pdf', size: '1.1 MB' },
    ],
    milestones: [
      { id: 'm1', title: 'Data model & API', amount: 1700, status: 'released', due: '25 Aug' },
      { id: 'm2', title: 'Charts & filters', amount: 1800, status: 'released', due: '20 Sep' },
      { id: 'm3', title: 'Export & handoff', amount: 1500, status: 'released', due: '12 Oct' },
    ],
    activity: [
      { id: 'a1', text: 'Project completed · 5.0 rating', date: '12 Oct', icon: 'flag' },
      { id: 'a2', text: 'Milestone 3 released · GH₵ 1,500', date: '12 Oct', icon: 'cash' },
    ],
  },
];

export const cedis = (n: number) => `GH₵ ${n.toLocaleString('en-US')}`;

export function projectTotals(p: Project) {
  const total = p.milestones.reduce((s, m) => s + m.amount, 0);
  const released = p.milestones.filter((m) => m.status === 'released').reduce((s, m) => s + m.amount, 0);
  const inEscrow = p.milestones.filter((m) => m.status === 'funded' || m.status === 'in_progress' || m.status === 'submitted').reduce((s, m) => s + m.amount, 0);
  const done = p.milestones.filter((m) => m.status === 'released').length;
  return { total, released, inEscrow, done, count: p.milestones.length, progress: done / p.milestones.length };
}

export function getProject(id?: string | string[]) {
  const key = Array.isArray(id) ? id[0] : id;
  return Projects.find((p) => p.id === key) ?? Projects[0];
}

export const MILESTONE_LABEL: Record<MilestoneStatus, string> = {
  released: 'Paid',
  in_progress: 'In progress',
  submitted: 'In review',
  funded: 'Funded',
  upcoming: 'Not funded yet',
};

export interface Reminder {
  title: string;
  subtitle: string;
  dueAt: number;
  route: string;
  projectId: string;
  milestoneId: string;
}

/** The most urgent deadline for this role: work due (freelancer) or a review window closing (client). */
export function nextReminder(role: 'freelancer' | 'client'): Reminder | null {
  const wanted: MilestoneStatus[] = role === 'client' ? ['submitted'] : ['in_progress', 'funded'];
  let best: Reminder | null = null;
  for (const p of Projects) {
    for (const m of p.milestones) {
      if (!m.dueAt || !wanted.includes(m.status)) continue;
      if (best && m.dueAt >= best.dueAt) continue;
      best = {
        title: role === 'client' ? 'Review due' : 'Milestone due',
        subtitle: role === 'client' ? `${m.title} auto-releases ${cedis(m.amount)}` : `${m.title} · ${p.company.name}`,
        dueAt: m.dueAt,
        route: `/project/${p.id}`,
        projectId: p.id,
        milestoneId: m.id,
      };
    }
  }
  return best;
}
