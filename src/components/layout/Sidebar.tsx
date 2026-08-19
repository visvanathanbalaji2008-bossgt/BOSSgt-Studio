import React, { useState } from "react";
import {
  Files, Search, GitBranch, Blocks,
  ChevronRight, ChevronDown, FileCode, FolderOpen,
  Plus, FolderPlus, Trash2, Edit2, File as FileIcon,
  Cloud, RefreshCw, Upload, Download, AlertTriangle,
  Replace, ReplaceAll, Settings as SettingsIcon
} from "lucide-react";
import { useWorkspace, FileNode } from "@/hooks/useWorkspace";
import { useSettings } from "@/hooks/useSettings";

interface SidebarProps {
  workspace?: ReturnType<typeof useWorkspace>;
}

export function Sidebar({ workspace }: SidebarProps) {
  const [activeTab, setActiveTab] = useState("explorer");

  const tabs = [
    { id: "explorer", icon: Files, label: "Explorer" },
    { id: "search", icon: Search, label: "Search" },
    { id: "source-control", icon: GitBranch, label: "Source Control" },
    { id: "extensions", icon: Blocks, label: "Extensions" },
  ];

  return (
    <div className="flex h-full border-r border-panel-border shrink-0">
      {/* Activity Bar */}
      <div className="w-12 bg-activity-bar flex flex-col items-center py-4 gap-4 border-r border-panel-border/50">
        <div className="flex-1 flex flex-col items-center gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? "text-accent bg-accent/10"
                  : "text-foreground/50 hover:text-foreground hover:bg-foreground/5"
              }`}
              title={tab.label}
            >
              <tab.icon size={22} strokeWidth={1.5} />
            </button>
          ))}
        </div>
        <div className="flex flex-col items-center gap-4 mt-auto">
          <button
            onClick={() => setActiveTab("settings")}
            className={`p-2 rounded-lg transition-colors ${
              activeTab === "settings"
                ? "text-accent bg-accent/10"
                : "text-foreground/50 hover:text-foreground hover:bg-foreground/5"
            }`}
            title="Settings"
          >
            <SettingsIcon size={22} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Primary Sidebar Panel */}
      <div className="w-64 bg-sidebar flex flex-col">
        <div className="h-10 flex items-center px-4 font-semibold text-xs tracking-wider text-foreground/70 uppercase">
          {tabs.find((t) => t.id === activeTab)?.label}
        </div>

        {activeTab === "explorer" && workspace && (
          <div className="flex-1 overflow-y-auto">
            <ExplorerTree workspace={workspace} />
          </div>
        )}

        {activeTab === "source-control" && workspace && (
          <div className="flex-1 overflow-y-auto">
            <SourceControlPanel workspace={workspace} />
          </div>
        )}

        {activeTab === "search" && workspace && (
          <div className="flex-1 overflow-y-auto">
            <SearchPanel workspace={workspace} />
          </div>
        )}

        {activeTab === "extensions" && (
          <div className="flex-1 overflow-y-auto">
            <ExtensionsPanel />
          </div>
        )}

        {activeTab === "settings" && (
          <div className="flex-1 overflow-y-auto">
            <SettingsPanel />
          </div>
        )}

        {activeTab !== "explorer" && activeTab !== "source-control" && activeTab !== "search" && activeTab !== "extensions" && activeTab !== "settings" && (
          <div className="p-4 text-xs text-foreground/50 text-center">
            Placeholder for {activeTab} functionality.
          </div>
        )}
      </div>
    </div>
  );
}

function ExplorerTree({ workspace }: { workspace: ReturnType<typeof useWorkspace> }) {
  const [isProjectOpen, setIsProjectOpen] = useState(true);

  const handleCreateFile = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const name = prompt("Enter file name:");
    if (name) workspace.createFile(name);
  };

  const handleCreateFolder = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const name = prompt("Enter folder name:");
    if (name) workspace.createFolder(name);
  };

  return (
    <div className="flex flex-col">
      <div
        onClick={() => setIsProjectOpen(!isProjectOpen)}
        className="w-full flex items-center justify-between px-2 py-1.5 text-sm font-medium hover:bg-foreground/5 transition-colors text-foreground/90 cursor-pointer group"
      >
        <div className="flex items-center gap-1">
          {isProjectOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span className="truncate">BOSSgt-Project</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={handleCreateFile} className="p-0.5 hover:bg-foreground/10 rounded" title="New File"><Plus size={14} /></button>
          <button onClick={handleCreateFolder} className="p-0.5 hover:bg-foreground/10 rounded" title="New Folder"><FolderPlus size={14} /></button>
        </div>
      </div>

      {isProjectOpen && (
        <div className="flex flex-col mt-1">
          {workspace.fileTree.map(node => (
            <TreeNode key={node.path} node={node} level={1} workspace={workspace} />
          ))}
        </div>
      )}
    </div>
  );
}

function TreeNode({ node, level, workspace }: { node: FileNode, level: number, workspace: ReturnType<typeof useWorkspace> }) {
  const [isOpen, setIsOpen] = useState(false);
  const isActive = workspace.activeFilePath === node.path;
  const paddingLeft = `${level * 12 + 16}px`;

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
      // Very basic path rename logic. We simply replace the basename.
      const parentDir = node.path.substring(0, node.path.lastIndexOf('/'));
      const newPath = parentDir ? `${parentDir}/${newName}` : newName;
      workspace.renamePath(node.path, newPath);
    }
  };

  const getIcon = () => {
    if (node.type === 'dir') return <FolderOpen size={15} className="text-blue-400" />;
    if (node.name.endsWith('.py')) return <FileCode size={15} className="text-blue-500" />;
    if (node.name.endsWith('.js') || node.name.endsWith('.ts')) return <FileCode size={15} className="text-yellow-400" />;
    if (node.name.endsWith('.c') || node.name.endsWith('.cpp')) return <FileCode size={15} className="text-purple-400" />;
    return <FileIcon size={15} className="text-gray-400" />;
  };

  return (
    <>
      <div
        onClick={handleToggle}
        className={`flex items-center justify-between py-1.5 pr-2 text-sm cursor-pointer group ${
          isActive ? "bg-accent/10 text-accent border-l-2 border-accent" : "hover:bg-foreground/5 text-foreground/80 border-l-2 border-transparent"
        }`}
        style={{ paddingLeft: isActive ? `calc(${paddingLeft} - 2px)` : paddingLeft }}
        title={node.path}
      >
        <div className="flex items-center gap-1.5 truncate">
          {node.type === 'dir' && (
            <span className="text-foreground/50">
              {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
          )}
          {getIcon()}
          <span className="truncate">{node.name}</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={handleRename} className="p-0.5 hover:bg-foreground/10 rounded text-foreground/50 hover:text-foreground" title="Rename"><Edit2 size={12} /></button>
          <button onClick={handleDelete} className="p-0.5 hover:bg-red-500/20 rounded text-foreground/50 hover:text-red-400" title="Delete"><Trash2 size={12} /></button>
        </div>
      </div>
      {node.type === 'dir' && isOpen && node.children && (
        <div className="flex flex-col">
          {node.children.map(child => (
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
        body: JSON.stringify({ action: "status" })
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
            body: JSON.stringify({ action: "remotes" })
          });
          const remData = await rem.json();
          setRemoteUrl(remData.remote);

          if (remData.remote) {
            const ab = await fetch("/api/git", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "aheadBehind" })
            });
            const abData = await ab.json();
            setAhead(abData.ahead);
            setBehind(abData.behind);
          }

          const logRes = await fetch("/api/git", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "log" })
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
      body: JSON.stringify({ action: "init" })
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
        body: JSON.stringify({ action, payload })
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
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "search", query, isRegex, matchCase })
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
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "replace", query, replaceWith, isRegex, matchCase, filePaths })
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
                onClick={() => {
                  workspace.openFile(file, file.split('/').pop() || file);
                  window.dispatchEvent(new CustomEvent('editor-goto-line', { detail: { file, line: res.line }}));
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
  const { settings, toggleExtension } = useSettings();
  const [query, setQuery] = useState("");

  const filtered = settings.extensions.filter(ext => 
    ext.name.toLowerCase().includes(query.toLowerCase()) || 
    ext.description.toLowerCase().includes(query.toLowerCase())
  );

  const installed = filtered.filter(e => e.installed);
  const recommended = filtered.filter(e => !e.installed);

  return (
    <div className="flex flex-col h-full font-sans p-3">
      <div className="mb-4">
        <div className="relative flex items-center bg-background border border-panel-border rounded focus-within:border-accent">
          <input
            type="text"
            placeholder="Search Extensions in Marketplace"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent p-1.5 text-xs text-foreground outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto -mx-3">
        {installed.length > 0 && (
          <div className="mb-4">
            <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground/50">
              Installed
            </div>
            {installed.map(ext => (
              <div key={ext.id} className="flex gap-3 p-3 hover:bg-foreground/5 border-b border-panel-border/30">
                <div className="w-8 h-8 rounded bg-accent/20 flex items-center justify-center shrink-0">
                  <Blocks size={16} className="text-accent" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-xs text-foreground truncate">{ext.name}</span>
                    <span className="text-[10px] text-foreground/50">v{ext.version}</span>
                  </div>
                  <span className="text-[10px] text-foreground/70 mt-1 line-clamp-2 leading-tight">
                    {ext.description}
                  </span>
                  <div className="flex gap-2 mt-2">
                    <button 
                      onClick={() => toggleExtension(ext.id, 'enabled', !ext.enabled)}
                      className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${ext.enabled ? 'border-accent text-accent hover:bg-accent/10' : 'border-foreground/30 text-foreground/50 hover:bg-foreground/10'}`}
                    >
                      {ext.enabled ? "Disable" : "Enable"}
                    </button>
                    <button 
                      onClick={() => {
                        toggleExtension(ext.id, 'installed', false);
                        toggleExtension(ext.id, 'enabled', false);
                      }}
                      className="px-2 py-0.5 rounded text-[10px] border border-red-900 text-red-400 hover:bg-red-900/20 transition-colors"
                    >
                      Uninstall
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {recommended.length > 0 && (
          <div className="mb-4">
            <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground/50">
              Recommended
            </div>
            {recommended.map(ext => (
              <div key={ext.id} className="flex gap-3 p-3 hover:bg-foreground/5 border-b border-panel-border/30">
                <div className="w-8 h-8 rounded bg-foreground/5 flex items-center justify-center shrink-0">
                  <Blocks size={16} className="text-foreground/40" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-xs text-foreground truncate">{ext.name}</span>
                    <span className="text-[10px] text-foreground/50">v{ext.version}</span>
                  </div>
                  <span className="text-[10px] text-foreground/70 mt-1 line-clamp-2 leading-tight">
                    {ext.description}
                  </span>
                  <div className="flex gap-2 mt-2">
                    <button 
                      onClick={() => {
                        toggleExtension(ext.id, 'installed', true);
                        toggleExtension(ext.id, 'enabled', true);
                      }}
                      className="px-3 py-0.5 bg-accent text-white rounded text-[10px] font-medium hover:bg-accent-hover transition-colors"
                    >
                      Install
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
