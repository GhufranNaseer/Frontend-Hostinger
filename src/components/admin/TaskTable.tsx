import React, { useState } from 'react';
import { Task, User, Department } from '../../types';
import { assignmentsService } from '../../services/assignments.service';

interface TaskTableProps {
    tasks: Task[];
    users: User[];
    departments: Department[];
    onRefresh: () => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, users, departments, onRefresh }) => {
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [assigneeId, setAssigneeId] = useState('');
    const [assignType, setAssignType] = useState<'user' | 'department'>('department');
    const [submitting, setSubmitting] = useState(false);

    const toggleSelect = (id: string) => {
        setSelectedTasks(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    const handleBulkAssign = async () => {
        if (!assigneeId || selectedTasks.length === 0) return;

        setSubmitting(true);
        try {
            await Promise.all(
                selectedTasks.map(taskId =>
                    assignmentsService.create({
                        taskId,
                        userId: assignType === 'user' ? assigneeId : undefined,
                        departmentId: assignType === 'department' ? assigneeId : undefined,
                    })
                )
            );
            setSelectedTasks([]);
            setShowModal(false);
            onRefresh();
        } catch (err) {
            alert('Failed to assign tasks');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col">
            <div className="mb-4 flex justify-between items-center">
                <span className="text-sm text-gray-600 font-medium">
                    {selectedTasks.length} tasks selected
                </span>
                <button
                    onClick={() => setShowModal(true)}
                    disabled={selectedTasks.length === 0}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-300 transition"
                >
                    Assign Selected Tasks
                </button>
            </div>

            <div className="overflow-x-auto border rounded-xl shadow-sm bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left">
                                <input
                                    type="checkbox"
                                    onChange={(e) => {
                                        if (e.target.checked) setSelectedTasks(tasks.map(t => t.id));
                                        else setSelectedTasks([]);
                                    }}
                                    checked={selectedTasks.length === tasks.length && tasks.length > 0}
                                    className="rounded text-blue-600 outline-none"
                                />
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">S.No</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Task</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Department</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Assigned To</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {tasks.map((task) => (
                            <tr key={task.id} className="hover:bg-blue-50 transition">
                                <td className="px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedTasks.includes(task.id)}
                                        onChange={() => toggleSelect(task.id)}
                                        className="rounded text-blue-600 outline-none"
                                    />
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">{task.sNo}</td>
                                <td className="px-4 py-3">
                                    <p className="text-sm font-bold text-gray-900">{task.taskName}</p>
                                    <p className="text-xs text-gray-500 truncate max-w-xs">{task.description}</p>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                                        {task.departmentName}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm">
                                    {task.assignments && task.assignments.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {task.assignments.map(a => (
                                                <span key={a.id} className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold">
                                                    {a.user?.name || a.department?.name}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 italic">Unassigned</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Assignment Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 font-display">Assign {selectedTasks.length} Tasks</h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Assign to Type</label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            className="text-blue-600"
                                            checked={assignType === 'department'}
                                            onChange={() => { setAssignType('department'); setAssigneeId(''); }}
                                        />
                                        <span className="ml-2 text-sm">Department</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            className="text-blue-600"
                                            checked={assignType === 'user'}
                                            onChange={() => { setAssignType('user'); setAssigneeId(''); }}
                                        />
                                        <span className="ml-2 text-sm">Specific User</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Select {assignType === 'department' ? 'Department' : 'User'}
                                </label>
                                <select
                                    value={assigneeId}
                                    onChange={(e) => setAssigneeId(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">Select an option</option>
                                    {assignType === 'department' ? (
                                        departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)
                                    ) : (
                                        users.filter(u => u.role === 'DEPARTMENT_USER').map(u => <option key={u.id} value={u.id}>{u.name} ({u.department?.name})</option>)
                                    )}
                                </select>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleBulkAssign}
                                    disabled={!assigneeId || submitting}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:bg-blue-300 shadow-lg shadow-blue-200"
                                >
                                    {submitting ? 'Assigning...' : 'Confirm'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(TaskTable);
