/**
 * DevPay Assistant — rule-based answers from the app's own listings and policies.
 * No AI service yet: this keeps answers grounded in local data until the backend arrives.
 */
import { Jobs, Job } from '@/constants/jobs';
import { TalentList, Talent } from '@/constants/talent';
import type { Role } from '@/contexts/AuthContext';

export interface Answer {
  text: string;
  jobs?: Job[];
  talent?: Talent[];
  followUps: string[];
}

const FAQ: { match: RegExp; text: (role: Role) => string; followUps: (role: Role) => string[] }[] = [
  {
    match: /escrow|safe|protect|secure/,
    text: () =>
      'Every milestone is funded into escrow before work starts. The client releases it after approving the work, or it releases automatically 7 days after submission if they don’t respond.',
    followUps: (r) => (r === 'client' ? ['How do I release payment?', 'Find a React Native developer'] : ['When do I get paid?', 'Remote React Native jobs']),
  },
  {
    match: /paid|payout|withdraw|momo|mobile money|cash out/,
    text: () =>
      'Approved milestones land in your DevPay wallet. Withdraw to MTN MoMo, Telecel Cash or your bank from Earnings. MoMo payouts carry a 1% network fee, capped.',
    followUps: () => ['How does escrow work?', 'How do I get verified?'],
  },
  {
    match: /release|approve|pay (the )?freelancer/,
    text: () =>
      'Open Contracts, choose the milestone marked “In review”, check the files, then tap Release. You can request changes up to twice instead.',
    followUps: () => ['How does escrow work?', 'What happens in a dispute?'],
  },
  {
    match: /verif|ghana card|trusted|badge|kyc/,
    text: (r) =>
      r === 'client'
        ? 'Verify your business with your registration, GRA TIN and a director’s Ghana Card, then pay the one-time GH₵ 150 fee. Verified clients can hire and fund larger escrows.'
        : 'Verify your Ghana Card, then pay the one-time GH₵ 50 fee. You get the Verified badge, verified-only jobs and higher placement in search.',
    followUps: (r) => (r === 'client' ? ['Top rated developers', 'How does escrow work?'] : ['Remote React Native jobs', 'When do I get paid?']),
  },
  {
    match: /dispute|refund|problem|scam|complain/,
    text: () =>
      'If you can’t agree on a milestone, open a dispute from the contract. DevPay reviews the contract, chat history and submitted work, and the escrowed money stays put until it’s resolved.',
    followUps: () => ['How does escrow work?', 'How do I get verified?'],
  },
  {
    match: /price|plan|pro\b|premium|subscription|cost/,
    text: (r) =>
      r === 'client'
        ? 'DevPay Basic is free. Business is GH₵ 99/month (GH₵ 79 yearly) with up to 5 open jobs and a 1% escrow fee.'
        : 'Starter is free. Pro is GH₵ 49/month (GH₵ 39 yearly) with unlimited proposals and a 1.5% fee. Elite is GH₵ 89/month with no fee.',
    followUps: () => ['How do I get verified?', 'When do I get paid?'],
  },
];

const budgetFloor = (j: Job) => Number(j.budget.replace(/[^\d,-]/g, '').split('-')[0].replace(/,/g, '')) || 0;

const CATEGORY_WORDS: [RegExp, string][] = [
  [/design|ui|ux|figma/, 'UI/UX Design'],
  [/react|mobile|developer|engineer|expo|app|code|dev/, 'Tech & Dev'],
  [/writ|content|copy/, 'Writing'],
  [/market/, 'Marketing'],
];

function searchJobs(q: string): Job[] {
  let list = [...Jobs];
  const over = q.match(/(?:over|above|more than|at least|from)\s*(?:gh₵|ghs|gh)?\s*([\d,]+)/);
  if (over) {
    const min = Number(over[1].replace(/,/g, ''));
    list = list.filter((j) => budgetFloor(j) >= min);
  }
  if (/remote/.test(q)) list = list.filter((j) => j.workplace === 'Remote' || j.tags.includes('Remote'));
  if (/hybrid/.test(q)) list = list.filter((j) => j.workplace === 'Hybrid');
  const cat = CATEGORY_WORDS.find(([re]) => re.test(q));
  if (cat) list = list.filter((j) => j.category === cat[1] || j.title.toLowerCase().includes(q.split(' ')[0]));
  const city = ['accra', 'kumasi', 'tema', 'takoradi'].find((c) => q.includes(c));
  if (city) list = list.filter((j) => j.location.toLowerCase() === city || j.company.city.toLowerCase() === city);
  return list.sort((a, b) => budgetFloor(b) - budgetFloor(a));
}

function searchTalent(q: string): Talent[] {
  let list = [...TalentList];
  const words = q.split(/\W+/).filter((w) => w.length > 2);
  const skillHit = list.filter((t) => words.some((w) => `${t.title} ${t.skills.join(' ')}`.toLowerCase().includes(w)));
  if (skillHit.length) list = skillHit;
  if (/available|now|free/.test(q)) list = list.filter((t) => t.available);
  if (/verified|trusted/.test(q)) list = list.filter((t) => t.verified);
  return list.sort((a, b) => b.rating - a.rating || b.jobsDone - a.jobsDone);
}

export function answer(raw: string, role: Role): Answer {
  const q = raw.toLowerCase().trim();
  const faq = FAQ.find((f) => f.match.test(q));
  const looksLikeSearch = /job|work|gig|find|show|hire|developer|designer|writer|engineer|talent|freelancer|remote|over|above/.test(q);
  if (faq && !looksLikeSearch) return { text: faq.text(role), followUps: faq.followUps(role) };

  if (role === 'client') {
    const talent = searchTalent(q);
    return talent.length
      ? {
          text: talent.length > 1 ? `I found ${talent.length} freelancers that match, top rated first.` : 'I found 1 freelancer that matches.',
          talent: talent.slice(0, 4),
          followUps: ['Only available now', 'How does escrow work?', 'How do I get verified?'],
        }
      : {
          text: 'No freelancers match that yet. Try a skill like “Figma”, “React Native” or “Node.js”.',
          followUps: ['Find a Figma designer', 'Top rated developers'],
        };
  }

  const jobs = searchJobs(q);
  return jobs.length
    ? {
        text: jobs.length > 1 ? `Here are ${jobs.length} jobs that match, highest budget first.` : 'Here is 1 job that matches.',
        jobs: jobs.slice(0, 4),
        followUps: ['Only remote jobs', 'Jobs over GH₵ 4,000', 'When do I get paid?'],
      }
    : {
        text: 'Nothing matches that right now. Try a skill, a city like Accra, or a budget such as “over GH₵ 3,000”.',
        followUps: ['Remote React Native jobs', 'Design jobs in Accra'],
      };
}

export const STARTERS: Record<Role, string[]> = {
  freelancer: ['Remote React Native jobs', 'Jobs over GH₵ 4,000', 'How does escrow work?', 'When do I get paid?'],
  client: ['Find a Figma designer', 'Top rated developers', 'How do I release payment?', 'How do I get verified?'],
};
