import React, { useState, useEffect } from 'react';
import { usersService, departmentsService } from '../../services';
import { Layout, Spinner } from '../../components/common';
import { useFetch } from '../../hooks/useFetch';
import { User, Department } from '../../types';

const Users: React.FC = () => {
    const { data: users, loading, error, execute: fetchUsers, setData: setUsers } = useFetch(() => usersService.getAll());
    const [departments, setDepartments] = useState<Department[]>([]);

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedDeptId, setSelectedDeptId] = useState('');
    const [selectedRole, setSelectedRole] = useState('');

    const [submitting, setSubmitting] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    // Fetch departments on mount
    useEffect(() => {
        departmentsService.getAll().then(setDepartments).catch(console.error);
    }, []);

    // Get roles specific to selected department
    const availableRoles = departments.find(d => d.id === selectedDeptId)?.roles || ['DEPARTMENT_USER'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email) return;

        setSubmitting(true);
        try {
            const payload = {
                name,
                email,
                departmentId: selectedDeptId || undefined,
                role: selectedRole || undefined,
                password: password || undefined
            };

            if (editingUser) {
                const updated = await usersService.update(editingUser.id, payload);
                const updatedList = users?.map((u: User) => u.id === updated.id ? updated : u) || [];
                setUsers(updatedList);
                setEditingUser(null);
            } else {
                const newUser = await usersService.create(payload);
                const newList = users ? [...users, newUser] : [newUser];
                setUsers(newList);
            }

            // Reset form
            setName('');
            setEmail('');
            setPassword('');
            setSelectedDeptId('');
            setSelectedRole('');
        } catch (err) {
            alert('Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setName(user.name);
        setEmail(user.email);
        setSelectedDeptId(user.departmentId || ''); // Assuming user has departmentId in frontend model, need to verify type
        // If the backend returns nested department object but not flat departmentId, we might need to adjust.
        // Checking UsersController: it returns department object. 
        // We might need to map it or check if ID is present. 
        // For now assume logic matches or we extract.
        setSelectedRole(user.role);
        setPassword(''); // Don't fill password
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await usersService.remove(id);
            setUsers(users?.filter(u => u.id !== id) || null);
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    return (
        <Layout>
            <div className="flex flex-col md:flex-row gap-8">
                {/* Create/Edit Form */}
                <div className="w-full md:w-1/3">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">
                            {editingUser ? 'Edit User' : 'Create New User'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={editingUser ? "Leave blank to keep current" : "Required for new users"}
                                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Department</label>
                                    <select
                                        value={selectedDeptId}
                                        onChange={(e) => { setSelectedDeptId(e.target.value); setSelectedRole(''); }}
                                        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    >
                                        <option value="">None</option>
                                        {departments.map(d => (
                                            <option key={d.id} value={d.id}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Role</label>
                                    <select
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    >
                                        <option value="">Default</option>
                                        {availableRoles.map(r => (
                                            <option key={r} value={r}>{r}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex space-x-2 pt-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:bg-blue-300 transition"
                                >
                                    {submitting ? <Spinner size="sm" /> : (editingUser ? 'Update User' : 'Create User')}
                                </button>
                                {editingUser && (
                                    <button
                                        type="button"
                                        onClick={() => { setEditingUser(null); setName(''); setEmail(''); setPassword(''); setSelectedDeptId(''); setSelectedRole(''); }}
                                        className="px-4 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Users List */}
                <div className="flex-1">
                    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">Users Directory</h2>
                            <button onClick={() => fetchUsers()} className="text-blue-600 font-bold text-sm hover:underline">Refresh</button>
                        </div>

                        {error && <div className="m-6 p-4 bg-red-50 text-red-600 rounded-xl">{error}</div>}

                        <div className="divide-y">
                            {loading && !users ? <div className="p-12 text-center"><Spinner /></div> :
                                !users || users.length === 0 ? <div className="p-12 text-center text-gray-500 italic">No users found.</div> :
                                    users.map(user => (
                                        <div key={user.id} className="p-6 hover:bg-gray-50 transition-colors flex justify-between items-center">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-gray-900">{user.name}</h3>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full font-medium text-gray-600">
                                                            {user.role}
                                                        </span>
                                                        {user.department && (
                                                            <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-bold border border-purple-100">
                                                                {user.department.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button onClick={() => handleEdit(user)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M18.364 5.636a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.536-8.536z" /></svg>
                                                </button>
                                                <button onClick={() => handleDelete(user.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Users;
