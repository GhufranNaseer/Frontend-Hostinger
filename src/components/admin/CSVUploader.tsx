import React, { useState, useRef } from 'react';
import { tasksService } from '../../services/tasks.service';
import ImportPreviewModal from './ImportPreviewModal';

interface CSVUploaderProps {
    eventId: string;
    onUploadSuccess: () => void;
}

const CSVUploader: React.FC<CSVUploaderProps> = ({ eventId, onUploadSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Preview State
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [previewStats, setPreviewStats] = useState({ total: 0, valid: 0, warnings: 0, errors: 0 });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (!selectedFile.name.match(/\.(csv|xlsx|xls)$/)) {
                setError('Please select a valid CSV or Excel file');
                setFile(null);
                return;
            }
            setFile(selectedFile);
            setError(null);
            setValidationErrors([]);
        }
    };

    const handlePreview = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);
        setValidationErrors([]);

        try {
            const response = await tasksService.uploadPreview(eventId, file);
            setPreviewData(response.preview);
            setPreviewStats(response.stats);
            setShowPreview(true);
        } catch (err: unknown) {
            const axiosError = err as any;
            if (axiosError.response?.data?.message === 'CSV validation failed') {
                setValidationErrors(axiosError.response.data.errors || []);
            } else {
                setError(axiosError.response?.data?.message || 'Failed to parse file.');
            }
        } finally {
            setUploading(false);
        }
    };

    const handleConfirmImport = async () => {
        setUploading(true);
        try {
            await tasksService.confirmImport(eventId, previewData);

            // Success
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            setShowPreview(false);
            onUploadSuccess();
        } catch (err: unknown) {
            const axiosError = err as any;
            setError(axiosError.response?.data?.message || 'Failed to import tasks.');
            setShowPreview(false); // Close preview on error? Or keep open? Close is safer to reset.
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <div className="bg-white p-6 rounded-xl border-2 border-dashed border-gray-300">
                <div className="text-center">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                    >
                        <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <div className="mt-4 flex text-sm text-gray-600 justify-center">
                        <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                        >
                            <span>Upload File</span>
                            <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                accept=".csv, .xlsx, .xls"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">Supported: CSV, Excel (.xlsx)</p>
                </div>

                {file && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-700 truncate">{file.name}</span>
                        <button
                            onClick={handlePreview}
                            disabled={uploading}
                            className="bg-blue-600 text-white px-4 py-1 rounded text-sm font-bold hover:bg-blue-700 disabled:bg-blue-300 transition"
                        >
                            {uploading ? 'Processing...' : 'Review & Import'}
                        </button>
                    </div>
                )}

                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
                        {error}
                    </div>
                )}

                {validationErrors.length > 0 && (
                    <div className="mt-4 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
                        <p className="font-bold text-sm mb-2 text-red-900">Validation Errors:</p>
                        <ul className="list-disc list-inside text-xs space-y-1">
                            {validationErrors.slice(0, 5).map((err, i) => (
                                <li key={i}>{err}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <ImportPreviewModal
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
                data={previewData}
                stats={previewStats}
                onConfirm={handleConfirmImport}
                isSubmitting={uploading}
            />
        </>
    );
};

export default CSVUploader;
