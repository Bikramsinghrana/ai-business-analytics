import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Bot, Loader2 } from 'lucide-react';
import { AIProvider } from '../../../types/enums';
import { SearchType } from '../types/ai.types';
import { useToast } from '../../../context/ToastContext';
import { aiApi } from '../api/aiApi';
import { AiConversation, AiMessage } from '../types/ai.types';
import { ConversationSidebar } from '../components/ConversationSidebar';
import { ChatMessageItem } from '../components/ChatMessageItem';
import { ChatInputArea } from '../components/ChatInputArea';
import { AiMetricsWidget } from '../components/AiMetricsWidget';
import { AiModelSelector } from '../components/AiModelSelector';
import { SearchTypeSelector } from '../components/SearchTypeSelector';

export const AIChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<AiConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<AiConversation | null>(null);
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingList, setFetchingList] = useState(true);
  const [provider, setProvider] = useState<AIProvider>(AIProvider.GEMINI);
  const [searchType, setSearchType] = useState<SearchType>(SearchType.WEB);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

    // Optimistic user message preview
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

    try {
      let res;
      if (activeConversation) {
        res = await aiApi.sendMessage(activeConversation.id, {
          message: userPrompt,
          search_type: selectedSearchType,
          provider: selectedProvider,
        });
      } else {
        res = await aiApi.quickPrompt({
          message: userPrompt,
          search_type: selectedSearchType,
          provider: selectedProvider,
        });
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
        loading={fetchingList}
      />

      {/* Main Chat Hub */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950/60">
        {/* Header Bar with Top Right AI Model Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-slate-800 bg-slate-900/70 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-sm">
                {activeConversation?.title || 'AURA AI Business Assistant'}
              </h2>
              <p className="text-[11px] text-slate-400">
                Multi-Agent Search Classification & Real-Time Engine
              </p>
            </div>
          </div>

          {/* Right Top Selectors */}
          <div className="flex items-center gap-2.5">
            {/* Search Domain Selector Dropdown */}
            <SearchTypeSelector
              value={searchType}
              onChange={setSearchType}
              disabled={loading}
            />

            <div className="hidden lg:block h-5 w-px bg-slate-800" />

            <div className="hidden lg:block">
              <AiMetricsWidget />
            </div>

            <div className="hidden lg:block h-5 w-px bg-slate-800" />

            {/* AI Model / Engine Selector Dropdown - LAST POSITION */}
            <AiModelSelector
              value={provider}
              onChange={setProvider}
              disabled={loading}
            />
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4 p-8">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-600/10">
                <Bot className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white">How can AURA assist you today?</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Select any category above (Project, Sports, Stocks, Business) or ask any question.
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg) => <ChatMessageItem key={msg.id} message={msg} />)
          )}

          {/* Thinking Indicator */}
          {loading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl rounded-tl-none bg-slate-900 border border-slate-800 text-xs text-indigo-300 flex items-center gap-2 shadow-sm">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                <span className="font-medium">Classifying domain & retrieving real-time data...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area with SearchType Context */}
        <ChatInputArea
          onSend={handleSendMessage}
          loading={loading}
          provider={provider}
          searchType={searchType}
          onSearchTypeChange={setSearchType}
        />
      </div>
    </div>
  );
};
