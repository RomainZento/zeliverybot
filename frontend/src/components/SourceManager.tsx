"use client";

import { useState, useEffect, useRef } from "react";
import { 
  X, 
  Search, 
  FolderPlus, 
  File, 
  Folder, 
  ChevronRight, 
  ChevronDown, 
  CloudRain, 
  CheckCircle2, 
  RefreshCcw, 
  Database,
  ShieldCheck,
  Zap,
  HardDrive,
  Info
} from "lucide-react";

interface SourceFile {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  children?: SourceFile[];
}

interface SourceManagerProps {
  onClose: () => void;
}

export function SourceManager({ onClose }: SourceManagerProps) {
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [fileList, setFileList] = useState<SourceFile[]>([]);
  const [ragMetrics, setRagMetrics] = useState<{ storage_size: string, total_chunks: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sources/list`);
      const data = await res.json();
      setFileList(data);
    } catch (err) {
      console.error("Erreur sources list:", err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sources/upload`, {
        method: 'POST',
        body: formData,
      });
      fetchFiles(); // Refresh list
    } catch (err) {
      console.error("Erreur upload:", err);
    }
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sources/status`);
        const data = await res.json();
        setRagMetrics(data);
      } catch (err) {
        console.error("Erreur status RAG:", err);
      }
    };
    fetchStatus();
  }, []);

  // Search effect
  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      const delayDebounceFn = setTimeout(async () => {
        setIsSearching(true);
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sources/search?query=${encodeURIComponent(searchQuery)}`);
          const data = await res.json();
          setFileList(data);
        } catch (err) {
          console.error("Erreur search:", err);
        } finally {
          setIsSearching(false);
        }
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    } else if (searchQuery.length === 0) {
      fetchFiles();
    }
  }, [searchQuery]);

  const handleSync = async () => {
    if (selectedDocs.length === 0) return;
    setIsSyncing(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sources/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: process.env.NEXT_PUBLIC_PROJECT_ID || "default",
          files: selectedDocs
        })
      });
      onClose();
    } catch (err) {
      console.error("Erreur sync:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-3xl animate-fade-in group/modal">
      <div className="absolute inset-0 bg-black/80 transition-opacity duration-700" onClick={onClose}></div>
      
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col bg-[hsl(var(--zento-black))] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl transition-all transform group-hover/modal:scale-[1.005] ring-1 ring-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 lg:p-10 pb-6 lg:pb-8 border-b border-white/5 bg-white/5 backdrop-blur-md">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl lg:text-4xl font-black tracking-tighter text-white flex items-center gap-3 lg:gap-4">
              <Database className="text-[hsl(var(--zento-rose))] w-10 h-10" />
              SOURCES <span className="text-slate-500">DOCUMENTAIRES</span>
            </h2>
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[9px] font-black uppercase tracking-widest border border-white/5">
                RAG ENGINE
              </span>
              <p className="text-slate-500 font-bold tracking-tight flex items-center gap-2 text-xs">
                <ShieldCheck size={14} className="text-green-500" />
                Indexation sécurisée via Zento Bot
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 lg:p-4 text-slate-500 hover:text-white transition-all bg-white/5 rounded-2xl lg:rounded-3xl hover:bg-white/10 group/close border border-white/5"
          >
            <X size={20} className="lg:w-7 lg:h-7 group-hover/close:rotate-90 transition-transform duration-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 divide-y lg:divide-y-0 lg:divide-x divide-white/5 overflow-y-auto lg:overflow-hidden">
          {/* File Browser */}
          <div className="lg:w-1/2 flex flex-col p-6 lg:p-10 bg-white/[0.02] transition-all duration-300 min-h-[400px] lg:min-h-0">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 lg:mb-10 gap-6">

               <div className="relative flex-1 group/search">
                 <Search className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isSearching ? "text-[hsl(var(--zento-rose))] animate-pulse" : "text-slate-500"}`} size={20} />
                 <input 
                   placeholder="Recherche globale (Drive + Local)..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-14 pr-6 text-white outline-none focus:border-[hsl(var(--zento-rose))]/40 focus:ring-4 focus:ring-[hsl(var(--zento-rose))]/10 placeholder-slate-600 transition-all font-bold text-base"
                 />
               </div>
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 onChange={handleFileUpload} 
                 className="hidden" 
               />
               <button 
                 onClick={() => fileInputRef.current?.click()}
                 className="px-6 py-4 bg-[hsl(var(--zento-rose))] text-white font-black uppercase tracking-widest text-xs rounded-full flex items-center gap-3 hover:scale-105 transition active:scale-95 shadow-lg shadow-rose-500/20"
               >
                 <FolderPlus size={18} strokeWidth={3} />
                 Importer
               </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-4 custom-scrollbar">
              <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em] px-4 mb-4">Stockage Cloud / VM</p>
              {fileList.map((item) => (
                <FileTreeItem key={item.id} item={item} selected={selectedDocs} onToggle={(id) => {
                  setSelectedDocs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
                }} />
              ))}
            </div>
          </div>

          {/* Configuration Panel */}
          <div className="w-full lg:w-1/2 lg:shrink-0 p-6 lg:p-10 flex flex-col gap-8 bg-black/20">
            <div className="space-y-8">
               <div className="flex items-center gap-5 group/stat">
                 <div className="p-4 bg-[hsl(var(--zento-rose))]/10 rounded-3xl border border-[hsl(var(--zento-rose))]/20 group-hover/stat:bg-[hsl(var(--zento-rose))]/20 transition-colors">
                   <HardDrive className="text-[hsl(var(--zento-rose))]" size={24} />
                 </div>
                 <div className="flex flex-col min-w-0">
                   <span className="text-2xl font-black text-white tracking-tighter truncate">{selectedDocs.length} SELECTIONNÉS</span>
                   <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-0.5 truncate">DOCUMENTS PRÊTS À SYNC</span>
                 </div>
               </div>

               {ragMetrics && (
                  <div className="flex flex-col gap-4 p-6 rounded-[32px] bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest whitespace-nowrap">Poids de l&apos;index</span>
                      <span className="text-lg font-black text-white truncate text-right shrink-0">{ragMetrics.storage_size}</span>
                   </div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 group/info relative">
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest whitespace-nowrap">Segments (Chunks)</span>
                        <Info size={12} className="text-slate-600 hover:text-white transition-colors cursor-help" />
                        <div className="absolute bottom-full left-0 mb-3 w-64 p-4 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all duration-300 z-50">
                          <p className="text-[11px] text-slate-300 leading-relaxed font-bold">
                            Les documents sont découpés en petits morceaux (chunks) pour permettre une recherche ultra-précise par l&apos;IA.
                          </p>
                          <div className="absolute bottom-[-6px] left-4 w-3 h-3 bg-slate-900 border-r border-b border-white/10 rotate-45"></div>
                        </div>
                      </div>
                      <span className="text-lg font-black text-white truncate text-right shrink-0">{ragMetrics.total_chunks}</span>
                    </div>
                 </div>
               )}

               <div className="h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent"></div>

               <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 rounded-[28px] bg-green-500/5 border border-green-500/10 transition hover:bg-green-500/10 group/status">
                   <div className="flex items-center gap-4">
                     <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)] group-hover/status:scale-125 transition-transform duration-500 animate-pulse"></div>
                    <span className="text-sm font-black uppercase tracking-widest text-green-500">Statut: Prêt</span>
                   </div>
                 </div>
                 
                 <div className="p-6 rounded-[32px] bg-[hsl(var(--zento-blue))]/5 border border-[hsl(var(--zento-blue))]/10 space-y-4">
                    <span className="text-[10px] text-[hsl(var(--zento-blue))] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                      <Zap size={14} className="fill-[hsl(var(--zento-blue))]" strokeWidth={3} />
                      OPTIMISATION IA
                    </span>
                    <p className="text-sm text-slate-500 leading-relaxed font-bold">
                      Indexation via <span className="text-slate-300">text-embedding-004</span>. Optimisé pour <span className="text-slate-300">Gemini 3 Flash</span>.
                    </p>
                 </div>
               </div>
            </div>

            <div className="mt-auto">
              <button 
                onClick={handleSync}
                disabled={selectedDocs.length === 0 || isSyncing}
                className={`
                  w-full py-6 rounded-full font-black text-white text-xl uppercase tracking-widest transition-all flex items-center justify-center gap-4 shadow-2xl relative overflow-hidden group/sync-btn
                  ${isSyncing 
                    ? "bg-slate-800 cursor-wait" 
                    : "bg-[hsl(var(--zento-rose))] hover:shadow-rose-500/40 hover:scale-[1.02] active:scale-95"}
                `}
              >
                {isSyncing ? (
                  <>
                    <RefreshCcw className="animate-spin" size={24} strokeWidth={3} />
                    <span>SYNCHRO...</span>
                  </>
                ) : (
                  <>
                    <CloudRain size={24} strokeWidth={3} className="group-hover/sync-btn:-translate-y-1 transition-transform" />
                    <span>INDEXER</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FileTreeItem({ item, selected, onToggle, depth = 0 }: { item: SourceFile, selected: string[], onToggle: (id: string) => void, depth?: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [children, setChildren] = useState<SourceFile[]>(item.children || []);
  const [loading, setLoading] = useState(false);
  const isSelected = selected.includes(item.id);

  const toggleOpen = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen && children.length === 0) {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sources/list?parent_id=${encodeURIComponent(item.id)}`);
        const data = await res.json();
        setChildren(data);
      } catch (err) {
        console.error("Erreur lazy-loading:", err);
      } finally {
        setLoading(false);
      }
    }
    setIsOpen(!isOpen);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(item.id);
  };

  return (
    <div className="flex flex-col gap-1">
      <div 
        onClick={item.type === "folder" ? toggleOpen : handleToggle}
        className={`
          flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-slate-800/60 rounded-2xl border transition-all group/item
          ${isSelected ? "bg-blue-600/10 border-blue-500/40" : "bg-transparent border-transparent"}
        `}
        style={{ marginLeft: `${depth * 20}px` }}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {item.type === "folder" && (
            <div className="p-1 hover:bg-slate-700 rounded-lg transition-colors">
              {loading ? (
                <RefreshCcw size={14} className="animate-spin text-slate-500" />
              ) : isOpen ? (
                <ChevronDown size={16} className="text-slate-400" />
              ) : (
                <ChevronRight size={16} className="text-slate-400" />
              )}
            </div>
          )}
          
          <div 
            onClick={handleToggle}
            className={`
              w-5 h-5 rounded-md flex items-center justify-center border transition-all
              ${isSelected ? "bg-blue-500 border-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "bg-slate-800 border-slate-700 group-hover/item:border-slate-500"}
            `}
          >
            {isSelected && <CheckCircle2 size={12} className="text-white" />}
          </div>

          {item.type === "folder" ? (
            <Folder size={18} className="text-orange-400/80 shrink-0" />
          ) : (
            <File size={18} className="text-blue-400/80 shrink-0" />
          )}
          
          <span className={`text-sm font-bold truncate tracking-tight ${isSelected ? "text-white" : "text-slate-300 group-hover/item:text-white"}`}>
            {item.name}
          </span>
        </div>

        {item.size && (
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            {item.size}
          </span>
        )}
      </div>

      {item.type === "folder" && isOpen && (
        <div className="flex flex-col gap-1 border-l border-slate-800 ml-6 pl-2">
          {children.length > 0 ? (
            children.map((child: SourceFile) => (
              <FileTreeItem 
                key={child.id} 
                item={child} 
                selected={selected} 
                onToggle={onToggle} 
                depth={depth + 1} 
              />
            ))
          ) : !loading && (
            <span className="text-[10px] text-slate-600 px-4 py-2 italic">Dossier vide</span>
          )}
        </div>
      )}
    </div>
  );
}
