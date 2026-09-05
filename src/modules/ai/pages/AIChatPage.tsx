import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Bot, Loader2, Settings, Eraser, Edit3, Check, X, Radio } from 'lucide-react';
import { AIProvider } from '../../../types/enums';
import { SearchType, PromptPersona, AiSettings } from '../types/ai.types';
import { useToast } from '../../../context/ToastContext';
import { aiApi } from '../api/aiApi';
import { AiConversation, AiMessage } from '../types/ai.types';
import { ConversationSidebar } from '../components/ConversationSidebar';
import { ChatMessageItem } from '../components/ChatMessageItem';
import { ChatInputArea } from '../components/ChatInputArea';
import { AiMetricsWidget } from '../components/AiMetricsWidget';
import { AiModelSelector } from '../components/AiModelSelector';
import { SearchTypeSelector } from '../components/SearchTypeSelector';
import { PromptPersonaSelector } from '../components/PromptPersonaSelector';
import { AiSettingsModal } from '../components/AiSettingsModal';

export const AIChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<AiConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<AiConversation | null>(null);
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingList, setFetchingList] = useState(true);
  const [provider, setProvider] = useState<AIProvider>(AIProvider.GEMINI);
  const [searchType, setSearchType] = useState<SearchType>(SearchType.WEB);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('general');
  const [selectedPersona, setSelectedPersona] = useState<PromptPersona | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(true);
  const [streamingContent, setStreamingContent] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  useEffect(() => {
    loadConversations();
    loadSettings();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, streamingContent]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadSettings = async () => {
    try {
      const res = await aiApi.getSettings();
      if (res.data?.settings) {
        setIsStreaming(res.data.settings.streaming_enabled ?? true);
        if (res.data.settings.default_provider) {
          setProvider(res.data.settings.default_provider as AIProvider);
        }
      }
    } catch (e) {
      // Non-blocking
    }
  };

  const loadConversations = async () => {
    try {
      setFetchingList(true);
      const res = await aiApi.getConversations();
      const list = res.data?.conversations || [];
      setConversations(list);

      if (list.length > 0) {
        selectConversation(list[0].id);
      } else {
        handleNewChat();
      }
    } catch (err: any) {
      toast.error('Failed to load chats', err.message || 'Error fetching conversations');
    } finally {
      setFetchingList(false);
    }
  };

  const selectConversation = async (id: string) => {
    try {
      setLoading(true);
      const res = await aiApi.getConversation(id);
      const conv = res.data?.conversation;
      if (conv) {
        setActiveConversation(conv);
        setMessages(conv.messages || []);
        if (conv.provider && Object.values(AIProvider).includes(conv.provider as AIProvider)) {
          setProvider(conv.provider as AIProvider);
        }
      }
    } catch (err: any) {
      toast.error('Error opening chat', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = async () => {
    try {
      setLoading(true);
      const res = await aiApi.createConversation({
        provider,
        title: 'New AI Conversation',
      });
      const newConv = res.data?.conversation;
      if (newConv) {
        setConversations((prev) => [newConv, ...prev]);
        setActiveConversation(newConv);
        setMessages([]);
      }
    } catch (err: any) {
      toast.error('Failed to create new session', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRenameConversation = async (id: string, newTitle: string) => {
    try {
      const res = await aiApi.updateConversationTitle(id, newTitle);
      const updatedConv = res.data?.conversation;
      if (updatedConv) {
        setConversations((prev) => prev.map((c) => (c.id === id ? updatedConv : c)));
        if (activeConversation?.id === id) {
          setActiveConversation(updatedConv);
        }
      }
      toast.success('Chat Renamed', 'Title updated successfully.');
    } catch (err: any) {
      toast.error('Rename failed', err.message || 'Could not rename conversation.');
    }
  };

  const handleClearMessages = async () => {
    if (!activeConversation) return;
    if (!confirm('Are you sure you want to clear message history for this conversation?')) return;

    try {
      const res = await aiApi.clearConversationMessages(activeConversation.id);
      if (res.data?.conversation) {
        setActiveConversation(res.data.conversation);
        setMessages([]);
        toast.success('History Cleared', 'All messages cleared.');
      }
    } catch (err: any) {
      toast.error('Clear failed', err.message || 'Failed to clear conversation history.');
    }
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      await aiApi.deleteConversation(id);
      const updated = conversations.filter((c) => c.id !== id);
      setConversations(updated);
      toast.success('Session removed', 'Conversation deleted.');

      if (activeConversation?.id === id) {
        if (updated.length > 0) {
          selectConversation(updated[0].id);
        } else {
          handleNewChat();
        }
      }
    } catch (err: any) {
      toast.error('Delete failed', err.message);
    }
  };

  const handleSendMessage = async (
    userPrompt: string,
    selectedProvider: AIProvider,
    selectedSearchType: SearchType
  ) => {
    if (!userPrompt.trim()) return;

    const tempUserMsg: AiMessage = {
      id: `temp-${Date.now()}`,
      conversation_id: activeConversation?.id || '',
      sender: 'user',
      role: 'user',
      content: userPrompt,
      tokens_used: 0,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setLoading(true);

    const payload = {
      message: userPrompt,
      search_type: selectedSearchType,
      provider: selectedProvider,
      system_prompt: selectedPersona?.system_prompt,
    };

    // If streaming enabled and we have an active conversation, stream via SSE
    if (isStreaming && activeConversation) {
      setStreamingContent('');
      let accumulated = '';

      await aiApi.streamMessage(
        activeConversation.id,
        payload,
        (chunk) => {
          accumulated += chunk;
          setStreamingContent(accumulated);
        },
        (finalData) => {
          setStreamingContent('');
          setLoading(false);
          if (finalData.conversation) {
            setActiveConversation(finalData.conversation);
            setMessages(finalData.conversation.messages || []);
            setConversations((prev) =>
              prev.map((c) => (c.id === finalData.conversation.id ? finalData.conversation : c))
            );
          }
          if (finalData.rate_limit) {
            toast.success(
              'Generated via Stream',
              `${finalData.agent_response?.agent_name || 'AURA'} • ${finalData.rate_limit.remaining} RPM quota remaining`
            );
          }
        },
        (err) => {
          setStreamingContent('');
          setLoading(false);
          toast.error('Streaming Error', err.message || 'Error receiving streaming tokens.');
          setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
        }
      );
    } else {
      // Standard non-streaming fallback
      try {
        let res;
        if (activeConversation) {
          res = await aiApi.sendMessage(activeConversation.id, payload);
        } else {
          res = await aiApi.quickPrompt(payload);
        }

        if (res.data) {
          const { conversation } = res.data;
          if (conversation) {
            setActiveConversation(conversation);
            setMessages(conversation.messages || []);
            setConversations((prev) =>
              prev.map((c) => (c.id === conversation.id ? conversation : c))
            );
          }

          const agentName = res.data.agent_response?.agent_name || 'AURA Agent';
          const detectedType = res.data.agent_response?.search_type || selectedSearchType;

          toast.success(
            `Dispatched ${agentName}`,
            `Handled via ${detectedType} domain using ${selectedProvider}.`
          );
        }
      } catch (err: any) {
        toast.error('AI Error', err.response?.data?.message || 'Failed to generate response.');
        setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="h-[calc(100vh-6.5rem)] flex rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      {/* Left Sidebar */}
      <ConversationSidebar
        conversations={conversations}
        activeId={activeConversation?.id || null}
        onSelect={selectConversation}
        onNewChat={handleNewChat}
        onDelete={handleDeleteConversation}
        onRename={handleRenameConversation}
        loading={fetchingList}
      />

      {/* Main Chat Hub */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950/60">
        
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-slate-800 bg-slate-900/70 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>

            <div>
              {isRenaming && activeConversation ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    className="bg-slate-950 border border-indigo-500 rounded-lg px-2 py-0.5 text-xs text-white focus:outline-none"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleRenameConversation(activeConversation.id, renameValue);
                        setIsRenaming(false);
                      }
                      if (e.key === 'Escape') setIsRenaming(false);
                    }}
                  />
                  <button
                    onClick={() => {
                      handleRenameConversation(activeConversation.id, renameValue);
                      setIsRenaming(false);
                    }}
                    className="p-1 text-emerald-400 hover:text-emerald-300"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setIsRenaming(false)} className="p-1 text-red-400 hover:text-red-300">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-white text-sm truncate max-w-[280px]">
                    {activeConversation?.title || 'AURA AI Business Assistant'}
                  </h2>
                  {activeConversation && (
                    <button
                      onClick={() => {
                        setRenameValue(activeConversation.title);
                        setIsRenaming(true);
                      }}
                      className="p-1 text-slate-500 hover:text-slate-300 rounded"
                      title="Rename conversation"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
              <p className="text-[11px] text-slate-400">
                Multi-Agent Search Classification & Real-Time Engine
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            {/* Prompt Persona Selector */}
            <PromptPersonaSelector
              selectedPersonaId={selectedPersonaId}
              onSelectPersona={(persona) => {
                setSelectedPersonaId(persona.id);
                setSelectedPersona(persona);
                toast.success('Persona Switched', `Active Persona: ${persona.name}`);
              }}
            />

            {/* Search Domain Selector */}
            <SearchTypeSelector
              value={searchType}
              onChange={setSearchType}
              disabled={loading}
            />

            {/* AI Model Selector */}
            <AiModelSelector
              value={provider}
              onChange={setProvider}
              disabled={loading}
            />

            <div className="hidden lg:block h-5 w-px bg-slate-800" />

            <div className="hidden lg:block">
              <AiMetricsWidget />
            </div>

            {/* Clear History Button */}
            {activeConversation && (
              <button
                type="button"
                onClick={handleClearMessages}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800/60 rounded-xl transition-colors"
                title="Clear message history"
              >
                <Eraser className="w-4 h-4" />
              </button>
            )}

            {/* AI Settings Modal Button */}
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition shadow-sm"
              title="Configure AI Settings, Models & API Keys"
            >
              <Settings className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {messages.length === 0 && !streamingContent ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4 p-8">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-600/10">
                <Bot className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white">How can AURA assist you today?</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Persona: <span className="text-indigo-300 font-semibold">{selectedPersona?.name || 'AURA Executive Copilot'}</span>. Select any category or ask any question.
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <ChatMessageItem key={msg.id} message={msg} />
              ))}

              {/* Real-time Streaming Output Card */}
              {streamingContent && (
                <ChatMessageItem
                  message={{
                    id: 'streaming-active',
                    conversation_id: activeConversation?.id || '',
                    sender: 'ai',
                    role: 'assistant',
                    content: streamingContent,
                    tokens_used: Math.ceil(streamingContent.length / 4),
                    created_at: new Date().toISOString(),
                    metadata: {
                      agent_name: 'AURA Streaming Core',
                      is_real_time: true,
                      model: provider,
                    },
                  }}
                />
              )}
            </>
          )}

          {/* Thinking Loader (when awaiting first streaming byte) */}
          {loading && !streamingContent && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl rounded-tl-none bg-slate-900 border border-slate-800 text-xs text-indigo-300 flex items-center gap-2 shadow-sm">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                <span className="font-medium">Classifying domain & streaming real-time tokens...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <ChatInputArea
          onSend={handleSendMessage}
          loading={loading}
          provider={provider}
          searchType={searchType}
          onSearchTypeChange={setSearchType}
        />
      </div>

      {/* AI Settings Modal */}
      <AiSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSettingsSaved={(newSettings) => {
          setIsStreaming(newSettings.streaming_enabled);
          if (newSettings.default_provider) {
            setProvider(newSettings.default_provider as AIProvider);
          }
        }}
      />
    </div>
  );
};
