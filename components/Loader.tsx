
import React, { useState, useEffect } from 'react';
import { CogIcon } from './icons/CogIcon';

const loadingMessages = [
    "Engaging transcription protocols...",
    "Robot is analyzing audio waves...",
    "Calibrating phonetic synthesizers...",
    "Assembling text fragments...",
    "Finalizing production...",
    "Running quality assurance checks..."
];

export const Loader: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
        }, 2500);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center p-8">
            <CogIcon className="w-20 h-20 text-cyan-400 animate-spin-slow" />
            <h2 className="mt-6 text-2xl font-bold text-cyan-300 tracking-wider">Production In Progress</h2>
            <p className="mt-2 text-gray-400 animate-pulse transition-opacity duration-500">
                {loadingMessages[messageIndex]}
            </p>
        </div>
    );
};
