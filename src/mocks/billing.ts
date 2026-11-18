import type { PlanTerm, SubscriptionPlan } from '@/types/models';

/** Tiered terms, like a hosting provider's renewal options — longer terms cost less per month. */
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  { term: '3m', label: '3 months', months: 3, price_cents: 15_000_00 },
  { term: '6m', label: '6 months', months: 6, price_cents: 27_000_00, savings_note: 'Save 10%' },
  { term: '1y', label: '1 year', months: 12, price_cents: 48_000_00, savings_note: 'Save 20%' },
  { term: '2y', label: '2 years', months: 24, price_cents: 90_000_00, savings_note: 'Save 25%' },
  { term: '3y', label: '3 years', months: 36, price_cents: 126_000_00, savings_note: 'Save 30%' },
  { term: '4y', label: '4 years', months: 48, price_cents: 158_000_00, savings_note: 'Save 34%' },
  { term: '5y', label: '5 years', months: 60, price_cents: 186_000_00, savings_note: 'Save 38%' },
];

export const planByTerm = (term: PlanTerm): SubscriptionPlan =>
  SUBSCRIPTION_PLANS.find((p) => p.term === term) ?? SUBSCRIPTION_PLANS[0];
