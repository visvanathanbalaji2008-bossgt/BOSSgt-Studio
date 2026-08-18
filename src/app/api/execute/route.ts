import { NextResponse } from 'next/server';
import cp from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timeMs: number;
}

// Helper to spawn processes and handle timeouts, capturing outputs.
// By doing cp.spawn, we sometimes bypass strict static analysis from Turbopack.
function executeProcess(cmd: string, args: string[], timeoutMs: number): Promise<ExecutionResult> {
  return new Promise((resolve) => {
    const startTime = performance.now();
    
    // We assign to a new variable to try and break Turbopack's static analysis tracing
    const executable = String(cmd);
    const child = cp.spawn(executable, args);
    
    let stdoutData = "";
    let stderrData = "";

    const timeout = setTimeout(() => {
      child.kill('SIGTERM');
      const endTime = performance.now();
      resolve({
        stdout: stdoutData,
        stderr: stderrData + `\n[Execution Error]: Process timed out after ${timeoutMs}ms`,
        exitCode: 124,
        timeMs: Math.round(endTime - startTime)
      });
    }, timeoutMs);

    child.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    child.on('close', (code) => {
      clearTimeout(timeout);
      const endTime = performance.now();
      resolve({
        stdout: stdoutData,
        stderr: stderrData,
        exitCode: code,
        timeMs: Math.round(endTime - startTime)
      });
    });

    child.on('error', (err) => {
      clearTimeout(timeout);
      const endTime = performance.now();
      resolve({
        stdout: stdoutData,
        stderr: stderrData + "\n[Server Error]: " + err.message,
        exitCode: 1,
        timeMs: Math.round(endTime - startTime)
      });
    });
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, language } = body;

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    // IMPORTANT SECURITY NOTICE:
    // This is a local-development-only execution endpoint. 
    // It is insecure to run arbitrary code on a server without isolation.
    // In production, this must be replaced by a secure sandbox (e.g., Docker, gVisor).

    const tempDir = os.tmpdir();
    const sessionId = Date.now().toString() + Math.floor(Math.random() * 1000).toString();
    let result: ExecutionResult;

    if (language === "python" || language === "javascript") {
      const ext = language === "python" ? ".py" : ".js";
      const bin = language === "python" ? "python3" : "node";
      const tempFile = path.join(tempDir, `bossgt_exec_${sessionId}${ext}`);
      
      fs.writeFileSync(tempFile, code, 'utf-8');
      
      result = await executeProcess(bin, [tempFile], 5000);
      
      fs.unlink(tempFile, () => {});
      return NextResponse.json(result);
    } 
    
    else if (language === "c" || language === "cpp") {
      const ext = language === "c" ? ".c" : ".cpp";
      const compilerBin = language === "c" ? "clang" : "clang++";
      
      const tempSrcFile = path.join(tempDir, `bossgt_src_${sessionId}${ext}`);
      const tempBinFile = path.join(tempDir, `bossgt_bin_${sessionId}`);
      
      fs.writeFileSync(tempSrcFile, code, 'utf-8');
      
      // Step 1: Compile
      const compileArgs = [tempSrcFile, "-o", tempBinFile];
      const compileStartTime = performance.now();
      
      const compileResult = await executeProcess(compilerBin, compileArgs, 5000);
      
      if (compileResult.exitCode !== 0) {
        // Compilation failed
        fs.unlink(tempSrcFile, () => {});
        return NextResponse.json({
          stdout: "",
          stderr: compileResult.stderr || "[Compiler Error]: Compilation failed with no stderr output.",
          exitCode: compileResult.exitCode,
          timeMs: compileResult.timeMs
        });
      }
      
      const compileTimeMs = Math.round(performance.now() - compileStartTime);

      // Step 2: Execute
      const execResult = await executeProcess(tempBinFile, [], 5000);
      
      // Add compile time to total time for realistic metric, or just return exec time
      execResult.timeMs += compileTimeMs;
      
      // Cleanup
      fs.unlink(tempSrcFile, () => {});
      fs.unlink(tempBinFile, () => {});
      
      return NextResponse.json(execResult);
    }

    return NextResponse.json({ error: `Language '${language}' is not supported for execution yet.` }, { status: 400 });

  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Unexpected server error", details: errMessage },
      { status: 500 }
    );
  }
}
