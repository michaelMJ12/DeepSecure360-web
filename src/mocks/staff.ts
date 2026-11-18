import type { StaffTask } from '@/types/models';

const day = 86_400_000;
const ago = (d: number) => new Date(Date.now() - d * day).toISOString();
const ahead = (d: number) => new Date(Date.now() + d * day).toISOString();

const titles = [
  'Review PowerShell alert on WKS-104',
  'Follow up with client on DS360-2026-0003',
  'Collect memory dump from WKS-108',
  'Write weekly SOC summary',
  'Verify patch rollout for CVE-2024-6387',
  'Triage new phishing report',
];
const statuses = ['todo', 'in_progress', 'done'] as const;
const severities = ['critical', 'high', 'medium', 'low'] as const;

export const mockStaffTasks: StaffTask[] = titles.map((title, i) => ({
  id: `task-${i + 1}`,
  title,
  related_case: `DS360-2026-000${(i % 6) + 1}`,
  due_date: i % 3 === 0 ? ago(1) : ahead(i),
  status: statuses[i % statuses.length],
  priority: severities[i % severities.length],
}));
