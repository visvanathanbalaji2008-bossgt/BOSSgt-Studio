"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Play, FileCode, Plus, FolderPlus, Terminal, Settings, Download, LogOut, Code2, Command, X, Check } from "lucide-react";
import { emitEvent } from "@/lib/events";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  workspace?: any;
  onRunCode?: () => void;
}

export function CommandPalette({ isOpen, onClose, workspace, onRunCode }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const commands = [
    {
      id: "run-code",
      title: "Run Current Code",
      category: "Execution",
      icon: Play,
      action: () => {
        if (onRunCode) onRunCode();
        else emitEvent("run:start");
      }
    },
    {
      id: "new-file",
      title: "New File",
      category: "Workspace",
      icon: Plus,
      action: () => {
        const name = prompt("Enter file name:");
        if (name && workspace) workspace.createFile(name);
      }
    },
    {
      id: "new-folder",
      title: "New Folder",
      category: "Workspace",
      icon: FolderPlus,
      action: () => {
        const name = prompt("Enter folder name:");
        if (name && workspace) workspace.createFolder(name);
      }
    },
    {
      id: "toggle-terminal",
      title: "Open / Toggle Terminal",
      category: "View",
      icon: Terminal,
      action: () => emitEvent("view:toggle-terminal")
    },
    {
      id: "open-settings",
      title: "Open Settings",
      category: "Preferences",
      icon: Settings,
      action: () => emitEvent("view:toggle-settings")
    },
    {
      id: "download-project",
      title: "Download Project Zip",
      category: "Workspace",
      icon: Download,
      action: () => {
        if (workspace?.downloadProject) workspace.downloadProject();
      }
    },
    {
      id: "save-file",
      title: "Save File",
      category: "Editor",
      icon: FileCode,
      action: () => emitEvent("file:save")
    }
  ];

  if (workspace?.openFiles) {
    workspace.openFiles.forEach((file: any) => {
      commands.push({
        id: `file-${file.path}`,
        title: `Open ${file.name}`,
        category: "Open Files",
        icon: FileCode,
        action: () => workspace.openFile(file.path)
      });
    });
  }

  const filteredCommands = commands.filter(cmd => 
    cmd.title.toLowerCase().includes(query.toLowerCase()) || 
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (index: number) => {
    const cmd = filteredCommands[index];
    if (cmd) {
      cmd.action();
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSelect(selectedIndex);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[999999] bg-black/70 backdrop-blur-md flex items-start justify-center pt-[15vh] px-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-[#090d16]/95 border border-indigo-500/30 rounded-2xl shadow-2xl shadow-indigo-950/50 overflow-hidden flex flex-col glass-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-indigo-500/20 bg-indigo-500/5">
          <Command size={18} className="text-indigo-400 mr-3 shrink-0" />
          <input 
            ref={inputRef}
            type="text"
            placeholder="Type a command or search files..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none font-sans"
          />
          <button 
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-[360px] overflow-y-auto p-2 space-y-1 no-scrollbar">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = cmd.icon;
              return (
                <div
                  key={cmd.id}
                  onClick={() => handleSelect(idx)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected 
                      ? "bg-indigo-600/20 text-white border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]" 
                      : "text-zinc-300 hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${isSelected ? "bg-indigo-500/30 text-indigo-300" : "bg-white/5 text-zinc-400"}`}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-medium">{cmd.title}</div>
                      <div className="text-[10px] text-zinc-500">{cmd.category}</div>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Press ↵
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-zinc-500">
              No matching commands found.
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2 border-t border-indigo-500/10 bg-black/40 text-[10px] text-zinc-500 flex items-center justify-between font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-indigo-400 font-semibold">NEURAL FORGE COMMAND CENTER</span>
        </div>
      </div>
    </div>
  );
}
