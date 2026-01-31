import React from 'react';
import { Spinner } from '../common';

interface ImportPreviewRow {
    sNo: number | null;
    taskName: string;
    description: string;
    departmentName: string;
    remark?: string;
    userName?: string;
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

interface ImportPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: ImportPreviewRow[];
    onConfirm: () => void;
    isSubmitting: boolean;
    stats: {
        total: number;
        valid: number;
        warnings: number;
        errors: number;
    };
}

const ImportPreviewModal: React.FC<ImportPreviewModalProps> = ({ isOpen, onClose, data, onConfirm, isSubmitting, stats }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-2xl leading-6 font-black text-gray-900" id="modal-title">
                                    Import Preview
                                </h3>
                                <div className="mt-2">
                                    <div className="flex space-x-4 mb-4 text-sm font-bold">
                                        <span className="text-gray-500">Total: {stats.total}</span>
                                        <span className="text-green-600">Valid: {stats.valid}</span>
                                        <span className="text-yellow-600">Warnings: {stats.warnings}</span>
                                        <span className="text-red-600">Errors: {stats.errors}</span>
                                    </div>

                                    <div className="max-h-[60vh] overflow-y-auto border rounded-xl">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50 sticky top-0">
                                                <tr>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dept</th>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User (Match)</th>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remark</th>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issues</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200 text-sm">
                                                {data.map((row, idx) => (
                                                    <tr key={idx} className={!row.isValid ? 'bg-red-50' : row.warnings.length > 0 ? 'bg-yellow-50' : ''}>
                                                        <td className="px-3 py-2 whitespace-nowrap">
                                                            {row.isValid ? (
                                                                row.warnings.length > 0 ?
                                                                    <span className="text-yellow-600 font-bold">⚠ Warning</span> :
                                                                    <span className="text-green-600 font-bold">✓ Ready</span>
                                                            ) : (
                                                                <span className="text-red-600 font-bold">✕ Error</span>
                                                            )}
                                                        </td>
                                                        <td className="px-3 py-2">{row.sNo}</td>
                                                        <td className="px-3 py-2 font-medium">{row.taskName}</td>
                                                        <td className="px-3 py-2">{row.departmentName}</td>
                                                        <td className="px-3 py-2">{row.userName || '-'}</td>
                                                        <td className="px-3 py-2 text-gray-500 italic">{row.remark || '-'}</td>
                                                        <td className="px-3 py-2 text-xs">
                                                            {row.errors.map((e, i) => <div key={i} className="text-red-600 font-bold">{e}</div>)}
                                                            {row.warnings.map((w, i) => <div key={i} className="text-yellow-700">{w}</div>)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {stats.errors > 0 && (
                                        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm font-bold">
                                            Cannot proceed: Fix {stats.errors} errors in your file and re-upload.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            disabled={isSubmitting || stats.errors > 0}
                            onClick={onConfirm}
                            className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none disabled:bg-gray-400 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            {isSubmitting ? <Spinner size="sm" color="white" /> : 'Confirm Import'}
                        </button>
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={onClose}
                            className="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImportPreviewModal;
