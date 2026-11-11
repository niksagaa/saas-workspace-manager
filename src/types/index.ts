export type UserRole = "OWNER" | 'ADMIN' | 'MEMBER' | 'GUEST'
export type TaskStatus = 'TO_DO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export const TASK_STATUS_LIST: TaskStatus[] = ['TO_DO', 'IN_PROGRESS', 'REVIEW', 'DONE']
export const TASK_PRIORITY_LIST: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']

export interface Workspace {
    id: string;
    name: string;
    slug: string;
    created_at: string
}

export interface WorkspaceMember {
    id: string;
    workspace_id: string;
    user_id: string;
    role: UserRole;
    created_at: string
}

export interface Board {
    id: string;
    workspace_id: string;
    title: string;
    description?: string,
    created_at: string
}

export interface Task {
    id: string;
    board_id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    assigned_to?: string;
    due_date?: string;
    position: number;
    created_at: string
}

export interface TaskComment {
    id: string;
    task_id: string;
    user_id: string;
    content: string;
    created_at: string;
}