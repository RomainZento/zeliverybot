"use client";

import { signIn } from "next-auth/react";
import { Sparkles, ArrowRight } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--zento-black))] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[hsl(var(--zento-rose))] opacity-[0.05] blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[hsl(var(--zento-blue))] opacity-[0.03] blur-[100px] rounded-full transition-all duration-1000"></div>
      </div>

      <div className="max-w-md w-full bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[48px] p-12 shadow-2xl relative z-10 flex flex-col items-center gap-10 text-center animate-fade-in">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[hsl(var(--zento-rose))] to-[hsl(var(--zento-blue))] p-0.5 shadow-2xl shadow-rose-500/20">
            <div className="w-full h-full bg-[hsl(var(--zento-black))] rounded-[22px] flex items-center justify-center">
              <Sparkles className="text-[hsl(var(--zento-rose))] w-10 h-10" strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white">
              ZELIVERY<span className="text-[hsl(var(--zento-rose))]">BOT</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-1">Intelligence Documentaire</p>
          </div>
        </div>

        <div className="space-y-4 w-full">
           <h2 className="text-xl font-bold text-slate-200 tracking-tight">Accès sécurisé SSO</h2>
           <p className="text-sm text-slate-500 leading-relaxed font-medium">Connectez-vous pour accéder à vos documents et à l&apos;assistant de projet.</p>
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full py-5 px-8 bg-white text-[hsl(var(--zento-black))] font-black uppercase tracking-widest text-xs rounded-full flex items-center justify-center gap-4 hover:scale-105 transition-all active:scale-95 shadow-xl hover:bg-slate-100 group"
        >
          Continuer avec Google
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.1em] py-2 border-t border-white/5 w-full">
          Propulsé par Zento Design System
        </p>
      </div>
    </div>
  );
}
