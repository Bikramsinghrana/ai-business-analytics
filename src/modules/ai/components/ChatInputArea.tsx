import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Loader2,
  Mic,
  MicOff,
  Volume2,
} from 'lucide-react';
import { AIProvider } from '../../../types/enums';
import { SearchType } from '../types/ai.types';
import { SEARCH_TYPE_PLACEHOLDERS } from '../constants/aiConstants';
import { useToast } from '../../../context/ToastContext';

interface ChatInputAreaProps {
  onSend: (message: string, provider: AIProvider, searchType: SearchType) => void;
  loading: boolean;
  provider: AIProvider;
  searchType: SearchType;
  onSearchTypeChange?: (type: SearchType) => void;
}

export const ChatInputArea: React.FC<ChatInputAreaProps> = ({
  onSend,
  loading,
  provider,
  searchType,
}) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const toast = useToast();

  useEffect(() => {
    // Initialize Web Speech Recognition API if available
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Voice search error:', event.error);
        setIsListening(false);
        if (event.error !== 'no-speech') {
          toast.error('Voice Search Error', `Microphone error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [toast]);

  const toggleVoiceSearch = () => {
    if (!recognitionRef.current) {
      toast.error(
        'Voice Search Unsupported',
        'Your browser does not support speech recognition. Try Google Chrome, Edge, or Safari.'
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast.info('Listening...', 'Speak your question clearly into the microphone.');
      } catch (err: any) {
        console.error('Failed to start voice recognition:', err);
        setIsListening(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    onSend(input.trim(), provider, searchType);
    setInput('');
  };

  const placeholderText = isListening
    ? 'Listening to your voice... Speak now...'
    : SEARCH_TYPE_PLACEHOLDERS[searchType] || 'Ask any question...';

  return (
    <div className="p-4 bg-slate-900/90 backdrop-blur-md border-t border-slate-800/80">
      {/* Main Search Input Form with Voice Button */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholderText}
            disabled={loading}
            className={`w-full bg-slate-950 border rounded-xl pl-4 pr-10 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition shadow-inner disabled:opacity-60 font-medium ${
              isListening
                ? 'border-red-500/80 ring-2 ring-red-500/30 placeholder-red-400/80 bg-red-950/10'
                : 'border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50'
            }`}
          />

          {/* Listening Indicator Badge inside Input */}
          {isListening && (
            <div className="absolute right-12 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[9px] font-bold animate-pulse">
              <Volume2 className="w-3 h-3 animate-ping" />
              <span>Listening...</span>
            </div>
          )}
        </div>

        {/* Voice Microphone Toggle Button */}
        <button
          type="button"
          disabled={loading}
          onClick={toggleVoiceSearch}
          title={isListening ? 'Stop Voice Listening' : 'Start Voice Search'}
          className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center transition active:scale-95 flex-shrink-0 ${
            isListening
              ? 'bg-red-600 hover:bg-red-500 text-white border-red-500 shadow-lg shadow-red-600/40 animate-pulse'
              : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 border-slate-800 hover:border-indigo-500/40'
          }`}
        >
          {isListening ? (
            <MicOff className="w-4 h-4 text-white" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
        </button>

        {/* Send Button */}
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/30 active:scale-95 flex-shrink-0"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};