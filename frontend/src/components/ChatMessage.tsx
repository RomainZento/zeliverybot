"use client";

import React, { useState, useEffect } from "react";
import { User, Sparkles, FileText, ExternalLink, BadgeCheck } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  timestamp: string | Date;
}

export function ChatMessage({ message }: { message: Message }) {
  const isAssistant = message.role === "assistant";

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const formatTime = (ts: string | Date) => {
    const d = typeof ts === 'string' ? new Date(ts) : ts;
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex flex-col gap-4 animate-fade-in ${isAssistant ? "items-start" : "items-end"}`}>
      <div className={`flex gap-4 max-w-[85%] ${isAssistant ? "flex-row" : "flex-row-reverse"}`}>
        {/* Avatar */}
        <div className={`
          flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg
          ${isAssistant 
            ? "bg-gradient-to-br from-[hsl(var(--zento-rose))] to-[hsl(var(--zento-blue))] text-white" 
            : "bg-slate-800 text-slate-400"}
        `}>
          {isAssistant ? <Sparkles size={20} strokeWidth={2.5} /> : <User size={20} />}
        </div>

        {/* Bubble */}
        <div className="flex flex-col gap-3">
          <div className={`
            px-6 py-5 rounded-[32px] shadow-sm relative group transition-all duration-300
            ${isAssistant 
              ? "bg-slate-900/40 text-slate-100 border border-white/5 backdrop-blur-sm rounded-tl-lg" 
              : "bg-slate-800 text-white rounded-tr-lg hover:bg-slate-700/80"}
          `}>
            <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:rounded-2xl prose-pre:border prose-pre:border-white/5 max-w-none font-medium text-[16px]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
            
            <div className={`
              absolute -bottom-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300
              ${isAssistant ? "left-0" : "right-0"}
            `}>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                {mounted ? formatTime(message.timestamp) : "--:--"}
              </span>
              {isAssistant && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 text-green-500 rounded-full border border-green-500/20">
                  <BadgeCheck size={10} strokeWidth={3} />
                  <span className="text-[8px] font-black uppercase tracking-tighter">Vérifié</span>
                </div>
              )}
            </div>
          </div>

          {/* Sources */}
          {isAssistant && message.sources && message.sources.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {message.sources.map((source, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900/60 hover:bg-slate-800 transition-colors border border-white/5 rounded-full group/source cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-lg bg-[hsl(var(--zento-rose))]/10 flex items-center justify-center">
                    <FileText size={12} className="text-[hsl(var(--zento-rose))]" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 group-hover/source:text-white transition-colors">{source}</span>
                  <ExternalLink size={10} className="text-slate-600 group-hover/source:text-[hsl(var(--zento-rose))]" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
