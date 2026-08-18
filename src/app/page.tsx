"use client";

import React, { useState } from "react";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { MainWorkspace } from "@/components/layout/MainWorkspace";
import { RightPanel } from "@/components/layout/RightPanel";
import { StatusBar } from "@/components/layout/StatusBar";
import { DEFAULT_LANGUAGE, getLanguageById } from "@/components/editor/editor-config";
import { useWorkspace } from "@/hooks/useWorkspace";

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timeMs: number;
}

export default function Home() {
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const workspace = useWorkspace();
  const activeFile = workspace.openFiles.find(f => f.path === workspace.activeFilePath);
  const activeLangId = activeFile ? activeFile.languageId : DEFAULT_LANGUAGE;

  const handleRunCode = async (code: string, language: string) => {
    const langConfig = getLanguageById(language);
    
    if (!langConfig.executionSupported) {
      setExecutionResult({
        stdout: `${langConfig.name} execution is coming soon.`,
        stderr: "",
        exitCode: 0,
        timeMs: 0
      });
      return;
    }

    setIsRunning(true);
    setExecutionResult(null);
    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language })
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
      const errMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setExecutionResult({
        stdout: "",
        stderr: "Failed to connect to execution server.\n" + errMessage,
        exitCode: 1,
        timeMs: 0
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-background">
      {/* Top Navigation Bar */}
      <TopNavigation />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar (Activity Bar + Explorer) */}
        <Sidebar workspace={workspace} />

        {/* Editor Area */}
        <MainWorkspace 
          workspace={workspace}
          onRun={handleRunCode} 
          isRunning={isRunning} 
        />

        {/* Right Panel (Output/Terminal/Problems) */}
        <RightPanel executionResult={executionResult} isRunning={isRunning} />
      </div>

      {/* Footer Status Bar */}
      <StatusBar activeLangId={activeLangId} />
    </div>
  );
}
