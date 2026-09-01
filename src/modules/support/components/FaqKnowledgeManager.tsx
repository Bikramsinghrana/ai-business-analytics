import React, { useState, useEffect } from 'react';
import { SupportFaq } from '../types/support.types';
import { supportApi } from '../services/supportApi';
import {
  HelpCircle,
  Plus,
  Search,
  CheckCircle2,
  Tag,
  ThumbsUp,
  Eye,
  Loader2,
  X
} from 'lucide-react';

export const FaqKnowledgeManager: React.FC = () => {
  const [faqs, setFaqs] = useState<SupportFaq[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newQuestion, setNewQuestion] = useState<string>('');
  const [newAnswer, setNewAnswer] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('General');

  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    try {
      setLoading(true);
      const res = await supportApi.getFaqs(undefined, search);
      setFaqs(res);
    } catch (err) {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFaq = async () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    try {
      await supportApi.createFaq({
        question: newQuestion,
        answer: newAnswer,
        category: newCategory,
        is_published: true,
      });
      setIsModalOpen(false);
      setNewQuestion('');
      setNewAnswer('');
      loadFaqs();
    } catch (err) {
      alert('Failed to create FAQ');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Support FAQs & Knowledge Base</h3>
            <p className="text-xs text-slate-400">Frequently Asked Questions grounded into AI Support Agent context</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadFaqs()}
              placeholder="Search FAQs..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add FAQ</span>
          </button>
        </div>
      </div>

      {/* FAQ Cards */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
          <span>Loading FAQs...</span>
        </div>
      ) : faqs.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-xs text-slate-400">
          No FAQs created yet. Click "Add FAQ" to publish your first support article.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {faq.category}
                </span>
                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3 text-emerald-400" /> {faq.helpful_count}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white">{faq.question}</h4>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create FAQ Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Create Support FAQ Article</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                >
                  <option value="General">General</option>
                  <option value="Billing & Plans">Billing & Plans</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Security & Privacy">Security & Privacy</option>
                  <option value="Shipping & Delivery">Shipping & Delivery</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Question</label>
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="e.g. How do I upgrade my license?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Answer</label>
                <textarea
                  rows={4}
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Detailed answer text..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold">
                Cancel
              </button>
              <button onClick={handleCreateFaq} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30">
                Publish FAQ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
