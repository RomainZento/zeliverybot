"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { 
  Send, 
  Paperclip, 
  Sparkles,
  Loader2
} from "lucide-react";
import { ChatMessage } from "./ChatMessage";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  timestamp: Date;
}

const DEFAULT_GREETING: Message = {
  id: "greet",
  role: "assistant",
  content: "Bonjour ! Je suis **ZeliveryBot**, votre assistant dédié à l'analyse de vos documents. Posez-moi vos questions !",
  timestamp: new Date(),
};

interface MessageResponse {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  timestamp: string;
}

interface QueryResponse {
  id: string;
  content: string;
  sources?: string[];
  timestamp: string;
  session_id?: string;
}

export function ChatWindow({ chatId }: { chatId: string | null }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchHistory = useCallback(async () => {
    if (!chatId) {
      setMessages([DEFAULT_GREETING]);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/history/${chatId}`);
      const data: MessageResponse[] = await res.json();
      setMessages(data.length > 0 ? data.map((m: MessageResponse) => ({
        ...m,
        timestamp: new Date(m.timestamp)
      })) : [DEFAULT_GREETING]);
    } catch (err) {
      console.error("Failed to fetch history", err);
      setMessages([DEFAULT_GREETING]);
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const currentInput = input;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: currentInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const fetchResponse = async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/chat/query`;
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: currentInput,
            project_id: process.env.NEXT_PUBLIC_PROJECT_ID || "default",
            history_id: chatId
          }),
        });
        
        const data: QueryResponse = await res.json();
        const aiMsg: Message = {
          id: data.id,
          role: "assistant",
          content: data.content,
          sources: data.sources,
          timestamp: new Date(data.timestamp),
        };
        setMessages((prev) => [...prev, aiMsg]);

        if (!chatId && data.session_id) {
          window.dispatchEvent(new CustomEvent('session_created', { detail: data.session_id }));
        }
      } catch (error) {
        console.error("Erreur d'appel API:", error);
        const errorMsg: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: "Désolé, une erreur est survenue lors de la communication avec le serveur.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsTyping(false);
      }
    };

    fetchResponse();
  };

  return (
    <div className="flex-1 flex flex-col bg-[hsl(var(--zento-black))] overflow-hidden font-sans relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[hsl(var(--zento-rose))] opacity-[0.03] blur-[100px] pointer-events-none"></div>
      
      {/* Messages View */}
      <div className="flex-1 overflow-y-auto px-6 py-10 space-y-10 max-w-5xl mx-auto w-full custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-[hsl(var(--zento-rose))] blur-xl opacity-20 animate-pulse"></div>
              <Loader2 className="animate-spin text-[hsl(var(--zento-rose))] relative" size={48} />
            </div>
            <p className="text-slate-500 font-bold tracking-widest text-[10px] uppercase animate-pulse">Synchronisation des neurones...</p>
          </div>
        ) : (
          <>
            {messages.map((m) => (
              <ChatMessage key={m.id} message={m} />
            ))}
            {isTyping && (
              <div className="flex gap-4 items-center px-4 animate-fade-in">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                  <Sparkles size={18} className="text-[hsl(var(--zento-rose))]" />
                </div>
                <div className="flex gap-1.5 p-4 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/5 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-[hsl(var(--zento-rose))] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-[hsl(var(--zento-rose))] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-[hsl(var(--zento-rose))] rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input / Footer */}
      <div className="p-8 pb-10 flex flex-col gap-4 max-w-5xl mx-auto w-full relative z-10">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--zento-rose))] to-[hsl(var(--zento-blue))] rounded-[40px] opacity-0 group-focus-within:opacity-20 blur-xl transition-all duration-700"></div>
          
          <div className="relative flex items-end gap-3 p-2 bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-2xl transition-all group-focus-within:border-[hsl(var(--zento-rose))]/30 group-focus-within:bg-slate-900/80">
            <button className="p-4 text-slate-500 hover:text-white transition-all bg-slate-800/40 rounded-full hover:bg-slate-700/50 active:scale-90">
              <Paperclip size={22} />
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Posez votre question sur vos documents..."
              className="flex-1 bg-transparent border-none outline-none py-4 px-2 text-white placeholder-slate-500 resize-none max-h-40 min-h-[56px] font-bold text-lg leading-relaxed mt-0.5"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={`
                p-4 transition-all zento-pill shadow-xl
                ${!input.trim() || isTyping 
                  ? "bg-slate-800 text-slate-600 cursor-not-allowed grayscale" 
                  : "bg-[hsl(var(--zento-rose))] text-white hover:scale-105 active:scale-95 hover:shadow-[hsl(var(--zento-rose))]/40"}
              `}
            >
              <Send size={24} strokeWidth={2.5} />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-6 px-4">
             <p className="text-[11px] text-slate-600 tracking-[0.1em] font-black uppercase flex items-center gap-2 py-1">
               <Sparkles size={12} className="text-[hsl(var(--zento-rose))]/80" />
               Assistant projet optimisé par <span className="text-slate-400">{process.env.NEXT_PUBLIC_LLM_MODEL || "Gemini 3 Flash"}</span>
             </p>
        </div>
      </div>
    </div>
  );
}
