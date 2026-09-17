"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { emitEvent } from "@/lib/events";
import { getAllLanguages, LanguageAdapter } from "@/components/editor/editor-config";
import {
  Command,
  Code2,
  Terminal,
  Globe,
  Play,
  Settings,
  User,
  LogIn,
  LogOut,
  Cpu,
  ShieldCheck,
  Zap,
  FolderTree,
  Activity,
  Layers,
  Search,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Monitor,
  Database
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const { session, user, signOut } = useAuth();
  
  // Real language count from canonical registry
  const allLanguages = useMemo(() => getAllLanguages(), []);
  const languageCount = allLanguages.length;
  
  // Interactive Language Matrix Filter
  const [langSearch, setLangSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  
  // Interactive Terminal Preview State
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "[SYSTEM_INIT] BOSSgt Studio Kernel v2100.4 online",
    "[SANDBOX] Container isolated securely (Linux x86_64)",
    `[REGISTRY] ${languageCount} Canonical languages mounted`,
    "[STATUS] Ready for remote execution"
  ]);
  const [isRunningSim, setIsRunningSim] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<"python" | "rust" | "typescript">("python");

  // Sample code snippets for simulated workspace preview
  const codeSnippets = {
    python: `def main():\n    workspace = "BOSSgt Studio"\n    print(f"[{workspace}] System Ready. Executing 200 languages...")\n\nif __name__ == "__main__":\n    main()`,
    rust: `fn main() {\n    let workspace = "BOSSgt Studio";\n    println!("[{}] System Ready. Executing 200 languages...", workspace);\n}`,
    typescript: `interface Workspace {\n  name: string;\n  status: "ONLINE" | "OFFLINE";\n}\n\nconst studio: Workspace = { name: "BOSSgt Studio", status: "ONLINE" };\nconsole.log(\`[\${studio.name}] State: \${studio.status}\`);`
  };

  const handleSimulateRun = () => {
    if (isRunningSim) return;
    setIsRunningSim(true);
    setTerminalLogs(prev => [...prev, `> Executing ${activeCodeTab.toUpperCase()} process...`]);

    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        `[PROCESS] Output:\n[BOSSgt Studio] System Ready. Executing 200 languages...`,
        `[STATUS] Execution finished with exit code 0 (Time: 42ms, Mem: 8.4MB)`
      ]);
      setIsRunningSim(false);
    }, 600);
  };

  // Filter languages for the interactive matrix
  const filteredLangs = useMemo(() => {
    return allLanguages.filter(l => {
      const matchesSearch = l.name.toLowerCase().includes(langSearch.toLowerCase()) || 
                            l.id.toLowerCase().includes(langSearch.toLowerCase());
      if (selectedCategory === "READY") return matchesSearch && l.executionStatus === "READY";
      if (selectedCategory === "COMPILED") return matchesSearch && l.compileRequired;
      return matchesSearch;
    });
  }, [allLanguages, langSearch, selectedCategory]);

  return (
    <div className="min-h-screen w-full bg-[#07090e] text-zinc-100 font-sans selection:bg-indigo-500/30 selection:text-white relative overflow-x-hidden">
      
      {/* BACKGROUND GRAPHICS & AMBIENT ATMOSPHERE */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
            backgroundSize: '36px 36px'
          }}
        />

        {/* Ambient Spotlights */}
        <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-[35%] -left-[10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[160px]" />
        <div className="absolute top-[60%] -right-[10%] w-[700px] h-[700px] bg-cyan-600/10 rounded-full blur-[160px]" />
      </div>

      {/* TOP APPLICATION SHELL HEADER */}
      <header className="sticky top-0 z-50 w-full bg-[#090d16]/80 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          
          {/* LEFT: BRAND & SYSTEM BADGE */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/10 group-hover:scale-105 transition-transform">
                <Command size={18} />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-wider text-white">BOSSgt Studio</span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30 hidden sm:inline-block">
                  2100.4
                </span>
              </div>
            </Link>

            {/* NAV LINKS */}
            <nav className="hidden md:flex items-center gap-1 font-medium text-xs text-zinc-400">
              <button 
                onClick={() => router.push(session ? "/dashboard" : "/editor")}
                className="px-3 py-1.5 rounded-md hover:text-white hover:bg-white/5 transition-colors"
              >
                Workspace
              </button>
              <a 
                href="#languages-section"
                className="px-3 py-1.5 rounded-md hover:text-white hover:bg-white/5 transition-colors"
              >
                Languages
              </a>
              <a 
                href="#features-section"
                className="px-3 py-1.5 rounded-md hover:text-white hover:bg-white/5 transition-colors"
              >
                Features
              </a>
              <button 
                onClick={() => emitEvent("help:about")}
                className="px-3 py-1.5 rounded-md hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1"
              >
                <BookOpen size={13} /> Documentation
              </button>
              <button 
                onClick={() => emitEvent("help:shortcuts")}
                className="px-3 py-1.5 rounded-md hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1"
              >
                <HelpCircle size={13} /> Shortcuts
              </button>
            </nav>
          </div>

          {/* RIGHT: SYSTEM STATUS & PROFILE / LOGIN */}
          <div className="flex items-center gap-3">
            {/* Status indicator */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>ONLINE</span>
            </div>

            {/* Settings button */}
            <button
              onClick={() => emitEvent("view:toggle-settings")}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              title="Settings"
              aria-label="Toggle Settings"
            >
              <Settings size={16} />
            </button>

            {/* Authentication user pill */}
            {session ? (
              <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-medium text-zinc-200 hover:bg-white/10 transition-colors"
                >
                  <User size={14} className="text-indigo-400" />
                  <span className="max-w-[100px] truncate hidden sm:inline">{user?.email}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
              >
                <LogIn size={14} />
                <span>SIGN IN</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-16 text-center">
        
        {/* HUD Subtitle Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md text-[11px] font-mono text-indigo-300 mb-6 shadow-xl">
          <Sparkles size={13} className="text-indigo-400 animate-pulse" />
          <span>NEXT-GENERATION CLOUD DEVELOPMENT SYSTEM</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 max-w-5xl mx-auto leading-[1.1]">
          BUILD THE SOFTWARE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400">
            OF TOMORROW.
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
          Code, compile, execute and ship across a global multi-language development environment powered by isolated sandboxes and zero setup overhead.
        </p>

        {/* Primary & Secondary Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <button
            onClick={() => router.push(session ? "/dashboard" : "/login")}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-sm transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 group hover:scale-[1.02]"
          >
            <span>OPEN WORKSPACE</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => router.push("/editor")}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/10 text-zinc-200 font-semibold text-sm transition-all flex items-center justify-center gap-2 backdrop-blur-md"
          >
            <Play size={15} className="text-indigo-400" />
            <span>EXPLORE WORKSPACE (ANONYMOUS)</span>
          </button>
        </div>

        {/* REAL-TIME DYNAMIC HUD STATUS BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto mb-16 font-mono text-xs text-left">
          <HudBadge label="SYSTEM STATUS" value="● ONLINE" color="text-emerald-400" />
          <HudBadge label="CLOUD ENGINE" value="READY" color="text-indigo-400" />
          <HudBadge label="CANONICAL LANGS" value={`${languageCount} AVAILABLE`} color="text-cyan-400" />
          <HudBadge label="SECURITY CORE" value="SANDBOX SECURE" color="text-purple-400" />
        </div>

        {/* SIMULATED IDE PREVIEW WORKSPACE */}
        <div className="max-w-5xl mx-auto bg-[#0d121f] border border-white/10 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-xl text-left font-mono">
          
          {/* Simulated IDE Titlebar */}
          <div className="h-10 bg-black/60 border-b border-white/10 px-4 flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-zinc-300 font-medium flex items-center gap-1.5 ml-2">
                <Command size={14} className="text-indigo-400" /> BOSSgt Studio Workspace
              </span>
            </div>

            {/* Language tabs in preview */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
              <button
                onClick={() => setActiveCodeTab("python")}
                className={`px-2.5 py-0.5 rounded text-[11px] transition-colors ${activeCodeTab === "python" ? "bg-indigo-600 text-white" : "hover:text-white"}`}
              >
                main.py
              </button>
              <button
                onClick={() => setActiveCodeTab("rust")}
                className={`px-2.5 py-0.5 rounded text-[11px] transition-colors ${activeCodeTab === "rust" ? "bg-indigo-600 text-white" : "hover:text-white"}`}
              >
                main.rs
              </button>
              <button
                onClick={() => setActiveCodeTab("typescript")}
                className={`px-2.5 py-0.5 rounded text-[11px] transition-colors ${activeCodeTab === "typescript" ? "bg-indigo-600 text-white" : "hover:text-white"}`}
              >
                main.ts
              </button>
            </div>
          </div>

          {/* Main Simulated Split Area */}
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[320px]">
            
            {/* Sidebar / Files */}
            <div className="hidden md:block md:col-span-3 bg-black/40 border-r border-white/10 p-3 text-xs text-zinc-400">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <FolderTree size={13} /> Project Files
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 font-medium">
                  <Code2 size={13} />
                  <span>{activeCodeTab === "python" ? "main.py" : activeCodeTab === "rust" ? "main.rs" : "main.ts"}</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/5 text-zinc-400">
                  <Code2 size={13} />
                  <span>app.config.json</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/5 text-zinc-400">
                  <Database size={13} />
                  <span>schema.sql</span>
                </div>
              </div>
            </div>

            {/* Code Editor Body */}
            <div className="md:col-span-9 p-4 bg-[#090d16]/90 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5 text-xs text-zinc-500">
                  <span>// Editable workspace preview</span>
                  <button
                    onClick={handleSimulateRun}
                    disabled={isRunningSim}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    <Play size={12} className="fill-current" />
                    <span>{isRunningSim ? "Running..." : "Run Preview"}</span>
                  </button>
                </div>
                <pre className="text-xs text-indigo-200 leading-relaxed overflow-x-auto">
                  <code>{codeSnippets[activeCodeTab]}</code>
                </pre>
              </div>

              {/* Simulated Terminal Footer */}
              <div className="mt-4 pt-3 border-t border-white/10 bg-black/60 p-3 rounded-xl border border-white/5">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Terminal size={12} className="text-emerald-400" /> TERMINAL OUTPUT
                  </span>
                  <span className="text-[9px] text-zinc-600">ISOLATED SANDBOX</span>
                </div>
                <div className="text-[11px] text-zinc-300 space-y-0.5 max-h-24 overflow-y-auto font-mono">
                  {terminalLogs.map((log, idx) => (
                    <div key={idx} className={log.startsWith(">") ? "text-indigo-400 font-semibold" : log.includes("STATUS") ? "text-emerald-400" : ""}>
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* IDE Footer Bar */}
          <div className="h-8 bg-indigo-950/40 border-t border-white/10 px-4 flex items-center justify-between text-[11px] text-zinc-400">
            <div className="flex items-center gap-3">
              <span className="text-emerald-400 font-semibold">● READY</span>
              <span>LANG: {activeCodeTab.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>CPU: 0.2%</span>
              <span>MEM: 12MB</span>
              <span>PORT: 3000</span>
            </div>
          </div>
        </div>
      </section>

      {/* CANONICAL LANGUAGE MATRIX SHOWCASE */}
      <section id="languages-section" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider mb-2">01 / LANGUAGE ENGINE</div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            {languageCount} Canonical Runtimes Built In
          </h2>
          <p className="text-sm text-zinc-400 mt-2">
            Every language is mapped to canonical execution adapters. Click any language to launch it in the workspace.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto mb-8">
          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search 200 languages..."
              value={langSearch}
              onChange={(e) => setLangSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-black/40 border border-white/10 rounded-xl text-xs font-medium">
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`px-3 py-1 rounded-lg transition-colors ${selectedCategory === "ALL" ? "bg-indigo-600 text-white" : "text-zinc-400 hover:text-white"}`}
            >
              All ({allLanguages.length})
            </button>
            <button
              onClick={() => setSelectedCategory("READY")}
              className={`px-3 py-1 rounded-lg transition-colors ${selectedCategory === "READY" ? "bg-indigo-600 text-white" : "text-zinc-400 hover:text-white"}`}
            >
              Instant Ready
            </button>
            <button
              onClick={() => setSelectedCategory("COMPILED")}
              className={`px-3 py-1 rounded-lg transition-colors ${selectedCategory === "COMPILED" ? "bg-indigo-600 text-white" : "text-zinc-400 hover:text-white"}`}
            >
              Compiled
            </button>
          </div>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-w-6xl mx-auto">
          {filteredLangs.slice(0, 36).map((lang) => (
            <button
              key={lang.id}
              onClick={() => router.push(`/editor?lang=${lang.id}`)}
              className="group p-3 rounded-xl bg-white/[0.02] border border-white/[0.07] hover:bg-white/[0.06] hover:border-indigo-500/50 transition-all text-left flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-xs text-white group-hover:text-indigo-300 transition-colors">
                  {lang.name}
                </span>
                <span className="text-[10px] font-mono text-zinc-500 group-hover:text-zinc-400">
                  {lang.extension}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                <span className={lang.executionStatus === "READY" ? "text-emerald-400" : "text-zinc-400"}>
                  {lang.executionStatus === "READY" ? "● Ready" : "Adapter"}
                </span>
                <ExternalLink size={11} className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ADVANCED FEATURE MODULE CARDS */}
      <section id="features-section" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider mb-2">02 / ARCHITECTURE</div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Built for High-Performance Cloud Execution
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <SystemModuleCard
            id="01"
            icon={<Code2 className="text-indigo-400" size={20} />}
            title="MULTI-LANGUAGE ENGINE"
            description="One workspace supporting 200 distinct programming languages with canonical compiler and execution adapters."
            onClick={() => router.push("/editor")}
          />
          <SystemModuleCard
            id="02"
            icon={<Globe className="text-purple-400" size={20} />}
            title="CLOUD WORKSPACE"
            description="Persistent cloud projects powered by Supabase and local fallback sync for seamless offline-to-cloud coding."
            onClick={() => router.push(session ? "/dashboard" : "/login")}
          />
          <SystemModuleCard
            id="03"
            icon={<Cpu className="text-cyan-400" size={20} />}
            title="EXECUTION CORE"
            description="Isolated container environment providing execution limits, STDIN capabilities, memory profiling, and exact exit code reporting."
            onClick={() => router.push("/editor")}
          />
          <SystemModuleCard
            id="04"
            icon={<Terminal className="text-emerald-400" size={20} />}
            title="INTELLIGENT TERMINAL"
            description="Interactive web terminal with resize support, output capture, clear logs, and instant process lifecycle control."
            onClick={() => router.push("/editor")}
          />
          <SystemModuleCard
            id="05"
            icon={<FolderTree className="text-amber-400" size={20} />}
            title="PROJECT SYSTEM"
            description="Hierarchical file tree management with create, rename, delete, tab state management, and file extension mapping."
            onClick={() => router.push("/editor")}
          />
          <SystemModuleCard
            id="06"
            icon={<Activity className="text-rose-400" size={20} />}
            title="DEVELOPER OBSERVABILITY"
            description="Real-time execution status, compilation diagnostics, syntax highlighting, and status bar metrics."
            onClick={() => router.push("/editor")}
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
        <div className="flex items-center gap-2">
          <Command size={16} className="text-indigo-400" />
          <span className="font-semibold text-zinc-300">BOSSgt Studio</span>
          <span>© 2026. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6 font-mono text-[11px]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400" /> SANDBOX SECURE
          </span>
          <span className="flex items-center gap-1.5">
            <Zap size={14} className="text-indigo-400" /> 200 RUNTIMES READY
          </span>
        </div>
      </footer>
    </div>
  );
}

function HudBadge({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-md">
      <div className="text-[10px] text-zinc-500 mb-1">{label}</div>
      <div className={`font-semibold ${color}`}>{value}</div>
    </div>
  );
}

function SystemModuleCard({
  id,
  icon,
  title,
  description,
  onClick
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <div 
      onClick={onClick}
      className="group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.05] hover:border-indigo-500/40 transition-all cursor-pointer flex flex-col justify-between shadow-xl backdrop-blur-md"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center">
            {icon}
          </div>
          <span className="font-mono text-xs text-zinc-600 group-hover:text-indigo-400 transition-colors">
            {id}
          </span>
        </div>
        <h3 className="text-sm font-bold text-white tracking-wide mb-2 group-hover:text-indigo-300 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed font-normal">
          {description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors">
        <span>Launch Module</span>
        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}
