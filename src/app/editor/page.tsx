"use client";

import React, { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { MainWorkspace } from "@/components/layout/MainWorkspace";
import { RightPanel } from "@/components/layout/RightPanel";
import { StatusBar } from "@/components/layout/StatusBar";
import { DEFAULT_LANGUAGE, getLanguageById } from "@/components/editor/editor-config";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useSettings } from "@/hooks/useSettings";
import { useLocalWorkspace } from "@/hooks/useLocalWorkspace";

export interface GeneratedFile {
  name: string;
  url: string;
  type?: 'image' | 'pdf' | 'text' | string;
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timeMs: number;
  generatedFiles?: GeneratedFile[];
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-[#030408] text-white font-sans">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            <span className="text-sm font-bold">BG</span>
          </div>
          <span className="text-xs font-mono tracking-widest uppercase text-indigo-300">INITIALIZING NEURAL FORGE...</span>
        </div>
      </div>
    }>
      <EditorWorkspaceRouter />
    </Suspense>
  );
}

function EditorWorkspaceRouter() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');
  
  if (projectId?.startsWith('local_')) {
    return <LocalEditorWorkspace projectId={projectId} />;
  }
  return <CloudEditorWorkspace projectId={projectId} />;
}

function CloudEditorWorkspace({ projectId }: { projectId: string | null }) {
  const workspace = useWorkspace(projectId);
  return <EditorWorkspaceCore workspace={workspace} projectId={projectId} />;
}

function LocalEditorWorkspace({ projectId }: { projectId: string | null }) {
  const workspace = useLocalWorkspace(projectId);
  return <EditorWorkspaceCore workspace={workspace} projectId={projectId} />;
}

function EditorWorkspaceCore({ workspace, projectId }: { workspace: ReturnType<typeof useWorkspace> | ReturnType<typeof useLocalWorkspace>, projectId: string | null }) {
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [stdin, setStdin] = useState("");
  const abortControllerRef = React.useRef<AbortController | null>(null);
  
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [rightPanelState, setRightPanelState] = useState<'collapsed' | 'expanded' | 'maximized'>('expanded');
  
  // Resizable panel dimensions with min/max bounds
  const [sidebarWidth, setSidebarWidth] = useState(310);
  const [rightPanelWidth, setRightPanelWidth] = useState(380);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [isResizingRightPanel, setIsResizingRightPanel] = useState(false);

  const { settings } = useSettings();
  const activeFile = workspace.openFiles.find((f: any) => f.path === workspace.activeFilePath);
  const activeLangId = activeFile ? activeFile.languageId : DEFAULT_LANGUAGE;

  useEffect(() => {
    if (settings.appearance.uiTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, [settings.appearance.uiTheme]);

  // Section 20: Lightweight Global Mouse Reactive Atmospheric Glow
  useEffect(() => {
    let rafId: number;
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Handle Sidebar Resizing
  const handleSidebarMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingSidebar(true);
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newWidth = Math.max(200, Math.min(520, startWidth + deltaX));
      setSidebarWidth(newWidth);
      window.dispatchEvent(new Event("resize"));
    };

    const handleMouseUp = () => {
      setIsResizingSidebar(false);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.dispatchEvent(new Event("resize"));
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Handle Right Panel Resizing
  const handleRightPanelMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingRightPanel(true);
    const startX = e.clientX;
    const startWidth = rightPanelWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = startX - moveEvent.clientX;
      const newWidth = Math.max(260, Math.min(750, startWidth + deltaX));
      setRightPanelWidth(newWidth);
      window.dispatchEvent(new Event("resize"));
    };

    const handleMouseUp = () => {
      setIsResizingRightPanel(false);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.dispatchEvent(new Event("resize"));
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleRunCode = async (code: string, language: string) => {
    setIsRunning(true);
    setExecutionResult(null);
    abortControllerRef.current = new AbortController();
    
    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, stdin }),
        signal: abortControllerRef.current.signal
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setExecutionResult({
          stdout: "",
          stderr: data.error + (data.details ? "\n" + data.details : ""),
          exitCode: 1,
          timeMs: 0
        });
      } else {
        setExecutionResult(data);
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setExecutionResult({
          stdout: "",
          stderr: "Execution forcefully aborted by user.",
          exitCode: -1,
          timeMs: 0
        });
      } else {
        const errMessage = err instanceof Error ? err.message : "Unknown error occurred";
        setExecutionResult({
          stdout: "",
          stderr: "Failed to connect to execution server.\n" + errMessage,
          exitCode: 1,
          timeMs: 0
        });
      }
    } finally {
      setIsRunning(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopCode = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const toggleMaximizeEditor = () => {
    if (rightPanelState === 'collapsed') {
      setRightPanelState('expanded');
    } else {
      setRightPanelState('collapsed');
    }
  };

  const handleMaximizeRightPanel = () => {
    setRightPanelState('maximized');
    setIsSidebarExpanded(false);
  };

  const handleCollapseRightPanel = () => {
    setRightPanelState('collapsed');
  };

  const handleRestoreRightPanel = () => {
    setRightPanelState('expanded');
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  React.useEffect(() => {
    const handleToggleExplorer = () => setIsSidebarExpanded(prev => !prev);
    const handleToggleTerminal = () => setRightPanelState('expanded');
    
    window.addEventListener("bossgt-toggle-explorer", handleToggleExplorer);
    window.addEventListener("bossgt-toggle-terminal", handleToggleTerminal);
    
    return () => {
      window.removeEventListener("bossgt-toggle-explorer", handleToggleExplorer);
      window.removeEventListener("bossgt-toggle-terminal", handleToggleTerminal);
    };
  }, []);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-[#030408] text-slate-100 select-none relative font-sans">
      {/* Neural Environment Background Layers */}
      <div className="neural-atmosphere" />
      <div className="neural-grid" />

      {/* Floating Translucent Top Navigation Bar */}
      <TopNavigation />

      {/* Main Content Area */}
      <div className={`flex flex-1 overflow-hidden relative z-10 ${isResizingSidebar || isResizingRightPanel ? 'cursor-col-resize select-none' : ''}`}>
          
        {/* Left Sidebar (Activity Rail + Explorer) */}
        <div 
          style={{ width: isSidebarExpanded ? (rightPanelState === 'maximized' ? 56 : sidebarWidth) : 56 }}
          className="shrink-0 flex h-full z-10 overflow-hidden"
        >
          <Sidebar workspace={workspace} isExpanded={isSidebarExpanded && rightPanelState !== 'maximized'} onToggle={toggleSidebar} />
        </div>

        {/* Sidebar Drag Resizer Handle */}
        {isSidebarExpanded && rightPanelState !== 'maximized' && (
          <div
            onMouseDown={handleSidebarMouseDown}
            className="w-1.5 h-full bg-transparent hover:bg-indigo-500/50 active:bg-indigo-400 cursor-col-resize transition-all z-20 shrink-0 my-2 rounded-full"
            title="Drag to resize Explorer"
          />
        )}

        {/* Main Editor Centerpiece */}
        <div className={`flex-1 min-w-0 h-full flex flex-col z-0 ${rightPanelState === 'maximized' ? 'hidden' : ''}`}>
          <MainWorkspace 
            workspace={workspace}
            onRun={handleRunCode} 
            onStop={handleStopCode}
            isRunning={isRunning} 
            onMaximize={toggleMaximizeEditor}
          />
        </div>

        {/* Right Panel Drag Resizer Handle */}
        {rightPanelState === 'expanded' && (
          <div
            onMouseDown={handleRightPanelMouseDown}
            className="w-1.5 h-full bg-transparent hover:bg-indigo-500/50 active:bg-indigo-400 cursor-col-resize transition-all z-20 shrink-0 my-2 rounded-full"
            title="Drag to resize Panel"
          />
        )}

        {/* Bottom / Right Panel (Output/Terminal/Problems) */}
        <div 
          style={{ 
            width: rightPanelState === 'collapsed' ? 0 : 
                   rightPanelState === 'maximized' ? '100%' : rightPanelWidth 
          }}
          className={`shrink-0 h-full flex flex-col z-10 ${
            rightPanelState === 'collapsed' ? 'overflow-hidden' : 
            rightPanelState === 'maximized' ? 'flex-1' : ''
          }`}
        >
          <RightPanel 
            executionResult={executionResult} 
            isRunning={isRunning} 
            stdin={stdin}
            onStdinChange={setStdin}
            projectId={projectId}
            onMaximize={handleMaximizeRightPanel}
            onCollapse={handleCollapseRightPanel}
            onRestore={handleRestoreRightPanel}
            isMaximized={rightPanelState === 'maximized'}
          />
        </div>
          
      </div>

      {/* Floating Status Bar Footer */}
      <StatusBar activeLangId={activeLangId} />
    </div>
  );
}
