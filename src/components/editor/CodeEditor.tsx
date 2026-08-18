"use client";

import React from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language: string;
  theme?: string;
}

export function CodeEditor({ 
  value, 
  onChange, 
  language,
  theme = "vs-dark"
}: CodeEditorProps) {
  
  // Future configurations can be handled here if needed

  return (
    <div className="w-full h-full">
      <Editor
        height="100%"
        width="100%"
        language={language}
        theme={theme}
        value={value}
        onChange={onChange}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          fontFamily: "var(--font-mono), monospace",
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: false,
          cursorStyle: "line",
          automaticLayout: true,
          wordWrap: "on",
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
  );
}
