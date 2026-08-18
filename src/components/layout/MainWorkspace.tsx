import React, { useEffect, useCallback } from "react";
import { Play, FileCode, X, Circle, Save } from "lucide-react";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { DiffEditor } from "@monaco-editor/react";
import { getLanguageById } from "@/components/editor/editor-config";
import { LanguageSelector } from "@/components/editor/LanguageSelector";
import { useWorkspace } from "@/hooks/useWorkspace";

interface MainWorkspaceProps {
  workspace: ReturnType<typeof useWorkspace>;
  onRun: (code: string, language: string) => void;
  isRunning: boolean;
}

export function MainWorkspace({ workspace, onRun, isRunning }: MainWorkspaceProps) {
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

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-editor relative">
      {/* Editor Tabs */}
      <div className="flex items-center h-10 bg-panel border-b border-panel-border overflow-x-auto shrink-0 scrollbar-hide">
        {openFiles.length === 0 && (
          <div className="px-4 py-2 text-sm text-foreground/40 italic">No files open</div>
        )}
        {openFiles.map(file => {
          const isActive = file.path === activeFilePath;
          const fileIsDirty = file.content !== file.savedContent;
          return (
            <div 
              key={file.path}
              onClick={() => openFile(file.path, file.name)}
              className={`flex items-center gap-2 px-3 py-2 min-w-[120px] max-w-[200px] cursor-pointer border-r border-panel-border transition-colors ${
                isActive ? "bg-editor border-t-2 border-t-accent text-accent" : "bg-panel border-t-2 border-t-transparent hover:bg-white/5 text-foreground/60"
              }`}
              title={file.path}
            >
              <FileCode size={14} className={isActive ? "text-accent" : "text-foreground/50"} />
              <span className="flex-1 text-sm truncate select-none">{file.name}</span>
              
              <div 
                className="flex items-center justify-center w-5 h-5 rounded hover:bg-white/10 text-foreground/50 hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  closeFile(file.path);
                }}
              >
                {fileIsDirty ? (
                  <Circle size={10} fill="currentColor" className="text-foreground/80 hover:hidden" />
                ) : null}
                <X size={14} className={`${fileIsDirty ? 'hidden hover:block' : ''}`} />
              </div>
            </div>
          );
        })}
      </div>

      {activeFile && activeLanguage ? (
        <>
          {/* Editor Toolbar */}
          <div className="flex justify-between items-center px-4 h-10 shrink-0 border-b border-panel-border/30">
            <div className="text-xs text-foreground/50 flex items-center">
              <LanguageSelector 
                activeLangId={activeFile.languageId} 
                onSelect={(langId) => updateActiveLanguage(langId)} 
              />
            </div>
            
            <div className="flex items-center gap-3">
              {isDirty && activeFile.mode !== 'diff' && (
                <button 
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-white/5 hover:bg-white/10 text-foreground transition-colors"
                  title="Save (Cmd+S)"
                >
                  <Save size={14} />
                  <span>Save</span>
                </button>
              )}
              <button 
                onClick={handleRunCode}
                disabled={isRunning}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors shadow-sm ${
                  isRunning 
                    ? "bg-accent/50 text-white/70 cursor-not-allowed" 
                    : "bg-accent hover:bg-accent-hover text-white shadow-accent/20"
                }`}
              >
                {isRunning ? (
                  <>
                    <span className="animate-spin text-xs">⟳</span>
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <Play size={14} fill="currentColor" />
                    <span>Run Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 overflow-hidden relative">
            {activeFile.mode === 'diff' ? (
              <DiffEditor 
                original={activeFile.originalContent || ""}
                modified={activeFile.content}
                language={activeLanguage.monacoLanguage} 
                theme="vs-dark"
                options={{ 
                  readOnly: true, 
                  renderSideBySide: true,
                  minimap: { enabled: false }
                }}
              />
            ) : (
              <CodeEditor 
                value={activeFile.content} 
                onChange={handleCodeChange} 
                language={activeLanguage.monacoLanguage} 
              />
            )}
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-editor">
          <div className="flex flex-col items-center opacity-20 select-none">
            <div className="text-[120px] mb-4">{"{ }"}</div>
            <h2 className="text-2xl font-bold tracking-wider">BOSSgt Studio</h2>
            <p className="mt-2 font-mono">Open a file from the explorer to begin.</p>
          </div>
        </div>
      )}
    </div>
  );
}
