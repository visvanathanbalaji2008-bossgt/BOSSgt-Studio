import React, { useState } from "react";
import { 
  Files, Search, GitBranch, Blocks, 
  ChevronRight, ChevronDown, FileCode, FolderOpen,
  Plus, FolderPlus, Trash2, Edit2, File as FileIcon
} from "lucide-react";
import { useWorkspace, FileNode } from "@/hooks/useWorkspace";

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
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`p-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? "text-accent bg-accent/10"
                : "text-foreground/50 hover:text-foreground hover:bg-white/5"
            }`}
            title={tab.label}
          >
            <tab.icon size={22} strokeWidth={1.5} />
          </button>
        ))}
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
        
        {activeTab !== "explorer" && activeTab !== "source-control" && (
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
        className="w-full flex items-center justify-between px-2 py-1.5 text-sm font-medium hover:bg-white/5 transition-colors text-foreground/90 cursor-pointer group"
      >
        <div className="flex items-center gap-1">
          {isProjectOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span className="truncate">BOSSgt-Project</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={handleCreateFile} className="p-0.5 hover:bg-white/10 rounded" title="New File"><Plus size={14} /></button>
          <button onClick={handleCreateFolder} className="p-0.5 hover:bg-white/10 rounded" title="New Folder"><FolderPlus size={14} /></button>
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
          isActive ? "bg-accent/10 text-accent border-l-2 border-accent" : "hover:bg-white/5 text-foreground/80 border-l-2 border-transparent"
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
          <button onClick={handleRename} className="p-0.5 hover:bg-white/10 rounded text-foreground/50 hover:text-foreground" title="Rename"><Edit2 size={12} /></button>
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
      }
    } catch (_) {}
  }, []);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStatus();
    // Set up polling or listen to workspace changes if necessary.
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
    await fetch("/api/git", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, payload })
    });
    if (action === "commit" || action === "restore") {
      setCommitMessage("");
    }
    await fetchStatus();
    setIsLoading(false);
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

  const stagedChanges = changes.filter(c => c.staging !== ' ' && c.staging !== '?');
  const unstagedChanges = changes.filter(c => c.working !== ' ' || c.staging === '?');

  return (
    <div className="flex flex-col h-full font-sans">
      {/* Git Header */}
      <div className="p-3 border-b border-panel-border/50">
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground/80 mb-3">
          <GitBranch size={14} className="text-accent" />
          <span>{branch || "main"}</span>
        </div>
        
        <div className="flex flex-col gap-2">
          <textarea
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            placeholder="Message (Cmd+Enter to commit)"
            className="w-full bg-background border border-panel-border rounded p-2 text-xs text-foreground placeholder:text-foreground/40 resize-none outline-none focus:border-accent"
            rows={3}
          />
          <button
            onClick={() => handleAction("commit", { message: commitMessage })}
            disabled={isLoading || !commitMessage || stagedChanges.length === 0}
            className="w-full py-1.5 bg-accent text-white rounded text-xs font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Commit
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Staged Changes */}
        {stagedChanges.length > 0 && (
          <div className="mt-2">
            <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground/50">
              Staged Changes ({stagedChanges.length})
            </div>
            {stagedChanges.map(c => (
              <div key={c.file} className="flex items-center justify-between px-3 py-1 hover:bg-white/5 group cursor-pointer" onClick={() => workspace.openDiff(c.file, c.file.split('/').pop() || c.file)}>
                <div className="flex items-center gap-2 truncate text-sm">
                  <span className="text-green-400 font-mono text-[10px] w-2">{c.staging}</span>
                  <span className="text-foreground/80 truncate">{c.file}</span>
                </div>
                <div className="hidden group-hover:flex items-center gap-1">
                  <button onClick={(e) => { e.stopPropagation(); handleAction("unstage", { file: c.file }); }} className="p-1 hover:bg-white/10 rounded text-foreground/50 hover:text-foreground" title="Unstage">-</button>
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
              <button onClick={() => handleAction("add", { file: "all" })} className="p-0.5 hover:bg-white/10 rounded text-foreground/50 hover:text-foreground" title="Stage All">
                <Plus size={14} />
              </button>
            </div>
            {unstagedChanges.map(c => (
              <div key={c.file} className="flex items-center justify-between px-3 py-1 hover:bg-white/5 group cursor-pointer" onClick={() => workspace.openDiff(c.file, c.file.split('/').pop() || c.file)}>
                <div className="flex items-center gap-2 truncate text-sm">
                  <span className={c.staging === '?' ? "text-green-400 font-mono text-[10px] w-2" : "text-yellow-400 font-mono text-[10px] w-2"}>
                    {c.staging === '?' ? 'U' : c.working}
                  </span>
                  <span className="text-foreground/80 truncate">{c.file}</span>
                </div>
                <div className="hidden group-hover:flex items-center gap-1">
                  <button onClick={(e) => { e.stopPropagation(); handleAction("restore", { file: c.file }); }} className="p-1 hover:bg-white/10 rounded text-foreground/50 hover:text-foreground" title="Discard Changes">
                    <Trash2 size={12} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleAction("add", { file: c.file }); }} className="p-1 hover:bg-white/10 rounded text-foreground/50 hover:text-foreground" title="Stage">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
