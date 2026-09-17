"use client";

import React, { useEffect, useCallback } from "react";
import { Play, FileCode, X, Circle, Save, LayoutTemplate, Maximize2, Sparkles, Command, Check, AlertTriangle } from "lucide-react";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { DiffEditor } from "@monaco-editor/react";
import { getLanguageById } from "@/components/editor/editor-config";
import { LanguageSelector } from "@/components/editor/LanguageSelector";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useListenEvent } from "@/lib/events";

interface MainWorkspaceProps {
  workspace: ReturnType<typeof useWorkspace>;
  onRun: (code: string, language: string) => void;
  onStop?: () => void;
  isRunning: boolean;
  onMaximize?: () => void;
}

export function MainWorkspace({ workspace, onRun, onStop, isRunning, onMaximize }: MainWorkspaceProps) {
  const { openFiles, activeFilePath, closeFile, updateFileContent, saveFile, updateActiveLanguage, openFile } = workspace;
  
  const activeFile = openFiles.find(f => f.path === activeFilePath);
  const activeLanguage = activeFile ? getLanguageById(activeFile.languageId) : null;
  const isDirty = activeFile ? activeFile.content !== activeFile.savedContent : false;

  const handleRunCode = () => {
    if (isRunning || !activeFile || !activeLanguage) return;
    onRun(activeFile.content, activeLanguage.id);
  };

  const handleCodeChange = (newValue: string | undefined) => {
    if (newValue !== undefined && activeFilePath) {
      updateFileContent(activeFilePath, newValue);
    }
  };

  const handleSave = useCallback(() => {
    if (activeFilePath && isDirty) {
      saveFile(activeFilePath);
    }
  }, [activeFilePath, isDirty, saveFile]);

  useListenEvent("file:save", handleSave);
  useListenEvent("file:save-as", () => {
    if (activeFile) {
      const newPath = prompt("Enter new file path:", activeFile.path);
      if (newPath && newPath !== activeFile.path) {
        workspace.createFile(newPath);
        workspace.updateFileContent(newPath, activeFile.content);
        workspace.saveFile(newPath);
      }
    }
  });
  useListenEvent("run:start", handleRunCode);
  useListenEvent("run:stop", () => onStop && onStop());
  
  useListenEvent("file:delete", () => {
    if (activeFilePath) {
      if (confirm(`Are you sure you want to delete ${activeFilePath}?`)) {
        workspace.deleteNode(activeFilePath);
      }
    }
  });

  useListenEvent("file:rename", () => {
    if (activeFilePath) {
      const newPath = prompt(`Rename ${activeFilePath} to:`, activeFilePath);
      if (newPath && newPath !== activeFilePath) {
        workspace.renameNode(activeFilePath, newPath);
      }
    }
  });

  useListenEvent("file:open", () => {
     const path = prompt("Enter file path to open:");
     if (path) {
       workspace.openFile(path);
     }
  });

  useListenEvent("run:restart", () => {
    if (onStop) onStop();
    setTimeout(handleRunCode, 500);
  });
  
  useListenEvent("run:start-current", handleRunCode);

  useListenEvent("help:docs", () => window.open("https://github.com", "_blank"));
  useListenEvent("help:shortcuts", () => alert("Shortcuts:\nCmd+K: Command Palette\nCmd+S: Save\nCmd+Z: Undo\nCmd+Shift+Z: Redo\nCmd+A: Select All"));
  useListenEvent("help:about", () => alert("BOSSgt Studio NEURAL FORGE\nA Cloud IDE powered by Supabase and Next.js\nVersion 2100.4"));

  // Global save shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  const [closingFile, setClosingFile] = React.useState<string | null>(null);

  const togglePreview = () => {
    if (activeFile && workspace) {
      workspace.setFileMode(activeFile.path, activeFile.mode === 'preview' ? 'edit' : 'preview');
    }
  };

  const handleCloseTab = (e: React.MouseEvent, path: string, isDirty: boolean) => {
    e.stopPropagation();
    if (isDirty) {
      setClosingFile(path);
    } else {
      closeFile(path);
    }
  };

  const confirmClose = (save: boolean) => {
    if (!closingFile) return;
    if (save) {
      workspace.saveFile(closingFile);
    }
    closeFile(closingFile);
    setClosingFile(null);
  };

  return (
    <div className="flex flex-col h-[calc(100%-16px)] my-2 bg-[#05070d]/95 border border-indigo-500/20 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-950/40 w-full min-w-0 relative backdrop-blur-xl">
      {/* Save Confirmation Modal */}
      {closingFile && (
        <div className="absolute inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090d16]/95 border border-indigo-500/30 rounded-2xl shadow-2xl p-6 w-[420px] glass-panel">
            <h3 className="text-base font-bold text-white mb-2">Save unsaved changes?</h3>
            <p className="text-xs text-zinc-400 mb-6">Your modified code in this tab will be lost if you do not save it.</p>
            <div className="flex justify-end gap-3 font-sans">
              <button onClick={() => setClosingFile(null)} className="px-4 py-2 text-xs rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-medium transition-colors">Cancel</button>
              <button onClick={() => confirmClose(false)} className="px-4 py-2 text-xs rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium transition-colors">Don't Save</button>
              <button onClick={() => confirmClose(true)} className="px-4 py-2 text-xs rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}

      {workspace && activeFile && workspace.openFiles.length > 0 ? (
        <>
          {/* Futuristic Floating File Tabs */}
          <div className="flex h-11 bg-[#090d16]/80 border-b border-indigo-500/20 overflow-x-auto overflow-y-hidden no-scrollbar shrink-0 px-2 pt-1 gap-1">
            {workspace.openFiles.map((file) => {
              const isActive = file.path === workspace.activeFilePath;
              const fileIsDirty = file.content !== file.savedContent;
              return (
                <div
                  key={file.path}
                  onClick={() => workspace.openFile(file.path)}
                  className={`group flex items-center min-w-[130px] max-w-[210px] h-full px-3.5 gap-2 cursor-pointer transition-all rounded-t-xl select-none text-xs border-t border-x ${
                    isActive 
                      ? "bg-[#05070d] border-indigo-500/40 border-b-2 border-b-indigo-400 text-white font-medium shadow-[0_-4px_12px_rgba(99,102,241,0.15)]" 
                      : "bg-white/[0.02] hover:bg-white/[0.06] border-white/5 text-zinc-400 hover:text-zinc-200 border-b-transparent"
                  }`}
                  title={file.path}
                >
                  <FileCode size={14} className={isActive ? "text-indigo-400" : "text-zinc-500"} />
                  <span className="flex-1 truncate font-sans">{file.name}</span>
                  
                  {fileIsDirty && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0"></span>
                  )}

                  <div 
                    className="flex items-center justify-center w-5 h-5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                    onClick={(e) => handleCloseTab(e, file.path, fileIsDirty)}
                    title="Close tab"
                  >
                    <X size={13} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating Editor Toolbar */}
          <div className="flex items-center px-4 h-11 shrink-0 border-b border-indigo-500/15 bg-[#090d16]/40 backdrop-blur-md relative z-50">
            {/* LEFT: LANGUAGE COMMAND SELECTOR & RUN BUTTON */}
            <div className="flex items-center gap-3">
              <LanguageSelector 
                activeLangId={activeFile.languageId} 
                onSelect={(langId) => updateActiveLanguage(langId)} 
              />
              
              <div className="w-[1px] h-4 bg-indigo-500/20 mx-0.5"></div>
              
              {/* Dynamic Execution Button */}
              {isRunning ? (
                <button 
                  onClick={onStop}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 shadow-red-500/20 animate-pulse"
                >
                  <span className="animate-spin text-xs">◌</span>
                  <span>EXECUTING</span>
                </button>
              ) : (
                <button 
                  onClick={handleRunCode}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-lg bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400/30 shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Play size={13} fill="currentColor" className="text-white" />
                  <span>▶ RUN</span>
                </button>
              )}

              {(activeFile.name.endsWith('.html') || activeFile.name.endsWith('.js') || activeFile.name.endsWith('.css')) && (
                <>
                  <div className="w-[1px] h-4 bg-indigo-500/20 mx-0.5"></div>
                  <button 
                    onClick={togglePreview}
                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors ml-1 px-2 py-1 rounded-lg hover:bg-white/5 font-sans"
                  >
                    <LayoutTemplate size={14} className="text-cyan-400" />
                    {activeFile.mode === 'preview' ? 'Show Code' : 'Web Preview'}
                  </button>
                </>
              )}
            </div>
            
            {/* CENTER SPACER */}
            <div className="flex-1"></div>
            
            {/* RIGHT TOOLBAR ACTIONS */}
            <div className="flex items-center gap-3">
              {isDirty && activeFile.mode !== 'diff' && (
                <button 
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all"
                  title="Save (Cmd+S)"
                >
                  <Save size={13} />
                  <span>Save</span>
                </button>
              )}
              {onMaximize && (
                <button 
                  onClick={onMaximize}
                  className="flex items-center justify-center p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Maximize Editor"
                >
                  <Maximize2 size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Monaco Code Editor Canvas Surface */}
          <div className="flex-1 overflow-hidden relative bg-[#030408]">
            {activeFile.mode === 'diff' ? (
              <DiffEditor 
                original={activeFile.originalContent || ""}
                modified={activeFile.content}
                language={activeLanguage?.monacoLanguage || 'plaintext'} 
                theme="vs-dark"
                options={{ 
                  readOnly: true, 
                  renderSideBySide: true,
                  minimap: { enabled: false }
                }}
              />
            ) : activeFile.mode === 'preview' ? (
              <div className="w-full h-full bg-white relative">
                <iframe 
                  title="Web Preview"
                  className="w-full h-full border-none bg-white"
                  sandbox="allow-scripts allow-forms allow-popups allow-modals"
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <meta charset="utf-8">
                      <title>Preview</title>
                      <style>
                        ${workspace.openFiles.find(f => f.name.endsWith('.css'))?.content || ''}
                      </style>
                    </head>
                    <body>
                      ${workspace.openFiles.find(f => f.name.endsWith('.html'))?.content || activeFile.content}
                      <script>
                        ${workspace.openFiles.find(f => f.name.endsWith('.js'))?.content || ''}
                      </script>
                    </body>
                    </html>
                  `}
                />
              </div>
            ) : (
              <CodeEditor 
                value={activeFile.content} 
                onChange={handleCodeChange} 
                language={activeLanguage?.monacoLanguage || 'plaintext'} 
              />
            )}
          </div>
        </>
      ) : (
        /* Empty State Screen */
        <div className="flex-1 flex flex-col items-center justify-center bg-[#030408] text-center p-8 select-none">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(99,102,241,0.25)]">
            <Command size={32} />
          </div>
          <h2 className="text-2xl font-bold tracking-wide text-white font-sans">BOSSgt Studio</h2>
          <div className="text-xs text-indigo-300 font-mono mt-1 tracking-widest uppercase">NEURAL FORGE WORKSTATION</div>
          <p className="mt-4 text-xs text-zinc-400 max-w-sm leading-relaxed">
            Select or create a file in the workspace explorer rail to enter the futuristic coding surface.
          </p>
          <div className="flex items-center gap-4 mt-6 text-xs text-zinc-500 font-mono">
            <span className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10">⌘K Command Palette</span>
            <span className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10">⌘S Save Code</span>
          </div>
        </div>
      )}
    </div>
  );
}
