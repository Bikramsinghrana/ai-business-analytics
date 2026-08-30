import React, { useState, useRef } from 'react';
import { DocumentFolder } from '../types/document.types';
import { 
  UploadCloud, 
  X, 
  FileText, 
  Sparkles, 
  Sliders, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Loader2
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  folders: DocumentFolder[];
  onUploadSuccess: () => void;
  uploadFn: (formData: FormData) => Promise<any>;
}

export const DocumentUploadModal: React.FC<Props> = ({
  isOpen,
  onClose,
  folders,
  onUploadSuccess,
  uploadFn,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [folderId, setFolderId] = useState<string>('');
  const [category, setCategory] = useState<string>('General');
  const [ocrEnabled, setOcrEnabled] = useState<boolean>(false);
  const [chunkSize, setChunkSize] = useState<number>(400);
  const [overlap, setOverlap] = useState<number>(50);
  const [tagsInput, setTagsInput] = useState<string>('knowledge, enterprise, q3');
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFilesAdded = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setError('Please choose at least one document to upload.');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('files[]', file);
      });

      if (folderId) formData.append('folder_id', folderId);
      formData.append('category', category);
      formData.append('ocr_enabled', ocrEnabled ? '1' : '0');
      formData.append('chunk_size', chunkSize.toString());
      formData.append('overlap', overlap.toString());

      const tagsArray = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      tagsArray.forEach((t, i) => {
        formData.append(`tags[${i}]`, t);
      });

      await uploadFn(formData);
      onUploadSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Upload and ingestion failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 space-y-6 shadow-2xl my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <UploadCloud className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Ingest & Embed Knowledge Documents</h2>
              <p className="text-xs text-slate-400">PDF, DOCX, CSV, TXT, JSON, MD & Image OCR Extraction</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFilesAdded(e.dataTransfer.files);
            }}
            className="border-2 border-dashed border-slate-700 hover:border-indigo-500/50 bg-slate-950/50 rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-slate-900/50 flex flex-col items-center justify-center gap-2"
          >
            <UploadCloud className="w-8 h-8 text-indigo-400" />
            <p className="text-sm font-semibold text-slate-200">
              Click or drag documents here to upload
            </p>
            <p className="text-xs text-slate-500">
              Supports PDF, DOCX, TXT, CSV, Markdown, PNG, JPG (up to 50MB each)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.doc,.txt,.csv,.md,.json,.png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => handleFilesAdded(e.target.files)}
            />
          </div>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
              {selectedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <span className="text-slate-200 font-medium truncate">{file.name}</span>
                    <span className="text-[10px] text-slate-500">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="text-slate-500 hover:text-red-400 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Organizing Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                Folder Destination
              </label>
              <select
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Root Knowledge Base (No Folder)</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    📁 {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                Domain Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="General">General</option>
                <option value="Legal">Legal & Contracts</option>
                <option value="Finance">Financial & Invoices</option>
                <option value="Technical">Technical & Architecture</option>
                <option value="HR">HR & Policies</option>
                <option value="Operations">Operations & SOPs</option>
              </select>
            </div>
          </div>

          {/* OCR & AI Settings */}
          <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-pink-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">Enable OCR Optical Text Recognition</h4>
                  <p className="text-[11px] text-slate-400">Extracts printed/scanned text inside images & diagrams</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={ocrEnabled}
                  onChange={(e) => setOcrEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pink-600"></div>
              </label>
            </div>

            {/* Chunking Sliders */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800/60">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Chunk Size (Words)</span>
                  <span className="font-semibold text-indigo-400">{chunkSize} words</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="1000"
                  step="50"
                  value={chunkSize}
                  onChange={(e) => setChunkSize(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Token Overlap</span>
                  <span className="font-semibold text-indigo-400">{overlap} words</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  step="10"
                  value={overlap}
                  onChange={(e) => setOverlap(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">
              Metadata Tags (Comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. quarterly, legal-review, policy-2026"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || selectedFiles.length === 0}
              className="px-6 py-2 text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Extracting & Embedding Vectors...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Ingest & Generate Vector Embeddings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
