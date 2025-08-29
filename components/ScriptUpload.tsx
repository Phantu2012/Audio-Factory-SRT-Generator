
import React, { useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { FileTextIcon } from './icons/FileTextIcon';
import { useTranslation } from '../hooks/useTranslation';

interface ScriptUploadProps {
  onFileChange: (file: File) => void;
  selectedFile?: File | null;
}

export const ScriptUpload: React.FC<ScriptUploadProps> = ({ onFileChange, selectedFile }) => {
  const { t } = useTranslation();
  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
       if (file.type === 'text/plain') {
         onFileChange(file);
       } else {
         alert(t('fileUpload.invalidScriptType'));
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
        <h2 className="text-2xl font-bold text-center text-sky-600 dark:text-sky-400 tracking-wide">
            {t('fileUpload.titleScript')}
        </h2>
        <p className="mt-2 text-center text-slate-500 dark:text-slate-400">
            {t('fileUpload.descriptionScript')}
        </p>
         {!selectedFile ? (
            <label
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="mt-6 w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-sky-500 dark:hover:border-sky-400 rounded-lg cursor-pointer transition-colors duration-300 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50"
            >
                <UploadIcon className="w-12 h-12 text-slate-400 dark:text-slate-500 mb-4" />
                <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">{t('fileUpload.dragDropScript')}</span>
                <span className="text-slate-500 dark:text-slate-400 mt-1">{t('fileUpload.or')}</span>
                <span className="mt-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md">{t('fileUpload.browse')}</span>
                <input
                    type="file"
                    className="hidden"
                    accept=".txt,text/plain"
                    onChange={(e) => handleFileSelect(e.target.files)}
                />
            </label>
        ) : (
             <div className="mt-6 w-full flex flex-col items-center justify-center p-4 border-2 border-dashed border-sky-600 dark:border-sky-700 rounded-lg bg-sky-50 dark:bg-slate-700/50">
                <FileTextIcon className="w-12 h-12 text-sky-500 dark:text-sky-400 mb-3" />
                <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">{selectedFile.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('fileUpload.loadedScript')}</p>
                <label className="text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 text-sm mt-2 cursor-pointer font-medium">
                    {t('fileUpload.chooseDifferentScript')}
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
