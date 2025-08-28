
import React from 'react';
import { FactoryIcon } from './icons/FactoryIcon';

export const Header: React.FC = () => {
    return (
        <header className="text-center">
            <div className="inline-flex items-center justify-center">
                <FactoryIcon className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400" />
                <h1 className="ml-4 text-4xl sm:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400">
                    Audio Factory
                </h1>
            </div>
            <p className="mt-2 text-lg text-gray-400">
                Automated SRT Subtitle Generator
            </p>
        </header>
    );
}
