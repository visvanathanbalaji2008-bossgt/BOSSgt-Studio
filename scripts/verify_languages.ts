import fs from 'fs';
import path from 'path';

const JUDGE0_API_URL = "https://ce.judge0.com";

const helloWorldTemplates: Record<string, { code: string, extension: string, mode: string }> = {
  "python": { code: 'print("Hello World")', extension: '.py', mode: 'script' },
  "javascript": { code: 'console.log("Hello World");', extension: '.js', mode: 'script' },
  "typescript": { code: 'console.log("Hello World");', extension: '.ts', mode: 'script' },
  "c (": { code: '#include <stdio.h>\nint main() { printf("Hello World\\n"); return 0; }', extension: '.c', mode: 'compiled' },
  "c++": { code: '#include <iostream>\nint main() { std::cout << "Hello World\\n"; return 0; }', extension: '.cpp', mode: 'compiled' },
  "java ": { code: 'public class Main { public static void main(String[] args) { System.out.println("Hello World"); } }', extension: '.java', mode: 'compiled' },
  "c#": { code: 'using System; class Program { static void Main() { Console.WriteLine("Hello World"); } }', extension: '.cs', mode: 'compiled' },
  "go ": { code: 'package main\nimport "fmt"\nfunc main() { fmt.Println("Hello World") }', extension: '.go', mode: 'compiled' },
  "rust": { code: 'fn main() { println!("Hello World"); }', extension: '.rs', mode: 'compiled' },
  "php": { code: '<?php echo "Hello World\\n"; ?>', extension: '.php', mode: 'script' },
  "ruby": { code: 'puts "Hello World"', extension: '.rb', mode: 'script' },
  "swift": { code: 'print("Hello World")', extension: '.swift', mode: 'compiled' },
  "kotlin": { code: 'fun main() { println("Hello World") }', extension: '.kt', mode: 'compiled' },
  "bash": { code: 'echo "Hello World"', extension: '.sh', mode: 'script' },
  "r (": { code: 'cat("Hello World\\n")', extension: '.r', mode: 'script' },
  "perl": { code: 'print "Hello World\\n";', extension: '.pl', mode: 'script' },
  "lua": { code: 'print("Hello World")', extension: '.lua', mode: 'script' },
  "haskell": { code: 'main = putStrLn "Hello World"', extension: '.hs', mode: 'compiled' },
  "scala": { code: 'object Main { def main(args: Array[String]): Unit = { println("Hello World") } }', extension: '.scala', mode: 'compiled' },
  "pascal": { code: 'program HelloWorld; begin writeln(\'Hello World\'); end.', extension: '.pas', mode: 'compiled' },
  "dart": { code: 'void main() { print("Hello World"); }', extension: '.dart', mode: 'script' },
  "objective-c": { code: '#import <Foundation/Foundation.h>\nint main(int argc, const char * argv[]) { @autoreleasepool { NSLog(@"Hello World"); } return 0; }', extension: '.m', mode: 'compiled' },
  "elixir": { code: 'IO.puts "Hello World"', extension: '.exs', mode: 'script' },
  "erlang": { code: '-module(main).\n-export([main/1]).\nmain(_) -> io:fwrite("Hello World\\n").', extension: '.erl', mode: 'compiled' },
  "f#": { code: 'printfn "Hello World"', extension: '.fs', mode: 'compiled' },
  "fortran": { code: 'program hello\n  print *, "Hello World"\nend program hello', extension: '.f90', mode: 'compiled' },
  "clojure": { code: '(println "Hello World")', extension: '.clj', mode: 'script' },
  "lisp": { code: '(print "Hello World")', extension: '.lisp', mode: 'script' },
  "prolog": { code: ':- initialization(main).\nmain :- write(\'Hello World\'), nl, halt.', extension: '.pl', mode: 'compiled' },
  "assembly": { code: 'section .data\n  msg db "Hello World",0xa\n  len equ $ - msg\nsection .text\n  global _start\n_start:\n  mov eax, 4\n  mov ebx, 1\n  mov ecx, msg\n  mov edx, len\n  int 0x80\n  mov eax, 1\n  mov ebx, 0\n  int 0x80', extension: '.asm', mode: 'compiled' },
  "cobol": { code: '       IDENTIFICATION DIVISION.\n       PROGRAM-ID. HELLO-WORLD.\n       PROCEDURE DIVISION.\n           DISPLAY "Hello World".\n           STOP RUN.', extension: '.cob', mode: 'compiled' },
  "d (": { code: 'import std.stdio;\nvoid main() { writeln("Hello World"); }', extension: '.d', mode: 'compiled' },
  "nim": { code: 'echo "Hello World"', extension: '.nim', mode: 'compiled' },
  "ocaml": { code: 'print_endline "Hello World";;', extension: '.ml', mode: 'compiled' },
  "julia": { code: 'println("Hello World")', extension: '.jl', mode: 'script' },
  "groovy": { code: 'println "Hello World"', extension: '.groovy', mode: 'script' },
  "brainfuck": { code: '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.', extension: '.bf', mode: 'script' },
  "visual basic": { code: 'Module Hello\n  Sub Main()\n    Console.WriteLine("Hello World")\n  End Sub\nEnd Module', extension: '.vb', mode: 'compiled' },
  "racket": { code: '#lang racket\n(displayln "Hello World")', extension: '.rkt', mode: 'script' },
  "awk": { code: 'BEGIN { print "Hello World" }', extension: '.awk', mode: 'script' },
  "tcl": { code: 'puts "Hello World"', extension: '.tcl', mode: 'script' },
  "v (": { code: 'fn main() { println("Hello World") }', extension: '.v', mode: 'compiled' },
  "zig": { code: 'const std = @import("std");\npub fn main() !void {\n    const stdout = std.io.getStdOut().writer();\n    try stdout.print("Hello World\\n", .{});\n}', extension: '.zig', mode: 'compiled' },
  "typescript (deno": { code: 'console.log("Hello World");', extension: '.ts', mode: 'script' },
  "java (openjdk": { code: 'public class Main { public static void main(String[] args) { System.out.println("Hello World"); } }', extension: '.java', mode: 'compiled' },
  "python (": { code: 'print("Hello World")', extension: '.py', mode: 'script' },
  "c (gcc": { code: '#include <stdio.h>\nint main() { printf("Hello World\\n"); return 0; }', extension: '.c', mode: 'compiled' },
  "c++ (gcc": { code: '#include <iostream>\nint main() { std::cout << "Hello World\\n"; return 0; }', extension: '.cpp', mode: 'compiled' }
};

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function verifyLanguages() {
  console.log("Fetching languages from Judge0...");
  
  const res = await fetch(`${JUDGE0_API_URL}/languages`);
  if (!res.ok) {
    console.error("Failed to fetch languages", res.statusText);
    return;
  }
  
  const languages: { id: number, name: string }[] = await res.json();
  console.log(`Found ${languages.length} languages.`);
  
  const verifiedLanguages = [];
  
  for (const lang of languages) {
    const langNameLower = lang.name.toLowerCase();
    
    // Find matching template
    let template = null;
    for (const [key, t] of Object.entries(helloWorldTemplates)) {
      if (langNameLower.includes(key)) {
        template = t;
        break;
      }
    }
    
    if (!template) {
      console.log(`[SKIP] No template for ${lang.name} (ID: ${lang.id})`);
      continue;
    }
    
    console.log(`[TESTING] ${lang.name} (ID: ${lang.id})...`);
    
    try {
      const payload = {
        source_code: template.code,
        language_id: lang.id,
        wall_time_limit: 5,
        cpu_time_limit: 2,
        memory_limit: 128000,
      };
      
      const submitRes = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=true`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (submitRes.status === 429) {
        console.log("Rate limited! Waiting 10 seconds...");
        await sleep(10000);
      }
      
      if (submitRes.ok) {
        const result = await submitRes.json();
        
        if (result.status && result.status.id === 3 && result.stdout?.includes("Hello World")) {
          console.log(`[SUCCESS] ${lang.name}`);
          verifiedLanguages.push({
            id: lang.id,
            name: lang.name,
            extension: template.extension,
            mode: template.mode,
            sampleCode: template.code,
            verificationStatus: "Verified"
          });
        } else {
          console.log(`[FAIL] ${lang.name} - Status: ${result.status?.description}, Output: ${result.stdout || result.stderr || result.compile_output}`);
        }
      } else {
        console.log(`[FAIL API] ${lang.name} - ${submitRes.status}`);
      }
    } catch (e) {
      console.error(`[ERROR] ${lang.name}:`, e);
    }
    
    // Rate limit prevention (Judge0 CE has limits)
    await sleep(1500); 
  }
  
  console.log(`\nVerification complete. Verified ${verifiedLanguages.length} languages.`);
  
  const outputDir = path.join(process.cwd(), 'src/components/editor');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(outputDir, 'verified_languages.json'), 
    JSON.stringify(verifiedLanguages, null, 2)
  );
  
  console.log("Saved to src/components/editor/verified_languages.json");
}

verifyLanguages();
