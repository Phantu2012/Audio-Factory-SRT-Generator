
import React, { useState } from 'react';
import { KeyIcon } from './icons/KeyIcon';

interface ApiKeyInputProps {
  onApiKeySubmit: (apiKey: string) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySubmit }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (apiKey.trim()) {
      onApiKeySubmit(apiKey.trim());
    }
  };

  return (
    <div className="flex flex-col items-center text-center animate-fade-in">
      <KeyIcon className="w-16 h-16 text-cyan-400" />
      <h2 className="mt-4 text-2xl font-bold text-cyan-300 tracking-wide">Factory Authorization Required</h2>
      <p className="mt-2 text-gray-400 max-w-md">
        To power the machinery, please provide your Google Gemini API key. Your key is stored locally in your browser and is never sent to our servers.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm mt-8">
        <div className="flex flex-col items-center">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Gemini API key"
            className="w-full px-4 py-3 bg-gray-900/70 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
            required
            aria-label="Gemini API Key"
          />
          <button
            type="submit"
            className="mt-4 w-full inline-flex items-center justify-center px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-400/50 shadow-lg shadow-cyan-600/30"
          >
            Authorize and Start
          </button>
        </div>
      </form>
      <p className="mt-6 text-xs text-gray-500">
        Don't have a key? Get one for free at{' '}
        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline">
          Google AI Studio
        </a>.
      </p>
    </div>
  );
};
