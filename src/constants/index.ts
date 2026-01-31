export const APP_CONFIG = {
    DEFAULT_DATE_FORMAT: 'medium',
    API_BASE_URL: '/api',
};

export const ROLES = {
    ADMIN: 'ADMIN',
    DEPARTMENT_USER: 'DEPARTMENT_USER',
} as const;

export const TASK_STATUS = {
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
};

export const ERROR_MESSAGES = {
    DEFAULT: 'An error occurred. Please try again.',
    FETCH_FAILED: 'Failed to load data. Please refresh the page.',
    UNAUTHORIZED: 'You are not authorized to access this resource.',
};
