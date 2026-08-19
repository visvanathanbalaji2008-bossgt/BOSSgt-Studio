export type ExecutionStatus = "READY" | "COMPILER_REQUIRED" | "RUNTIME_REQUIRED" | "UNSUPPORTED";

export interface LanguageConfig {
  id: string;
  name: string;
  monacoLanguage: string;
  extension: string;
  executionStatus: ExecutionStatus;
  executor: string | null;
}

export const SUPPORTED_LANGUAGES: Record<string, LanguageConfig> = {
  python: {
    id: "python",
    name: "Python",
    monacoLanguage: "python",
    extension: ".py",
    executionStatus: "READY",
    executor: "92"
  },
  javascript: {
    id: "javascript",
    name: "JavaScript",
    monacoLanguage: "javascript",
    extension: ".js",
    executionStatus: "READY",
    executor: "93"
  },
  typescript: {
    id: "typescript",
    name: "TypeScript",
    monacoLanguage: "typescript",
    extension: ".ts",
    executionStatus: "READY",
    executor: "101"
  },
  typescriptreact: {
    id: "typescriptreact",
    name: "TypeScript React",
    monacoLanguage: "typescript",
    extension: ".tsx",
    executionStatus: "READY",
    executor: "typescript"
  },
  javascriptreact: {
    id: "javascriptreact",
    name: "JavaScript React",
    monacoLanguage: "javascript",
    extension: ".jsx",
    executionStatus: "READY",
    executor: "javascript"
  },
  c: { id: "c", name: "C", monacoLanguage: "c", extension: ".c", executionStatus: "READY", executor: "103" },
  cpp: { id: "cpp", name: "C++", monacoLanguage: "cpp", extension: ".cpp", executionStatus: "READY", executor: "105" },
  java: { id: "java", name: "Java", monacoLanguage: "java", extension: ".java", executionStatus: "READY", executor: "91" },
  csharp: { id: "csharp", name: "C#", monacoLanguage: "csharp", extension: ".cs", executionStatus: "READY", executor: "csharp" },
  go: { id: "go", name: "Go", monacoLanguage: "go", extension: ".go", executionStatus: "READY", executor: "107" },
  rust: { id: "rust", name: "Rust", monacoLanguage: "rust", extension: ".rs", executionStatus: "READY", executor: "108" },
  php: { id: "php", name: "PHP", monacoLanguage: "php", extension: ".php", executionStatus: "READY", executor: "98" },
  ruby: { id: "ruby", name: "Ruby", monacoLanguage: "ruby", extension: ".rb", executionStatus: "READY", executor: "72" },
  kotlin: { id: "kotlin", name: "Kotlin", monacoLanguage: "kotlin", extension: ".kt", executionStatus: "READY", executor: "111" },
  swift: { id: "swift", name: "Swift", monacoLanguage: "swift", extension: ".swift", executionStatus: "READY", executor: "83" },
  dart: { id: "dart", name: "Dart", monacoLanguage: "dart", extension: ".dart", executionStatus: "READY", executor: "90" },
  r: { id: "r", name: "R", monacoLanguage: "r", extension: ".r", executionStatus: "READY", executor: "99" },
  lua: { id: "lua", name: "Lua", monacoLanguage: "lua", extension: ".lua", executionStatus: "READY", executor: "64" },
  perl: { id: "perl", name: "Perl", monacoLanguage: "perl", extension: ".pl", executionStatus: "READY", executor: "perl" },
  scala: { id: "scala", name: "Scala", monacoLanguage: "scala", extension: ".scala", executionStatus: "READY", executor: "scala" },
  haskell: { id: "haskell", name: "Haskell", monacoLanguage: "haskell", extension: ".hs", executionStatus: "READY", executor: "ghc" },
  sql: { id: "sql", name: "SQL", monacoLanguage: "sql", extension: ".sql", executionStatus: "UNSUPPORTED", executor: null },
  bash: { id: "bash", name: "Bash", monacoLanguage: "shell", extension: ".sh", executionStatus: "READY", executor: "46" },
  powershell: { id: "powershell", name: "PowerShell", monacoLanguage: "powershell", extension: ".ps1", executionStatus: "READY", executor: "pwsh" },
  plaintext: { id: "plaintext", name: "Plain Text", monacoLanguage: "plaintext", extension: ".txt", executionStatus: "UNSUPPORTED", executor: null }
};

export type SupportedLanguageId = keyof typeof SUPPORTED_LANGUAGES;

export const DEFAULT_LANGUAGE = "python";

export function getLanguageById(id: string): LanguageConfig {
  return SUPPORTED_LANGUAGES[id] || SUPPORTED_LANGUAGES[DEFAULT_LANGUAGE];
}

export function getLanguageByExtension(filename: string): LanguageConfig {
  const ext = filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
  if (!ext) return SUPPORTED_LANGUAGES["plaintext"];
  
  const extensionWithDot = `.${ext.toLowerCase()}`;
  
  const found = Object.values(SUPPORTED_LANGUAGES).find(lang => {
    return lang.extension === extensionWithDot;
  });
  
  if (extensionWithDot === ".cc" || extensionWithDot === ".cxx") {
    return SUPPORTED_LANGUAGES["cpp"];
  }

  return found || SUPPORTED_LANGUAGES["plaintext"];
}

export function getAllLanguages(): LanguageConfig[] {
  return Object.values(SUPPORTED_LANGUAGES);
}
