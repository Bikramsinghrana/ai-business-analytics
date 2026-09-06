import React, { useState } from 'react';
import { AiMessage } from '../types/ai.types';
import { 
  Bot, 
  User, 
  Copy, 
  Check, 
  Radio, 
  Clock, 
  Volume2, 
  VolumeX, 
  Code2, 
  FileText 
} from 'lucide-react';

interface ChatMessageItemProps {
  message: AiMessage;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const [codeCopiedIndex, setCodeCopiedIndex] = useState<number | null>(null);
  const [viewRawJson, setViewRawJson] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const isAi = message.sender === 'ai' || message.role === 'assistant';
  const meta = message.metadata || {};

  const handleCopyText = (text: string, index?: number) => {
    navigator.clipboard.writeText(text);
    if (typeof index === 'number') {
      setCodeCopiedIndex(index);
      setTimeout(() => setCodeCopiedIndex(null), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(message.content);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Advanced clean markdown & code block renderer
  const renderFormattedContent = (content: string) => {
    // Check if content contains fenced code blocks ```lang ... ```
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let blockIndex = 0;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Text before code block
      if (match.index > lastIndex) {
        parts.push(renderTextLines(content.substring(lastIndex, match.index), `text-${lastIndex}`));
      }

      const lang = match[1] || 'code';
      const code = match[2];
      const currentBlock = blockIndex++;

      parts.push(
        <div key={`code-${match.index}`} className="my-3 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-[11px] shadow-lg">
          <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400">
            <span className="font-bold text-indigo-400 uppercase tracking-wider">{lang}</span>
            <button
              type="button"
              onClick={() => handleCopyText(code, currentBlock)}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              {codeCopiedIndex === currentBlock ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-3.5 overflow-x-auto text-indigo-100 leading-relaxed custom-scrollbar">
            <code>{code}</code>
          </pre>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(renderTextLines(content.substring(lastIndex), `text-${lastIndex}`));
    }

    return parts;
  };

  const renderTextLines = (text: string, keyPrefix: string) => {
    const lines = text.split('\n');
    return (
      <div key={keyPrefix} className="space-y-1">
        {lines.map((line, index) => {
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
          if (line.startsWith('> ')) {
            return (
              <blockquote key={index} className="p-2 bg-slate-950/60 border-l-2 border-indigo-500 rounded-r text-[11px] text-slate-300 my-1 font-mono">
                {parseInlineFormatting(line.replace('> ', ''))}
              </blockquote>
            );
          }
          if (line.startsWith('- ') || line.startsWith('* ')) {
            return (
              <li key={index} className="ml-4 list-disc text-xs leading-relaxed text-slate-300">
                {parseInlineFormatting(line.substring(2))}
              </li>
            );
          }
          if (/^\d+\.\s/.test(line)) {
            return (
              <li key={index} className="ml-4 list-decimal text-xs leading-relaxed text-slate-300">
                {parseInlineFormatting(line.replace(/^\d+\.\s/, ''))}
              </li>
            );
          }
          if (!line.trim()) {
            return <div key={index} className="h-1.5" />;
          }
          return (
            <p key={index} className="text-xs leading-relaxed text-slate-200">
              {parseInlineFormatting(line)}
            </p>
          );
        })}
      </div>
    );
  };

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

      <div className={`max-w-3xl flex flex-col space-y-1.5 ${isAi ? 'items-start' : 'items-end'}`}>
        {/* Clean Sender Header */}
        {isAi && (
          <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-200">{meta.agent_name || 'AURA Assistant'}</span>
            {meta.model && <span className="text-[10px] text-slate-500 font-mono">• {meta.model}</span>}
            {meta.is_real_time && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Live
              </span>
            )}
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`p-4 rounded-2xl text-xs relative w-full ${
            isAi
              ? 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-md backdrop-blur-sm'
              : 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/20'
          }`}
        >
          {viewRawJson ? (
            <pre className="p-3 bg-slate-950 rounded-xl overflow-x-auto text-[11px] font-mono text-emerald-400">
              {JSON.stringify(message, null, 2)}
            </pre>
          ) : isAi ? (
            renderFormattedContent(message.content)
          ) : (
            <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
          )}

          {/* Footer Metadata & Actions */}
          <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between text-[10px] text-slate-400 gap-2">
            <div className="flex items-center gap-2">
              {meta.source && (
                <span className="text-slate-400 font-mono flex items-center gap-1 truncate max-w-[200px]" title={meta.source}>
                  <Radio className="w-2.5 h-2.5 text-indigo-400 flex-shrink-0" />
                  <span className="truncate">{meta.source}</span>
                </span>
              )}
              {meta.updated_at && (
                <span className="text-slate-500 font-mono flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {meta.updated_at}
                </span>
              )}
              {message.tokens_used > 0 && (
                <span className="text-slate-500 font-mono">
                  {message.tokens_used} tokens
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <span>{message.created_at ? new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}</span>

              {isAi && (
                <>
                  <button
                    type="button"
                    onClick={handleSpeak}
                    className="hover:text-white transition p-0.5"
                    title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
                  >
                    {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-indigo-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewRawJson(!viewRawJson)}
                    className="hover:text-white transition p-0.5"
                    title={viewRawJson ? 'View formatted' : 'View raw JSON'}
                  >
                    {viewRawJson ? <FileText className="w-3.5 h-3.5 text-indigo-400" /> : <Code2 className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyText(message.content)}
                    className="hover:text-white transition p-0.5"
                    title="Copy response"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </>
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
