"use client";

import { useState } from "react";
import { 
  User, 
  Settings
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { ChatWindow } from "@/components/ChatWindow";
import { SourceManager } from "@/components/SourceManager";
import { useEffect } from "react";

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  useEffect(() => {
    const handleSessionCreated = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setCurrentChatId(customEvent.detail);
      }
    };
    window.addEventListener('session_created', handleSessionCreated);
    return () => window.removeEventListener('session_created', handleSessionCreated);
  }, []);

  return (
    <main className="flex h-screen overflow-hidden">
      {/* Sidebar - History & Config */}
      <Sidebar 
        currentChatId={currentChatId}
        onChatSelect={setCurrentChatId} 
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 relative min-w-0 bg-[hsl(var(--zento-black))]">
        <header className="h-16 flex-shrink-0 flex items-center justify-between px-8 border-b border-white/5 bg-[hsl(var(--zento-black))] shadow-xl z-20">
          <div className="flex items-center gap-3">
            <span className="font-black text-xs tracking-[0.2em] text-slate-400 uppercase">
              Projet : <span className="text-white">Zelivery RAG</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[hsl(var(--zento-rose))]/10 text-[hsl(var(--zento-rose))] text-[9px] font-black border border-[hsl(var(--zento-rose))]/20 tracking-tighter">
              BETA V1.0
            </span>
          </div>
          
          <div className="flex items-center gap-5">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2.5 hover:bg-slate-800/50 rounded-2xl transition-all text-slate-400 hover:text-[hsl(var(--zento-rose))] active:scale-95"
            >
              <Settings size={20} />
            </button>
            <div className="h-10 w-10 rounded-2xl bg-slate-800 flex items-center justify-center border border-white/5 shadow-lg relative group cursor-pointer transition-all hover:border-[hsl(var(--zento-rose))]/30">
              <User size={20} className="text-slate-400 group-hover:text-white transition-colors" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[hsl(var(--zento-black))] rounded-full"></div>
            </div>
          </div>
        </header>

        <ChatWindow chatId={currentChatId} />
      </div>

      {/* Modals & Overlays */}
      {isSettingsOpen && (
        <SourceManager onClose={() => setIsSettingsOpen(false)} />
      )}
    </main>
  );
}
