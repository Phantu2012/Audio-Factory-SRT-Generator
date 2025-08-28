
import React, { useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { AudioFileIcon } from './icons/AudioFileIcon';


interface FileUploadProps {
  onFileChange: (file: File) => void;
  selectedFile?: File | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, selectedFile }) => {
  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
       if (file.type.startsWith('audio/')) {
         onFileChange(file);
       } else {
         alert('Please select a valid audio file (e.g., MP3, WAV, M4A).');
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
            Step 1: Upload Audio Material
        </h2>
        <p className="mt-2 text-center text-gray-400">
            The machine requires an audio source file (.mp3, .wav, .m4a).
        </p>
        {!selectedFile ? (
            <label
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="mt-6 w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-600 hover:border-cyan-500 rounded-lg cursor-pointer transition-colors duration-300 bg-gray-800/50 hover:bg-gray-700/50"
            >
                <UploadIcon className="w-12 h-12 text-gray-500 mb-4" />
                <span className="text-lg font-semibold text-gray-300">Drag & drop your audio file here</span>
                <span className="text-gray-500 mt-1">or</span>
                <span className="mt-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-md">Browse Files</span>
                <input
                type="file"
                className="hidden"
                accept="audio/*"
                onChange={(e) => handleFileSelect(e.target.files)}
                />
            </label>
        ) : (
             <div className="mt-6 w-full flex flex-col items-center justify-center p-4 border-2 border-dashed border-cyan-700 rounded-lg bg-gray-700/50">
                <AudioFileIcon className="w-12 h-12 text-cyan-400 mb-3" />
                <p className="text-lg font-semibold text-gray-200">{selectedFile.name}</p>
                <p className="text-sm text-gray-400">Audio material loaded.</p>
                <label className="text-cyan-400 hover:text-cyan-300 text-sm mt-2 cursor-pointer">
                    Choose a different file
                    <input
                        type="file"
                        className="hidden"
                        accept="audio/*"
                        onChange={(e) => handleFileSelect(e.target.files)}
                    />
                </label>
            </div>
        )}
    </div>
  );
};
