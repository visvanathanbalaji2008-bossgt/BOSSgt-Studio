import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check, Code2 } from "lucide-react";
import { getAllLanguages } from "./editor-config";

interface LanguageSelectorProps {
  activeLangId: string;
  onSelect: (langId: string) => void;
}

export function LanguageSelector({ activeLangId, onSelect }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const languages = getAllLanguages();

  const activeLang = languages.find(l => l.id === activeLangId) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const filteredLanguages = languages.filter(lang => 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    lang.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const supported = filteredLanguages.filter(l => l.executionStatus === "READY");
  const comingSoon = filteredLanguages.filter(l => l.executionStatus !== "READY");

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/10 text-foreground/80 hover:text-foreground transition-colors text-xs font-medium border border-transparent hover:border-panel-border"
      >
        <Code2 size={14} className="text-accent" />
        <span>{activeLang.name}</span>
        <ChevronDown size={14} className="opacity-50" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 right-0 w-64 bg-panel border border-panel-border rounded-md shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 border-b border-panel-border/50">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-foreground/40" />
              <input 
                type="text" 
                placeholder="Search language..."
                className="w-full bg-editor border border-panel-border rounded text-xs px-8 py-1.5 focus:outline-none focus:border-accent text-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          
          <div className="max-h-80 overflow-y-auto p-1 py-2">
            {supported.length > 0 && (
              <div className="mb-2">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent mb-1">
                  Currently Supported
                </div>
                {supported.map(lang => (
                  <button
                    key={lang.id}
                    onClick={() => {
                      onSelect(lang.id);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs rounded hover:bg-white/10 text-left transition-colors"
                  >
                    <span className={activeLangId === lang.id ? "text-foreground font-medium" : "text-foreground/80"}>
                      {lang.name}
                    </span>
                    {activeLangId === lang.id && <Check size={14} className="text-accent" />}
                  </button>
                ))}
              </div>
            )}
            
            {comingSoon.length > 0 && (
              <div>
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground/40 mb-1 mt-2">
                  Coming Soon
                </div>
                {comingSoon.map(lang => (
                  <button
                    key={lang.id}
                    onClick={() => {
                      onSelect(lang.id);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs rounded hover:bg-white/5 text-left transition-colors group"
                  >
                    <span className={activeLangId === lang.id ? "text-foreground font-medium" : "text-foreground/50 group-hover:text-foreground/70"}>
                      {lang.name}
                    </span>
                    {activeLangId === lang.id && <Check size={14} className="text-foreground/50" />}
                  </button>
                ))}
              </div>
            )}
            
            {filteredLanguages.length === 0 && (
              <div className="text-center py-4 text-xs text-foreground/40">
                No languages found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
