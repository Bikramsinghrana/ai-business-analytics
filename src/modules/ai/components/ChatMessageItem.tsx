import React, { useState } from 'react';
import { AiMessage } from '../types/ai.types';
import { Bot, User, Copy, Check, Wrench } from 'lucide-react';

interface ChatMessageItemProps {
  message: AiMessage;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isAi = message.sender === 'ai' || message.role === 'assistant';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple clean markdown parser for headings, lists, bold text and code snippets
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      // Headers
      if (line.startsWith('#### ')) {
        return (
          <h4 key={index} className="text-xs font-bold text-indigo-300 mt-2 mb-1 uppercase tracking-wider">
            {line.replace('#### ', '')}
          </h4>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="text-sm font-bold text-white mt-2 mb-1.5 flex items-center gap-1.5">
            {line.replace('### ', '')}
          </h3>
        );
      }
      // Bullet items
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const bulletText = line.substring(2);
        return (
          <li key={index} className="ml-4 list-disc text-xs leading-relaxed text-slate-300">
            {parseInlineFormatting(bulletText)}
          </li>
        );
      }
      // Numbered lists
      if (/^\d+\.\s/.test(line)) {
        return (
          <li key={index} className="ml-4 list-decimal text-xs leading-relaxed text-slate-300">
            {parseInlineFormatting(line.replace(/^\d+\.\s/, ''))}
          </li>
        );
      }
      // Blank lines
      if (!line.trim()) {
        return <div key={index} className="h-1.5" />;
      }
      // Regular paragraph
      return (
        <p key={index} className="text-xs leading-relaxed text-slate-200">
          {parseInlineFormatting(line)}
        </p>
      );
    });
  };

  // Inline formatting helper for **bold** and `code`
  const parseInlineFormatting = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 bg-slate-900 border border-slate-700/60 rounded text-[11px] font-mono text-indigo-300">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className={`flex gap-3 ${isAi ? 'justify-start' : 'justify-end'} group`}>
      {isAi && (
        <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0 shadow-sm">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div className={`max-w-2xl flex flex-col space-y-1.5 ${isAi ? 'items-start' : 'items-end'}`}>
        {/* Tool Executions Pills */}
        {isAi && message.tool_calls && message.tool_calls.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-1">
            {message.tool_calls.map((t, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-medium text-emerald-400"
                title={t.description}
              >
                <Wrench className="w-3 h-3" />
                <span>{t.tool}</span>
              </span>
            ))}
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`p-4 rounded-2xl text-xs relative ${
            isAi
              ? 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-md backdrop-blur-sm'
              : 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/20'
          }`}
        >
          <div className="space-y-1">
            {isAi ? renderFormattedContent(message.content) : <p className="leading-relaxed">{message.content}</p>}
          </div>

          {/* Footer Metadata */}
          <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 gap-4">
            <div className="flex items-center gap-2">
              {message.metadata?.provider && (
                <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono text-[9px] uppercase font-semibold">
                  {message.metadata.provider} {message.metadata.model && `• ${message.metadata.model}`}
                </span>
              )}
              {message.tokens_used > 0 && (
                <span className="text-slate-500 font-mono">
                  {message.tokens_used} tokens
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span>{message.created_at ? new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}</span>
              {isAi && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="opacity-0 group-hover:opacity-100 hover:text-white transition p-0.5"
                  title="Copy response"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {!isAi && (
        <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
