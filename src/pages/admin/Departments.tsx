import React, { useState } from 'react';
import { departmentsService } from '../../services';
import { Layout, Spinner } from '../../components/common';
import { useFetch } from '../../hooks/useFetch';
import { Department } from '../../types';

const Departments: React.FC = () => {
    const { data: departments, loading, error, execute: fetchDepartments, setData: setDepartments } = useFetch(() => departmentsService.getAll());
    const [name, setName] = useState('');
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

    const rolesList = ['ADMIN', 'DEPARTMENT_USER'];

    const handleRoleToggle = (role: string) => {
        setSelectedRoles((prev: string[]) =>
            prev.includes(role) ? prev.filter((r: string) => r !== role) : [...prev, role]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;

        setSubmitting(true);
        try {
            if (editingDepartment) {
                const updated = await departmentsService.update(editingDepartment.id, { name, roles: selectedRoles });
                const updatedList = departments?.map((d: Department) => d.id === updated.id ? updated : d) || [];
                setDepartments(updatedList);
                setEditingDepartment(null);
            } else {
                const newDept = await departmentsService.create({ name, roles: selectedRoles });
                const newList = departments ? [...departments, newDept] : [newDept];
                setDepartments(newList);
            }
            setName('');
            setSelectedRoles([]);
        } catch (err) {
            alert('Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (dept: Department) => {
        setEditingDepartment(dept);
        setName(dept.name);
        setSelectedRoles(dept.roles || []);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this department?')) return;
        try {
            await departmentsService.remove(id);
            setDepartments(departments?.filter(d => d.id !== id) || null);
        } catch (err) {
            alert('Failed to delete department');
        }
    };

    return (
        <Layout>
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">
                            {editingDepartment ? 'Edit Department' : 'Create New Department'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Department Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. IT, Operations"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Assigned Roles</label>
                                <div className="space-y-2">
                                    {rolesList.map(role => (
                                        <label key={role} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedRoles.includes(role)}
                                                onChange={() => handleRoleToggle(role)}
                                                className="rounded text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700">{role}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:bg-blue-300 transition"
                                >
                                    {submitting ? <Spinner size="sm" /> : (editingDepartment ? 'Update' : 'Create')}
                                </button>
                                {editingDepartment && (
                                    <button
                                        type="button"
                                        onClick={() => { setEditingDepartment(null); setName(''); setSelectedRoles([]); }}
                                        className="px-4 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">Departments</h2>
                            <button onClick={() => fetchDepartments()} className="text-blue-600 font-bold text-sm hover:underline">Refresh</button>
                        </div>

                        {error && <div className="m-6 p-4 bg-red-50 text-red-600 rounded-xl">{error}</div>}

                        <div className="divide-y">
                            {loading && !departments ? <div className="p-12 text-center"><Spinner /></div> :
                                !departments || departments.length === 0 ? <div className="p-12 text-center text-gray-500 italic">No departments found.</div> :
                                    departments.map(dept => (
                                        <div key={dept.id} className="p-6 hover:bg-gray-50 transition-colors flex justify-between items-center">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">{dept.name}</h3>
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {dept.roles?.map(role => (
                                                        <span key={role} className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-100 uppercase">
                                                            {role}
                                                        </span>
                                                    ))}
                                                    {(!dept.roles || dept.roles.length === 0) && <span className="text-xs text-gray-400 italic">No roles assigned</span>}
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button onClick={() => handleEdit(dept)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M18.364 5.636a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.536-8.536z" /></svg>
                                                </button>
                                                <button onClick={() => handleDelete(dept.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
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

export default Departments;
