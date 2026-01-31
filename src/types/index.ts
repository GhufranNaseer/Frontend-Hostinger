export interface User {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'DEPARTMENT_USER';
    department?: Department;
}

export interface Department {
    id: string;
    name: string;
    roles?: string[];
}

export interface Event {
    id: string;
    name: string;
    description?: string;
    eventDate: string;
    createdBy: {
        id: string;
        name: string;
        email: string;
    };
    createdAt: string;
    tasks?: Task[];
    _count?: {
        tasks: number;
    };
}

export interface Task {
    id: string;
    eventId: string;
    sNo: number;
    taskName: string;
    description: string;
    departmentName: string;
    createdAt: string;
    event?: Pick<Event, 'id' | 'name' | 'eventDate'>;
    assignments?: Assignment[];
}

export interface Assignment {
    id: string;
    taskId: string;
    userId?: string;
    departmentId?: string;
    assignedAt: string;
    user?: Pick<User, 'id' | 'name' | 'email'>;
    department?: Pick<Department, 'id' | 'name'>;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    user: User;
}
