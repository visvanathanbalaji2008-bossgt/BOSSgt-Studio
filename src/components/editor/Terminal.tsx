"use client";

import React, { useEffect, useRef, useState } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { Maximize2, Minimize2, Trash2 } from "lucide-react";
import { useListenEvent, emitEvent } from "@/lib/events";

// Global guard for xterm.js Viewport._innerRefresh to prevent 'reading dimensions of undefined' crashes
if (typeof window !== "undefined") {
  try {
    const proto = XTerm.prototype as any;
    if (proto && !proto.__viewportPatched) {
      proto.__viewportPatched = true;
      const origOpen = proto.open;
      if (origOpen) {
        proto.open = function (parent: HTMLElement) {
          try {
            origOpen.call(this, parent);
            const core = (this as any)._core;
            if (core) {
              // Guard viewport _innerRefresh
              if (core._viewport) {
                const origRefresh = core._viewport._innerRefresh;
                if (origRefresh && !origRefresh.__guarded) {
                  core._viewport._innerRefresh = function (...args: any[]) {
                    try {
                      return origRefresh.apply(this, args);
                    } catch (e) {
                      // Ignore transient uninitialized dimensions errors during viewport scroll/refresh
                    }
                  };
                  core._viewport._innerRefresh.__guarded = true;
                }
              }
              // Guard renderService dimensions access if needed
              if (core._renderService) {
                const origRender = core._renderService.renderRows;
                if (origRender && !origRender.__guarded) {
                  core._renderService.renderRows = function (...args: any[]) {
                    try {
                      return origRender.apply(this, args);
                    } catch (e) {
                      // Ignore transient render errors
                    }
                  };
                  core._renderService.renderRows.__guarded = true;
                }
              }
            }
          } catch (err) {
            console.warn("XTerm open call safely guarded:", err);
          }
        };
      }
    }
  } catch (e) {}
}

export function TerminalPanel({ projectId }: { projectId?: string | null }) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const terminalIdRef = useRef<string>(Math.random().toString(36).substring(7));

  useEffect(() => {
    if (!terminalRef.current) return;

    let isDisposed = false;
    let terminalOpened = false;
    let animFrameId: number | null = null;
    let interval: NodeJS.Timeout | null = null;
    let resizeObserver: ResizeObserver | null = null;

    const term = new XTerm({
      cursorBlink: true,
      theme: {
        background: "#1e1e1e",
        foreground: "#cccccc",
        cursor: "#ffffff",
      },
      fontFamily: "var(--font-mono), monospace",
      fontSize: 12,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    const termId = terminalIdRef.current;
    const resolvedProjectId = projectId || new URLSearchParams(window.location.search).get('projectId');

    const handleResize = () => {
      if (isDisposed || !terminalOpened) return;
      const host = terminalRef.current;
      if (
        host &&
        host.isConnected &&
        host.clientWidth > 0 &&
        host.clientHeight > 0 &&
        fitAddonRef.current
      ) {
        try {
          fitAddonRef.current.fit();
          if (xtermRef.current) {
            fetch('/api/terminal', { 
              method: 'POST', 
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: 'resize', terminalId: termId, cols: xtermRef.current.cols, rows: xtermRef.current.rows }) 
            }).catch(() => {});
          }
        } catch (e) {
          // Ignored safely if hidden or in transition
        }
      }
    };

    const openTerminalWhenReady = () => {
      if (isDisposed) return;
      const host = terminalRef.current;
      if (!host || !host.isConnected) {
        animFrameId = requestAnimationFrame(openTerminalWhenReady);
        return;
      }

      if (host.clientWidth <= 0 || host.clientHeight <= 0) {
        animFrameId = requestAnimationFrame(openTerminalWhenReady);
        return;
      }

      if (terminalOpened) return;
      terminalOpened = true;

      try {
        term.open(host);
        xtermRef.current = term;
        fitAddonRef.current = fitAddon;

        term.writeln("\x1b[1;34mBOSSgt Cloud Terminal (Initializing...)\x1b[0m");

        // Start terminal backend
        fetch('/api/terminal', {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: 'start', terminalId: termId, projectId: resolvedProjectId, cols: term.cols, rows: term.rows })
        }).then(() => {
          if (!isDisposed && term) {
            term.writeln("\x1b[1;32mConnected.\x1b[0m\r\n");
          }
        }).catch(() => {
          if (!isDisposed && term) {
            term.writeln("\x1b[1;31mConnection failed.\x1b[0m\r\n");
          }
        });

        // Fit after opening
        animFrameId = requestAnimationFrame(() => {
          if (isDisposed || !host.isConnected) return;
          try {
            if (host.clientWidth > 0 && host.clientHeight > 0) {
              fitAddon.fit();
            }
          } catch (err) {}
        });

        // Setup resize observer
        resizeObserver = new ResizeObserver(() => {
          handleResize();
        });
        resizeObserver.observe(host);

        // Poll for output
        interval = setInterval(async () => {
          if (isDisposed) return;
          try {
             const res = await fetch('/api/terminal', { 
               method: 'POST', 
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ action: 'poll', terminalId: termId }) 
             });
             const data = await res.json();
             if (data.output && xtermRef.current && !isDisposed) {
               xtermRef.current.write(data.output);
             }
          } catch (e) {}
        }, 200);

        // Send input
        term.onData(data => {
          if (isDisposed) return;
          fetch('/api/terminal', { 
            method: 'POST', 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: 'input', terminalId: termId, data }) 
          }).catch(() => {});
        });

      } catch (e) {
        console.error("Terminal initialization error:", e);
      }
    };

    openTerminalWhenReady();
    window.addEventListener("resize", handleResize);

    return () => {
      isDisposed = true;
      terminalOpened = false;
      if (animFrameId !== null) cancelAnimationFrame(animFrameId);
      if (interval) clearInterval(interval);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);

      if (xtermRef.current) {
        try { xtermRef.current.dispose(); } catch (e) {}
        xtermRef.current = null;
      }
      fitAddonRef.current = null;
    };
  }, [projectId]);

  const handleClear = () => {
    if (xtermRef.current) {
      xtermRef.current.clear();
    }
  };

  useListenEvent("terminal:clear", handleClear);
  
  useListenEvent("terminal:kill", () => {
    fetch('/api/terminal', { 
      method: 'POST', 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: 'kill', terminalId: terminalIdRef.current }) 
    }).then(() => {
       if (xtermRef.current) {
         xtermRef.current.writeln("\r\n\x1b[1;31mTerminal Killed.\x1b[0m\r\n");
       }
    });
  });

  useListenEvent("terminal:open", () => emitEvent("view:toggle-terminal"));
  useListenEvent("terminal:new", () => {
    // Basic reload for now to get a new instance, or we could handle multiple terminals
    handleClear();
    emitEvent("view:toggle-terminal");
  });

  return (
    <div className={`flex flex-col h-full bg-panel border-t border-panel-border transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 h-screen w-screen' : ''}`}>
      <div className="flex items-center justify-between px-4 py-1.5 bg-background border-b border-panel-border shrink-0">
        <span className="text-xs font-semibold uppercase tracking-wider text-foreground/70">Terminal</span>
        <div className="flex items-center gap-1">
          <button onClick={handleClear} className="p-1 hover:bg-foreground/10 rounded text-foreground/50 transition-colors" title="Clear Terminal">
            <Trash2 size={14} />
          </button>
          <button onClick={() => { setIsFullscreen(!isFullscreen); setTimeout(() => fitAddonRef.current?.fit(), 50); }} className="p-1 hover:bg-foreground/10 rounded text-foreground/50 transition-colors" title={isFullscreen ? "Minimize" : "Maximize"}>
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden p-2" ref={terminalRef} />
    </div>
  );
}
