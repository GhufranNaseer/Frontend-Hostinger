export const formatDate = (date: string | Date, options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }) => {
    return new Date(date).toLocaleDateString(undefined, options);
};

export const truncate = (text: string, length: number) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
};

export const getRoleDisplay = (role?: string) => {
    if (!role) return '';
    return role.replace('_', ' ');
};
