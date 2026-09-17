"use client";

import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Search, Check, Sparkles } from "lucide-react";
import { getAllLanguages } from "./editor-config";

interface LanguageSelectorProps {
  activeLangId: string;
  onSelect: (langId: string) => void;
}

interface LanguageStatus {
  id: string;
  name: string;
  status: string;
  executable: boolean;
}

export function LanguageSelector({ activeLangId, onSelect }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [backendStatuses, setBackendStatuses] = useState<Record<string, boolean>>({});
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const languages = getAllLanguages().filter(l => l.id !== "plaintext");
  const activeLang = languages.find(l => l.id === activeLangId) || languages[0];

  useEffect(() => {
    setMounted(true);
    // Fetch dynamic backend language runtime statuses
    fetch("/api/execution/languages")
      .then(res => res.json())
      .then((data: LanguageStatus[]) => {
        if (Array.isArray(data)) {
          const map: Record<string, boolean> = {};
          data.forEach(item => {
            map[item.id] = item.executable;
          });
          setBackendStatuses(map);
        }
      })
      .catch(() => {});
  }, []);

  const filteredLanguages = languages.filter(lang => 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    lang.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      const currentIndex = filteredLanguages.findIndex(l => l.id === activeLangId);
      setSelectedIndex(Math.max(0, currentIndex));
      
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
        if (listRef.current && currentIndex > 0) {
          const selectedEl = listRef.current.children[currentIndex] as HTMLElement;
          if (selectedEl) {
            selectedEl.scrollIntoView({ block: 'nearest' });
          }
        }
      }, 0);
    }
  }, [isOpen, activeLangId]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent | MouseEvent | TouchEvent) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
        menuRef.current && !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    
    function handleScrollOrResize(e: Event) {
      if (isOpen) {
        if (menuRef.current && menuRef.current.contains(e.target as Node)) {
          return;
        }
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("pointerdown", handlePointerDown);
      document.addEventListener("mousedown", handlePointerDown);
      document.addEventListener("touchstart", handlePointerDown);
      window.addEventListener("scroll", handleScrollOrResize, true);
      window.addEventListener("resize", handleScrollOrResize);
    }
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

  const toggleDropdown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 6,
        left: rect.left,
      });
      setSearchQuery("");
    }
    setIsOpen(!isOpen);
  };

  const handleSelect = (langId: string) => {
    onSelect(langId);
    setIsOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (filteredLanguages.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => {
        const next = Math.min(prev + 1, filteredLanguages.length - 1);
        scrollToIndex(next);
        return next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => {
        const next = Math.max(prev - 1, 0);
        scrollToIndex(next);
        return next;
      });
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredLanguages[selectedIndex]) {
        handleSelect(filteredLanguages[selectedIndex].id);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  const scrollToIndex = (index: number) => {
    if (listRef.current) {
      const el = listRef.current.children[index] as HTMLElement;
      if (el) {
        el.scrollIntoView({ block: 'nearest' });
      }
    }
  };

  return (
    <div className="relative font-sans" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-white transition-all text-xs font-semibold rounded-xl border border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.1)] group"
      >
        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_8px_#818cf8]"></span>
        <span>{activeLang.name}</span>
        <ChevronDown size={13} className="text-indigo-400 opacity-70 group-hover:opacity-100 transition-opacity ml-1" />
      </button>

      {mounted && isOpen && createPortal(
        <div 
          ref={menuRef}
          style={{ top: dropdownPos.top, left: dropdownPos.left }}
          className="fixed w-80 bg-[#090d16]/95 border border-indigo-500/30 rounded-2xl shadow-2xl shadow-indigo-950/80 z-[99999] animate-in fade-in zoom-in-95 duration-150 flex flex-col backdrop-blur-2xl glass-panel p-2"
          onPointerDown={(e) => {
            if (e.target !== inputRef.current) {
              e.preventDefault();
            }
          }}
          onMouseDown={(e) => {
            if (e.target !== inputRef.current) {
              e.preventDefault();
            }
          }}
        >
          <div className="pb-2 border-b border-indigo-500/20 shrink-0">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" />
              <input 
                ref={inputRef}
                type="text" 
                placeholder="SEARCH LANGUAGE..."
                className="w-full bg-black/40 border border-indigo-500/20 rounded-xl text-xs px-8 py-2 focus:outline-none focus:border-indigo-500 text-white placeholder-zinc-500 font-mono tracking-wider"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
          
          <div 
            ref={listRef}
            className="max-h-[300px] overflow-y-auto pt-1 space-y-1 flex-1 no-scrollbar flex flex-col"
          >
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((lang, index) => {
                const isSelected = index === selectedIndex;
                const isActive = activeLangId === lang.id;
                const isExecutable = backendStatuses[lang.id] !== false;

                return (
                  <button
                    key={lang.id}
                    onClick={() => handleSelect(lang.id)}
                    onPointerEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-all text-left shrink-0 ${
                      isSelected 
                        ? "bg-indigo-600/20 border border-indigo-500/30 text-white shadow-[0_0_10px_rgba(99,102,241,0.15)]" 
                        : "text-zinc-300 hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className={isActive ? "text-indigo-400 font-bold truncate" : "text-zinc-300 truncate"}>
                        {lang.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${
                        isExecutable 
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}>
                        {isExecutable ? "✓ RUNNABLE" : "⚠ RUNTIME UNAVAILABLE"}
                      </span>
                      {isActive && <Check size={14} className="text-indigo-400 font-bold" />}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="text-center py-4 text-xs text-zinc-500 font-mono">
                No matching languages found.
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
