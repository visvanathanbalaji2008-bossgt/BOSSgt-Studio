export interface LanguageConfig {
  id: string;
  name: string;
  monacoLanguage: string;
  extension: string;
  executionSupported: boolean;
  executor: string | null;
}

export const SUPPORTED_LANGUAGES: Record<string, LanguageConfig> = {
  python: {
    id: "python",
    name: "Python",
    monacoLanguage: "python",
    extension: ".py",
    executionSupported: true,
    executor: "python"
  },
  javascript: {
    id: "javascript",
    name: "JavaScript",
    monacoLanguage: "javascript",
    extension: ".js",
    executionSupported: true,
    executor: "node"
  },
  typescript: {
    id: "typescript",
    name: "TypeScript",
    monacoLanguage: "typescript",
    extension: ".ts",
    executionSupported: false,
    executor: "node"
  },
  typescriptreact: {
    id: "typescriptreact",
    name: "TypeScript React",
    monacoLanguage: "typescript",
    extension: ".tsx",
    executionSupported: false,
    executor: "node"
  },
  javascriptreact: {
    id: "javascriptreact",
    name: "JavaScript React",
    monacoLanguage: "javascript",
    extension: ".jsx",
    executionSupported: false,
    executor: "node"
  },
  c: { id: "c", name: "C", monacoLanguage: "c", extension: ".c", executionSupported: true, executor: "c" },
  cpp: { id: "cpp", name: "C++", monacoLanguage: "cpp", extension: ".cpp", executionSupported: true, executor: "cpp" },
  java: { id: "java", name: "Java", monacoLanguage: "java", extension: ".java", executionSupported: false, executor: "jdk" },
  csharp: { id: "csharp", name: "C#", monacoLanguage: "csharp", extension: ".cs", executionSupported: false, executor: "dotnet" },
  go: { id: "go", name: "Go", monacoLanguage: "go", extension: ".go", executionSupported: false, executor: "go" },
  rust: { id: "rust", name: "Rust", monacoLanguage: "rust", extension: ".rs", executionSupported: false, executor: "rustc" },
  php: { id: "php", name: "PHP", monacoLanguage: "php", extension: ".php", executionSupported: false, executor: "php" },
  ruby: { id: "ruby", name: "Ruby", monacoLanguage: "ruby", extension: ".rb", executionSupported: false, executor: "ruby" },
  kotlin: { id: "kotlin", name: "Kotlin", monacoLanguage: "kotlin", extension: ".kt", executionSupported: false, executor: "kotlinc" },
  swift: { id: "swift", name: "Swift", monacoLanguage: "swift", extension: ".swift", executionSupported: false, executor: "swiftc" },
  dart: { id: "dart", name: "Dart", monacoLanguage: "dart", extension: ".dart", executionSupported: false, executor: "dart" },
  r: { id: "r", name: "R", monacoLanguage: "r", extension: ".r", executionSupported: false, executor: "Rscript" },
  lua: { id: "lua", name: "Lua", monacoLanguage: "lua", extension: ".lua", executionSupported: false, executor: "lua" },
  perl: { id: "perl", name: "Perl", monacoLanguage: "perl", extension: ".pl", executionSupported: false, executor: "perl" },
  scala: { id: "scala", name: "Scala", monacoLanguage: "scala", extension: ".scala", executionSupported: false, executor: "scala" },
  haskell: { id: "haskell", name: "Haskell", monacoLanguage: "haskell", extension: ".hs", executionSupported: false, executor: "ghc" },
  sql: { id: "sql", name: "SQL", monacoLanguage: "sql", extension: ".sql", executionSupported: false, executor: null },
  bash: { id: "bash", name: "Bash", monacoLanguage: "shell", extension: ".sh", executionSupported: false, executor: "bash" },
  powershell: { id: "powershell", name: "PowerShell", monacoLanguage: "powershell", extension: ".ps1", executionSupported: false, executor: "pwsh" },
  plaintext: { id: "plaintext", name: "Plain Text", monacoLanguage: "plaintext", extension: ".txt", executionSupported: false, executor: null }
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
