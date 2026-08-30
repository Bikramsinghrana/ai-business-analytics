import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { KnowledgeDocument, DocumentFolder } from '../types/document.types';
import { documentApi } from '../api/documentApi';
import { folderApi } from '../api/folderApi';
import { DocumentFolderTree } from '../components/DocumentFolderTree';
import { DocumentGridList } from '../components/DocumentGridList';
import { DocumentUploadModal } from '../components/DocumentUploadModal';
import { DocumentPreviewModal } from '../components/DocumentPreviewModal';
import { AIDocumentChat } from '../components/AIDocumentChat';
import { RAGSearchStudio } from '../components/RAGSearchStudio';
import { DocumentIntelligenceTab } from '../components/DocumentIntelligenceTab';
import { DocumentCompareModal } from '../components/DocumentCompareModal';
import { DocumentAnalyticsTab } from '../components/DocumentAnalyticsTab';
import { 
  FileText, 
  Bot, 
  Search, 
  BrainCircuit, 
  BarChart3, 
  Sparkles, 
  Layers,
  UploadCloud
} from 'lucide-react';

export const KnowledgeBasePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get('tab');
  const activeStudioTab: 'library' | 'chat' | 'search' | 'intelligence' | 'analytics' = 
    rawTab && ['library', 'chat', 'search', 'intelligence', 'analytics'].includes(rawTab)
      ? (rawTab as any)
      : 'library';

  const setActiveStudioTab = (tab: 'library' | 'chat' | 'search' | 'intelligence' | 'analytics') => {
    setSearchParams({ tab });
  };

  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [folders, setFolders] = useState<DocumentFolder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [previewDoc, setPreviewDoc] = useState<KnowledgeDocument | null>(null);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [docsRes, foldersRes] = await Promise.all([
        documentApi.list({
          folder_id: selectedFolderId || undefined,
          category: selectedCategory || undefined,
          search: searchQuery || undefined,
        }),
        folderApi.getTree(),
      ]);

      const docList = (docsRes as any)?.data || (docsRes as any) || [];
      setDocuments(Array.isArray(docList) ? docList : []);
      setFolders(Array.isArray(foldersRes) ? foldersRes : []);
    } catch (err) {
      console.error('Failed to fetch knowledge documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedFolderId, selectedCategory, searchQuery]);

  const handleCreateFolder = async (data: { name: string; color?: string; description?: string }) => {
    try {
      await folderApi.create(data);
      const updatedFolders = await folderApi.getTree();
      setFolders(updatedFolders);
    } catch (err) {
      console.error('Failed to create folder:', err);
    }
  };

  const handleDeleteFolder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this folder?')) return;
    try {
      await folderApi.delete(id);
      if (selectedFolderId === id) setSelectedFolderId(null);
      const updatedFolders = await folderApi.getTree();
      setFolders(updatedFolders);
    } catch (err) {
      console.error('Failed to delete folder:', err);
    }
  };

  const handleReindex = async (doc: KnowledgeDocument) => {
    try {
      await documentApi.reindex(doc.id);
      fetchData();
    } catch (err) {
      console.error('Reindex failed:', err);
    }
  };

  const handleDeleteDoc = async (id: string) => {
    if (!confirm('Are you sure you want to delete and purge this document from vector storage?')) return;
    try {
      await documentApi.delete(id);
      fetchData();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Studio Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 rounded-3xl border border-indigo-500/20 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-wide">
                RAG & Document Intelligence Studio
              </h1>
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                Gemini Vector Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Enterprise Knowledge Base, Multi-Document AI Chat, Hybrid Semantic Search & Structured Extraction
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all self-start md:self-auto"
        >
          <UploadCloud className="w-4 h-4" />
          Ingest New Documents
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveStudioTab('library')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeStudioTab === 'library'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Knowledge Library ({documents.length})
        </button>

        <button
          onClick={() => setActiveStudioTab('chat')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeStudioTab === 'chat'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Bot className="w-3.5 h-3.5 text-pink-400" />
          Multi-Doc AI Chat
        </button>

        <button
          onClick={() => setActiveStudioTab('search')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeStudioTab === 'search'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Search className="w-3.5 h-3.5 text-emerald-400" />
          RAG Hybrid Search Studio
        </button>

        <button
          onClick={() => setActiveStudioTab('intelligence')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeStudioTab === 'intelligence'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <BrainCircuit className="w-3.5 h-3.5 text-amber-400" />
          Document Intelligence & Extraction
        </button>

        <button
          onClick={() => setActiveStudioTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeStudioTab === 'analytics'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
          Vector Analytics & Audit Logs
        </button>
      </div>

      {/* Main Tab Views */}
      {activeStudioTab === 'library' && (
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <DocumentFolderTree
            folders={folders}
            selectedFolderId={selectedFolderId}
            selectedCategory={selectedCategory}
            onSelectFolder={setSelectedFolderId}
            onSelectCategory={setSelectedCategory}
            onCreateFolder={handleCreateFolder}
            onDeleteFolder={handleDeleteFolder}
          />
          <DocumentGridList
            documents={documents}
            loading={loading}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onPreview={(doc) => setPreviewDoc(doc)}
            onReindex={handleReindex}
            onDelete={handleDeleteDoc}
            onOpenUpload={() => setShowUploadModal(true)}
          />
        </div>
      )}

      {activeStudioTab === 'chat' && <AIDocumentChat documents={documents} />}

      {activeStudioTab === 'search' && <RAGSearchStudio documents={documents} />}

      {activeStudioTab === 'intelligence' && (
        <DocumentIntelligenceTab
          documents={documents}
          onOpenCompare={() => setShowCompareModal(true)}
        />
      )}

      {activeStudioTab === 'analytics' && <DocumentAnalyticsTab />}

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        folders={folders}
        uploadFn={documentApi.upload}
        onUploadSuccess={fetchData}
      />

      {/* Preview Modal */}
      <DocumentPreviewModal
        document={previewDoc}
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
      />

      {/* Compare Modal */}
      <DocumentCompareModal
        documents={documents}
        isOpen={showCompareModal}
        onClose={() => setShowCompareModal(false)}
      />
    </div>
  );
};
