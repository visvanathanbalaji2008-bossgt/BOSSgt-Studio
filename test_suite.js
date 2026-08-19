const API_URL = "http://localhost:3000/api/execute";

async function runTest(name, language, code, expectedOutcome) {
  process.stdout.write(`Testing ${name}... `);
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language })
    });
    const data = await res.json();
    
    if (expectedOutcome(data, res.status)) {
      console.log("✅ PASS");
    } else {
      console.log("❌ FAIL");
      console.log("Response:", data);
    }
  } catch (err) {
    console.log("❌ ERROR:", err.message);
  }
}

// Simple delay between tests to prevent rate-limiting on public API
const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function main() {
  console.log("Starting Phase 13.5 Execution Backend Test Suite...\n");

  // Python Tests
  await runTest("Python Hello World", "python", "print('Hello World')", 
    d => d.stdout.includes("Hello World") && d.exitCode === 0);
  await delay(1000);
  
  await runTest("Python Syntax Error", "python", "print('Hello'", 
    d => d.stderr.includes("SyntaxError") && d.exitCode !== 0);
  await delay(1000);
  
  await runTest("Python Runtime Error", "python", "1/0", 
    d => d.stderr.includes("ZeroDivisionError") && d.exitCode !== 0);
  await delay(1000);
  
  await runTest("Python Timeout (Infinite Loop)", "python", "while True: pass", 
    d => d.stderr.includes("Time Limit Exceeded") && d.exitCode !== 0);
  await delay(1000);

  // JS/TS Tests
  await runTest("JS Hello World", "javascript", "console.log('Hello JS')", 
    d => d.stdout.includes("Hello JS") && d.exitCode === 0);
  await delay(1000);

  await runTest("TS Hello World", "typescript", "const x: string = 'Hello TS'; console.log(x);", 
    d => d.stdout.includes("Hello TS") && d.exitCode === 0);
  await delay(1000);

  // C/C++ Tests
  await runTest("C Hello World", "c", '#include <stdio.h>\nint main() { printf("Hello C\\n"); return 0; }', 
    d => d.stdout.includes("Hello C") && d.exitCode === 0);
  await delay(1000);

  await runTest("C++ Hello World", "cpp", '#include <iostream>\nint main() { std::cout << "Hello C++\\n"; return 0; }', 
    d => d.stdout.includes("Hello C++") && d.exitCode === 0);
  await delay(1000);

  // Java Tests
  await runTest("Java Hello World", "java", 'public class Main { public static void main(String[] args) { System.out.println("Hello Java"); } }', 
    d => d.stdout.includes("Hello Java") && d.exitCode === 0);
  await delay(1000);

  // Go Tests
  await runTest("Go Hello World", "go", 'package main\nimport "fmt"\nfunc main() { fmt.Println("Hello Go") }', 
    d => d.stdout.includes("Hello Go") && d.exitCode === 0);
  await delay(1000);

  // Rust Tests
  await runTest("Rust Hello World", "rust", 'fn main() { println!("Hello Rust"); }', 
    d => d.stdout.includes("Hello Rust") && d.exitCode === 0);
  await delay(1000);

  // PHP Tests
  await runTest("PHP Hello World", "php", '<?php echo "Hello PHP"; ?>', 
    d => d.stdout.includes("Hello PHP") && d.exitCode === 0);
  await delay(1000);

  // Ruby Tests
  await runTest("Ruby Hello World", "ruby", 'puts "Hello Ruby"', 
    d => d.stdout.includes("Hello Ruby") && d.exitCode === 0);
  await delay(1000);

  // Swift Tests
  await runTest("Swift Hello World", "swift", 'print("Hello Swift")', 
    d => d.stdout.includes("Hello Swift") && d.exitCode === 0);
  await delay(1000);

  // Kotlin Tests
  await runTest("Kotlin Hello World", "kotlin", 'fun main() { println("Hello Kotlin") }', 
    d => d.stdout.includes("Hello Kotlin") && d.exitCode === 0);
  await delay(1000);

  // Edge Cases
  await runTest("Empty Code Validation", "python", "", 
    (d, status) => status === 400 && d.error.includes("No code"));
  await delay(500);

  await runTest("Oversized Source Rejection", "python", "x = 1\n".repeat(20000), 
    (d, status) => status === 400 && d.error.includes("exceeds maximum"));
  await delay(500);

  await runTest("Unsupported Language", "sql", "SELECT 1;", 
    (d, status) => status === 500 && d.details.includes("unsupported or missing"));
  await delay(500);

  console.log("\nStarting Security Penetration Tests...");
  
  await runTest("Attempted Filesystem Access (/etc/passwd)", "python", "import sys\ntry:\n  print(open('/etc/passwd').read())\nexcept Exception as e:\n  print(str(e), file=sys.stderr)\n  sys.exit(1)", 
    d => d.exitCode !== 0 && (d.stderr.includes("Permission denied") || d.stderr.includes("No such file") || d.stderr.includes("not permitted")));
  await delay(1000);

  await runTest("Attempted Environment Variable Access", "python", "import os; print('JUDGE0' in os.environ)", 
    d => d.exitCode === 0 && d.stdout.includes("False"));
  await delay(1000);

  await runTest("Attempted Network Access", "python", "import urllib.request; urllib.request.urlopen('http://example.com')", 
    d => d.exitCode !== 0 && (d.stderr.includes("Name or service not known") || d.stderr.includes("Temporary failure in name resolution")));
  await delay(1000);

  await runTest("Process Spawning Abuse (Fork Bomb/Limits)", "python", "import os\nwhile True: os.fork()", 
    d => d.exitCode !== 0 && (d.stderr.includes("Resource temporarily unavailable") || d.stderr.includes("Time Limit Exceeded") || d.stderr.includes("Runtime Error")));
  await delay(1000);

  await runTest("Oversized Output Generation", "python", "print('A' * (1024 * 1024 * 10))", 
    d => d.stdout.length < (1024 * 1024 * 10) || (d.exitCode !== 0 && d.stderr.includes("Output Limit Exceeded")));
  await delay(1000);

  console.log("\nStarting Rate Limiting Test...");
  process.stdout.write("Sending burst of 110 requests... ");
  let rateLimitHit = false;
  
  const requests = Array.from({ length: 110 }).map(() => 
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: "print(1)", language: "python" })
    })
  );

  const responses = await Promise.all(requests);
  for (const res of responses) {
    if (res.status === 429) rateLimitHit = true;
  }

  if (rateLimitHit) console.log("✅ PASS (429 Too Many Requests received)");
  else console.log("❌ FAIL (Rate limit not enforced)");

}

main();
