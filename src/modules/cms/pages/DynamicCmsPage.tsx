import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Globe,
  FileText,
  Menu as MenuIcon,
  Layout,
  Image as ImageIcon,
  Plus,
  Trash2,
  ExternalLink,
  Eye,
  RefreshCw,
  HardDrive,
  Tag,
  CheckCircle2,
  Search,
  Sparkles,
  Layers,
  Edit3,
  Sliders,
  FolderOpen,
  Wand2,
  Upload,
  X
} from 'lucide-react';
import { automationSaasApi } from '../../automation/services/automationSaasApi';
import {
  CmsPage,
  CmsMenu,
  CmsContentBlock,
  MediaFile,
  MediaStats
} from '../../automation/types/automationSaas.types';

export const DynamicCmsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Sync active tab from URL
  const getTabFromPath = () => {
    if (location.pathname.endsWith('/media') || location.search.includes('tab=media')) {
      return 'media';
    }
    if (location.pathname.endsWith('/menus') || location.pathname.endsWith('/blocks') || location.search.includes('tab=menus')) {
      return 'menus_blocks';
    }
    return 'pages';
  };

  const [activeTab, setActiveTab] = useState<'pages' | 'menus_blocks' | 'media'>(getTabFromPath());
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<CmsPage | null>(null);
  const [menus, setMenus] = useState<CmsMenu[]>([]);
  const [blocks, setBlocks] = useState<CmsContentBlock[]>([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [mediaStats, setMediaStats] = useState<MediaStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // Media Modal & Generation State
  const [showMediaModal, setShowMediaModal] = useState<boolean>(false);
  const [mediaModalTab, setMediaModalTab] = useState<'ai' | 'upload'>('ai');
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiTitle, setAiTitle] = useState<string>('');
  const [aiTagInput, setAiTagInput] = useState<string>('banner, marketing');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaSubmitting, setMediaSubmitting] = useState<boolean>(false);

  // Update tab whenever URL changes
  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname, location.search]);

  const handleTabChange = (tab: 'pages' | 'menus_blocks' | 'media') => {
    setActiveTab(tab);
    if (tab === 'media') {
      navigate('/cms/media');
    } else if (tab === 'menus_blocks') {
      navigate('/cms/menus');
    } else {
      navigate('/cms/pages');
    }
  };

  const resolveImageUrl = (url?: string) => {
    if (!url) return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      if (url.includes('localhost:8000/storage/')) {
        const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost/ai-business-platform/public/api/v1';
        const rootBase = apiBase.replace(/\/api\/v1\/?$/, '');
        return url.replace('http://localhost:8000/storage', `${rootBase}/storage`);
      }
      return url;
    }
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost/ai-business-platform/public/api/v1';
    const rootBase = apiBase.replace(/\/api\/v1\/?$/, '');
    return `${rootBase}/${url.replace(/^\/+/, '')}`;
  };

  // Load all CMS Data with resilient individual try/catch
  const loadData = async () => {
    setLoading(true);
    try {
      const [pagesRes, menusRes, blocksRes, mediaRes, statsRes] = await Promise.allSettled([
        automationSaasApi.getCmsPages(),
        automationSaasApi.getCmsMenus(),
        automationSaasApi.getContentBlocks(),
        automationSaasApi.getMediaFiles(),
        automationSaasApi.getMediaStats(),
      ]);

      const pagesData = pagesRes.status === 'fulfilled' ? pagesRes.value : [];
      const menusData = menusRes.status === 'fulfilled' ? menusRes.value : [];
      const blocksData = blocksRes.status === 'fulfilled' ? blocksRes.value : [];
      const mediaData = mediaRes.status === 'fulfilled' ? mediaRes.value : [];
      const statsData = statsRes.status === 'fulfilled' ? statsRes.value : null;

      setPages(pagesData);
      if (pagesData.length > 0 && !selectedPage) {
        setSelectedPage(pagesData[0]);
      }
      setMenus(menusData);
      setBlocks(blocksData);
      setMediaFiles(mediaData);
      setMediaStats(statsData);
    } catch (err) {
      console.error('Failed to load CMS data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreatePage = async () => {
    const title = prompt('Enter page title:', 'Product Release Notes');
    if (!title) return;
    try {
      const newPage = await automationSaasApi.createCmsPage({
        title,
        layout: 'default',
        content: `# ${title}\n\nEnter page details here.`,
        status: 'published',
      });
      await loadData();
      setSelectedPage(newPage);
    } catch (err) {
      console.error('Failed to create page', err);
    }
  };

  const handleSavePage = async () => {
    if (!selectedPage) return;
    setSaving(true);
    try {
      const updated = await automationSaasApi.updateCmsPage(selectedPage.id, selectedPage);
      setPages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setSelectedPage(updated);
      alert('CMS Page saved successfully!');
    } catch (err) {
      console.error('Failed to save CMS page', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePage = async (id: number) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    try {
      await automationSaasApi.deleteCmsPage(id);
      await loadData();
      if (selectedPage?.id === id) {
        setSelectedPage(null);
      }
    } catch (err) {
      console.error('Failed to delete page', err);
    }
  };

  const handleCreateMenu = async () => {
    const name = prompt('Enter Navigation Menu Name (e.g. Footer Quick Links):', 'Footer Quick Links');
    if (!name) return;
    const rawLocation = prompt('Enter Location identifier (header, footer, sidebar, mobile):', 'footer') || 'header';
    const location = (['header', 'footer', 'sidebar', 'mobile'].includes(rawLocation) ? rawLocation : 'header') as 'header' | 'footer' | 'sidebar' | 'mobile';
    try {
      await automationSaasApi.createCmsMenu({
        name,
        location,
        is_active: true,
        items: [
          { title: 'Home', url: '/', target: '_self' },
          { title: 'Pricing', url: '/billing', target: '_self' },
          { title: 'Contact', url: '/support', target: '_self' },
        ],
      });
      await loadData();
    } catch (err) {
      console.error('Failed to create menu', err);
    }
  };

  const handleAddItemToMenu = async (menu: CmsMenu) => {
    const title = prompt('Enter Link Label (e.g. Blog, About Us, Careers):', 'About Us');
    if (!title) return;
    const url = prompt('Enter URL path or External URL (e.g. /cms/pages or https://example.com):', '/cms/pages') || '/';
    try {
      const updatedItems = [...(menu.items || []), { title, url, target: '_self' as const }];
      await automationSaasApi.updateCmsMenu(menu.id, {
        items: updatedItems,
      });
      await loadData();
    } catch (err) {
      console.error('Failed to add item to menu', err);
    }
  };

  const handleDeleteMenu = async (id: number) => {
    if (!confirm('Are you sure you want to delete this navigation menu?')) return;
    try {
      await automationSaasApi.deleteCmsMenu(id);
      await loadData();
    } catch (err) {
      console.error('Failed to delete menu', err);
    }
  };

  const handleCreateBlock = async () => {
    const title = prompt('Enter Content Block Title:', 'Call to Action Banner');
    if (!title) return;
    const identifier = title.toLowerCase().replace(/\s+/g, '_');
    try {
      await automationSaasApi.createContentBlock({
        title,
        identifier,
        type: 'cta',
        is_active: true,
        content: {
          headline: title,
          description: 'Get started with autonomous intelligence today.',
          button_text: 'Explore Platform',
          button_url: '/multi-agent',
        },
      });
      await loadData();
    } catch (err) {
      console.error('Failed to create content block', err);
    }
  };

  const handleDeleteBlock = async (id: number) => {
    if (!confirm('Are you sure you want to delete this content block?')) return;
    try {
      await automationSaasApi.deleteContentBlock(id);
      await loadData();
    } catch (err) {
      console.error('Failed to delete content block', err);
    }
  };

  const handleGenerateAiMedia = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiPrompt.trim()) {
      alert('Please enter an image prompt description (e.g. "Sports championship stadium with floodlights")');
      return;
    }
    setMediaSubmitting(true);
    try {
      const tags = aiTagInput
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean);

      await automationSaasApi.generateAiMedia({
        prompt: aiPrompt.trim(),
        name: aiTitle.trim() || undefined,
        tags,
      });

      await loadData();
      setShowMediaModal(false);
      setAiPrompt('');
      setAiTitle('');
    } catch (err) {
      console.error('Failed to generate AI image', err);
      alert('Failed to generate AI image. Please check logs or try again.');
    } finally {
      setMediaSubmitting(false);
    }
  };

  const handleUploadMediaFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please choose an image or document file to upload.');
      return;
    }
    setMediaSubmitting(true);
    try {
      const tags = aiTagInput
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean);

      await automationSaasApi.uploadMediaFile(selectedFile, aiTitle.trim() || selectedFile.name, tags);
      await loadData();
      setShowMediaModal(false);
      setSelectedFile(null);
      setAiTitle('');
    } catch (err) {
      console.error('Failed to upload media file', err);
      alert('Failed to upload file. Please try again.');
    } finally {
      setMediaSubmitting(false);
    }
  };

  const handleDeleteMedia = async (id: number) => {
    if (!confirm('Are you sure you want to delete this media asset?')) return;
    try {
      await automationSaasApi.deleteMediaFile(id);
      await loadData();
    } catch (err) {
      console.error('Failed to delete media asset', err);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Dynamic CMS & Media Suite
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Module 10
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Manage dynamic pages, navigation menu trees, reusable content blocks, and media asset storage.
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => handleTabChange('pages')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'pages'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Pages & SEO</span>
          </button>

          <button
            onClick={() => handleTabChange('menus_blocks')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'menus_blocks'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Menus & Blocks</span>
          </button>

          <button
            onClick={() => handleTabChange('media')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'media'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Media Assets</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-400">
          <RefreshCw className="w-7 h-7 animate-spin text-cyan-400" />
          <p className="text-sm">Loading Dynamic CMS...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: DYNAMIC PAGES & SEO */}
          {activeTab === 'pages' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Pages List */}
              <div className="lg:col-span-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">CMS Pages ({pages.length})</h2>
                  <button
                    onClick={handleCreatePage}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600 hover:text-white border border-cyan-500/30 text-xs font-semibold transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Page</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {pages.map((p) => {
                    const isSelected = selectedPage?.id === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPage(p)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-800/90 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                            : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-bold text-white">{p.title}</h3>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              p.status === 'published'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-slate-700 text-slate-400'
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>

                        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                          <span className="font-mono text-cyan-400">/{p.slug}</span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3 text-slate-500" /> {p.view_count.toLocaleString()} views
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Page Editor */}
              <div className="lg:col-span-8 space-y-4">
                {selectedPage ? (
                  <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                      <div>
                        <h2 className="text-base font-bold text-white">Page Settings & Markdown Editor</h2>
                        <p className="text-xs text-slate-400 font-mono">Live Slug URL: /{selectedPage.slug}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeletePage(selectedPage.id)}
                          className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 transition-all text-xs"
                          title="Delete Page"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <button
                          disabled={saving}
                          onClick={handleSavePage}
                          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-600/20 transition-all disabled:opacity-50"
                        >
                          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Page Title</label>
                        <input
                          type="text"
                          value={selectedPage.title}
                          onChange={(e) => setSelectedPage({ ...selectedPage, title: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">URL Slug</label>
                        <input
                          type="text"
                          value={selectedPage.slug}
                          onChange={(e) => setSelectedPage({ ...selectedPage, slug: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-cyan-400 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Layout Template</label>
                        <select
                          value={selectedPage.layout}
                          onChange={(e) => setSelectedPage({ ...selectedPage, layout: e.target.value as any })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200"
                        >
                          <option value="default">Default Content Layout</option>
                          <option value="landing">Landing Page Hero Layout</option>
                          <option value="full_width">Full Width Canvas</option>
                          <option value="blog">Article / Blog Layout</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Publication Status</label>
                        <select
                          value={selectedPage.status}
                          onChange={(e) => setSelectedPage({ ...selectedPage, status: e.target.value as any })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200"
                        >
                          <option value="published">Published (Public)</option>
                          <option value="draft">Draft (Private)</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">SEO Meta Description</label>
                      <input
                        type="text"
                        value={selectedPage.meta_description || ''}
                        onChange={(e) => setSelectedPage({ ...selectedPage, meta_description: e.target.value })}
                        placeholder="Concise SEO search description snippet..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Page Body (Markdown / HTML)</label>
                      <textarea
                        rows={10}
                        value={selectedPage.content || ''}
                        onChange={(e) => setSelectedPage({ ...selectedPage, content: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
                    Select or create a page to view and edit.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MENUS & CONTENT BLOCKS */}
          {activeTab === 'menus_blocks' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Navigation Menus Tree */}
              <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <MenuIcon className="w-4 h-4 text-cyan-400" />
                    Navigation Menus ({menus.length})
                  </h2>

                  <button
                    onClick={handleCreateMenu}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/20"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Menu</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {menus.map((m) => (
                    <div key={m.id} className="p-4 bg-slate-800/70 rounded-xl border border-slate-700/70 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-white">{m.name}</h3>
                          <span className="text-[11px] text-cyan-400 capitalize">Location: #{m.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                            Active
                          </span>
                          <button
                            onClick={() => handleDeleteMenu(m.id)}
                            title="Delete Menu"
                            className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-950/50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5 pl-2 border-l-2 border-slate-700">
                        {m.items?.map((item: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 bg-slate-900/60 rounded-lg text-xs"
                          >
                            <span className="font-semibold text-slate-200">{item.title}</span>
                            <span className="text-cyan-400 font-mono text-[11px]">{item.url}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => handleAddItemToMenu(m)}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-medium border border-slate-700/80 transition-colors"
                      >
                        <Plus className="w-3 h-3 text-cyan-400" />
                        <span>Add Link Item</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Content Blocks */}
              <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Layout className="w-4 h-4 text-cyan-400" />
                    Reusable Content Blocks ({blocks.length})
                  </h2>

                  <button
                    onClick={handleCreateBlock}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Block</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {blocks.map((b) => (
                    <div key={b.id} className="p-4 bg-slate-800/70 rounded-xl border border-slate-700/70 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-white">{b.title}</h3>
                          <span className="text-[11px] font-mono text-cyan-400">identifier: {b.identifier}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300">
                            {b.type}
                          </span>
                          <button
                            onClick={() => handleDeleteBlock(b.id)}
                            title="Delete Block"
                            className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-950/50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <pre className="p-2.5 bg-slate-950 rounded-lg text-[10px] font-mono text-slate-300 overflow-x-auto max-h-32">
                        {JSON.stringify(b.content, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MEDIA ASSETS & STORAGE */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              {/* Storage Stats Header Bar */}
              {mediaStats && (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                    <p className="text-[11px] font-bold text-slate-400 uppercase">Total Storage Used</p>
                    <p className="text-xl font-bold text-cyan-400 mt-1">{mediaStats.total_mb} MB</p>
                    <p className="text-[10px] text-slate-500">{mediaStats.total_gb} GB</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                    <p className="text-[11px] font-bold text-slate-400 uppercase">Total Files</p>
                    <p className="text-xl font-bold text-white mt-1">{mediaStats.file_count}</p>
                    <p className="text-[10px] text-slate-500">Indexed media records</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                    <p className="text-[11px] font-bold text-slate-400 uppercase">Images & Graphics</p>
                    <p className="text-xl font-bold text-emerald-400 mt-1">{mediaStats.image_count}</p>
                    <p className="text-[10px] text-slate-500">PNG, SVG, WebP, JPG</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                    <p className="text-[11px] font-bold text-slate-400 uppercase">Documents & PDFs</p>
                    <p className="text-xl font-bold text-indigo-400 mt-1">{mediaStats.document_count}</p>
                    <p className="text-[10px] text-slate-500">PDF, JSON, CSV</p>
                  </div>
                </div>
              )}

              {/* Media Gallery Grid */}
              <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <FolderOpen className="w-4 h-4 text-cyan-400" />
                      Media Assets Gallery ({mediaFiles.length})
                    </h2>
                    <p className="text-xs text-slate-400">Generate prompt-tailored AI visuals or upload custom assets</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setMediaModalTab('ai');
                        setShowMediaModal(true);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate AI Image</span>
                    </button>

                    <button
                      onClick={() => {
                        setMediaModalTab('upload');
                        setShowMediaModal(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
                    >
                      <Upload className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Upload File</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
                  {mediaFiles.map((m) => (
                    <div
                      key={m.id}
                      className="group bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between relative"
                    >
                      <div className="space-y-2">
                        <div className="h-36 w-full rounded-lg bg-slate-900 overflow-hidden relative group/img">
                          <img
                            src={resolveImageUrl(m.url)}
                            alt={m.alt_text || m.name}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
                            }}
                            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <button
                            onClick={() => handleDeleteMedia(m.id)}
                            title="Delete Asset"
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-950/80 hover:bg-red-600 text-red-300 hover:text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-white line-clamp-1" title={m.name}>
                            {m.name}
                          </h4>
                          <p className="text-[10px] font-mono text-slate-400 truncate" title={m.file_name}>
                            {m.file_name}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500">
                        <span>{Math.round(m.size_bytes / 1024)} KB</span>
                        <div className="flex flex-wrap gap-1 justify-end max-w-[70%]">
                          {m.tags?.slice(0, 3).map((t: string, i: number) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800/80 text-cyan-400 text-[10px]">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AI / UPLOAD MODAL */}
          {showMediaModal && (
            <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    {mediaModalTab === 'ai' ? (
                      <Sparkles className="w-5 h-5 text-purple-400" />
                    ) : (
                      <Upload className="w-5 h-5 text-cyan-400" />
                    )}
                    <h3 className="text-base font-bold text-white">
                      {mediaModalTab === 'ai' ? 'AI Visual Asset Generator' : 'Upload Media Asset'}
                    </h3>
                  </div>

                  <button
                    onClick={() => setShowMediaModal(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mode Selector Tabs */}
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setMediaModalTab('ai')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      mediaModalTab === 'ai' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>AI Prompt Generator</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaModalTab('upload')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      mediaModalTab === 'upload' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>File Upload</span>
                  </button>
                </div>

                {/* AI GENERATION FORM */}
                {mediaModalTab === 'ai' && (
                  <form onSubmit={handleGenerateAiMedia} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Image Description / Prompt *
                      </label>
                      <textarea
                        rows={3}
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="e.g. Cricket match action in stadium with crowd cheering under floodlights"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Asset Title (Optional)
                        </label>
                        <input
                          type="text"
                          value={aiTitle}
                          onChange={(e) => setAiTitle(e.target.value)}
                          placeholder="e.g. Cricket Championship"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          value={aiTagInput}
                          onChange={(e) => setAiTagInput(e.target.value)}
                          placeholder="sports, stadium, match"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowMediaModal(false)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={mediaSubmitting}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
                      >
                        {mediaSubmitting ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Generating Image...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Generate Unique Asset</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {/* UPLOAD FORM */}
                {mediaModalTab === 'upload' && (
                  <form onSubmit={handleUploadMediaFile} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Select File (PNG, JPG, WebP, SVG) *
                      </label>
                      <input
                        type="file"
                        accept="image/*,.pdf,.svg"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Asset Title / Alt Text
                        </label>
                        <input
                          type="text"
                          value={aiTitle}
                          onChange={(e) => setAiTitle(e.target.value)}
                          placeholder="e.g. Company Banner"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          value={aiTagInput}
                          onChange={(e) => setAiTagInput(e.target.value)}
                          placeholder="marketing, logo, upload"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowMediaModal(false)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={mediaSubmitting || !selectedFile}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/30 transition-all disabled:opacity-50"
                      >
                        {mediaSubmitting ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Media</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
