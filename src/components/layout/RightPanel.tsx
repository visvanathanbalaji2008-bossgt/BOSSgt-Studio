import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import { X, Maximize2, Minus, Trash2, RefreshCw } from "lucide-react";
import { ExecutionResult } from "@/app/page";

interface RightPanelProps {
  executionResult: ExecutionResult | null;
  isRunning: boolean;
}

interface TerminalHistoryEntry {
  id: string;
  command: string;
  cwd: string;
  stdout: string;
  stderr: string;
  exitCode: number;
}

export function RightPanel({ executionResult, isRunning }: RightPanelProps) {
  const [activeTab, setActiveTab] = useState("terminal");
  const tabs = ["Output", "Problems", "Terminal"];

  // Terminal State
  const [terminalHistory, setTerminalHistory] = useState<TerminalHistoryEntry[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [cwd, setCwd] = useState<string>("~/project"); // Default display until resolved
  const [isTerminalRunning, setIsTerminalRunning] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Initialize terminal CWD on mount
  useEffect(() => {
    const initTerminal = async () => {
      try {
        const res = await fetch("/api/terminal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ command: "pwd", cwd: "" })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.newCwd) {
            setCwd(data.newCwd);
          }
        }
      } catch (_) {
        // Silently fail
      }
    };
    initTerminal();
  }, []);

  // Auto-scroll terminal
  useEffect(() => {
    if (activeTab === "terminal") {
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalHistory, activeTab]);

  const handleTerminalSubmit = async () => {
    if (!inputValue.trim()) return;

    const command = inputValue;
    setInputValue("");
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);
    setIsTerminalRunning(true);

    // Optimistic UI entry
    const entryId = Date.now().toString();

    try {
      const response = await fetch("/api/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command, cwd })
      });
      const data = await response.json();

      if (data.newCwd && data.newCwd !== cwd) {
        setCwd(data.newCwd);
      }

      setTerminalHistory(prev => [...prev, {
        id: entryId,
        command,
        cwd,
        stdout: data.stdout || "",
        stderr: data.stderr || "",
        exitCode: data.exitCode || 0
      }]);
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Unknown error";
      setTerminalHistory(prev => [...prev, {
        id: entryId,
        command,
        cwd,
        stdout: "",
        stderr: "Failed to execute command: " + errMessage,
        exitCode: 1
      }]);
    } finally {
      setIsTerminalRunning(false);
    }
  };

  const handleTerminalKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleTerminalSubmit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputValue("");
      }
    }
  };

  const clearTerminal = () => {
    setTerminalHistory([]);
  };

  const restartSession = () => {
    setTerminalHistory([]);
    setCommandHistory([]);
    setHistoryIndex(-1);
    // Fetch initial cwd again
    fetch("/api/terminal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: "pwd", cwd: "" })
    }).then(res => res.json()).then(data => {
      if (data.newCwd) setCwd(data.newCwd);
    }).catch(() => {});
  };

  // Format cwd for display (replace home dir with ~ if possible)
  const displayCwd = cwd.split('/').pop() || cwd;

  return (
    <div className="w-80 lg:w-[400px] xl:w-[500px] border-l border-panel-border bg-panel flex flex-col shrink-0">
      {/* Panel Header */}
      <div className="flex items-center justify-between h-10 px-2 border-b border-panel-border shrink-0">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-3 py-1 text-xs font-medium uppercase tracking-wider rounded transition-colors ${
                activeTab === tab.toLowerCase()
                  ? "text-foreground bg-white/10"
                  : "text-foreground/50 hover:text-foreground/80 hover:bg-white/5"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 text-foreground/50 pr-2">
          {activeTab === "terminal" && (
            <>
              <button onClick={clearTerminal} className="p-1 hover:text-foreground hover:bg-white/10 rounded" title="Clear Terminal"><Trash2 size={14} /></button>
              <button onClick={restartSession} className="p-1 hover:text-foreground hover:bg-white/10 rounded" title="Restart Session"><RefreshCw size={14} /></button>
              <div className="w-px h-4 bg-panel-border mx-1"></div>
            </>
          )}
          <button className="p-1 hover:text-foreground hover:bg-white/10 rounded"><Maximize2 size={14} /></button>
          <button className="p-1 hover:text-foreground hover:bg-white/10 rounded"><Minus size={14} /></button>
          <button className="p-1 hover:text-foreground hover:bg-white/10 rounded"><X size={14} /></button>
        </div>
      </div>

      {/* Panel Content */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-sm relative">
        {activeTab === "output" && (
          <div className="text-foreground/80 flex flex-col min-h-full">
            <div className="text-accent mb-4">[{new Date().toLocaleTimeString()}] Output Console</div>
            
            {isRunning ? (
              <div className="flex items-center gap-2 text-foreground/50 italic animate-pulse">
                <span className="animate-spin">⟳</span> Executing code...
              </div>
            ) : executionResult ? (
              <div className="flex flex-col gap-6 flex-1">
                <div>
                  <h3 className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1">Status</h3>
                  {executionResult.exitCode === 0 ? (
                    <div className="text-green-400 font-medium flex items-center gap-1">✓ Completed</div>
                  ) : (
                    <div className="text-red-400 font-medium flex items-center gap-1">✕ Failed</div>
                  )}
                </div>

                {executionResult.stdout && (
                  <div>
                    <h3 className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1">Output</h3>
                    <pre className="text-foreground/90 whitespace-pre-wrap">{executionResult.stdout}</pre>
                  </div>
                )}

                {executionResult.stderr && (
                  <div>
                    <h3 className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1">Error</h3>
                    <pre className="text-red-400/90 whitespace-pre-wrap">{executionResult.stderr}</pre>
                  </div>
                )}

                <div className="flex items-center gap-8 pt-4 border-t border-panel-border/30 mt-auto">
                  <div>
                    <h3 className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1">Exit Code</h3>
                    <div className="text-foreground/70">{executionResult.exitCode}</div>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1">Time</h3>
                    <div className="text-foreground/70">{executionResult.timeMs} ms</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-foreground/40 italic mt-8 text-xs border border-dashed border-panel-border p-4 rounded bg-white/5">
                Ready to execute code. Click &quot;Run Code&quot; in the editor toolbar.
              </div>
            )}
          </div>
        )}
        
        {activeTab === "problems" && (
          <div className="flex flex-col items-center justify-center h-full text-foreground/40 text-sm">
            <span>No problems have been detected in the workspace.</span>
          </div>
        )}

        {activeTab === "terminal" && (
          <div className="flex flex-col min-h-full font-mono text-[13px] leading-relaxed">
            {terminalHistory.map((entry) => (
              <div key={entry.id} className="mb-3">
                <div className="flex gap-2 text-foreground/90">
                  <span className="text-green-400 font-medium whitespace-nowrap">bossgt@studio</span>
                  <span className="text-blue-400 font-medium whitespace-nowrap">{entry.cwd.split('/').pop() || entry.cwd}</span>
                  <span className="text-foreground/50">$</span>
                  <span className="break-all">{entry.command}</span>
                </div>
                {entry.stdout && (
                  <pre className="text-foreground/80 mt-1 whitespace-pre-wrap break-words">{entry.stdout}</pre>
                )}
                {entry.stderr && (
                  <pre className="text-red-400/90 mt-1 whitespace-pre-wrap break-words">{entry.stderr}</pre>
                )}
                {entry.exitCode !== 0 && !entry.stderr && (
                  <div className="text-red-400 mt-1 text-xs">[Process exited with code {entry.exitCode}]</div>
                )}
              </div>
            ))}
            
            <div className="flex gap-2 text-foreground/90 mt-1 items-center">
              <span className="text-green-400 font-medium whitespace-nowrap">bossgt@studio</span>
              <span className="text-blue-400 font-medium whitespace-nowrap">{displayCwd}</span>
              <span className="text-foreground/50">$</span>
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleTerminalKeyDown}
                disabled={isTerminalRunning}
                className="flex-1 bg-transparent outline-none border-none text-foreground w-full focus:ring-0 p-0 m-0 min-w-0"
                autoFocus
                autoComplete="off"
                spellCheck="false"
              />
            </div>
            <div ref={terminalEndRef} className="h-4"></div>
          </div>
        )}
      </div>
    </div>
  );
}
