import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Sparkles, Send, Bot, User, Cpu } from 'lucide-react';
import { AIProvider } from '../../../types/enums';
import { useToast } from '../../../context/ToastContext';
import { AI_PROVIDER_MODELS } from '../constants/aiConstants';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  provider?: string;
  timestamp: string;
}

export const AIChatPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [provider, setProvider] = useState<AIProvider>(AIProvider.GEMINI);
  const toast = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am your AURA Multi-Agent AI Assistant. How can I automate your business operations today?',
      provider: 'GEMINI',
      timestamp: '10:00 AM'
    }
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: `[${provider} Response]: Processed "${input}". Database query and agent tool execution finished.`,
      provider: provider,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    toast.success('AI Agent Executed', `Response generated using ${AI_PROVIDER_MODELS[provider]}`);
    setInput('');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-slate-900/60 backdrop-blur-md p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base">AURA AI Conversational Hub</h2>
            <p className="text-xs text-slate-400">Swappable Multi-Provider Architecture</p>
          </div>
        </div>

        {/* Dynamic Provider Selection */}
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400 font-medium">Provider:</span>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as AIProvider)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-indigo-400 font-semibold focus:outline-none focus:border-indigo-500"
          >
            {Object.entries(AI_PROVIDER_MODELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Message List */}
      <Card className="flex-1 overflow-y-auto space-y-4 p-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div
              className={`max-w-xl p-4 rounded-2xl text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-slate-800/80 text-slate-200 border border-slate-700/60 rounded-bl-none'
              }`}
            >
              <p>{msg.text}</p>
              <div className="mt-2 flex items-center justify-between text-[10px] opacity-70">
                <span>{msg.timestamp}</span>
                {msg.provider && (
                  <span className="font-semibold uppercase tracking-wider text-indigo-300">
                    {msg.provider}
                  </span>
                )}
              </div>
            </div>
            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </Card>

      {/* Input Form */}
      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask AI to query sales, dispatch support agent, or analyze documents..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <Button onClick={handleSend} className="px-6">
          <Send className="w-4 h-4" />
          Send
        </Button>
      </div>
    </div>
  );
};
