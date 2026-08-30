import React, { useState } from 'react';
import { DocumentFolder } from '../types/document.types';
import { 
  Folder, 
  FolderPlus, 
  ChevronRight, 
  ChevronDown, 
  Layers, 
  Sparkles, 
  FileText,
  Trash2
} from 'lucide-react';

interface Props {
  folders: DocumentFolder[];
  selectedFolderId: string | null;
  selectedCategory: string | null;
  onSelectFolder: (id: string | null) => void;
  onSelectCategory: (category: string | null) => void;
  onCreateFolder: (data: { name: string; color?: string; description?: string }) => void;
  onDeleteFolder?: (id: string) => void;
}

const PRESET_CATEGORIES = [
  { name: 'All Categories', key: null },
  { name: 'Legal & Contracts', key: 'Legal' },
  { name: 'Financial & Invoices', key: 'Finance' },
  { name: 'Technical & Engineering', key: 'Technical' },
  { name: 'HR & Personnel', key: 'HR' },
  { name: 'Operations & SOPs', key: 'Operations' },
  { name: 'General', key: 'General' },
];

export const DocumentFolderTree: React.FC<Props> = ({
  folders,
  selectedFolderId,
  selectedCategory,
  onSelectFolder,
  onSelectCategory,
  onCreateFolder,
  onDeleteFolder,
}) => {
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#6366f1');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    onCreateFolder({ name: newFolderName, color: newFolderColor });
    setNewFolderName('');
    setShowNewFolderModal(false);
  };

  const renderFolderItem = (folder: DocumentFolder, depth = 0) => {
    const isSelected = selectedFolderId === folder.id;
    const isExpanded = expandedFolders[folder.id] ?? true;
    const hasChildren = folder.children_folders && folder.children_folders.length > 0;

    return (
      <div key={folder.id} className="space-y-1">
        <div
          onClick={() => onSelectFolder(folder.id)}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          className={`flex items-center justify-between group px-2 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
            isSelected
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            {hasChildren ? (
              <button
                onClick={(e) => toggleExpand(folder.id, e)}
                className="text-slate-500 hover:text-slate-300"
              >
                {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>
            ) : (
              <Folder className="w-3.5 h-3.5" style={{ color: folder.color || '#6366f1' }} />
            )}
            <span className="truncate">{folder.name}</span>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {folder.documents_count !== undefined && (
              <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                {folder.documents_count}
              </span>
            )}
            {onDeleteFolder && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteFolder(folder.id);
                }}
                className="text-slate-500 hover:text-red-400 p-0.5"
                title="Delete Folder"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-1">
            {folder.children_folders!.map((child) => renderFolderItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          Folders & Hierarchy
        </h3>
        <button
          onClick={() => setShowNewFolderModal(true)}
          className="p-1 rounded-lg text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-colors"
          title="New Folder"
        >
          <FolderPlus className="w-4 h-4" />
        </button>
      </div>

      {/* Root All Documents */}
      <div className="space-y-1">
        <div
          onClick={() => onSelectFolder(null)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
            selectedFolderId === null && selectedCategory === null
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-300 hover:bg-slate-800/60'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>All Knowledge Files</span>
        </div>

        {folders.map((folder) => renderFolderItem(folder))}
      </div>

      {/* Categories Filter */}
      <div className="border-t border-slate-800 pt-4 space-y-2">
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          Domain Categories
        </h4>
        <div className="space-y-0.5">
          {PRESET_CATEGORIES.map((cat) => {
            const isCatSelected = selectedCategory === cat.key;
            return (
              <div
                key={cat.name}
                onClick={() => onSelectCategory(cat.key)}
                className={`px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-all flex items-center justify-between ${
                  isCatSelected
                    ? 'bg-pink-600/20 text-pink-300 font-semibold border border-pink-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <span>{cat.name}</span>
                {isCatSelected && <div className="w-1.5 h-1.5 rounded-full bg-pink-400" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-indigo-400" />
              Create Document Folder
            </h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                  Folder Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3 Financial Reports"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  {['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewFolderColor(color)}
                      className={`w-6 h-6 rounded-full transition-transform ${
                        newFolderColor === color ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewFolderModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-600/30"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
