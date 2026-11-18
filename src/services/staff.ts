import type { StaffTask } from '@/types/models';
import { mockStaffTasks } from '@/mocks/staff';
import { createService } from './resourceService';

export const staffTaskService = createService<StaffTask>('/staff/tasks', mockStaffTasks, ['title', 'related_case', 'status']);
