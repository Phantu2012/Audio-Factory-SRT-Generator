
import React, { useState, useCallback, useEffect, useContext, useRef } from 'react';
import { generateSrtFromAudioAndScript } from './services/geminiService';
import { FileUpload } from './components/FileUpload';
import { ScriptUpload } from './components/ScriptUpload';
import { Loader } from './components/Loader';
import { TranscriptDisplay } from './components/TranscriptDisplay';
import { Header } from './components/Header';
import { RobotIcon } from './components/icons/RobotIcon';
import { ErrorDisplay } from './components/ErrorDisplay';
import { ApiKeyInput } from './components/ApiKeyInput';
import { AppContext } from './contexts/AppContext';
import { useTranslation } from './hooks/useTranslation';
import { HistoryPanel } from './components/HistoryPanel';
import { CogIcon } from './components/icons/CogIcon';
import { HistoryIcon } from './components/icons/HistoryIcon';


type AppStatus = 'idle' | 'loading' | 'success' | 'error';
type AppView = 'generator' | 'history';

const App: React.FC = () => {
  const { theme, addToHistory } = useContext(AppContext);
  const { t } = useTranslation();

  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [textFile, setTextFile] = useState<File | null>(null);
  const [scriptContent, setScriptContent] = useState<string>('');
  const [srtResult, setSrtResult] = useState<string>('');
  const [status, setStatus] = useState<AppStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [maxCharsPerLine, setMaxCharsPerLine] = useState<number>(100);
  const [generationLanguage, setGenerationLanguage] = useState<'en' | 'vi'>('en');
  const [view, setView] = useState<AppView>('generator');
  const [viewingHistoryItem, setViewingHistoryItem] = useState<{ fileName: string; srtContent: string } | null>(null);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<number | null>(null);


  useEffect(() => {
    const storedApiKey = localStorage.getItem('gemini-api-key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setIsAuthorized(true);
    }
  }, []);
  
   useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini-api-key', key);
    setIsAuthorized(true);
  };
  
  const handleInvalidApiKey = useCallback(() => {
      localStorage.removeItem('gemini-api-key');
      setApiKey(null);
      setIsAuthorized(false);
      setStatus('idle');
  }, []);

  const handleAudioFileChange = (file: File | null) => {
    if (file) {
      setAudioFile(file);
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
            setError(t('error.emptyScript'));
            setStatus('error');
            setTextFile(null);
        }
      };
      reader.onerror = () => {
        setError(t('error.readScript'));
        setStatus('error');
        setTextFile(null);
      }
      reader.readAsText(file);
    }
  };

  const stopProgressSimulation = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setProgress(100);
  }, []);

  const startProgressSimulation = useCallback(() => {
    setProgress(0);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    progressIntervalRef.current = window.setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
          return 95;
        }
        if (prev < 60) {
          return prev + Math.random() * 5;
        }
        return prev + Math.random() * 2;
      });
    }, 400);
  }, []);

  const handleGenerateSrt = useCallback(async () => {
    if (!apiKey) {
      setError(t('error.apiKeyMissing'));
      handleInvalidApiKey();
      return;
    }
    if (!audioFile) {
      setError(t('error.noAudio'));
      setStatus('error');
      return;
    }
    if (!scriptContent || !textFile) {
      setError(t('error.noScript'));
      setStatus('error');
      return;
    }
    setStatus('loading');
    setError(null);
    setViewingHistoryItem(null);
    startProgressSimulation();
    try {
      const result = await generateSrtFromAudioAndScript(audioFile, scriptContent, maxCharsPerLine, apiKey, generationLanguage);
      stopProgressSimulation();
      setSrtResult(result);
      addToHistory({
        id: crypto.randomUUID(),
        fileName: audioFile.name,
        srtContent: result,
        timestamp: Date.now(),
      });
      // A small delay to show 100% completion before switching views
      setTimeout(() => {
        setStatus('success');
      }, 300);
    } catch (err: unknown) {
      console.error('SRT Generation failed:', err);
      stopProgressSimulation();
      const errorMessage = err instanceof Error ? err.message : t('error.unknown');
      
      if (errorMessage.includes('Invalid API Key')) {
          setError(`${errorMessage}. ${t('error.newKeyPrompt')}`);
          setTimeout(handleInvalidApiKey, 3000);
      } else {
          setError(`${t('error.productionHalt')} ${errorMessage}`);
      }
      // A small delay to show 100% completion before switching views
      setTimeout(() => {
         setStatus('error');
      }, 300);
    }
  }, [audioFile, textFile, scriptContent, maxCharsPerLine, apiKey, generationLanguage, t, addToHistory, handleInvalidApiKey, startProgressSimulation, stopProgressSimulation]);

  const handleDownloadSrt = (fileName: string, srtContent: string) => {
    const blob = new Blob([srtContent], { type: 'text/srt' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const baseName = fileName.replace(/\.[^/.]+$/, "") || 'subtitles';
    a.download = `${baseName}.srt`;
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
    setViewingHistoryItem(null);
    setView('generator');
  }

  const handleViewHistoryItem = (item: { fileName: string; srtContent: string }) => {
    setViewingHistoryItem(item);
    setStatus('success');
    setView('generator');
  };

  const renderContent = () => {
    if (!isAuthorized) {
        return <ApiKeyInput onSubmit={handleApiKeySubmit} />;
    }
      
    if (view === 'history') {
      return <HistoryPanel onViewItem={handleViewHistoryItem} />;
    }

    switch (status) {
      case 'loading':
        return <Loader progress={progress} />;
      case 'error':
        const showReset = !error?.includes('Invalid API Key');
        return <ErrorDisplay message={error || t('error.unknown')} onReset={resetState} showReset={showReset} />;
      case 'success':
        const currentFile = viewingHistoryItem?.fileName || audioFile?.name || 'your_audio.mp3';
        const currentSrt = viewingHistoryItem?.srtContent || srtResult;
        return (
          <TranscriptDisplay
            srtContent={currentSrt}
            onDownload={() => handleDownloadSrt(currentFile, currentSrt)}
            onReset={resetState}
            fileName={currentFile}
          />
        );
      case 'idle':
      default:
        return (
          <div className="space-y-8">
            <FileUpload onFileChange={handleAudioFileChange} selectedFile={audioFile} />
            
            {audioFile && (
              <ScriptUpload onFileChange={handleTextFileChange} selectedFile={textFile} />
            )}

            {audioFile && textFile && scriptContent && (
               <div className="animate-fade-in">
                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-6">
                  <div>
                    <label className="block text-center text-sky-600 dark:text-sky-400 font-semibold mb-2">
                        {t('settings.generationLanguage')}
                    </label>
                    <div className="flex justify-center gap-2">
                        <button onClick={() => setGenerationLanguage('en')} className={`px-4 py-2 rounded-md font-semibold transition-colors ${generationLanguage === 'en' ? 'bg-sky-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>English</button>
                        <button onClick={() => setGenerationLanguage('vi')} className={`px-4 py-2 rounded-md font-semibold transition-colors ${generationLanguage === 'vi' ? 'bg-sky-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>Tiếng Việt</button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="char-limit-slider" className="block text-center text-sky-600 dark:text-sky-400 font-semibold">
                        {t('settings.maxChars')}: <span className="font-bold text-slate-800 dark:text-white tabular-nums">{maxCharsPerLine}</span>
                    </label>
                    <input
                        id="char-limit-slider"
                        type="range"
                        min="70"
                        max="150"
                        step="1"
                        value={maxCharsPerLine}
                        onChange={(e) => setMaxCharsPerLine(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        aria-label={t('settings.maxCharsAria')}
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-1">{t('settings.maxCharsDescription')}</p>
                  </div>
                </div>

                <div className="text-center pt-8">
                  <button
                    onClick={handleGenerateSrt}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-sky-400/50 shadow-lg shadow-sky-600/30"
                  >
                    <RobotIcon className="w-6 h-6 mr-3"/>
                    {t('buttons.startProduction')}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-200 font-sans flex flex-col items-center p-4 sm:p-6 md:p-8 transition-colors duration-300">
      <div className="w-full max-w-3xl mx-auto">
        <Header isAuthorized={isAuthorized} onChangeApiKey={handleInvalidApiKey} />
        <main className="mt-8 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-sky-500/20 rounded-2xl shadow-2xl shadow-sky-500/10 overflow-hidden">
            {isAuthorized && (
               <div className="border-b border-slate-200 dark:border-slate-700">
                  <nav className="flex justify-center -mb-px">
                      <button onClick={() => setView('generator')} className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${view === 'generator' ? 'border-sky-500 text-sky-600 dark:text-sky-400' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:hover:text-slate-300 dark:hover:border-slate-500'}`}>
                          <CogIcon className="w-5 h-5 mr-2 inline-block" />
                          {t('tabs.generator')}
                      </button>
                      <button onClick={() => setView('history')} className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${view === 'history' ? 'border-sky-500 text-sky-600 dark:text-sky-400' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:hover:text-slate-300 dark:hover:border-slate-500'}`}>
                          <HistoryIcon className="w-5 h-5 mr-2 inline-block" />
                          {t('tabs.history')}
                      </button>
                  </nav>
               </div>
            )}
          <div className="p-6 sm:p-8 md:p-10">
             {renderContent()}
          </div>
        </main>
        <footer className="text-center mt-8 text-slate-500 dark:text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} {t('footer.text')}</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
