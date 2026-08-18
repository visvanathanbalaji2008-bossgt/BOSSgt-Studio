import React from "react";
import { GitBranch, Check, Bell, Cpu } from "lucide-react";
import { getLanguageById } from "@/components/editor/editor-config";

interface StatusBarProps {
  activeLangId?: string;
}

export function StatusBar({ activeLangId = "python" }: StatusBarProps) {
  const language = getLanguageById(activeLangId);

  return (
    <div className="h-6 bg-status-bar text-status-bar-fg flex items-center justify-between px-3 text-[11px] tracking-wide shrink-0 font-medium">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 hover:bg-white/20 px-1.5 py-0.5 rounded cursor-pointer transition-colors">
          <GitBranch size={12} />
          <span>main*</span>
        </div>
        <div className="flex items-center gap-1.5 hover:bg-white/20 px-1.5 py-0.5 rounded cursor-pointer transition-colors">
          <Cpu size={12} />
          <span>Ready</span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4 hover:bg-white/20 px-1.5 py-0.5 rounded cursor-pointer transition-colors">
          <span>Ln 1, Col 1</span>
          <span>Spaces: 4</span>
          <span>UTF-8</span>
          <span>CRLF</span>
        </div>
        
        <div className="hover:bg-white/20 px-1.5 py-0.5 rounded cursor-pointer transition-colors">
          {language.name}
        </div>

        <div className="flex items-center gap-2 hover:bg-white/20 px-1.5 py-0.5 rounded cursor-pointer transition-colors">
          <Check size={12} />
          <span>Prettier</span>
        </div>
        
        <div className="hover:bg-white/20 px-1.5 py-0.5 rounded cursor-pointer transition-colors">
          <Bell size={12} />
        </div>
      </div>
    </div>
  );
}
