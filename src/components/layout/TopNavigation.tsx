"use client";

import React, { useState, useRef, useEffect } from "react";
import { User, Settings, Command, LogOut, LogIn, X, Check, HelpCircle, Key, Info, GitBranch, Sparkles, Folder, Play } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { emitEvent, useListenEvent } from "@/lib/events";
import { supabase } from "@/lib/supabase";
import { CommandPalette } from "./CommandPalette";

export function TopNavigation() {
  const { session, user, signOut } = useAuth();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  
  // Profile state
  const [fullName, setFullName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  // GitHub token state for authenticated user
  const [githubToken, setGithubToken] = useState("");
  const [githubUser, setGithubUser] = useState<any>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || user.email?.split("@")[0] || "");
      const storedToken = localStorage.getItem(`bossgt_github_token_${user.id}`);
      if (storedToken) {
        setGithubToken(storedToken);
        fetchGitHubUser(storedToken);
      }
    }
  }, [user]);

  // Command Palette global shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fetchGitHubUser = async (token: string) => {
    try {
      const res = await fetch("https://api.github.com/user", {
        headers: { Authorization: `token ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setGithubUser(data);
      } else {
        setGithubUser(null);
      }
    } catch (e) {
      setGithubUser(null);
    }
  };

  const saveGithubToken = (token: string) => {
    if (!user) return;
    localStorage.setItem(`bossgt_github_token_${user.id}`, token);
    setGithubToken(token);
    fetchGitHubUser(token);
    window.dispatchEvent(new Event("bossgt_github_changed"));
  };

  const disconnectGithub = () => {
    if (!user) return;
    localStorage.removeItem(`bossgt_github_token_${user.id}`);
    setGithubToken("");
    setGithubUser(null);
    window.dispatchEvent(new Event("bossgt_github_changed"));
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    setProfileMsg(null);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });

      if (error) {
        setProfileMsg(`Error: ${error.message}`);
      } else {
        setProfileMsg("Profile updated successfully!");
      }
    } catch (e: any) {
      setProfileMsg(`Error: ${e.message || "Failed to update profile"}`);
    } finally {
      setSavingProfile(false);
    }
  };

  useListenEvent("help:shortcuts", () => setShowShortcutsModal(true));
  useListenEvent("help:about", () => setShowAboutModal(true));
  useListenEvent("help:docs", () => window.open("https://github.com", "_blank"));

  const menus = {
    File: [
      { label: "New File", action: "file:new-file" },
      { label: "New Folder", action: "file:new-folder" },
      { label: "Open File", action: "file:open" },
      { label: "Save", action: "file:save", shortcut: "Cmd+S" },
      { label: "Save As", action: "file:save-as" },
      { label: "Delete", action: "file:delete" },
      { label: "Rename", action: "file:rename" },
    ],
    Edit: [
      { label: "Undo", action: "edit:undo", shortcut: "Cmd+Z" },
      { label: "Redo", action: "edit:redo", shortcut: "Cmd+Shift+Z" },
      { label: "Cut", action: "edit:cut", shortcut: "Cmd+X" },
      { label: "Copy", action: "edit:copy", shortcut: "Cmd+C" },
      { label: "Paste", action: "edit:paste", shortcut: "Cmd+V" },
      { label: "Select All", action: "edit:select-all", shortcut: "Cmd+A" },
    ],
    View: [
      { label: "Toggle Explorer", action: "view:toggle-explorer" },
      { label: "Toggle Search", action: "view:toggle-search" },
      { label: "Toggle Terminal", action: "view:toggle-terminal" },
      { label: "Toggle Output", action: "view:toggle-output" },
      { label: "Toggle Problems", action: "view:toggle-problems" },
      { label: "Toggle Minimap", action: "view:toggle-minimap" },
      { label: "Toggle Word Wrap", action: "view:toggle-word-wrap" },
    ],
    Run: [
      { label: "Run Code", action: "run:start" },
      { label: "Stop Execution", action: "run:stop" },
      { label: "Restart", action: "run:restart" },
      { label: "Run Current File", action: "run:start-current" },
    ],
    Terminal: [
      { label: "Open Terminal", action: "terminal:open" },
      { label: "Clear Terminal", action: "terminal:clear" },
      { label: "Kill Terminal", action: "terminal:kill" },
    ],
    Help: [
      { label: "Documentation", action: "help:docs" },
      { label: "Keyboard Shortcuts", action: "help:shortcuts" },
      { label: "About BOSSgt Studio", action: "help:about" },
    ]
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = (action: string) => {
    emitEvent(action);
    setActiveMenu(null);
  };

  const displayName = fullName || user?.email?.split("@")[0] || "User";

  return (
    <>
      <div 
        className="m-2 shrink-0 h-12 bg-[#090d16]/80 border border-indigo-500/20 rounded-2xl backdrop-blur-xl px-4 flex items-center justify-between shadow-xl shadow-indigo-950/20 relative z-50 transition-all duration-200" 
        ref={menuRef}
      >
        {/* LEFT BRAND & NAVIGATION MENUS */}
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.3)] group-hover:scale-105 transition-transform">
              <Command size={16} />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide text-white font-sans">BOSSgt Studio</span>
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 text-transparent bg-clip-text text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                NEURAL FORGE
              </span>
            </div>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-0.5 relative">
            {Object.entries(menus).map(([item, options]) => (
              <div key={item} className="relative">
                <button
                  onClick={() => setActiveMenu(activeMenu === item ? null : item)}
                  className={`px-2.5 py-1 text-xs text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-all font-sans ${activeMenu === item ? 'bg-indigo-500/20 text-white border border-indigo-500/30' : ''}`}
                >
                  {item}
                </button>
                
                {activeMenu === item && (
                  <div className="absolute top-full left-0 mt-2 w-52 bg-[#090d16]/95 border border-indigo-500/30 rounded-xl shadow-2xl shadow-indigo-950/80 py-1.5 z-[60] backdrop-blur-2xl glass-panel animate-in fade-in zoom-in-95 duration-150">
                    {options.map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => handleAction(opt.action)}
                        className="w-full text-left px-3.5 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-indigo-600/20 flex justify-between items-center transition-colors"
                      >
                        <span>{opt.label}</span>
                        {(opt as any).shortcut && <span className="text-zinc-500 text-[10px] font-mono">{(opt as any).shortcut}</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* CENTER WORKSPACE & AI COMMAND CENTER TRIGGER */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/[0.03] border border-indigo-500/20 rounded-xl text-xs font-medium text-zinc-300 shadow-inner">
            <Folder size={13} className="text-indigo-400" />
            <span className="font-mono text-[11px]">BOSSgt-Project</span>
          </div>

          <button
            onClick={() => setShowCommandPalette(true)}
            className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-xs text-indigo-300 transition-all shadow-[0_0_10px_rgba(99,102,241,0.1)] group"
          >
            <Sparkles size={13} className="text-cyan-400 animate-pulse" />
            <span className="font-sans font-medium text-[11px]">⌘ Command</span>
            <kbd className="px-1.5 py-0.2 bg-indigo-950/60 border border-indigo-500/40 text-[9px] font-mono rounded text-indigo-200">⌘K</kbd>
          </button>
        </div>

        {/* RIGHT ACTIONS & PROFILE */}
        <div className="flex items-center gap-3">
          {/* GitHub Status Indicator */}
          <button
            onClick={() => setShowProfileModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.03] border border-white/10 hover:border-indigo-500/30 text-xs transition-colors"
            title="GitHub Sync Status"
          >
            <GitBranch size={13} className={githubUser ? "text-emerald-400" : "text-zinc-500"} />
            <span className={`text-[10px] font-mono ${githubUser ? "text-emerald-400" : "text-zinc-400"}`}>
              {githubUser ? `@${githubUser.login}` : "GitHub"}
            </span>
          </button>

          {/* Save Status Pill */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Saved</span>
          </div>

          <button 
            onClick={() => emitEvent("view:toggle-settings")}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors" 
            title="Settings"
          >
            <Settings size={16} />
          </button>
          
          {session ? (
            <div className="relative">
              <button 
                onClick={() => setActiveMenu(activeMenu === 'Profile' ? null : 'Profile')}
                className={`flex items-center gap-2 p-1.5 rounded-xl border transition-all ${activeMenu === 'Profile' ? 'bg-indigo-600/20 border-indigo-500/40 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-white/[0.03] border-white/10 text-zinc-300 hover:border-indigo-500/30'}`}
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-[10px] font-bold text-white shadow-inner">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-medium hidden md:inline-block truncate max-w-[100px]">{displayName}</span>
              </button>

              {/* AUTHENTICATED PROFILE DROPDOWN MENU */}
              {activeMenu === 'Profile' && (
                <div className="absolute top-full right-0 mt-2 w-60 bg-[#090d16]/95 border border-indigo-500/30 rounded-2xl shadow-2xl shadow-indigo-950/80 py-2 z-[9999] backdrop-blur-2xl glass-panel animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2.5 border-b border-indigo-500/20">
                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-0.5">
                      NEURAL FORGE ACCOUNT
                    </div>
                    <div className="text-xs font-semibold text-white truncate">{displayName}</div>
                    <div className="text-[11px] text-zinc-400 truncate">{user?.email}</div>
                  </div>

                  <div className="py-1 font-sans text-xs space-y-0.5">
                    <button 
                      onClick={() => { setActiveMenu(null); setShowProfileModal(true); }}
                      className="w-full text-left px-4 py-2 text-zinc-300 hover:text-white hover:bg-indigo-600/20 flex items-center gap-2.5 transition-colors"
                    >
                      <User size={14} className="text-indigo-400" />
                      <span>Profile & Account</span>
                    </button>

                    <button 
                      onClick={() => { setActiveMenu(null); setShowProfileModal(true); }}
                      className="w-full text-left px-4 py-2 text-zinc-300 hover:text-white hover:bg-indigo-600/20 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <GitBranch size={14} className="text-purple-400" />
                        <span>GitHub Storage</span>
                      </div>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${githubUser ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-zinc-800 text-zinc-400"}`}>
                        {githubUser ? `@${githubUser.login}` : "Connect"}
                      </span>
                    </button>

                    <button 
                      onClick={() => { setActiveMenu(null); emitEvent("view:toggle-settings"); }}
                      className="w-full text-left px-4 py-2 text-zinc-300 hover:text-white hover:bg-indigo-600/20 flex items-center gap-2.5 transition-colors"
                    >
                      <Settings size={14} className="text-cyan-400" />
                      <span>Studio Settings</span>
                    </button>

                    <button 
                      onClick={() => { setActiveMenu(null); setShowShortcutsModal(true); }}
                      className="w-full text-left px-4 py-2 text-zinc-300 hover:text-white hover:bg-indigo-600/20 flex items-center gap-2.5 transition-colors"
                    >
                      <Key size={14} className="text-amber-400" />
                      <span>Keyboard Shortcuts</span>
                    </button>
                  </div>

                  <div className="pt-1.5 mt-1 border-t border-indigo-500/20 px-2">
                    <button 
                      onClick={() => { setActiveMenu(null); signOut(); }}
                      className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl flex items-center gap-2 font-medium transition-colors"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link 
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              <LogIn size={14} />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>

      {/* COMMAND PALETTE MODAL */}
      <CommandPalette 
        isOpen={showCommandPalette} 
        onClose={() => setShowCommandPalette(false)} 
      />

      {/* REAL PROFILE MODAL */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090d16]/95 border border-indigo-500/30 rounded-2xl p-6 w-full max-w-lg shadow-2xl shadow-indigo-950/80 relative glass-panel animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4 mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <User size={18} className="text-indigo-400" /> BOSSgt Profile & Integrations
              </h2>
              <button onClick={() => setShowProfileModal(false)} className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10">
                <X size={16} />
              </button>
            </div>

            {profileMsg && (
              <div className={`p-3 rounded-xl text-xs mb-4 ${profileMsg.startsWith("Error") ? "bg-red-500/10 border border-red-500/30 text-red-300" : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"}`}>
                {profileMsg}
              </div>
            )}

            <div className="space-y-4 font-sans text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Full Name</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-black/40 border border-indigo-500/20 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500 font-sans"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Email Address</label>
                <input 
                  type="text" 
                  readOnly 
                  value={user?.email || ""}
                  className="w-full bg-black/20 border border-white/5 rounded-xl px-3 py-2 text-zinc-400 cursor-not-allowed font-mono text-xs"
                />
              </div>

              {/* GITHUB INTEGRATION SECTION */}
              <div className="pt-4 border-t border-indigo-500/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <GitBranch size={16} className="text-purple-400" />
                    <span>GitHub Integration</span>
                  </div>
                  {githubUser ? (
                    <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                      <Check size={12} /> Connected
                    </span>
                  ) : (
                    <span className="text-[11px] text-zinc-400 font-mono">Not Connected</span>
                  )}
                </div>

                {githubUser ? (
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">{githubUser.name || githubUser.login}</div>
                      <div className="text-zinc-400 text-[11px]">@{githubUser.login}</div>
                    </div>
                    <button 
                      onClick={disconnectGithub}
                      className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-semibold transition-colors"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-zinc-400 text-[11px]">
                      Enter your GitHub Personal Access Token to enable Repository Sync, Push, Pull, and Remote commits.
                    </p>
                    <div className="flex gap-2">
                      <input 
                        type="password" 
                        placeholder="ghp_xxxxxxxxxxxx"
                        value={githubToken}
                        onChange={(e) => setGithubToken(e.target.value)}
                        className="flex-1 bg-black/40 border border-indigo-500/20 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-indigo-500 text-xs"
                      />
                      <button 
                        onClick={() => saveGithubToken(githubToken)}
                        disabled={!githubToken}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-semibold text-xs transition-colors shadow-lg shadow-indigo-600/30"
                      >
                        Connect
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-indigo-500/20">
              <button 
                onClick={() => signOut()}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl font-semibold text-xs transition-colors"
              >
                Sign Out
              </button>
              <button 
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-xs transition-colors shadow-lg shadow-indigo-600/30"
              >
                {savingProfile ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KEYBOARD SHORTCUTS MODAL */}
      {showShortcutsModal && (
        <div className="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090d16]/95 border border-indigo-500/30 rounded-2xl p-6 w-full max-w-lg shadow-2xl shadow-indigo-950/80 relative glass-panel animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3 mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Key size={18} className="text-amber-400" /> Keyboard Shortcuts
              </h2>
              <button onClick={() => setShowShortcutsModal(false)} className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono max-h-[350px] overflow-y-auto pr-2 no-scrollbar">
              <ShortcutRow action="Command Center" keys="Cmd / Ctrl + K" />
              <ShortcutRow action="Save File" keys="Cmd / Ctrl + S" />
              <ShortcutRow action="Undo" keys="Cmd / Ctrl + Z" />
              <ShortcutRow action="Redo" keys="Cmd / Ctrl + Shift + Z" />
              <ShortcutRow action="Select All" keys="Cmd / Ctrl + A" />
              <ShortcutRow action="Copy" keys="Cmd / Ctrl + C" />
              <ShortcutRow action="Paste" keys="Cmd / Ctrl + V" />
              <ShortcutRow action="Find" keys="Cmd / Ctrl + F" />
              <ShortcutRow action="Toggle Explorer" keys="Cmd / Ctrl + B" />
              <ShortcutRow action="Run Code" keys="Cmd / Ctrl + Enter" />
            </div>
          </div>
        </div>
      )}

      {/* ABOUT MODAL */}
      {showAboutModal && (
        <div className="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090d16]/95 border border-indigo-500/30 rounded-2xl p-6 w-full max-w-md shadow-2xl shadow-indigo-950/80 relative glass-panel text-center animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
              <Command size={24} />
            </div>
            <h2 className="text-xl font-bold text-white font-sans">BOSSgt Studio</h2>
            <div className="text-xs text-indigo-300 font-mono mt-1">NEURAL FORGE Edition v2100.4</div>
            <p className="text-xs text-zinc-400 mt-3 leading-relaxed">
              Futuristic AI-Powered Coding Workstation with 200 Canonical Language Runtimes, Isolated Sandboxed Execution, and Integrated Neural Intelligence.
            </p>
            <button 
              onClick={() => setShowAboutModal(false)} 
              className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function ShortcutRow({ action, keys }: { action: string; keys: string }) {
  return (
    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-indigo-500/10">
      <span className="text-zinc-300 font-sans">{action}</span>
      <span className="px-2 py-0.5 bg-black/60 text-amber-400 border border-amber-500/30 rounded-lg font-semibold">{keys}</span>
    </div>
  );
}
