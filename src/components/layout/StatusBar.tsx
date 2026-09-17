"use client";

import React, { useState, useEffect } from "react";
import { GitBranch, Check, Bell, Cpu, Sparkles } from "lucide-react";
import { getLanguageById } from "@/components/editor/editor-config";

interface StatusBarProps {
  activeLangId?: string;
}

export function StatusBar({ activeLangId = "python" }: StatusBarProps) {
  const language = getLanguageById(activeLangId);
  const [cursor, setCursor] = useState({ line: 1, col: 1 });

  useEffect(() => {
    const handleCursorChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ line: number, col: number }>;
      setCursor(customEvent.detail);
    };
    window.addEventListener('editor:cursor-change', handleCursorChange);
    return () => window.removeEventListener('editor:cursor-change', handleCursorChange);
  }, []);

  return (
    <div className="mx-2 mb-1.5 h-6 bg-[#090d16]/80 border border-indigo-500/20 rounded-xl text-zinc-300 backdrop-blur-xl flex items-center justify-between px-3 text-[10px] tracking-wider shrink-0 font-mono font-medium shadow-lg z-50 select-none">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 hover:text-white hover:bg-white/5 px-2 py-0.5 rounded-lg cursor-pointer transition-colors text-indigo-400">
          <GitBranch size={11} />
          <span>main*</span>
        </div>
        <div className="flex items-center gap-1.5 hover:text-white hover:bg-white/5 px-2 py-0.5 rounded-lg cursor-pointer transition-colors text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>NEURAL KERNEL READY</span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 text-zinc-400">
        <div className="flex items-center gap-3 hover:text-white px-2 py-0.5 rounded-lg cursor-pointer transition-colors">
          <span>Ln {cursor.line}, Col {cursor.col}</span>
          <span>Spaces: 4</span>
          <span>UTF-8</span>
          <span>CRLF</span>
        </div>
        
        <div className="hover:text-indigo-300 font-semibold px-2 py-0.5 rounded-lg cursor-pointer transition-colors text-indigo-400">
          {language.name}
        </div>

        <div className="flex items-center gap-1 hover:text-white px-2 py-0.5 rounded-lg cursor-pointer transition-colors text-emerald-400">
          <Check size={11} />
          <span>Format</span>
        </div>
      </div>
    </div>
  );
}
