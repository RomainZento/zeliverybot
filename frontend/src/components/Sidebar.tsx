"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  MessageSquare, 
  Settings, 
  LogOut, 
  PanelLeft, 
  PanelLeftClose, 
  Loader2 
} from "lucide-react";
import { signOut } from "next-auth/react";

interface SidebarProps {
  currentChatId: string | null;
  onChatSelect: (id: string | null) => void;
  onOpenSettings: () => void;
}

interface Session {
  id: string;
  title: string;
  timestamp: string;
}

export function Sidebar({ currentChatId, onChatSelect, onOpenSettings }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [history, setHistory] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const url = `${process.env.NEXT_PUBLIC_API_URL}/chat/sessions?project_id=${process.env.NEXT_PUBLIC_PROJECT_ID || "default"}`;
      console.log("Sidebar fetching sessions:", url);
      const res = await fetch(url);
      const data = await res.json();
      console.log("Sidebar sessions data:", data);
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch sessions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [currentChatId]); // Refresh list when active chat changes (e.g. after first message)

  const handleNewChat = () => {
    onChatSelect(null);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return "aujourd'hui";
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <aside 
      className={`
        ${isCollapsed ? "w-20" : "w-80"} 
        transition-all duration-500 ease-in-out h-full
        bg-[hsl(var(--zento-black))] border-r border-slate-800/50 flex flex-col relative z-20 glass
      `}
    >
      {/* Header / New Chat */}
      <div className="p-4 flex flex-col gap-4 flex-shrink-0">
        <div className="flex items-center justify-between min-h-[40px]">
          {!isCollapsed && <span className="font-black text-xl tracking-tighter text-white">ZELIVERY<span className="text-[hsl(var(--zento-rose))]">BOT</span></span>}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-slate-800/50 rounded-xl text-slate-400 transition-colors"
          >
            {isCollapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
          </button>
        </div>
        
        <button 
          onClick={() => onChatSelect(null)}
          className={`
            flex items-center gap-3 px-4 py-3.5 
            bg-[hsl(var(--zento-rose))] text-white font-bold
            zento-pill hover:scale-[1.02] transition-all shadow-lg shadow-rose-500/20 active:scale-95
            ${isCollapsed ? "justify-center px-0" : ""}
          `}
        >
          <Plus size={20} strokeWidth={3} />
          {!isCollapsed && <span>Nouveau Chat</span>}
        </button>
      </div>

      {/* Sessions History */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 custom-scrollbar">
        {!isCollapsed && <p className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 mt-2">Historique</p>}
        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-600" /></div>
        ) : (
          history.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group
                ${currentChatId === chat.id 
                  ? "bg-slate-800/50 text-[hsl(var(--zento-rose))] ring-1 ring-white/5" 
                  : "text-slate-400 hover:bg-slate-800/30 hover:text-white"}
                ${isCollapsed ? "justify-center px-0" : ""}
              `}
            >
              <MessageSquare size={18} className={currentChatId === chat.id ? "text-[hsl(var(--zento-rose))]" : "text-slate-500"} />
              {!isCollapsed && (
                <div className="flex flex-col items-start overflow-hidden text-left">
                  <span className="text-sm font-bold truncate w-full">{chat.title}</span>
                  <span className="text-[10px] font-medium opacity-50 uppercase tracking-tighter">{formatDate(chat.timestamp)}</span>
                </div>
              )}
            </button>
          ))
        )}
        {!loading && history.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-xs text-slate-600 font-medium italic">Aucun historique</p>
          </div>
        )}
      </div>

      {/* Footer / Settings */}
      <div className="p-4 border-t border-slate-800/50">
        <button 
          onClick={onOpenSettings}
          className={`
            w-full flex items-center gap-3 px-4 py-3 rounded-2xl
            text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all
            ${isCollapsed ? "justify-center px-0" : ""}
          `}
        >
          <Settings size={20} />
          {!isCollapsed && <span className="text-sm font-bold">Configuration</span>}
        </button>
        <button 
          onClick={() => signOut()}
          className={`
            w-full flex items-center gap-3 px-4 py-3 rounded-2xl mt-2
            text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all
            ${isCollapsed ? "justify-center px-0" : ""}
          `}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="text-sm font-bold">Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}
