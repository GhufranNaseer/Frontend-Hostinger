import React, { useState, useRef } from 'react';
import { tasksService } from '../../services/tasks.service';

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (!selectedFile.name.endsWith('.csv')) {
                setError('Please select a valid CSV file');
                setFile(null);
                return;
            }
            setFile(selectedFile);
            setError(null);
            setValidationErrors([]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);
        setValidationErrors([]);

        try {
            await tasksService.uploadCSV(eventId, file);
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            onUploadSuccess();
        } catch (err: unknown) {
            const axiosError = err as any;
            if (axiosError.response?.data?.message === 'CSV validation failed') {
                setValidationErrors(axiosError.response.data.errors || []);
            } else {
                setError(axiosError.response?.data?.message || 'Failed to upload CSV. Please check the file format.');
            }
        } finally {
            setUploading(false);
        }
    };

    return (
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
                        <span>Upload a CSV file</span>
                        <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept=".csv"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                        />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">BOQ CSV with S.no, Task, Description, Name, Department</p>
            </div>

            {file && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-700 truncate">{file.name}</span>
                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="bg-blue-600 text-white px-4 py-1 rounded text-sm font-bold hover:bg-blue-700 disabled:bg-blue-300 transition"
                    >
                        {uploading ? 'Uploading...' : 'Upload Now'}
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
                        {validationErrors.slice(0, 10).map((err, i) => (
                            <li key={i}>{err}</li>
                        ))}
                        {validationErrors.length > 10 && (
                            <li className="font-bold underline">...and {validationErrors.length - 10} more errors</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CSVUploader;
