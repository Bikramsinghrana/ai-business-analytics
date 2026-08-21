import React, { useState } from 'react';
import { AiConversation } from '../types/ai.types';
import { Plus, MessageSquare, Trash2, Search } from 'lucide-react';

interface ConversationSidebarProps {
  conversations: AiConversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  activeId,
  onSelect,
  onNewChat,
  onDelete,
  loading,
}) => {
  const [search, setSearch] = useState('');

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="w-72 flex-shrink-0 flex flex-col h-full bg-slate-900/80 backdrop-blur-md border-r border-slate-800 p-4 space-y-4">
      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
      >
        <Plus className="w-4 h-4" />
        New AI Session
      </button>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search chats..."
          className="w-full pl-8 pr-3 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition"
        />
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
        {loading && conversations.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 animate-pulse">
            Loading sessions...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            {search ? 'No matching chats' : 'No previous conversations'}
          </div>
        ) : (
          filtered.map((conv) => {
            const isActive = conv.id === activeId;
            return (
              <div
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition border text-xs ${
                  isActive
                    ? 'bg-indigo-600/15 border-indigo-500/40 text-indigo-200 shadow-sm'
                    : 'bg-slate-900/40 border-transparent hover:border-slate-800 hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <MessageSquare
                    className={`w-3.5 h-3.5 flex-shrink-0 ${
                      isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-400'
                    }`}
                  />
                  <div className="truncate">
                    <p className="truncate font-medium leading-snug">{conv.title}</p>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {conv.provider} • {conv.model}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(conv.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition text-slate-500 rounded"
                  title="Delete chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};
