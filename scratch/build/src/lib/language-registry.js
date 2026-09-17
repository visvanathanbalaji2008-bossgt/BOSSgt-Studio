"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LANGUAGE_REGISTRY = void 0;
exports.LANGUAGE_REGISTRY = {
    "assembly": {
        "id": "assembly",
        "name": "Assembly",
        "extension": "asm",
        "judge0Id": 45,
        "pistonLang": "nasm",
        "category": "compiled"
    },
    "bash": {
        "id": "bash",
        "name": "Bash",
        "extension": "sh",
        "judge0Id": 46,
        "pistonLang": "bash",
        "localCmd": "bash",
        "category": "scripting"
    },
    "basic": {
        "id": "basic",
        "name": "Basic",
        "extension": "bas",
        "judge0Id": 47,
        "category": "scripting"
    },
    "c": {
        "id": "c",
        "name": "C",
        "extension": "c",
        "judge0Id": 54,
        "pistonLang": "c",
        "compileCmd": "gcc",
        "category": "compiled"
    },
    "cpp": {
        "id": "cpp",
        "name": "C++",
        "extension": "cpp",
        "judge0Id": 76,
        "pistonLang": "cpp",
        "compileCmd": "g++",
        "category": "compiled"
    },
    "clojure": {
        "id": "clojure",
        "name": "Clojure",
        "extension": "clj",
        "judge0Id": 86,
        "pistonLang": "clojure",
        "category": "scripting"
    },
    "csharp": {
        "id": "csharp",
        "name": "C#",
        "extension": "cs",
        "judge0Id": 51,
        "pistonLang": "csharp",
        "category": "compiled"
    },
    "cobol": {
        "id": "cobol",
        "name": "COBOL",
        "extension": "cob",
        "judge0Id": 88,
        "pistonLang": "cobol",
        "category": "compiled"
    },
    "common-lisp": {
        "id": "common-lisp",
        "name": "Common Lisp",
        "extension": "lisp",
        "judge0Id": 55,
        "pistonLang": "lisp",
        "category": "scripting"
    },
    "dart": {
        "id": "dart",
        "name": "Dart",
        "extension": "dart",
        "judge0Id": 90,
        "pistonLang": "dart",
        "category": "scripting"
    },
    "d": {
        "id": "d",
        "name": "D",
        "extension": "d",
        "judge0Id": 56,
        "pistonLang": "d",
        "category": "compiled"
    },
    "elixir": {
        "id": "elixir",
        "name": "Elixir",
        "extension": "ex",
        "judge0Id": 57,
        "pistonLang": "elixir",
        "category": "scripting"
    },
    "erlang": {
        "id": "erlang",
        "name": "Erlang",
        "extension": "erl",
        "judge0Id": 58,
        "pistonLang": "erlang",
        "category": "scripting"
    },
    "fsharp": {
        "id": "fsharp",
        "name": "F#",
        "extension": "fs",
        "judge0Id": 87,
        "pistonLang": "fsharp",
        "category": "compiled"
    },
    "fortran": {
        "id": "fortran",
        "name": "Fortran",
        "extension": "f90",
        "judge0Id": 59,
        "pistonLang": "fortran",
        "category": "compiled"
    },
    "go": {
        "id": "go",
        "name": "Go",
        "extension": "go",
        "judge0Id": 60,
        "pistonLang": "go",
        "compileCmd": "go",
        "category": "compiled"
    },
    "groovy": {
        "id": "groovy",
        "name": "Groovy",
        "extension": "groovy",
        "judge0Id": 88,
        "pistonLang": "groovy",
        "category": "scripting"
    },
    "haskell": {
        "id": "haskell",
        "name": "Haskell",
        "extension": "hs",
        "judge0Id": 61,
        "pistonLang": "haskell",
        "category": "compiled"
    },
    "java": {
        "id": "java",
        "name": "Java",
        "extension": "java",
        "judge0Id": 62,
        "pistonLang": "java",
        "localCmd": "java",
        "compileCmd": "javac",
        "category": "compiled"
    },
    "javascript": {
        "id": "javascript",
        "name": "JavaScript",
        "extension": "js",
        "judge0Id": 63,
        "pistonLang": "javascript",
        "localCmd": "node",
        "category": "scripting"
    },
    "kotlin": {
        "id": "kotlin",
        "name": "Kotlin",
        "extension": "kt",
        "judge0Id": 78,
        "pistonLang": "kotlin",
        "category": "compiled"
    },
    "lua": {
        "id": "lua",
        "name": "Lua",
        "extension": "lua",
        "judge0Id": 64,
        "pistonLang": "lua",
        "localCmd": "lua",
        "category": "scripting"
    },
    "objective-c": {
        "id": "objective-c",
        "name": "Objective-C",
        "extension": "m",
        "judge0Id": 79,
        "pistonLang": "objective-c",
        "category": "compiled"
    },
    "ocaml": {
        "id": "ocaml",
        "name": "OCaml",
        "extension": "ml",
        "judge0Id": 77,
        "pistonLang": "ocaml",
        "category": "compiled"
    },
    "octave": {
        "id": "octave",
        "name": "Octave",
        "extension": "m",
        "judge0Id": 66,
        "pistonLang": "octave",
        "category": "scientific"
    },
    "pascal": {
        "id": "pascal",
        "name": "Pascal",
        "extension": "pas",
        "judge0Id": 67,
        "pistonLang": "pascal",
        "category": "compiled"
    },
    "perl": {
        "id": "perl",
        "name": "Perl",
        "extension": "pl",
        "judge0Id": 85,
        "pistonLang": "perl",
        "localCmd": "perl",
        "category": "scripting"
    },
    "php": {
        "id": "php",
        "name": "PHP",
        "extension": "php",
        "judge0Id": 68,
        "pistonLang": "php",
        "localCmd": "php",
        "category": "scripting"
    },
    "prolog": {
        "id": "prolog",
        "name": "Prolog",
        "extension": "pro",
        "judge0Id": 69,
        "pistonLang": "prolog",
        "category": "scripting"
    },
    "python": {
        "id": "python",
        "name": "Python",
        "extension": "py",
        "judge0Id": 71,
        "pistonLang": "python",
        "localCmd": "python3",
        "category": "scripting"
    },
    "r": {
        "id": "r",
        "name": "R",
        "extension": "r",
        "judge0Id": 80,
        "pistonLang": "r",
        "category": "scientific"
    },
    "ruby": {
        "id": "ruby",
        "name": "Ruby",
        "extension": "rb",
        "judge0Id": 72,
        "pistonLang": "ruby",
        "localCmd": "ruby",
        "category": "scripting"
    },
    "rust": {
        "id": "rust",
        "name": "Rust",
        "extension": "rs",
        "judge0Id": 73,
        "pistonLang": "rust",
        "compileCmd": "rustc",
        "category": "compiled"
    },
    "scala": {
        "id": "scala",
        "name": "Scala",
        "extension": "scala",
        "judge0Id": 81,
        "pistonLang": "scala",
        "category": "compiled"
    },
    "sql": {
        "id": "sql",
        "name": "SQL",
        "extension": "sql",
        "judge0Id": 82,
        "pistonLang": "sqlite3",
        "category": "data"
    },
    "swift": {
        "id": "swift",
        "name": "Swift",
        "extension": "swift",
        "judge0Id": 83,
        "pistonLang": "swift",
        "compileCmd": "swiftc",
        "category": "compiled"
    },
    "typescript": {
        "id": "typescript",
        "name": "TypeScript",
        "extension": "ts",
        "judge0Id": 74,
        "pistonLang": "typescript",
        "localCmd": "node",
        "category": "scripting"
    },
    "visual-basic": {
        "id": "visual-basic",
        "name": "Visual Basic",
        "extension": "vb",
        "judge0Id": 84,
        "category": "scripting"
    },
    "html": {
        "id": "html",
        "name": "HTML",
        "extension": "html",
        "category": "scripting"
    },
    "css": {
        "id": "css",
        "name": "CSS",
        "extension": "css",
        "category": "scripting"
    },
    "json": {
        "id": "json",
        "name": "JSON",
        "extension": "json",
        "category": "scripting"
    },
    "markdown": {
        "id": "markdown",
        "name": "Markdown",
        "extension": "md",
        "category": "scripting"
    },
    "plain-text": {
        "id": "plain-text",
        "name": "Plain Text",
        "extension": "txt",
        "category": "scripting"
    },
    "ada": {
        "id": "ada",
        "name": "Ada",
        "extension": "ada",
        "category": "scripting"
    },
    "agda": {
        "id": "agda",
        "name": "Agda",
        "extension": "agda",
        "category": "scripting"
    },
    "alloy": {
        "id": "alloy",
        "name": "Alloy",
        "extension": "allo",
        "category": "scripting"
    },
    "ampl": {
        "id": "ampl",
        "name": "AMPL",
        "extension": "ampl",
        "category": "scripting"
    },
    "antlr": {
        "id": "antlr",
        "name": "ANTLR",
        "extension": "antl",
        "category": "scripting"
    },
    "apex": {
        "id": "apex",
        "name": "Apex",
        "extension": "apex",
        "category": "scripting"
    },
    "apl": {
        "id": "apl",
        "name": "APL",
        "extension": "apl",
        "category": "scripting"
    },
    "applescript": {
        "id": "applescript",
        "name": "AppleScript",
        "extension": "applescript",
        "category": "scripting"
    },
    "arc": {
        "id": "arc",
        "name": "Arc",
        "extension": "arc",
        "category": "scripting"
    },
    "arduino": {
        "id": "arduino",
        "name": "Arduino",
        "extension": "ino",
        "category": "scripting"
    },
    "autohotkey": {
        "id": "autohotkey",
        "name": "AutoHotkey",
        "extension": "ahk",
        "category": "scripting"
    },
    "autoit": {
        "id": "autoit",
        "name": "AutoIt",
        "extension": "auto",
        "category": "scripting"
    },
    "awk": {
        "id": "awk",
        "name": "Awk",
        "extension": "awk",
        "category": "scripting"
    },
    "ballerina": {
        "id": "ballerina",
        "name": "Ballerina",
        "extension": "ball",
        "category": "scripting"
    },
    "batch": {
        "id": "batch",
        "name": "Batch",
        "extension": "bat",
        "category": "scripting"
    },
    "befunge": {
        "id": "befunge",
        "name": "Befunge",
        "extension": "bf",
        "category": "scripting"
    },
    "bison": {
        "id": "bison",
        "name": "Bison",
        "extension": "biso",
        "category": "scripting"
    },
    "bitbake": {
        "id": "bitbake",
        "name": "BitBake",
        "extension": "bitb",
        "category": "scripting"
    },
    "blitzbasic": {
        "id": "blitzbasic",
        "name": "BlitzBasic",
        "extension": "blit",
        "category": "scripting"
    },
    "blitzmax": {
        "id": "blitzmax",
        "name": "BlitzMax",
        "extension": "blit",
        "category": "scripting"
    },
    "bluespec": {
        "id": "bluespec",
        "name": "Bluespec",
        "extension": "blue",
        "category": "scripting"
    },
    "boo": {
        "id": "boo",
        "name": "Boo",
        "extension": "boo",
        "category": "scripting"
    },
    "brainfuck": {
        "id": "brainfuck",
        "name": "Brainfuck",
        "extension": "brai",
        "category": "scripting"
    },
    "brightscript": {
        "id": "brightscript",
        "name": "Brightscript",
        "extension": "brig",
        "category": "scripting"
    },
    "c2ml": {
        "id": "c2ml",
        "name": "C2ML",
        "extension": "c2ml",
        "category": "scripting"
    },
    "cap'n-proto": {
        "id": "cap'n-proto",
        "name": "Cap'n Proto",
        "extension": "cap'",
        "category": "scripting"
    },
    "cartocss": {
        "id": "cartocss",
        "name": "CartoCSS",
        "extension": "cart",
        "category": "scripting"
    },
    "ceylon": {
        "id": "ceylon",
        "name": "Ceylon",
        "extension": "ceyl",
        "category": "scripting"
    },
    "chapel": {
        "id": "chapel",
        "name": "Chapel",
        "extension": "chap",
        "category": "scripting"
    },
    "chuck": {
        "id": "chuck",
        "name": "ChucK",
        "extension": "chuc",
        "category": "scripting"
    },
    "cirru": {
        "id": "cirru",
        "name": "Cirru",
        "extension": "cirr",
        "category": "scripting"
    },
    "clarion": {
        "id": "clarion",
        "name": "Clarion",
        "extension": "clar",
        "category": "scripting"
    },
    "clean": {
        "id": "clean",
        "name": "Clean",
        "extension": "clea",
        "category": "scripting"
    },
    "click": {
        "id": "click",
        "name": "Click",
        "extension": "clic",
        "category": "scripting"
    },
    "cmake": {
        "id": "cmake",
        "name": "CMake",
        "extension": "cmak",
        "category": "scripting"
    },
    "coffeescript": {
        "id": "coffeescript",
        "name": "CoffeeScript",
        "extension": "coff",
        "category": "scripting"
    },
    "coldfusion": {
        "id": "coldfusion",
        "name": "ColdFusion",
        "extension": "cold",
        "category": "scripting"
    },
    "coq": {
        "id": "coq",
        "name": "Coq",
        "extension": "coq",
        "category": "scripting"
    },
    "crystal": {
        "id": "crystal",
        "name": "Crystal",
        "extension": "crys",
        "pistonLang": "crystal",
        "category": "compiled"
    },
    "csound": {
        "id": "csound",
        "name": "Csound",
        "extension": "csou",
        "category": "scripting"
    },
    "cuda": {
        "id": "cuda",
        "name": "Cuda",
        "extension": "cuda",
        "category": "scripting"
    },
    "cython": {
        "id": "cython",
        "name": "Cython",
        "extension": "cyth",
        "category": "scripting"
    },
    "dataweave": {
        "id": "dataweave",
        "name": "DataWeave",
        "extension": "data",
        "category": "scripting"
    },
    "delphi": {
        "id": "delphi",
        "name": "Delphi",
        "extension": "delp",
        "category": "scripting"
    },
    "dhall": {
        "id": "dhall",
        "name": "Dhall",
        "extension": "dhal",
        "category": "scripting"
    },
    "diff": {
        "id": "diff",
        "name": "Diff",
        "extension": "diff",
        "category": "scripting"
    },
    "dockerfile": {
        "id": "dockerfile",
        "name": "Dockerfile",
        "extension": "dock",
        "category": "scripting"
    },
    "dogescript": {
        "id": "dogescript",
        "name": "Dogescript",
        "extension": "doge",
        "category": "scripting"
    },
    "dylan": {
        "id": "dylan",
        "name": "Dylan",
        "extension": "dyla",
        "category": "scripting"
    },
    "e": {
        "id": "e",
        "name": "E",
        "extension": "e",
        "category": "scripting"
    },
    "eagle": {
        "id": "eagle",
        "name": "Eagle",
        "extension": "eagl",
        "category": "scripting"
    },
    "ebnf": {
        "id": "ebnf",
        "name": "EBNF",
        "extension": "ebnf",
        "category": "scripting"
    },
    "ec": {
        "id": "ec",
        "name": "eC",
        "extension": "ec",
        "category": "scripting"
    },
    "eiffel": {
        "id": "eiffel",
        "name": "Eiffel",
        "extension": "eiff",
        "category": "scripting"
    },
    "elm": {
        "id": "elm",
        "name": "Elm",
        "extension": "elm",
        "category": "scripting"
    },
    "emacs-lisp": {
        "id": "emacs-lisp",
        "name": "Emacs Lisp",
        "extension": "emac",
        "category": "scripting"
    },
    "emberscript": {
        "id": "emberscript",
        "name": "EmberScript",
        "extension": "embe",
        "category": "scripting"
    },
    "fstar": {
        "id": "fstar",
        "name": "F*",
        "extension": "f*",
        "category": "scripting"
    },
    "factor": {
        "id": "factor",
        "name": "Factor",
        "extension": "fact",
        "category": "scripting"
    },
    "fantom": {
        "id": "fantom",
        "name": "Fantom",
        "extension": "fant",
        "category": "scripting"
    },
    "faust": {
        "id": "faust",
        "name": "Faust",
        "extension": "faus",
        "category": "scripting"
    },
    "fennel": {
        "id": "fennel",
        "name": "Fennel",
        "extension": "fenn",
        "category": "scripting"
    },
    "flux": {
        "id": "flux",
        "name": "FLUX",
        "extension": "flux",
        "category": "scripting"
    },
    "forth": {
        "id": "forth",
        "name": "Forth",
        "extension": "fort",
        "category": "scripting"
    },
    "freemarker": {
        "id": "freemarker",
        "name": "FreeMarker",
        "extension": "free",
        "category": "scripting"
    },
    "frege": {
        "id": "frege",
        "name": "Frege",
        "extension": "freg",
        "category": "scripting"
    },
    "futhark": {
        "id": "futhark",
        "name": "Futhark",
        "extension": "futh",
        "category": "scripting"
    },
    "g-code": {
        "id": "g-code",
        "name": "G-code",
        "extension": "g-co",
        "category": "scripting"
    },
    "game-maker-language": {
        "id": "game-maker-language",
        "name": "Game Maker Language",
        "extension": "game",
        "category": "scripting"
    },
    "gams": {
        "id": "gams",
        "name": "GAMS",
        "extension": "gams",
        "category": "scripting"
    },
    "gap": {
        "id": "gap",
        "name": "GAP",
        "extension": "gap",
        "category": "scripting"
    },
    "gdscript": {
        "id": "gdscript",
        "name": "GDScript",
        "extension": "gdsc",
        "category": "scripting"
    },
    "genie": {
        "id": "genie",
        "name": "Genie",
        "extension": "geni",
        "category": "scripting"
    },
    "genshi": {
        "id": "genshi",
        "name": "Genshi",
        "extension": "gens",
        "category": "scripting"
    },
    "gentoo": {
        "id": "gentoo",
        "name": "Gentoo",
        "extension": "gent",
        "category": "scripting"
    },
    "gherkin": {
        "id": "gherkin",
        "name": "Gherkin",
        "extension": "gher",
        "category": "scripting"
    },
    "glsl": {
        "id": "glsl",
        "name": "GLSL",
        "extension": "glsl",
        "category": "scripting"
    },
    "glyph": {
        "id": "glyph",
        "name": "Glyph",
        "extension": "glyp",
        "category": "scripting"
    },
    "gnuplot": {
        "id": "gnuplot",
        "name": "Gnuplot",
        "extension": "gnup",
        "category": "scripting"
    },
    "golo": {
        "id": "golo",
        "name": "Golo",
        "extension": "golo",
        "category": "scripting"
    },
    "gosu": {
        "id": "gosu",
        "name": "Gosu",
        "extension": "gosu",
        "category": "scripting"
    },
    "grace": {
        "id": "grace",
        "name": "Grace",
        "extension": "grac",
        "category": "scripting"
    },
    "gradle": {
        "id": "gradle",
        "name": "Gradle",
        "extension": "grad",
        "category": "scripting"
    },
    "graphql": {
        "id": "graphql",
        "name": "GraphQL",
        "extension": "grap",
        "category": "scripting"
    },
    "hack": {
        "id": "hack",
        "name": "Hack",
        "extension": "hack",
        "category": "scripting"
    },
    "haml": {
        "id": "haml",
        "name": "Haml",
        "extension": "haml",
        "category": "scripting"
    },
    "handlebars": {
        "id": "handlebars",
        "name": "Handlebars",
        "extension": "hand",
        "category": "scripting"
    },
    "harbour": {
        "id": "harbour",
        "name": "Harbour",
        "extension": "harb",
        "category": "scripting"
    },
    "haxe": {
        "id": "haxe",
        "name": "Haxe",
        "extension": "haxe",
        "category": "scripting"
    },
    "hcl": {
        "id": "hcl",
        "name": "HCL",
        "extension": "hcl",
        "category": "scripting"
    },
    "hlsl": {
        "id": "hlsl",
        "name": "HLSL",
        "extension": "hlsl",
        "category": "scripting"
    },
    "holyc": {
        "id": "holyc",
        "name": "HolyC",
        "extension": "holy",
        "category": "scripting"
    },
    "hy": {
        "id": "hy",
        "name": "Hy",
        "extension": "hy",
        "category": "scripting"
    },
    "icon": {
        "id": "icon",
        "name": "Icon",
        "extension": "icon",
        "category": "scripting"
    },
    "idris": {
        "id": "idris",
        "name": "Idris",
        "extension": "idri",
        "category": "scripting"
    },
    "inform-7": {
        "id": "inform-7",
        "name": "Inform 7",
        "extension": "info",
        "category": "scripting"
    },
    "ini": {
        "id": "ini",
        "name": "INI",
        "extension": "ini",
        "category": "scripting"
    },
    "io": {
        "id": "io",
        "name": "Io",
        "extension": "io",
        "category": "scripting"
    },
    "ioke": {
        "id": "ioke",
        "name": "Ioke",
        "extension": "ioke",
        "category": "scripting"
    },
    "isabelle": {
        "id": "isabelle",
        "name": "Isabelle",
        "extension": "isab",
        "category": "scripting"
    },
    "j": {
        "id": "j",
        "name": "J",
        "extension": "j",
        "category": "scripting"
    },
    "jflex": {
        "id": "jflex",
        "name": "JFlex",
        "extension": "jfle",
        "category": "scripting"
    },
    "jsoniq": {
        "id": "jsoniq",
        "name": "JSONiq",
        "extension": "json",
        "category": "scripting"
    },
    "json5": {
        "id": "json5",
        "name": "JSON5",
        "extension": "json",
        "category": "scripting"
    },
    "julia": {
        "id": "julia",
        "name": "Julia",
        "extension": "juli",
        "judge0Id": 55,
        "pistonLang": "julia",
        "category": "scientific"
    },
    "jupyter-notebook": {
        "id": "jupyter-notebook",
        "name": "Jupyter Notebook",
        "extension": "jupy",
        "category": "scripting"
    },
    "kaitai-struct": {
        "id": "kaitai-struct",
        "name": "Kaitai Struct",
        "extension": "kait",
        "category": "scripting"
    },
    "krl": {
        "id": "krl",
        "name": "KRL",
        "extension": "krl",
        "category": "scripting"
    },
    "labview": {
        "id": "labview",
        "name": "LabVIEW",
        "extension": "labv",
        "category": "scripting"
    },
    "lasso": {
        "id": "lasso",
        "name": "Lasso",
        "extension": "lass",
        "category": "scripting"
    },
    "latte": {
        "id": "latte",
        "name": "Latte",
        "extension": "latt",
        "category": "scripting"
    },
    "lean": {
        "id": "lean",
        "name": "Lean",
        "extension": "lean",
        "category": "scripting"
    },
    "less": {
        "id": "less",
        "name": "Less",
        "extension": "less",
        "category": "scripting"
    },
    "lex": {
        "id": "lex",
        "name": "Lex",
        "extension": "lex",
        "category": "scripting"
    },
    "lfe": {
        "id": "lfe",
        "name": "LFE",
        "extension": "lfe",
        "category": "scripting"
    },
    "lilypond": {
        "id": "lilypond",
        "name": "LilyPond",
        "extension": "lily",
        "category": "scripting"
    },
    "limbo": {
        "id": "limbo",
        "name": "Limbo",
        "extension": "limb",
        "category": "scripting"
    },
    "liquid": {
        "id": "liquid",
        "name": "Liquid",
        "extension": "liqu",
        "category": "scripting"
    },
    "livescript": {
        "id": "livescript",
        "name": "LiveScript",
        "extension": "live",
        "category": "scripting"
    },
    "logos": {
        "id": "logos",
        "name": "Logos",
        "extension": "logo",
        "category": "scripting"
    },
    "logtalk": {
        "id": "logtalk",
        "name": "Logtalk",
        "extension": "logt",
        "category": "scripting"
    },
    "lolcode": {
        "id": "lolcode",
        "name": "LOLCODE",
        "extension": "lolc",
        "category": "scripting"
    },
    "lookml": {
        "id": "lookml",
        "name": "LookML",
        "extension": "look",
        "category": "scripting"
    },
    "loomscript": {
        "id": "loomscript",
        "name": "LoomScript",
        "extension": "loom",
        "category": "scripting"
    },
    "lsl": {
        "id": "lsl",
        "name": "LSL",
        "extension": "lsl",
        "category": "scripting"
    },
    "m": {
        "id": "m",
        "name": "M",
        "extension": "m",
        "category": "scripting"
    },
    "m4": {
        "id": "m4",
        "name": "M4",
        "extension": "m4",
        "category": "scripting"
    },
    "makefile": {
        "id": "makefile",
        "name": "Makefile",
        "extension": "make",
        "category": "scripting"
    },
    "mask": {
        "id": "mask",
        "name": "Mask",
        "extension": "mask",
        "category": "scripting"
    },
    "mathematica": {
        "id": "mathematica",
        "name": "Mathematica",
        "extension": "math",
        "category": "scripting"
    },
    "matlab": {
        "id": "matlab",
        "name": "MATLAB",
        "extension": "matl",
        "category": "scripting"
    },
    "max": {
        "id": "max",
        "name": "Max",
        "extension": "max",
        "category": "scripting"
    },
    "maxscript": {
        "id": "maxscript",
        "name": "MAXScript",
        "extension": "maxs",
        "category": "scripting"
    },
    "mercury": {
        "id": "mercury",
        "name": "Mercury",
        "extension": "merc",
        "category": "scripting"
    },
    "meson": {
        "id": "meson",
        "name": "Meson",
        "extension": "meso",
        "category": "scripting"
    },
    "metal": {
        "id": "metal",
        "name": "Metal",
        "extension": "meta",
        "category": "scripting"
    },
    "minid": {
        "id": "minid",
        "name": "MiniD",
        "extension": "mini",
        "category": "scripting"
    },
    "mirah": {
        "id": "mirah",
        "name": "Mirah",
        "extension": "mira",
        "category": "scripting"
    },
    "modelica": {
        "id": "modelica",
        "name": "Modelica",
        "extension": "mode",
        "category": "scripting"
    },
    "modula-2": {
        "id": "modula-2",
        "name": "Modula-2",
        "extension": "modu",
        "category": "scripting"
    },
    "modula-3": {
        "id": "modula-3",
        "name": "Modula-3",
        "extension": "modu",
        "category": "scripting"
    },
    "module-management-system": {
        "id": "module-management-system",
        "name": "Module Management System",
        "extension": "modu",
        "category": "scripting"
    },
    "monkey": {
        "id": "monkey",
        "name": "Monkey",
        "extension": "monk",
        "category": "scripting"
    },
    "moocode": {
        "id": "moocode",
        "name": "Moocode",
        "extension": "mooc",
        "category": "scripting"
    },
    "moonscript": {
        "id": "moonscript",
        "name": "MoonScript",
        "extension": "moon",
        "category": "scripting"
    },
    "motorola-68k-assembly": {
        "id": "motorola-68k-assembly",
        "name": "Motorola 68K Assembly",
        "extension": "moto",
        "category": "scripting"
    },
    "mtml": {
        "id": "mtml",
        "name": "MTML",
        "extension": "mtml",
        "category": "scripting"
    },
    "muf": {
        "id": "muf",
        "name": "MUF",
        "extension": "muf",
        "category": "scripting"
    },
    "mupad": {
        "id": "mupad",
        "name": "mupad",
        "extension": "mupa",
        "category": "scripting"
    },
    "myghty": {
        "id": "myghty",
        "name": "Myghty",
        "extension": "mygh",
        "category": "scripting"
    },
    "ncl": {
        "id": "ncl",
        "name": "NCL",
        "extension": "ncl",
        "category": "scientific"
    },
    "nearley": {
        "id": "nearley",
        "name": "Nearley",
        "extension": "near",
        "category": "scripting"
    },
    "nemerle": {
        "id": "nemerle",
        "name": "Nemerle",
        "extension": "neme",
        "category": "scripting"
    },
    "nesc": {
        "id": "nesc",
        "name": "nesC",
        "extension": "nesc",
        "category": "scripting"
    },
    "netlinx": {
        "id": "netlinx",
        "name": "NetLinx",
        "extension": "netl",
        "category": "scripting"
    },
    "netlogo": {
        "id": "netlogo",
        "name": "NetLogo",
        "extension": "netl",
        "category": "scripting"
    },
    "newlisp": {
        "id": "newlisp",
        "name": "NewLisp",
        "extension": "newl",
        "category": "scripting"
    }
};
