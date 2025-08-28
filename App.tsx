
import React, { useState, useCallback, useEffect } from 'react';
import { generateSrtFromAudioAndScript } from './services/geminiService';
import { FileUpload } from './components/FileUpload';
import { ScriptUpload } from './components/ScriptUpload';
import { Loader } from './components/Loader';
import { TranscriptDisplay } from './components/TranscriptDisplay';
import { Header } from './components/Header';
import { RobotIcon } from './components/icons/RobotIcon';
import { ErrorDisplay } from './components/ErrorDisplay';
import { ApiKeyInput } from './components/ApiKeyInput';

type AppStatus = 'idle' | 'loading' | 'success' | 'error';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isApiKeySet, setIsApiKeySet] = useState<boolean>(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [textFile, setTextFile] = useState<File | null>(null);
  const [scriptContent, setScriptContent] = useState<string>('');
  const [srtResult, setSrtResult] = useState<string>('');
  const [status, setStatus] = useState<AppStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      setIsApiKeySet(true);
    }
  }, []);

  const handleApiKeySubmit = (key: string) => {
    if (key.trim()) {
      setApiKey(key);
      setIsApiKeySet(true);
      localStorage.setItem('gemini_api_key', key);
    }
  };

  const handleAudioFileChange = (file: File | null) => {
    if (file) {
      setAudioFile(file);
      // Reset subsequent steps if audio file changes
      setTextFile(null);
      setScriptContent('');
      setSrtResult('');
      setStatus('idle');
      setError(null);
    }
  };
  
  const handleTextFileChange = (file: File | null) => {
    if (file) {
      setTextFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
            setScriptContent(content);
            setStatus('idle');
            setSrtResult('');
            setError(null);
        } else {
            setError('The script file appears to be empty.');
            setStatus('error');
            setTextFile(null);
        }
      };
      reader.onerror = () => {
        setError('Failed to read the script file.');
        setStatus('error');
        setTextFile(null);
      }
      reader.readAsText(file);
    }
  };

  const handleGenerateSrt = useCallback(async () => {
    if (!audioFile) {
      setError('Please select an audio file first.');
      setStatus('error');
      return;
    }
    if (!scriptContent || !textFile) {
      setError('Please provide the script file.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setError(null);
    try {
      const result = await generateSrtFromAudioAndScript(audioFile, scriptContent, apiKey);
      setSrtResult(result);
      setStatus('success');
    } catch (err: unknown) {
      console.error('SRT Generation failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during SRT generation.';
      setError(`Production halt! ${errorMessage}`);
      setStatus('error');
    }
  }, [audioFile, textFile, scriptContent, apiKey]);

  const handleDownloadSrt = () => {
    if (!srtResult) return;
    const blob = new Blob([srtResult], { type: 'text/srt' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const fileName = audioFile?.name.replace(/\.[^/.]+$/, "") || 'subtitles';
    a.download = `${fileName}.srt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const resetState = () => {
    setAudioFile(null);
    setTextFile(null);
    setScriptContent('');
    setSrtResult('');
    setStatus('idle');
    setError(null);
  }

  const handleChangeApiKey = () => {
    setApiKey('');
    setIsApiKeySet(false);
    localStorage.removeItem('gemini_api_key');
    resetState();
  };

  const renderContent = () => {
    if (!isApiKeySet) {
      return <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} />;
    }
    switch (status) {
      case 'loading':
        return <Loader />;
      case 'error':
        return <ErrorDisplay message={error || 'An unknown error occurred.'} onReset={resetState} />;
      case 'success':
        return (
          <TranscriptDisplay
            srtContent={srtResult}
            onDownload={handleDownloadSrt}
            onReset={resetState}
            fileName={audioFile?.name || 'your_audio.mp3'}
          />
        );
      case 'idle':
      default:
        return (
          <div className="space-y-10">
            <FileUpload onFileChange={handleAudioFileChange} selectedFile={audioFile} />
            
            {audioFile && (
              <ScriptUpload onFileChange={handleTextFileChange} selectedFile={textFile} />
            )}

            {audioFile && textFile && scriptContent && (
              <div className="text-center pt-4">
                <button
                  onClick={handleGenerateSrt}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-400/50 shadow-lg shadow-cyan-600/30"
                >
                  <RobotIcon className="w-6 h-6 mr-3"/>
                  Start Production (Generate SRT)
                </button>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-3xl mx-auto">
        <Header />
        <main className="mt-8 bg-gray-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden">
          <div className="p-6 sm:p-8 md:p-10">
             {renderContent()}
          </div>
        </main>
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Audio Factory Inc. All rights reserved.</p>
          {isApiKeySet && (
            <button onClick={handleChangeApiKey} className="mt-2 text-cyan-500 hover:text-cyan-400 underline text-xs">
              Change API Key
            </button>
          )}
        </footer>
      </div>
    </div>
  );
};

export default App;
