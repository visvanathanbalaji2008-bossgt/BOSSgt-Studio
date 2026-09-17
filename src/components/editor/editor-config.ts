// This file contains exactly 200 distinct programming languages.
export type ExecutionStatus = "READY" | "COMPILER_REQUIRED" | "RUNTIME_REQUIRED" | "UNSUPPORTED";

export interface LanguageAdapter {
  id: string;
  name: string;
  monacoLanguage: string;
  extension: string;
  executionStatus: ExecutionStatus;
  executor: string | null;
  compileRequired: boolean;
}

export const LANGUAGES: LanguageAdapter[] = [
  {
    "id": "assembly",
    "name": "Assembly",
    "monacoLanguage": "asm",
    "extension": ".asm",
    "executionStatus": "READY",
    "executor": "45",
    "compileRequired": false
  },
  {
    "id": "bash",
    "name": "Bash",
    "monacoLanguage": "shell",
    "extension": ".sh",
    "executionStatus": "READY",
    "executor": "46",
    "compileRequired": false
  },
  {
    "id": "basic",
    "name": "Basic",
    "monacoLanguage": "vb",
    "extension": ".bas",
    "executionStatus": "READY",
    "executor": "47",
    "compileRequired": false
  },
  {
    "id": "c",
    "name": "C",
    "monacoLanguage": "c",
    "extension": ".c",
    "executionStatus": "READY",
    "executor": "104",
    "compileRequired": false
  },
  {
    "id": "cpp",
    "name": "C++",
    "monacoLanguage": "cpp",
    "extension": ".cpp",
    "executionStatus": "READY",
    "executor": "105",
    "compileRequired": false
  },
  {
    "id": "clojure",
    "name": "Clojure",
    "monacoLanguage": "clojure",
    "extension": ".clj",
    "executionStatus": "READY",
    "executor": "86",
    "compileRequired": false
  },
  {
    "id": "csharp",
    "name": "C#",
    "monacoLanguage": "csharp",
    "extension": ".cs",
    "executionStatus": "READY",
    "executor": "51",
    "compileRequired": false
  },
  {
    "id": "cobol",
    "name": "COBOL",
    "monacoLanguage": "cobol",
    "extension": ".cob",
    "executionStatus": "READY",
    "executor": "77",
    "compileRequired": false
  },
  {
    "id": "common-lisp",
    "name": "Common Lisp",
    "monacoLanguage": "lisp",
    "extension": ".lisp",
    "executionStatus": "READY",
    "executor": "55",
    "compileRequired": false
  },
  {
    "id": "dart",
    "name": "Dart",
    "monacoLanguage": "dart",
    "extension": ".dart",
    "executionStatus": "READY",
    "executor": "90",
    "compileRequired": false
  },
  {
    "id": "d",
    "name": "D",
    "monacoLanguage": "d",
    "extension": ".d",
    "executionStatus": "READY",
    "executor": "56",
    "compileRequired": false
  },
  {
    "id": "elixir",
    "name": "Elixir",
    "monacoLanguage": "elixir",
    "extension": ".ex",
    "executionStatus": "READY",
    "executor": "57",
    "compileRequired": false
  },
  {
    "id": "erlang",
    "name": "Erlang",
    "monacoLanguage": "erlang",
    "extension": ".erl",
    "executionStatus": "READY",
    "executor": "58",
    "compileRequired": false
  },
  {
    "id": "fsharp",
    "name": "F#",
    "monacoLanguage": "fsharp",
    "extension": ".fs",
    "executionStatus": "READY",
    "executor": "87",
    "compileRequired": false
  },
  {
    "id": "fortran",
    "name": "Fortran",
    "monacoLanguage": "fortran",
    "extension": ".f90",
    "executionStatus": "READY",
    "executor": "59",
    "compileRequired": false
  },
  {
    "id": "go",
    "name": "Go",
    "monacoLanguage": "go",
    "extension": ".go",
    "executionStatus": "READY",
    "executor": "107",
    "compileRequired": false
  },
  {
    "id": "groovy",
    "name": "Groovy",
    "monacoLanguage": "groovy",
    "extension": ".groovy",
    "executionStatus": "READY",
    "executor": "88",
    "compileRequired": false
  },
  {
    "id": "haskell",
    "name": "Haskell",
    "monacoLanguage": "haskell",
    "extension": ".hs",
    "executionStatus": "READY",
    "executor": "61",
    "compileRequired": false
  },
  {
    "id": "java",
    "name": "Java",
    "monacoLanguage": "java",
    "extension": ".java",
    "executionStatus": "READY",
    "executor": "91",
    "compileRequired": false
  },
  {
    "id": "javascript",
    "name": "JavaScript",
    "monacoLanguage": "javascript",
    "extension": ".js",
    "executionStatus": "READY",
    "executor": "102",
    "compileRequired": false
  },
  {
    "id": "kotlin",
    "name": "Kotlin",
    "monacoLanguage": "kotlin",
    "extension": ".kt",
    "executionStatus": "READY",
    "executor": "111",
    "compileRequired": false
  },
  {
    "id": "lua",
    "name": "Lua",
    "monacoLanguage": "lua",
    "extension": ".lua",
    "executionStatus": "READY",
    "executor": "64",
    "compileRequired": false
  },
  {
    "id": "objective-c",
    "name": "Objective-C",
    "monacoLanguage": "objective-c",
    "extension": ".m",
    "executionStatus": "READY",
    "executor": "79",
    "compileRequired": false
  },
  {
    "id": "ocaml",
    "name": "OCaml",
    "monacoLanguage": "ocaml",
    "extension": ".ml",
    "executionStatus": "READY",
    "executor": "65",
    "compileRequired": false
  },
  {
    "id": "octave",
    "name": "Octave",
    "monacoLanguage": "octave",
    "extension": ".m",
    "executionStatus": "READY",
    "executor": "66",
    "compileRequired": false
  },
  {
    "id": "pascal",
    "name": "Pascal",
    "monacoLanguage": "pascal",
    "extension": ".pas",
    "executionStatus": "READY",
    "executor": "67",
    "compileRequired": false
  },
  {
    "id": "perl",
    "name": "Perl",
    "monacoLanguage": "perl",
    "extension": ".pl",
    "executionStatus": "READY",
    "executor": "85",
    "compileRequired": false
  },
  {
    "id": "php",
    "name": "PHP",
    "monacoLanguage": "php",
    "extension": ".php",
    "executionStatus": "READY",
    "executor": "98",
    "compileRequired": false
  },
  {
    "id": "prolog",
    "name": "Prolog",
    "monacoLanguage": "prolog",
    "extension": ".pro",
    "executionStatus": "READY",
    "executor": "69",
    "compileRequired": false
  },
  {
    "id": "python",
    "name": "Python",
    "monacoLanguage": "python",
    "extension": ".py",
    "executionStatus": "READY",
    "executor": "113",
    "compileRequired": false
  },
  {
    "id": "r",
    "name": "R",
    "monacoLanguage": "r",
    "extension": ".r",
    "executionStatus": "READY",
    "executor": "99",
    "compileRequired": false
  },
  {
    "id": "ruby",
    "name": "Ruby",
    "monacoLanguage": "ruby",
    "extension": ".rb",
    "executionStatus": "READY",
    "executor": "72",
    "compileRequired": false
  },
  {
    "id": "rust",
    "name": "Rust",
    "monacoLanguage": "rust",
    "extension": ".rs",
    "executionStatus": "READY",
    "executor": "108",
    "compileRequired": false
  },
  {
    "id": "scala",
    "name": "Scala",
    "monacoLanguage": "scala",
    "extension": ".scala",
    "executionStatus": "READY",
    "executor": "112",
    "compileRequired": false
  },
  {
    "id": "sql",
    "name": "SQL",
    "monacoLanguage": "sql",
    "extension": ".sql",
    "executionStatus": "READY",
    "executor": "82",
    "compileRequired": false
  },
  {
    "id": "swift",
    "name": "Swift",
    "monacoLanguage": "swift",
    "extension": ".swift",
    "executionStatus": "READY",
    "executor": "83",
    "compileRequired": false
  },
  {
    "id": "typescript",
    "name": "TypeScript",
    "monacoLanguage": "typescript",
    "extension": ".ts",
    "executionStatus": "READY",
    "executor": "101",
    "compileRequired": false
  },
  {
    "id": "visual-basic",
    "name": "Visual Basic",
    "monacoLanguage": "vb",
    "extension": ".vb",
    "executionStatus": "READY",
    "executor": "84",
    "compileRequired": false
  },
  {
    "id": "html",
    "name": "HTML",
    "monacoLanguage": "html",
    "extension": ".html",
    "executionStatus": "UNSUPPORTED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "css",
    "name": "CSS",
    "monacoLanguage": "css",
    "extension": ".css",
    "executionStatus": "UNSUPPORTED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "json",
    "name": "JSON",
    "monacoLanguage": "json",
    "extension": ".json",
    "executionStatus": "UNSUPPORTED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "markdown",
    "name": "Markdown",
    "monacoLanguage": "markdown",
    "extension": ".md",
    "executionStatus": "UNSUPPORTED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "plain-text",
    "name": "Plain Text",
    "monacoLanguage": "plaintext",
    "extension": ".txt",
    "executionStatus": "UNSUPPORTED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "ada",
    "name": "Ada",
    "monacoLanguage": "plaintext",
    "extension": ".ada",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "agda",
    "name": "Agda",
    "monacoLanguage": "plaintext",
    "extension": ".agda",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "alloy",
    "name": "Alloy",
    "monacoLanguage": "plaintext",
    "extension": ".allo",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "ampl",
    "name": "AMPL",
    "monacoLanguage": "plaintext",
    "extension": ".ampl",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "antlr",
    "name": "ANTLR",
    "monacoLanguage": "plaintext",
    "extension": ".antl",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "apex",
    "name": "Apex",
    "monacoLanguage": "plaintext",
    "extension": ".apex",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "apl",
    "name": "APL",
    "monacoLanguage": "plaintext",
    "extension": ".apl",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "applescript",
    "name": "AppleScript",
    "monacoLanguage": "plaintext",
    "extension": ".applescript",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "arc",
    "name": "Arc",
    "monacoLanguage": "plaintext",
    "extension": ".arc",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "arduino",
    "name": "Arduino",
    "monacoLanguage": "plaintext",
    "extension": ".ino",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "autohotkey",
    "name": "AutoHotkey",
    "monacoLanguage": "plaintext",
    "extension": ".ahk",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "autoit",
    "name": "AutoIt",
    "monacoLanguage": "plaintext",
    "extension": ".auto",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "awk",
    "name": "Awk",
    "monacoLanguage": "plaintext",
    "extension": ".awk",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "ballerina",
    "name": "Ballerina",
    "monacoLanguage": "plaintext",
    "extension": ".ball",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "batch",
    "name": "Batch",
    "monacoLanguage": "plaintext",
    "extension": ".bat",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "befunge",
    "name": "Befunge",
    "monacoLanguage": "plaintext",
    "extension": ".bf",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "bison",
    "name": "Bison",
    "monacoLanguage": "plaintext",
    "extension": ".biso",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "bitbake",
    "name": "BitBake",
    "monacoLanguage": "plaintext",
    "extension": ".bitb",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "blitzbasic",
    "name": "BlitzBasic",
    "monacoLanguage": "plaintext",
    "extension": ".blit",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "blitzmax",
    "name": "BlitzMax",
    "monacoLanguage": "plaintext",
    "extension": ".blit",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "bluespec",
    "name": "Bluespec",
    "monacoLanguage": "plaintext",
    "extension": ".blue",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "boo",
    "name": "Boo",
    "monacoLanguage": "plaintext",
    "extension": ".boo",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "brainfuck",
    "name": "Brainfuck",
    "monacoLanguage": "plaintext",
    "extension": ".brai",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "brightscript",
    "name": "Brightscript",
    "monacoLanguage": "plaintext",
    "extension": ".brig",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "c2ml",
    "name": "C2ML",
    "monacoLanguage": "plaintext",
    "extension": ".c2ml",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "cap'n-proto",
    "name": "Cap'n Proto",
    "monacoLanguage": "plaintext",
    "extension": ".cap'",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "cartocss",
    "name": "CartoCSS",
    "monacoLanguage": "plaintext",
    "extension": ".cart",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "ceylon",
    "name": "Ceylon",
    "monacoLanguage": "plaintext",
    "extension": ".ceyl",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "chapel",
    "name": "Chapel",
    "monacoLanguage": "plaintext",
    "extension": ".chap",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "chuck",
    "name": "ChucK",
    "monacoLanguage": "plaintext",
    "extension": ".chuc",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "cirru",
    "name": "Cirru",
    "monacoLanguage": "plaintext",
    "extension": ".cirr",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "clarion",
    "name": "Clarion",
    "monacoLanguage": "plaintext",
    "extension": ".clar",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "clean",
    "name": "Clean",
    "monacoLanguage": "plaintext",
    "extension": ".clea",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "click",
    "name": "Click",
    "monacoLanguage": "plaintext",
    "extension": ".clic",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "cmake",
    "name": "CMake",
    "monacoLanguage": "plaintext",
    "extension": ".cmak",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "coffeescript",
    "name": "CoffeeScript",
    "monacoLanguage": "plaintext",
    "extension": ".coff",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "coldfusion",
    "name": "ColdFusion",
    "monacoLanguage": "plaintext",
    "extension": ".cold",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "coq",
    "name": "Coq",
    "monacoLanguage": "plaintext",
    "extension": ".coq",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "crystal",
    "name": "Crystal",
    "monacoLanguage": "plaintext",
    "extension": ".crys",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "csound",
    "name": "Csound",
    "monacoLanguage": "plaintext",
    "extension": ".csou",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "cuda",
    "name": "Cuda",
    "monacoLanguage": "plaintext",
    "extension": ".cuda",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "cython",
    "name": "Cython",
    "monacoLanguage": "plaintext",
    "extension": ".cyth",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "dataweave",
    "name": "DataWeave",
    "monacoLanguage": "plaintext",
    "extension": ".data",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "delphi",
    "name": "Delphi",
    "monacoLanguage": "plaintext",
    "extension": ".delp",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "dhall",
    "name": "Dhall",
    "monacoLanguage": "plaintext",
    "extension": ".dhal",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "diff",
    "name": "Diff",
    "monacoLanguage": "plaintext",
    "extension": ".diff",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "dockerfile",
    "name": "Dockerfile",
    "monacoLanguage": "plaintext",
    "extension": ".dock",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "dogescript",
    "name": "Dogescript",
    "monacoLanguage": "plaintext",
    "extension": ".doge",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "dylan",
    "name": "Dylan",
    "monacoLanguage": "plaintext",
    "extension": ".dyla",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "e",
    "name": "E",
    "monacoLanguage": "plaintext",
    "extension": ".e",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "eagle",
    "name": "Eagle",
    "monacoLanguage": "plaintext",
    "extension": ".eagl",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "ebnf",
    "name": "EBNF",
    "monacoLanguage": "plaintext",
    "extension": ".ebnf",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "ec",
    "name": "eC",
    "monacoLanguage": "plaintext",
    "extension": ".ec",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "eiffel",
    "name": "Eiffel",
    "monacoLanguage": "plaintext",
    "extension": ".eiff",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "elm",
    "name": "Elm",
    "monacoLanguage": "plaintext",
    "extension": ".elm",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "emacs-lisp",
    "name": "Emacs Lisp",
    "monacoLanguage": "plaintext",
    "extension": ".emac",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "emberscript",
    "name": "EmberScript",
    "monacoLanguage": "plaintext",
    "extension": ".embe",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "fstar",
    "name": "F*",
    "monacoLanguage": "plaintext",
    "extension": ".f*",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "factor",
    "name": "Factor",
    "monacoLanguage": "plaintext",
    "extension": ".fact",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "fantom",
    "name": "Fantom",
    "monacoLanguage": "plaintext",
    "extension": ".fant",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "faust",
    "name": "Faust",
    "monacoLanguage": "plaintext",
    "extension": ".faus",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "fennel",
    "name": "Fennel",
    "monacoLanguage": "plaintext",
    "extension": ".fenn",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "flux",
    "name": "FLUX",
    "monacoLanguage": "plaintext",
    "extension": ".flux",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "forth",
    "name": "Forth",
    "monacoLanguage": "plaintext",
    "extension": ".fort",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "freemarker",
    "name": "FreeMarker",
    "monacoLanguage": "plaintext",
    "extension": ".free",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "frege",
    "name": "Frege",
    "monacoLanguage": "plaintext",
    "extension": ".freg",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "futhark",
    "name": "Futhark",
    "monacoLanguage": "plaintext",
    "extension": ".futh",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "g-code",
    "name": "G-code",
    "monacoLanguage": "plaintext",
    "extension": ".g-co",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "game-maker-language",
    "name": "Game Maker Language",
    "monacoLanguage": "plaintext",
    "extension": ".game",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "gams",
    "name": "GAMS",
    "monacoLanguage": "plaintext",
    "extension": ".gams",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "gap",
    "name": "GAP",
    "monacoLanguage": "plaintext",
    "extension": ".gap",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "gdscript",
    "name": "GDScript",
    "monacoLanguage": "plaintext",
    "extension": ".gdsc",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "genie",
    "name": "Genie",
    "monacoLanguage": "plaintext",
    "extension": ".geni",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "genshi",
    "name": "Genshi",
    "monacoLanguage": "plaintext",
    "extension": ".gens",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "gentoo",
    "name": "Gentoo",
    "monacoLanguage": "plaintext",
    "extension": ".gent",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "gherkin",
    "name": "Gherkin",
    "monacoLanguage": "plaintext",
    "extension": ".gher",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "glsl",
    "name": "GLSL",
    "monacoLanguage": "plaintext",
    "extension": ".glsl",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "glyph",
    "name": "Glyph",
    "monacoLanguage": "plaintext",
    "extension": ".glyp",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "gnuplot",
    "name": "Gnuplot",
    "monacoLanguage": "plaintext",
    "extension": ".gnup",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "golo",
    "name": "Golo",
    "monacoLanguage": "plaintext",
    "extension": ".golo",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "gosu",
    "name": "Gosu",
    "monacoLanguage": "plaintext",
    "extension": ".gosu",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "grace",
    "name": "Grace",
    "monacoLanguage": "plaintext",
    "extension": ".grac",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "gradle",
    "name": "Gradle",
    "monacoLanguage": "plaintext",
    "extension": ".grad",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "graphql",
    "name": "GraphQL",
    "monacoLanguage": "plaintext",
    "extension": ".grap",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "hack",
    "name": "Hack",
    "monacoLanguage": "plaintext",
    "extension": ".hack",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "haml",
    "name": "Haml",
    "monacoLanguage": "plaintext",
    "extension": ".haml",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "handlebars",
    "name": "Handlebars",
    "monacoLanguage": "plaintext",
    "extension": ".hand",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "harbour",
    "name": "Harbour",
    "monacoLanguage": "plaintext",
    "extension": ".harb",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "haxe",
    "name": "Haxe",
    "monacoLanguage": "plaintext",
    "extension": ".haxe",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "hcl",
    "name": "HCL",
    "monacoLanguage": "plaintext",
    "extension": ".hcl",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "hlsl",
    "name": "HLSL",
    "monacoLanguage": "plaintext",
    "extension": ".hlsl",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "holyc",
    "name": "HolyC",
    "monacoLanguage": "plaintext",
    "extension": ".holy",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "hy",
    "name": "Hy",
    "monacoLanguage": "plaintext",
    "extension": ".hy",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "icon",
    "name": "Icon",
    "monacoLanguage": "plaintext",
    "extension": ".icon",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "idris",
    "name": "Idris",
    "monacoLanguage": "plaintext",
    "extension": ".idri",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "inform-7",
    "name": "Inform 7",
    "monacoLanguage": "plaintext",
    "extension": ".info",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "ini",
    "name": "INI",
    "monacoLanguage": "plaintext",
    "extension": ".ini",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "io",
    "name": "Io",
    "monacoLanguage": "plaintext",
    "extension": ".io",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "ioke",
    "name": "Ioke",
    "monacoLanguage": "plaintext",
    "extension": ".ioke",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "isabelle",
    "name": "Isabelle",
    "monacoLanguage": "plaintext",
    "extension": ".isab",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "j",
    "name": "J",
    "monacoLanguage": "plaintext",
    "extension": ".j",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "jflex",
    "name": "JFlex",
    "monacoLanguage": "plaintext",
    "extension": ".jfle",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "jsoniq",
    "name": "JSONiq",
    "monacoLanguage": "plaintext",
    "extension": ".json",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "json5",
    "name": "JSON5",
    "monacoLanguage": "plaintext",
    "extension": ".json",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "julia",
    "name": "Julia",
    "monacoLanguage": "plaintext",
    "extension": ".juli",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "jupyter-notebook",
    "name": "Jupyter Notebook",
    "monacoLanguage": "plaintext",
    "extension": ".jupy",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "kaitai-struct",
    "name": "Kaitai Struct",
    "monacoLanguage": "plaintext",
    "extension": ".kait",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "krl",
    "name": "KRL",
    "monacoLanguage": "plaintext",
    "extension": ".krl",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "labview",
    "name": "LabVIEW",
    "monacoLanguage": "plaintext",
    "extension": ".labv",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "lasso",
    "name": "Lasso",
    "monacoLanguage": "plaintext",
    "extension": ".lass",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "latte",
    "name": "Latte",
    "monacoLanguage": "plaintext",
    "extension": ".latt",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "lean",
    "name": "Lean",
    "monacoLanguage": "plaintext",
    "extension": ".lean",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "less",
    "name": "Less",
    "monacoLanguage": "plaintext",
    "extension": ".less",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "lex",
    "name": "Lex",
    "monacoLanguage": "plaintext",
    "extension": ".lex",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "lfe",
    "name": "LFE",
    "monacoLanguage": "plaintext",
    "extension": ".lfe",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "lilypond",
    "name": "LilyPond",
    "monacoLanguage": "plaintext",
    "extension": ".lily",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "limbo",
    "name": "Limbo",
    "monacoLanguage": "plaintext",
    "extension": ".limb",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "liquid",
    "name": "Liquid",
    "monacoLanguage": "plaintext",
    "extension": ".liqu",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "livescript",
    "name": "LiveScript",
    "monacoLanguage": "plaintext",
    "extension": ".live",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "logos",
    "name": "Logos",
    "monacoLanguage": "plaintext",
    "extension": ".logo",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "logtalk",
    "name": "Logtalk",
    "monacoLanguage": "plaintext",
    "extension": ".logt",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "lolcode",
    "name": "LOLCODE",
    "monacoLanguage": "plaintext",
    "extension": ".lolc",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "lookml",
    "name": "LookML",
    "monacoLanguage": "plaintext",
    "extension": ".look",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "loomscript",
    "name": "LoomScript",
    "monacoLanguage": "plaintext",
    "extension": ".loom",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "lsl",
    "name": "LSL",
    "monacoLanguage": "plaintext",
    "extension": ".lsl",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "m",
    "name": "M",
    "monacoLanguage": "plaintext",
    "extension": ".m",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "m4",
    "name": "M4",
    "monacoLanguage": "plaintext",
    "extension": ".m4",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "makefile",
    "name": "Makefile",
    "monacoLanguage": "plaintext",
    "extension": ".make",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "mask",
    "name": "Mask",
    "monacoLanguage": "plaintext",
    "extension": ".mask",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "mathematica",
    "name": "Mathematica",
    "monacoLanguage": "plaintext",
    "extension": ".math",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "matlab",
    "name": "MATLAB",
    "monacoLanguage": "plaintext",
    "extension": ".matl",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "max",
    "name": "Max",
    "monacoLanguage": "plaintext",
    "extension": ".max",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "maxscript",
    "name": "MAXScript",
    "monacoLanguage": "plaintext",
    "extension": ".maxs",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "mercury",
    "name": "Mercury",
    "monacoLanguage": "plaintext",
    "extension": ".merc",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "meson",
    "name": "Meson",
    "monacoLanguage": "plaintext",
    "extension": ".meso",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "metal",
    "name": "Metal",
    "monacoLanguage": "plaintext",
    "extension": ".meta",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "minid",
    "name": "MiniD",
    "monacoLanguage": "plaintext",
    "extension": ".mini",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "mirah",
    "name": "Mirah",
    "monacoLanguage": "plaintext",
    "extension": ".mira",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "modelica",
    "name": "Modelica",
    "monacoLanguage": "plaintext",
    "extension": ".mode",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "modula-2",
    "name": "Modula-2",
    "monacoLanguage": "plaintext",
    "extension": ".modu",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "modula-3",
    "name": "Modula-3",
    "monacoLanguage": "plaintext",
    "extension": ".modu",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "module-management-system",
    "name": "Module Management System",
    "monacoLanguage": "plaintext",
    "extension": ".modu",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "monkey",
    "name": "Monkey",
    "monacoLanguage": "plaintext",
    "extension": ".monk",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "moocode",
    "name": "Moocode",
    "monacoLanguage": "plaintext",
    "extension": ".mooc",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "moonscript",
    "name": "MoonScript",
    "monacoLanguage": "plaintext",
    "extension": ".moon",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "motorola-68k-assembly",
    "name": "Motorola 68K Assembly",
    "monacoLanguage": "plaintext",
    "extension": ".moto",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "mtml",
    "name": "MTML",
    "monacoLanguage": "plaintext",
    "extension": ".mtml",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "muf",
    "name": "MUF",
    "monacoLanguage": "plaintext",
    "extension": ".muf",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "mupad",
    "name": "mupad",
    "monacoLanguage": "plaintext",
    "extension": ".mupa",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "myghty",
    "name": "Myghty",
    "monacoLanguage": "plaintext",
    "extension": ".mygh",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "ncl",
    "name": "NCL",
    "monacoLanguage": "plaintext",
    "extension": ".ncl",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "nearley",
    "name": "Nearley",
    "monacoLanguage": "plaintext",
    "extension": ".near",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "nemerle",
    "name": "Nemerle",
    "monacoLanguage": "plaintext",
    "extension": ".neme",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "nesc",
    "name": "nesC",
    "monacoLanguage": "plaintext",
    "extension": ".nesc",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "netlinx",
    "name": "NetLinx",
    "monacoLanguage": "plaintext",
    "extension": ".netl",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "netlogo",
    "name": "NetLogo",
    "monacoLanguage": "plaintext",
    "extension": ".netl",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  },
  {
    "id": "newlisp",
    "name": "NewLisp",
    "monacoLanguage": "plaintext",
    "extension": ".newl",
    "executionStatus": "RUNTIME_REQUIRED",
    "executor": null,
    "compileRequired": false
  }
];

export const SUPPORTED_LANGUAGES: Record<string, LanguageAdapter> = {};
LANGUAGES.forEach(lang => {
  SUPPORTED_LANGUAGES[lang.id] = lang;
});

// Ensure plaintext exists
if (!SUPPORTED_LANGUAGES["plaintext"]) {
  SUPPORTED_LANGUAGES["plaintext"] = {
    id: "plaintext",
    name: "Plain Text",
    monacoLanguage: "plaintext",
    extension: ".txt",
    executionStatus: "UNSUPPORTED",
    executor: null,
    compileRequired: false
  };
}

export const DEFAULT_LANGUAGE = "plaintext";

export function getLanguageById(id: string): LanguageAdapter {
  return SUPPORTED_LANGUAGES[id] || SUPPORTED_LANGUAGES[DEFAULT_LANGUAGE];
}

export function getLanguageByExtension(filename: string): LanguageAdapter {
  if (!filename || typeof filename !== 'string') return SUPPORTED_LANGUAGES["plaintext"];
  const ext = filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
  if (!ext) return SUPPORTED_LANGUAGES["plaintext"];
  
  const extensionWithDot = `.${ext}`;
  
  const found = Object.values(SUPPORTED_LANGUAGES).find(lang => {
    return lang.extension === extensionWithDot;
  });
  
  if (extensionWithDot === ".cc" || extensionWithDot === ".cxx") return SUPPORTED_LANGUAGES["cpp"];
  if (extensionWithDot === ".tsx") return SUPPORTED_LANGUAGES["typescript"];
  if (extensionWithDot === ".jsx") return SUPPORTED_LANGUAGES["javascript"];

  return found || SUPPORTED_LANGUAGES["plaintext"];
}

export function getAllLanguages(): LanguageAdapter[] {
  return LANGUAGES;
}
