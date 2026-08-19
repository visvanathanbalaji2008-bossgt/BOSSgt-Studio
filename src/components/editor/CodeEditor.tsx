"use client";

import React, { useMemo, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Check, Columns, ChevronsRight } from "lucide-react";
import type { editor } from "monaco-editor";
import { useSettings } from "@/hooks/useSettings";

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language: string;
}

// Detect conflict markers
const conflictRegex = /<<<<<<< HEAD\n([\s\S]*?)\n=======\n([\s\S]*?)\n>>>>>>> [^\n]*/;

export function CodeEditor({
  value,
  onChange,
  language
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const { settings } = useSettings();

  useEffect(() => {
    const handleGoToLine = (e: Event) => {
      const customEvent = e as CustomEvent<{ file: string, line: number }>;
      if (editorRef.current) {
        editorRef.current.revealLineInCenter(customEvent.detail.line);
        editorRef.current.setPosition({ lineNumber: customEvent.detail.line, column: 1 });
        editorRef.current.focus();
      }
    };

    window.addEventListener('editor-goto-line', handleGoToLine);
    return () => window.removeEventListener('editor-goto-line', handleGoToLine);
  }, []);

  const hasConflict = useMemo(() => conflictRegex.test(value), [value]);

  const resolveConflict = (strategy: "current" | "incoming" | "both") => {
    const match = value.match(conflictRegex);
    if (!match) return;

    const [fullMatch, current, incoming] = match;
    let replacement = "";
    if (strategy === "current") replacement = current;
    if (strategy === "incoming") replacement = incoming;
    if (strategy === "both") replacement = `${current}\n${incoming}`;

    const newValue = value.replace(fullMatch, replacement);
    onChange(newValue);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {hasConflict && (
        <div className="flex items-center gap-4 bg-red-900/20 px-4 py-2 border-b border-red-900/50">
          <span className="text-red-400 text-sm font-semibold flex-1">Merge Conflict Detected (Resolving first occurrence)</span>
          <button onClick={() => resolveConflict("current")} className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-xs text-foreground/80 transition-colors">
            <Check size={14} /> Accept Current
          </button>
          <button onClick={() => resolveConflict("incoming")} className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-xs text-foreground/80 transition-colors">
            <Columns size={14} /> Accept Incoming
          </button>
          <button onClick={() => resolveConflict("both")} className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-xs text-foreground/80 transition-colors">
            <ChevronsRight size={14} /> Accept Both
          </button>
        </div>
      )}
      <div className="flex-1 w-full relative">
      <Editor
        height="100%"
        width="100%"
        language={language}
        theme={settings.editor.theme}
        value={value}
        onChange={onChange}
        onMount={(editor) => {
          editorRef.current = editor;
        }}
        options={{
          minimap: { enabled: settings.editor.minimap },
          fontSize: settings.editor.fontSize,
          fontFamily: "var(--font-mono), monospace",
          lineNumbers: settings.editor.lineNumbers,
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: false,
          cursorStyle: "line",
          automaticLayout: true,
          wordWrap: settings.editor.wordWrap,
          tabSize: settings.editor.tabSize,
          autoClosingBrackets: settings.editor.autoClosingBrackets,
          bracketPairColorization: { enabled: true },
          formatOnPaste: true,
          formatOnType: true,
        }}
        loading={
          <div className="flex h-full items-center justify-center text-foreground/50 text-sm">
            Loading Editor...
          </div>
        }
      />
      </div>
    </div>
  );
}
