
import React, { useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { FileTextIcon } from './icons/FileTextIcon';

interface ScriptUploadProps {
  onFileChange: (file: File) => void;
  selectedFile?: File | null;
}

export const ScriptUpload: React.FC<ScriptUploadProps> = ({ onFileChange, selectedFile }) => {
  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
       if (file.type === 'text/plain') {
         onFileChange(file);
       } else {
         alert('Please select a valid text file (.txt).');
       }
    }
  };

  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    handleFileSelect(event.dataTransfer.files);
  }, []);

  return (
    <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold text-center text-cyan-400 tracking-wide">
            Step 2: Upload Script File
        </h2>
        <p className="mt-2 text-center text-gray-400">
            Provide the original script (.txt) to be synchronized with the audio.
        </p>
         {!selectedFile ? (
            <label
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="mt-6 w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-600 hover:border-cyan-500 rounded-lg cursor-pointer transition-colors duration-300 bg-gray-800/50 hover:bg-gray-700/50"
            >
                <UploadIcon className="w-12 h-12 text-gray-500 mb-4" />
                <span className="text-lg font-semibold text-gray-300">Drag & drop your script file here</span>
                <span className="text-gray-500 mt-1">or</span>
                <span className="mt-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-md">Browse Files</span>
                <input
                    type="file"
                    className="hidden"
                    accept=".txt,text/plain"
                    onChange={(e) => handleFileSelect(e.target.files)}
                />
            </label>
        ) : (
             <div className="mt-6 w-full flex flex-col items-center justify-center p-4 border-2 border-dashed border-cyan-700 rounded-lg bg-gray-700/50">
                <FileTextIcon className="w-12 h-12 text-cyan-400 mb-3" />
                <p className="text-lg font-semibold text-gray-200">{selectedFile.name}</p>
                <p className="text-sm text-gray-400">Script material loaded.</p>
                <label className="text-cyan-400 hover:text-cyan-300 text-sm mt-2 cursor-pointer">
                    Choose a different script
                    <input
                        type="file"
                        className="hidden"
                        accept=".txt,text/plain"
                        onChange={(e) => handleFileSelect(e.target.files)}
                    />
                </label>
            </div>
        )}
    </div>
  );
};
