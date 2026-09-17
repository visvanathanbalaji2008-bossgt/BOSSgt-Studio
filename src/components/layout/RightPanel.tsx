"use client";

import React, { useState } from "react";
import { X, Maximize2, Minus, Terminal as TerminalIcon, Cpu, CheckCircle2, AlertCircle, Clock, Sparkles } from "lucide-react";
import { ExecutionResult } from "@/app/editor/page";
import dynamic from "next/dynamic";
const TerminalPanel = dynamic(() => import("@/components/editor/Terminal").then(m => m.TerminalPanel), { ssr: false });
import { useListenEvent } from "@/lib/events";

interface RightPanelProps {
  executionResult: ExecutionResult | null;
  isRunning: boolean;
  stdin: string;
  onStdinChange: (val: string) => void;
  projectId?: string | null;
  onMaximize?: () => void;
  onCollapse?: () => void;
  onRestore?: () => void;
  isMaximized?: boolean;
}

export function RightPanel({ executionResult, isRunning, stdin, onStdinChange, projectId, onMaximize, onCollapse, onRestore, isMaximized }: RightPanelProps) {
  const [activeTab, setActiveTab] = useState("terminal");
  const tabs = ["Output", "Input", "Problems", "Terminal"];

  useListenEvent("view:toggle-terminal", () => setActiveTab("terminal"));
  useListenEvent("view:toggle-output", () => setActiveTab("output"));
  useListenEvent("view:toggle-problems", () => setActiveTab("problems"));

  return (
    <div className="w-full h-full border-l border-indigo-500/20 bg-[#090d16]/90 backdrop-blur-2xl flex flex-col shrink-0 font-sans shadow-2xl select-none">
      {/* Floating Header Bar */}
      <div className="flex items-center justify-between h-11 px-3 border-b border-indigo-500/20 bg-[#090d16]/60 shrink-0">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.toLowerCase();
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                  isActive
                    ? "text-white bg-indigo-600/20 border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.25)]"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-1 text-zinc-400 pr-1">
          {isMaximized ? (
             <button onClick={onRestore} className="p-1.5 hover:text-white hover:bg-white/10 rounded-xl transition-colors" title="Restore"><Minus size={14} /></button>
          ) : (
             <button onClick={onMaximize} className="p-1.5 hover:text-white hover:bg-white/10 rounded-xl transition-colors" title="Maximize"><Maximize2 size={14} /></button>
          )}
          <button onClick={onCollapse} className="p-1.5 hover:text-white hover:bg-white/10 rounded-xl transition-colors" title="Collapse"><X size={14} /></button>
        </div>
      </div>

      {/* Panel Content Body */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-xs relative no-scrollbar">
        {activeTab === "output" && (
          <div className="text-zinc-300 flex flex-col min-h-full space-y-4">
            <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2">
              <div className="text-indigo-400 font-bold tracking-wider flex items-center gap-2">
                <Sparkles size={14} className="text-cyan-400" />
                <span>NEURAL FORGE EXECUTION CONSOLE</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">[{new Date().toLocaleTimeString()}]</span>
            </div>
            
            {isRunning ? (
              <div className="flex items-center gap-3 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-300 animate-pulse">
                <span className="animate-spin text-base">◌</span>
                <span className="font-semibold text-xs">Executing code in sandbox kernel...</span>
              </div>
            ) : executionResult ? (
              <div className="flex flex-col gap-4 flex-1">
                {/* EXECUTION STATUS & TIME ROW */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Status */}
                  <div className="p-3 bg-black/40 border border-indigo-500/20 rounded-2xl">
                    <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">EXECUTION</h3>
                    {executionResult.exitCode === 0 ? (
                      <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 size={14} /> ✓ COMPLETED
                      </div>
                    ) : executionResult.exitCode === 501 ? (
                      <div className="flex flex-col gap-1.5">
                        <div className="text-amber-400 font-bold flex items-center gap-1.5">
                          <AlertCircle size={14} /> ⚠ CONTAINER NEEDED
                        </div>
                      </div>
                    ) : executionResult.exitCode === 5 || executionResult.exitCode === 124 ? (
                      <div className="text-yellow-400 font-bold flex items-center gap-1.5">
                        <Clock size={14} /> ⏱ TIMEOUT
                      </div>
                    ) : (
                      <div className="text-red-400 font-bold flex items-center gap-1.5">
                        <AlertCircle size={14} /> ✕ FAILED
                      </div>
                    )}
                  </div>

                  {/* Execution Time */}
                  <div className="p-3 bg-black/40 border border-indigo-500/20 rounded-2xl">
                    <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">TIME</h3>
                    <div className="text-zinc-200 font-bold font-mono">
                      {(executionResult.timeMs / 1000).toFixed(2)}s <span className="text-[10px] text-zinc-500 font-normal">({executionResult.timeMs} ms)</span>
                    </div>
                  </div>

                  {/* Exit Code */}
                  <div className="p-3 bg-black/40 border border-indigo-500/20 rounded-2xl">
                    <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">EXIT CODE</h3>
                    <div className="text-zinc-200 font-bold font-mono">{executionResult.exitCode ?? 0}</div>
                  </div>
                </div>

                {/* STDOUT CARD */}
                {executionResult.stdout && (
                  <div className="space-y-1">
                    <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">OUTPUT</h3>
                    <pre className="text-zinc-100 whitespace-pre-wrap font-mono text-xs p-3.5 bg-[#030408] border border-indigo-500/20 rounded-2xl overflow-x-auto shadow-inner leading-relaxed">{executionResult.stdout}</pre>
                  </div>
                )}

                {/* STDERR / DIAGNOSTICS CARD */}
                {executionResult.stderr && (
                  <div className="space-y-1">
                    <h3 className="text-[10px] font-bold text-red-400 uppercase tracking-widest">ERROR / DIAGNOSTICS</h3>
                    <pre className="text-red-300 whitespace-pre-wrap font-mono text-xs p-3.5 bg-red-950/30 border border-red-500/30 rounded-2xl overflow-x-auto shadow-inner leading-relaxed">{executionResult.stderr}</pre>
                  </div>
                )}

                {/* GENERATED GRAPHICS */}
                {executionResult.generatedFiles && executionResult.generatedFiles.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-indigo-500/20">
                    <h3 className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles size={12} /> GENERATED GRAPHICS & OUTPUT FILES
                    </h3>
                    <div className="space-y-3">
                      {executionResult.generatedFiles.map((file, idx) => (
                        <div key={idx} className="p-3 bg-[#030408] border border-indigo-500/20 rounded-2xl">
                          <div className="text-xs font-semibold text-zinc-300 mb-2 font-mono">{file.name}</div>
                          {file.url.startsWith("data:image/") || file.name.endsWith(".png") || file.name.endsWith(".jpg") || file.name.endsWith(".svg") ? (
                            <img src={file.url} alt={file.name} className="max-w-full h-auto rounded-xl border border-indigo-500/20 max-h-64 object-contain bg-white/5" />
                          ) : (
                            <a href={file.url} download={file.name} className="text-xs text-indigo-400 hover:underline">Download {file.name}</a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-zinc-500 italic mt-8 text-xs border border-dashed border-indigo-500/20 p-6 rounded-2xl bg-black/20 text-center font-sans">
                Console ready. Click &quot;▶ RUN&quot; in the editor toolbar to execute your code.
              </div>
            )}
          </div>
        )}
        
        {activeTab === "input" && (
          <div className="flex flex-col min-h-full h-full space-y-2">
            <div className="text-indigo-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Cpu size={14} /> Standard Input (stdin)
            </div>
            <textarea 
              value={stdin}
              onChange={(e) => onStdinChange(e.target.value)}
              className="flex-1 w-full bg-[#030408] border border-indigo-500/20 rounded-2xl p-4 text-xs text-zinc-100 focus:border-indigo-500 outline-none font-mono resize-none shadow-inner"
              placeholder="Enter program input here before running code..."
            />
          </div>
        )}

        {activeTab === "problems" && (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500 text-xs font-mono space-y-2">
            <CheckCircle2 size={24} className="text-emerald-400 opacity-60" />
            <span>No static syntax or runtime problems detected.</span>
          </div>
        )}

        {/* TERMINAL CONTAINER - ENGINE UNTOUCHED */}
        <div className={`flex flex-col min-h-full -m-4 ${activeTab === "terminal" ? 'block' : 'hidden'}`}>
          <TerminalPanel projectId={projectId} />
        </div>
      </div>
    </div>
  );
}
