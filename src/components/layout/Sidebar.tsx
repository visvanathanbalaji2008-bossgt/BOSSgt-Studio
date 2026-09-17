import React, { useState } from "react";
import {
  Files, Search, GitBranch, Blocks, Home, Play,
  ChevronRight, ChevronDown, FileCode, FolderOpen,
  Plus, FolderPlus, Trash2, Edit2, File as FileIcon,
  Cloud, RefreshCw, Upload, Download, AlertTriangle,
  Replace, ReplaceAll, Settings as SettingsIcon, Sparkles
} from "lucide-react";
import { useWorkspace, FileNode } from "@/hooks/useWorkspace";
import { useSettings } from "@/hooks/useSettings";
import { useListenEvent, emitEvent } from "@/lib/events";
import Link from "next/link";

interface SidebarProps {
  workspace?: ReturnType<typeof useWorkspace>;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ workspace, isExpanded = true, onToggle }: SidebarProps) {
  const [activeTab, setActiveTab] = useState("explorer");

  const tabs = [
    { id: "explorer", icon: Files, label: "Explorer" },
    { id: "search", icon: Search, label: "Search" },
    { id: "source-control", icon: GitBranch, label: "Source Control" },
    { id: "extensions", icon: Blocks, label: "Extensions" }
  ];

  useListenEvent("view:toggle-explorer", () => {
    setActiveTab("explorer");
    if (!isExpanded && onToggle) onToggle();
  });
  useListenEvent("view:toggle-search", () => {
    setActiveTab("search");
    if (!isExpanded && onToggle) onToggle();
  });
  useListenEvent("view:toggle-settings", () => {
    setActiveTab("settings");
    if (!isExpanded && onToggle) onToggle();
  });

  const handleTabClick = (tabId: string) => {
    if (activeTab === tabId) {
      if (onToggle) onToggle();
    } else {
      setActiveTab(tabId);
      if (!isExpanded && onToggle) onToggle();
    }
  };

  return (
    <div className="flex h-full w-full bg-transparent shrink-0 overflow-hidden select-none">
      {/* Activity Bar Rail */}
      <div className="w-14 bg-[#090d16]/90 border border-indigo-500/20 rounded-2xl backdrop-blur-xl flex flex-col items-center py-4 gap-4 shrink-0 z-20 shadow-xl shadow-indigo-950/20 m-1 my-2">
        {/* Workspace Home Link */}
        <Link 
          href="/dashboard"
          className="p-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all group relative"
          title="Workspace Dashboard"
        >
          <Home size={19} strokeWidth={1.75} />
          <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#090d16] border border-indigo-500/30 text-white text-[11px] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
            Workspace Dashboard
          </div>
        </Link>

        <div className="w-8 h-[1px] bg-indigo-500/20 my-0.5"></div>

        <div className="flex-1 flex flex-col items-center gap-3">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id && isExpanded;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`p-2.5 rounded-xl transition-all relative group ${
                  isActive
                    ? "text-white bg-indigo-600/20 border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.35)]"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent"
                }`}
                title={tab.label}
              >
                <Icon size={19} strokeWidth={1.75} />
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gradient-to-b from-indigo-400 to-purple-500 rounded-r-full shadow-[0_0_8px_#6366f1]" />
                )}
                {/* Tooltip */}
                <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#090d16] border border-indigo-500/30 text-white text-[11px] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap font-sans">
                  {tab.label}
                </div>
              </button>
            );
          })}

          {/* Quick Run Code Toggle Action */}
          <button
            onClick={() => emitEvent("run:start")}
            className="p-2.5 rounded-xl text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/30 border border-transparent transition-all relative group"
            title="Execute Code (Run)"
          >
            <Play size={19} strokeWidth={1.75} fill="currentColor" />
            <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#090d16] border border-emerald-500/30 text-emerald-300 text-[11px] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap font-sans">
              Run Code
            </div>
          </button>
        </div>

        <div className="flex flex-col items-center gap-3 mt-auto">
          <button
            onClick={() => handleTabClick("settings")}
            className={`p-2.5 rounded-xl transition-all relative group ${
              activeTab === "settings" && isExpanded
                ? "text-white bg-indigo-600/20 border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.35)]"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent"
            }`}
            title="Settings"
          >
            <SettingsIcon size={19} strokeWidth={1.75} />
            {activeTab === "settings" && isExpanded && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gradient-to-b from-indigo-400 to-purple-500 rounded-r-full shadow-[0_0_8px_#6366f1]" />
            )}
            <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#090d16] border border-indigo-500/30 text-white text-[11px] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap font-sans">
              Settings
            </div>
          </button>
        </div>
      </div>

      {/* Primary Sidebar Panel */}
      <div className={`flex flex-col bg-[#090d16]/85 border border-indigo-500/20 rounded-2xl backdrop-blur-2xl h-[calc(100%-16px)] my-2 mr-2 shadow-2xl shadow-indigo-950/30 transition-all duration-300 ${isExpanded ? 'w-[260px] opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
        <div className="h-10 flex items-center justify-between px-4 font-bold text-[10px] tracking-widest text-indigo-400 uppercase border-b border-indigo-500/20 shrink-0 font-mono">
          <span className="flex items-center gap-1.5">
            <Sparkles size={12} className="text-cyan-400" />
            {activeTab === "settings" ? "Settings" : tabs.find((t) => t.id === activeTab)?.label}
          </span>
        </div>

        {activeTab === "explorer" && workspace && (
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <ExplorerTree workspace={workspace} />
          </div>
        )}

        {activeTab === "search" && workspace && (
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <SearchPanel workspace={workspace} />
          </div>
        )}

        {activeTab === "source-control" && workspace && (
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <SourceControlPanel workspace={workspace} />
          </div>
        )}

        {activeTab === "extensions" && (
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <ExtensionsPanel />
          </div>
        )}

        {activeTab === "settings" && (
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <SettingsPanel />
          </div>
        )}

        {activeTab !== "explorer" && activeTab !== "search" && activeTab !== "settings" && activeTab !== "source-control" && activeTab !== "extensions" && (
          <div className="p-4 text-xs text-zinc-500 text-center font-mono">
            Coming soon.
          </div>
        )}
      </div>
    </div>
  );
}

function ExplorerTree({ workspace }: { workspace: ReturnType<typeof useWorkspace> }) {
  const [isProjectOpen, setIsProjectOpen] = useState(true);

  useListenEvent("file:new-file", () => {
    const name = prompt("Enter file name:");
    if (name) workspace.createFile(name);
  });

  useListenEvent("file:new-folder", () => {
    const name = prompt("Enter folder name:");
    if (name) workspace.createFolder(name);
  });

  const handleCreateFile = async (e: React.MouseEvent, parentPath?: string) => {
    e.stopPropagation();
    const name = prompt("Enter file name:");
    if (name) {
      const fullPath = parentPath ? `${parentPath}/${name}` : name;
      workspace.createFile(fullPath);
    }
  };

  const handleCreateFolder = async (e: React.MouseEvent, parentPath?: string) => {
    e.stopPropagation();
    const name = prompt("Enter folder name:");
    if (name) {
      const fullPath = parentPath ? `${parentPath}/${name}` : name;
      workspace.createFolder(fullPath);
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    workspace.downloadProject();
  };

  return (
    <div className="flex flex-col p-1">
      <div
        onClick={() => setIsProjectOpen(!isProjectOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold hover:bg-white/5 transition-colors text-zinc-200 cursor-pointer group rounded-xl border border-transparent hover:border-indigo-500/20"
      >
        <div className="flex items-center gap-1.5 font-mono">
          {isProjectOpen ? <ChevronDown size={14} className="text-indigo-400" /> : <ChevronRight size={14} className="text-zinc-500" />}
          <span className="truncate tracking-wide text-white">WORKSPACE</span>
          <span className="text-[10px] text-zinc-500 font-normal">/ BOSSgt-Project</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => handleCreateFile(e)} className="p-1 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white" title="New File"><Plus size={13} /></button>
          <button onClick={(e) => handleCreateFolder(e)} className="p-1 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white" title="New Folder"><FolderPlus size={13} /></button>
          <button onClick={handleDownload} className="p-1 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white" title="Download Project"><Download size={13} /></button>
        </div>
      </div>

      {isProjectOpen && (
        <div className="flex flex-col mt-1 space-y-0.5">
          {workspace.fileTree.filter((n: FileNode) => n.name !== '.keep').length === 0 ? (
            <div className="px-4 py-6 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Files size={20} />
              </div>
              <div>
                <p className="text-xs text-zinc-300 font-medium mb-1">No workspace files.</p>
                <p className="text-[10px] text-zinc-500 mb-3 max-w-[160px]">Create a file to start coding in the Neural Forge.</p>
              </div>
              <button 
                onClick={(e) => handleCreateFile(e)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
              >
                Create File
              </button>
            </div>
          ) : (
            workspace.fileTree.filter((n: FileNode) => n.name !== '.keep').map((node: FileNode) => (
              <TreeNode key={node.path} node={node} level={1} workspace={workspace} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function TreeNode({ node, level, workspace }: { node: FileNode, level: number, workspace: ReturnType<typeof useWorkspace> }) {
  const [isOpen, setIsOpen] = useState(false);
  const isActive = workspace.activeFilePath === node.path;
  
  // Check if file is dirty / modified
  const openFileObj = workspace.openFiles.find((f: any) => f.path === node.path);
  const isDirty = openFileObj ? openFileObj.content !== openFileObj.savedContent : false;
  
  const paddingLeft = `${level * 10 + 12}px`;

  const handleToggle = () => {
    if (node.type === 'dir') {
      setIsOpen(!isOpen);
    } else {
      workspace.openFile(node.path, node.name);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete ${node.name}?`)) {
      workspace.deletePath(node.path);
    }
  };

  const handleRename = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newName = prompt("Enter new name:", node.name);
    if (newName && newName !== node.name) {
      const parentDir = node.path.substring(0, node.path.lastIndexOf('/'));
      const newPath = parentDir ? `${parentDir}/${newName}` : newName;
      workspace.renamePath(node.path, newPath);
    }
  };

  const getIcon = () => {
    if (node.type === 'dir') return <FolderOpen size={14} className="text-indigo-400" />;
    if (node.name.endsWith('.py')) return <FileCode size={14} className="text-blue-400" />;
    if (node.name.endsWith('.js') || node.name.endsWith('.ts') || node.name.endsWith('.tsx') || node.name.endsWith('.jsx')) return <FileCode size={14} className="text-amber-400" />;
    if (node.name.endsWith('.c') || node.name.endsWith('.cpp')) return <FileCode size={14} className="text-cyan-400" />;
    if (node.name.endsWith('.rs')) return <FileCode size={14} className="text-orange-400" />;
    if (node.name.endsWith('.json') || node.name.endsWith('.md')) return <FileCode size={14} className="text-purple-400" />;
    return <FileIcon size={14} className="text-zinc-400" />;
  };

  return (
    <>
      <div
        onClick={handleToggle}
        className={`flex items-center justify-between py-1.5 pr-2 text-xs rounded-xl cursor-pointer transition-all group ${
          isActive 
            ? "bg-indigo-600/20 text-white font-medium border-l-2 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]" 
            : "hover:bg-white/5 text-zinc-300 border-l-2 border-transparent"
        }`}
        style={{ paddingLeft }}
        title={node.path}
      >
        <div className="flex items-center gap-1.5 truncate">
          {node.type === 'dir' && (
            <span className="text-zinc-500">
              {isOpen ? <ChevronDown size={13} className="text-indigo-400" /> : <ChevronRight size={13} />}
            </span>
          )}
          {getIcon()}
          <span className="truncate">{node.name}</span>
          {isDirty && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0 ml-1" title="Unsaved changes"></span>
          )}
        </div>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {node.type === 'dir' && (
            <>
              <button onClick={async (e) => {
                e.stopPropagation();
                const name = prompt("Enter file name:");
                if (name) {
                  workspace.createFile(`${node.path}/${name}`);
                  setIsOpen(true);
                }
              }} className="p-1 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white" title="New File"><Plus size={11} /></button>
              <button onClick={async (e) => {
                e.stopPropagation();
                const name = prompt("Enter folder name:");
                if (name) {
                  workspace.createFolder(`${node.path}/${name}`);
                  setIsOpen(true);
                }
              }} className="p-1 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white" title="New Folder"><FolderPlus size={11} /></button>
            </>
          )}
          <button onClick={handleRename} className="p-1 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white" title="Rename"><Edit2 size={11} /></button>
          <button onClick={handleDelete} className="p-1 hover:bg-red-500/20 rounded-lg text-zinc-400 hover:text-red-400" title="Delete"><Trash2 size={11} /></button>
        </div>
      </div>
      {node.type === 'dir' && isOpen && node.children && (
        <div className="flex flex-col space-y-0.5">
          {node.children.filter(n => n.name !== '.keep').map(child => (
            <TreeNode key={child.path} node={child} level={level + 1} workspace={workspace} />
          ))}
        </div>
      )}
    </>
  );
}

function SourceControlPanel({ workspace }: { workspace: ReturnType<typeof useWorkspace> }) {
  const [isRepo, setIsRepo] = useState(false);
  const [branch, setBranch] = useState("");
  const [changes, setChanges] = useState<{staging: string, working: string, file: string}[]>([]);
  const [commitMessage, setCommitMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Remote state
  const [remoteUrl, setRemoteUrl] = useState<string | null>(null);
  const [ahead, setAhead] = useState(0);
  const [behind, setBehind] = useState(0);
  const [showRemoteForm, setShowRemoteForm] = useState(false);
  const [newRemoteUrl, setNewRemoteUrl] = useState("");
  const [newToken, setNewToken] = useState("");
  const [logs, setLogs] = useState<{hash: string, message: string, author: string, date: string}[]>([]);

  const fetchStatus = React.useCallback(async () => {
    try {
      const res = await fetch("/api/git", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "status", projectId: new URLSearchParams(window.location.search).get("projectId") })
      });
      if (res.ok) {
        const data = await res.json();
        setIsRepo(data.isRepo);
        setBranch(data.branch || "");
        setChanges(data.changes || []);

        if (data.isRepo) {
          const rem = await fetch("/api/git", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "remotes", projectId: new URLSearchParams(window.location.search).get("projectId") })
          });
          const remData = await rem.json();
          setRemoteUrl(remData.remote);

          if (remData.remote) {
            const ab = await fetch("/api/git", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "aheadBehind", projectId: new URLSearchParams(window.location.search).get("projectId") })
            });
            const abData = await ab.json();
            setAhead(abData.ahead);
            setBehind(abData.behind);
          }

          const logRes = await fetch("/api/git", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "log", projectId: new URLSearchParams(window.location.search).get("projectId") })
          });
          const logData = await logRes.json();
          setLogs(logData.logs || []);
        }
      }
    } catch {}
  }, []);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const handleInit = async () => {
    setIsLoading(true);
    await fetch("/api/git", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "init", projectId: new URLSearchParams(window.location.search).get("projectId") })
    });
    await fetchStatus();
    setIsLoading(false);
  };

  const handleAction = async (action: string, payload: Record<string, unknown> = {}) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/git", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload, projectId: new URLSearchParams(window.location.search).get("projectId") })
      });
      const data = await res.json();

      if (!res.ok) {
        alert("Git error: " + (data.error || "Unknown error"));
      } else if (data.conflict) {
        alert("Merge conflict detected! Please resolve the files marked with 'C' in the editor.");
      }

      if (action === "commit" || action === "restore") {
        setCommitMessage("");
      }
    } catch (e) {
      console.error(e);
    }
    await fetchStatus();
    setIsLoading(false);
  };

  const connectRemote = async () => {
    if (!newRemoteUrl) return;
    setIsLoading(true);
    await handleAction("addRemote", { url: newRemoteUrl });
    if (newToken) {
      workspace.setGithubToken(newToken);
    }
    setNewRemoteUrl("");
    setNewToken("");
    setShowRemoteForm(false);
    setIsLoading(false);
    fetchStatus();
  };

  const handlePushPull = async (action: "push" | "pull" | "fetch") => {
    if (!remoteUrl) return;
    if (!workspace.githubToken && (action === "push" || action === "pull")) {
      setShowRemoteForm(true);
      return;
    }
    await handleAction(action, {
      url: remoteUrl,
      token: workspace.githubToken,
      branch
    });
  };

  if (!isRepo) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <GitBranch size={32} className="text-foreground/30 mb-4" />
        <p className="text-sm text-foreground/70 mb-4">No active Git repository found.</p>
        <button
          onClick={handleInit}
          disabled={isLoading}
          className="px-4 py-2 bg-accent text-white rounded text-sm hover:bg-accent-hover transition-colors"
        >
          Initialize Repository
        </button>
      </div>
    );
  }

  // UU indicates both modified (merge conflict)
  const conflicts = changes.filter(c => c.staging === 'U' && c.working === 'U');
  const stagedChanges = changes.filter(c => c.staging !== ' ' && c.staging !== '?' && !(c.staging === 'U' && c.working === 'U'));
  const unstagedChanges = changes.filter(c => (c.working !== ' ' || c.staging === '?') && !(c.staging === 'U' && c.working === 'U'));

  return (
    <div className="flex flex-col h-full font-sans">
      {/* Git Header */}
      <div className="p-3 border-b border-panel-border/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground/80">
            <GitBranch size={14} className="text-accent" />
            <span>{branch || "main"}</span>
          </div>
          {remoteUrl && (
            <div className="flex items-center gap-1 text-[10px] text-foreground/60">
              <span className="flex items-center gap-0.5"><Upload size={10}/> {ahead}</span>
              <span className="flex items-center gap-0.5"><Download size={10}/> {behind}</span>
              <button
                onClick={() => handlePushPull("fetch")}
                disabled={isLoading}
                className="p-1 hover:text-foreground hover:bg-foreground/10 rounded ml-1"
                title="Fetch"
              >
                <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <textarea
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            placeholder="Message (Cmd+Enter to commit)"
            className="w-full bg-background border border-panel-border rounded p-2 text-xs text-foreground placeholder:text-foreground/40 resize-none outline-none focus:border-accent"
            rows={3}
            disabled={conflicts.length > 0}
          />
          <button
            onClick={() => handleAction("commit", { message: commitMessage })}
            disabled={isLoading || (!commitMessage && conflicts.length === 0) || (stagedChanges.length === 0 && conflicts.length === 0) || conflicts.length > 0}
            className="w-full py-1.5 bg-accent text-white rounded text-xs font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {conflicts.length > 0 ? "Resolve Conflicts First" : "Commit"}
          </button>
        </div>

        {/* Remote Sync Panel */}
        <div className="mt-3 pt-3 border-t border-panel-border/30">
          {!remoteUrl || showRemoteForm ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1 text-xs font-medium text-foreground/70 mb-1">
                <Cloud size={12} /> Connect Remote
              </div>
              <input
                type="text"
                placeholder="Repository URL (https://...)"
                value={newRemoteUrl}
                onChange={e => setNewRemoteUrl(e.target.value)}
                className="w-full bg-background border border-panel-border rounded p-1.5 text-xs text-foreground focus:border-accent outline-none"
              />
              <input
                type="password"
                placeholder="Personal Access Token (PAT)"
                value={newToken}
                onChange={e => setNewToken(e.target.value)}
                className="w-full bg-background border border-panel-border rounded p-1.5 text-xs text-foreground focus:border-accent outline-none"
              />
              <div className="flex gap-2">
                <button onClick={connectRemote} disabled={isLoading || !newRemoteUrl} className="flex-1 py-1 bg-foreground/10 hover:bg-foreground/20 rounded text-xs transition-colors">Connect</button>
                {showRemoteForm && remoteUrl && (
                  <button onClick={() => setShowRemoteForm(false)} className="py-1 px-2 hover:bg-foreground/10 rounded text-xs transition-colors text-foreground/50">Cancel</button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => handlePushPull("pull")}
                disabled={isLoading}
                className="flex-1 py-1.5 flex justify-center items-center gap-1.5 bg-foreground/5 hover:bg-foreground/10 rounded text-xs transition-colors"
              >
                <Download size={12} /> Pull
              </button>
              <button
                onClick={() => handlePushPull("push")}
                disabled={isLoading}
                className="flex-1 py-1.5 flex justify-center items-center gap-1.5 bg-foreground/5 hover:bg-foreground/10 rounded text-xs transition-colors"
              >
                <Upload size={12} /> Push
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Conflicts */}
        {conflicts.length > 0 && (
          <div className="mt-2 bg-red-900/10 py-1">
            <div className="px-3 py-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-red-400">
              <AlertTriangle size={12} /> Merge Conflicts ({conflicts.length})
            </div>
            {conflicts.map(c => (
              <div key={c.file} className="flex items-center justify-between px-3 py-1 hover:bg-red-900/20 group cursor-pointer" onClick={() => workspace.openFile(c.file, c.file.split('/').pop() || c.file)}>
                <div className="flex items-center gap-2 truncate text-sm">
                  <span className="text-red-500 font-mono text-[10px] w-2 font-bold">C</span>
                  <span className="text-red-400 truncate">{c.file}</span>
                </div>
                <div className="hidden group-hover:flex items-center gap-1">
                  <button onClick={(e) => { e.stopPropagation(); handleAction("add", { file: c.file }); }} className="p-1 hover:bg-red-500/20 rounded text-red-400 hover:text-red-300 text-xs" title="Mark Resolved (Stage)">
                    Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Staged Changes */}
        {stagedChanges.length > 0 && (
          <div className="mt-2">
            <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground/50">
              Staged Changes ({stagedChanges.length})
            </div>
            {stagedChanges.map(c => (
              <div key={c.file} className="flex items-center justify-between px-3 py-1 hover:bg-foreground/5 group cursor-pointer" onClick={() => workspace.openDiff(c.file, c.file.split('/').pop() || c.file)}>
                <div className="flex items-center gap-2 truncate text-sm">
                  <span className="text-green-400 font-mono text-[10px] w-2">{c.staging}</span>
                  <span className="text-foreground/80 truncate">{c.file}</span>
                </div>
                <div className="hidden group-hover:flex items-center gap-1">
                  <button onClick={(e) => { e.stopPropagation(); handleAction("unstage", { file: c.file }); }} className="p-1 hover:bg-foreground/10 rounded text-foreground/50 hover:text-foreground" title="Unstage">-</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Unstaged Changes */}
        {unstagedChanges.length > 0 && (
          <div className="mt-2">
            <div className="px-3 py-1 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
                Changes ({unstagedChanges.length})
              </span>
              <button onClick={() => handleAction("add", { file: "all" })} className="p-0.5 hover:bg-foreground/10 rounded text-foreground/50 hover:text-foreground" title="Stage All">
                <Plus size={14} />
              </button>
            </div>
            {unstagedChanges.map(c => (
              <div key={c.file} className="flex items-center justify-between px-3 py-1 hover:bg-foreground/5 group cursor-pointer" onClick={() => workspace.openDiff(c.file, c.file.split('/').pop() || c.file)}>
                <div className="flex items-center gap-2 truncate text-sm">
                  <span className={c.staging === '?' ? "text-green-400 font-mono text-[10px] w-2" : "text-yellow-400 font-mono text-[10px] w-2"}>
                    {c.staging === '?' ? 'U' : c.working}
                  </span>
                  <span className="text-foreground/80 truncate">{c.file}</span>
                </div>
                <div className="hidden group-hover:flex items-center gap-1">
                  <button onClick={(e) => { e.stopPropagation(); handleAction("restore", { file: c.file }); }} className="p-1 hover:bg-foreground/10 rounded text-foreground/50 hover:text-foreground" title="Discard Changes">
                    <Trash2 size={12} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleAction("add", { file: c.file }); }} className="p-1 hover:bg-foreground/10 rounded text-foreground/50 hover:text-foreground" title="Stage">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Commit History */}
        {logs.length > 0 && (
          <div className="mt-2 border-t border-panel-border/30 pt-2">
            <div className="px-3 py-1 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
                Commit History
              </span>
            </div>
            {logs.map(log => (
              <div key={log.hash} className="flex flex-col px-3 py-1.5 hover:bg-foreground/5 border-b border-foreground/5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-foreground/90 text-xs font-medium truncate">{log.message}</span>
                  <span className="text-accent font-mono text-[10px]">{log.hash}</span>
                </div>
                <div className="flex items-center justify-between gap-2 text-[10px] text-foreground/50 mt-0.5">
                  <span className="truncate">{log.author}</span>
                  <span className="whitespace-nowrap">{log.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SearchPanel({ workspace }: { workspace: ReturnType<typeof useWorkspace> }) {
  const [query, setQuery] = useState("");
  const [replaceWith, setReplaceWith] = useState("");
  const [matchCase, setMatchCase] = useState(false);
  const [isRegex, setIsRegex] = useState(false);
  const [results, setResults] = useState<{file: string, line: number, text: string}[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!query) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    
    const currentProjectId = workspace.projectId || new URLSearchParams(window.location.search).get('projectId');
    
    if (!currentProjectId) {
      // Local client-side search fallback
      try {
        const localFiles = JSON.parse(localStorage.getItem('bossgt_files') || '[]');
        let regex: RegExp;
        if (isRegex) {
          regex = new RegExp(query, matchCase ? "g" : "gi");
        } else {
          const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          regex = new RegExp(escapedQuery, matchCase ? "g" : "gi");
        }

        const localResults: {file: string, line: number, text: string}[] = [];
        for (const file of localFiles) {
          if (!file.content) continue;
          const lines = file.content.split('\n');
          lines.forEach((lineText: string, i: number) => {
            if (regex.test(lineText)) {
              localResults.push({
                file: file.path,
                line: i + 1,
                text: lineText
              });
              // Reset regex lastIndex since we are testing line by line
              regex.lastIndex = 0;
            }
          });
        }
        setResults(localResults);
      } catch (e) {
        console.error("Local search error", e);
      }
      setIsSearching(false);
      return;
    }

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "search", query, isRegex, matchCase, projectId: currentProjectId })
      });
      const data = await res.json();
      setResults(data.results || []);
    } catch (e) {
      console.error("Search error", e);
    }
    setIsSearching(false);
  };

  const handleReplace = async (filePaths: string[]) => {
    if (!query || filePaths.length === 0) return;
    const currentProjectId = workspace.projectId || new URLSearchParams(window.location.search).get('projectId');
    
    if (!currentProjectId) {
      // Local client-side replace fallback
      try {
        const localFiles = JSON.parse(localStorage.getItem('bossgt_files') || '[]');
        let regex: RegExp;
        if (isRegex) {
          regex = new RegExp(query, matchCase ? "g" : "gi");
        } else {
          const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          regex = new RegExp(escapedQuery, matchCase ? "g" : "gi");
        }
        
        let modified = false;
        const updatedFiles = localFiles.map((file: any) => {
          if (filePaths.includes(file.path) && file.content) {
            const newContent = file.content.replace(regex, replaceWith);
            if (newContent !== file.content) {
              modified = true;
              return { ...file, content: newContent };
            }
          }
          return file;
        });

        if (modified) {
          localStorage.setItem('bossgt_files', JSON.stringify(updatedFiles));
          // Refresh the file if it's currently open
          if (filePaths.includes(workspace.activeFilePath || '')) {
             const updated = updatedFiles.find((f: any) => f.path === workspace.activeFilePath);
             if (updated) {
               window.dispatchEvent(new CustomEvent('workspace-file-updated', { detail: { path: updated.path, content: updated.content }}));
             }
          }
          handleSearch();
        }
      } catch (e) {
        console.error("Local replace error", e);
      }
      return;
    }

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "replace", query, replaceWith, isRegex, matchCase, filePaths, projectId: currentProjectId })
      });
      const data = await res.json();
      if (data.success) {
        handleSearch();
      }
    } catch (e) {
      console.error("Replace error", e);
    }
  };

  const grouped = results.reduce((acc, curr) => {
    if (!acc[curr.file]) acc[curr.file] = [];
    acc[curr.file].push(curr);
    return acc;
  }, {} as Record<string, typeof results>);

  return (
    <div className="flex flex-col h-full font-sans p-3">
      <div className="flex flex-col gap-2 mb-4">
        <div className="relative flex items-center bg-background border border-panel-border rounded focus-within:border-accent">
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            className="w-full bg-transparent p-1.5 text-xs text-foreground placeholder:text-foreground/40 outline-none"
          />
          <div className="flex items-center gap-1 pr-1">
            <button 
              onClick={() => setMatchCase(!matchCase)} 
              className={`p-0.5 rounded text-xs font-mono font-bold transition-colors ${matchCase ? 'bg-accent/20 text-accent' : 'text-foreground/50 hover:text-foreground'}`}
              title="Match Case"
            >Aa</button>
            <button 
              onClick={() => setIsRegex(!isRegex)} 
              className={`p-0.5 rounded text-xs font-mono font-bold transition-colors ${isRegex ? 'bg-accent/20 text-accent' : 'text-foreground/50 hover:text-foreground'}`}
              title="Use Regular Expression"
            >.*</button>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-background border border-panel-border rounded focus-within:border-accent">
          <input
            type="text"
            placeholder="Replace"
            value={replaceWith}
            onChange={e => setReplaceWith(e.target.value)}
            className="w-full bg-transparent p-1.5 text-xs text-foreground placeholder:text-foreground/40 outline-none"
          />
          <button 
            onClick={() => handleReplace(Object.keys(grouped))}
            className="p-1 text-foreground/50 hover:text-foreground rounded transition-colors mr-1"
            title="Replace All"
          >
            <ReplaceAll size={14} />
          </button>
        </div>
        
        <button 
          onClick={handleSearch}
          disabled={isSearching || !query}
          className="w-full py-1.5 bg-accent text-white rounded text-xs font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          {isSearching ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto -mx-3">
        {Object.entries(grouped).map(([file, lines]) => (
          <div key={file} className="mb-2">
            <div className="px-3 py-1 flex items-center justify-between text-xs font-semibold text-foreground/80 bg-foreground/5">
              <span className="truncate">{file}</span>
              <div className="flex items-center gap-1">
                <span className="px-1.5 py-0.5 bg-foreground/10 rounded-full text-[10px]">{lines.length}</span>
                <button 
                  onClick={() => handleReplace([file])}
                  className="p-1 hover:bg-foreground/20 rounded text-foreground/70"
                  title="Replace in file"
                >
                  <Replace size={12} />
                </button>
              </div>
            </div>
            {lines.map((res, i) => (
              <div 
                key={i} 
                className="px-3 py-1 text-[11px] font-mono text-foreground/60 hover:bg-foreground/5 hover:text-foreground cursor-pointer flex gap-2 truncate"
                onClick={async () => {
                  await workspace.openFile(file, file.split('/').pop() || file);
                  setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('editor-goto-line', { detail: { file, line: res.line }}));
                  }, 150);
                }}
              >
                <span className="text-accent/70 shrink-0">{res.line}</span>
                <span className="truncate">{res.text.trim()}</span>
              </div>
            ))}
          </div>
        ))}
        {query && results.length === 0 && !isSearching && (
          <div className="px-3 py-4 text-center text-xs text-foreground/50">
            No results found.
          </div>
        )}
      </div>
    </div>
  );
}

function ExtensionsPanel() {
  const [query, setQuery] = useState("");

  const builtinEngines = [
    { id: "ext-python", name: "Python Language Support", description: "Built-in execution engine, Pylance IntelliSense, and NumPy/SciPy sandbox compatibility.", version: "3.11.0", status: "Built-in" },
    { id: "ext-node", name: "JavaScript & TypeScript", description: "V8 JavaScript engine, TS compiler diagnostics, and Node.js execution toolchain.", version: "20.x", status: "Built-in" },
    { id: "ext-cpp", name: "C & C++ Native Engine", description: "GCC/Clang compilation pipeline, stdc++17 header support, and GDB diagnostics.", version: "13.2.0", status: "Built-in" },
    { id: "ext-java", name: "Java JDK Runtime", description: "OpenJDK 17 compilation & JVM runtime execution with standard library support.", version: "17.0", status: "Built-in" },
    { id: "ext-rust", name: "Rust Toolchain", description: "rustc compiler engine, Cargo package resolution, and memory-safe sandbox execution.", version: "1.75.0", status: "Built-in" },
    { id: "ext-go", name: "Go Compiler", description: "Go toolchain runtime with fast single-pass compilation and goroutine support.", version: "1.22.0", status: "Built-in" },
    { id: "ext-web", name: "Web Preview Engine", description: "Live HTML5, CSS3, and DOM script iframe preview container.", version: "1.0.0", status: "Built-in" }
  ];

  const filtered = builtinEngines.filter(ext => 
    ext.name.toLowerCase().includes(query.toLowerCase()) || 
    ext.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full font-sans p-3">
      <div className="mb-4">
        <div className="relative flex items-center bg-background border border-panel-border rounded focus-within:border-accent">
          <input
            type="text"
            placeholder="Search Built-in Runtimes"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent p-1.5 text-xs text-foreground outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto -mx-3">
        <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground/50 mb-2">
          Built-in Language Runtimes ({filtered.length})
        </div>

        {filtered.map(ext => (
          <div key={ext.id} className="flex gap-3 p-3 hover:bg-foreground/5 border-b border-panel-border/30">
            <div className="w-8 h-8 rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Blocks size={16} className="text-indigo-400" />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-xs text-foreground truncate">{ext.name}</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[9px]">
                  {ext.status}
                </span>
              </div>
              <span className="text-[10px] text-foreground/70 mt-1 leading-relaxed">
                {ext.description}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsPanel() {
  const { settings, updateEditorSettings, updateAppearanceSettings } = useSettings();
  const [query, setQuery] = useState("");

  const categories = [
    {
      title: "Editor",
      settings: [
        { id: "fontSize", label: "Font Size", type: "number", value: settings.editor.fontSize },
        { id: "tabSize", label: "Tab Size", type: "number", value: settings.editor.tabSize },
        { id: "wordWrap", label: "Word Wrap", type: "select", options: ["on", "off"], value: settings.editor.wordWrap },
        { id: "minimap", label: "Minimap", type: "boolean", value: settings.editor.minimap },
        { id: "lineNumbers", label: "Line Numbers", type: "select", options: ["on", "off"], value: settings.editor.lineNumbers },
        { id: "autoClosingBrackets", label: "Auto Closing Brackets", type: "select", options: ["always", "languageDefined", "beforeWhitespace", "never"], value: settings.editor.autoClosingBrackets },
        { id: "theme", label: "Color Theme", type: "select", options: ["vs-dark", "vs", "hc-black"], value: settings.editor.theme }
      ]
    },
    {
      title: "Appearance",
      settings: [
        { id: "uiTheme", label: "UI Theme", type: "select", options: ["dark", "light"], value: settings.appearance.uiTheme }
      ]
    }
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdate = (categoryId: string, id: string, value: any) => {
    if (categoryId === "Editor") {
      updateEditorSettings({ [id]: value });
    } else if (categoryId === "Appearance") {
      updateAppearanceSettings({ [id]: value });
    }
  };

  return (
    <div className="flex flex-col h-full font-sans p-4">
      <div className="mb-6">
        <div className="relative flex items-center bg-background border border-panel-border rounded focus-within:border-accent">
          <input
            type="text"
            placeholder="Search Settings"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent p-1.5 text-xs text-foreground outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {categories.map(category => {
          const visibleSettings = category.settings.filter(s => s.label.toLowerCase().includes(query.toLowerCase()));
          if (visibleSettings.length === 0) return null;

          return (
            <div key={category.title} className="mb-8">
              <h3 className="text-sm font-semibold text-foreground border-b border-panel-border/50 pb-2 mb-4">{category.title}</h3>
              <div className="flex flex-col gap-5">
                {visibleSettings.map(setting => (
                  <div key={setting.id} className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-foreground/90">{setting.label}</label>
                    
                    {setting.type === "number" && (
                      <input 
                        type="number" 
                        value={setting.value as number}
                        onChange={e => handleUpdate(category.title, setting.id, parseInt(e.target.value, 10))}
                        className="w-full max-w-[200px] bg-background border border-panel-border rounded px-2 py-1 text-xs focus:border-accent outline-none"
                      />
                    )}

                    {setting.type === "boolean" && (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={setting.value as boolean}
                          onChange={e => handleUpdate(category.title, setting.id, e.target.checked)}
                          className="accent-accent"
                        />
                        <span className="text-xs text-foreground/70">Enabled</span>
                      </label>
                    )}

                    {setting.type === "select" && setting.options && (
                      <select 
                        value={setting.value as string}
                        onChange={e => handleUpdate(category.title, setting.id, e.target.value)}
                        className="w-full max-w-[200px] bg-background border border-panel-border rounded px-2 py-1 text-xs focus:border-accent outline-none text-foreground"
                      >
                        {setting.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
