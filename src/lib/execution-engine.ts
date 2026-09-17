import { LANGUAGE_REGISTRY, LanguageDef } from "./language-registry";
import { executeNCL } from "./runtimes/ncl";
import { execFile } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import os from "os";

export interface ProjectFile {
  path: string;
  content: string;
}

export interface ExecutionRequest {
  code: string;
  language: string;
  stdin?: string;
  files?: ProjectFile[];
}

export interface ExecutionResponse {
  stdout: string;
  stderr: string;
  exitCode: number;
  timeMs: number;
  generatedFiles?: { name: string; url: string; type: string }[];
}

const JUDGE0_API_URL = process.env.JUDGE0_API_URL || "https://ce.judge0.com/submissions?wait=true&fields=stdout,stderr,status_id,compile_output,time,memory";
const PISTON_API_URL = process.env.PISTON_API_URL || "https://emkc.org/api/v2/piston/execute";

// Sanitize process environment to prevent secret leaking to user code
function getSanitizedEnv(): NodeJS.ProcessEnv {
  return {
    PATH: process.env.PATH || "/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin",
    HOME: os.tmpdir(),
    TMPDIR: os.tmpdir(),
    USER: "bossgt_sandbox",
    LANG: "en_US.UTF-8",
    LC_ALL: "en_US.UTF-8",
    NODE_ENV: "production"
  };
}

export async function executeCode(req: ExecutionRequest): Promise<ExecutionResponse> {
  const startTime = Date.now();
  const langKey = (req.language || "python").toLowerCase();
  const langDef: LanguageDef = LANGUAGE_REGISTRY[langKey] || {
    id: langKey,
    name: req.language,
    extension: "txt",
    category: "scripting"
  };

  // 1. Dedicated NCL Runtime Execution
  if (langKey === "ncl") {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "bossgt_ncl_"));
    try {
      return await executeNCL(req.code, tmpDir, req.stdin);
    } finally {
      try { await fs.rm(tmpDir, { recursive: true, force: true }); } catch {}
    }
  }

  // 2. Multi-file Local Sandbox Execution
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "bossgt_exec_"));
  try {
    // Write main file
    const mainFileName = langKey === "java" ? "Main.java" : `main.${langDef.extension}`;
    const mainFilePath = path.join(tmpDir, mainFileName);
    await fs.writeFile(mainFilePath, req.code, "utf-8");

    // Write additional project files if provided
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        if (file.path && file.content && file.path !== mainFileName) {
          const fileDest = path.join(tmpDir, file.path);
          await fs.mkdir(path.dirname(fileDest), { recursive: true });
          await fs.writeFile(fileDest, file.content, "utf-8");
        }
      }
    }

    // Check if local binary is available
    if (langDef.localCmd || langDef.compileCmd) {
      const targetBinary = langDef.compileCmd || langDef.localCmd!;
      const isLocalAvailable = await checkBinaryAvailable(targetBinary);

      if (isLocalAvailable) {
        // Compile step
        if (langDef.compileCmd) {
          let compileArgs: string[] = [];
          if (langKey === "c") compileArgs = ["main.c", "-o", "out"];
          else if (langKey === "cpp") compileArgs = ["main.cpp", "-o", "out"];
          else if (langKey === "java") compileArgs = ["Main.java"];
          else if (langKey === "rust") compileArgs = ["main.rs", "-o", "out"];
          else if (langKey === "swift") compileArgs = ["main.swift", "-o", "out"];
          else compileArgs = [mainFileName];

          const compileRes = await runCmd(langDef.compileCmd, compileArgs, "", tmpDir, 12000);
          if (compileRes.exitCode !== 0) {
            // If local compiler is a stub (e.g. macOS java/swift stub), attempt remote gateways before giving up
            const isLocalStubError = compileRes.stderr.includes("Unable to locate a Java Runtime") || 
                                     compileRes.stderr.includes("Operation not permitted") ||
                                     compileRes.stderr.includes("xcrun: error");
            if (!isLocalStubError) {
              return {
                stdout: "",
                stderr: `[Compilation Error]:\n${compileRes.stderr || compileRes.stdout}`,
                exitCode: compileRes.exitCode || 1,
                timeMs: Date.now() - startTime
              };
            }
          } else {
            // Local compilation succeeded, proceed to execute local binary
            let execCmd = langDef.localCmd || "./out";
            let execArgs: string[] = [];
            if (langKey === "c" || langKey === "cpp" || langKey === "rust" || langKey === "swift") {
              execCmd = path.join(tmpDir, "out");
              execArgs = [];
            } else if (langKey === "java") {
              execCmd = "java";
              execArgs = ["Main"];
            } else {
              execArgs = [mainFileName];
            }

            const execRes = await runCmd(execCmd, execArgs, req.stdin || "", tmpDir, 12000);
            const generatedFiles = await detectGeneratedArtifacts(tmpDir);

            return {
              stdout: execRes.stdout.trim(),
              stderr: execRes.stderr.trim(),
              exitCode: execRes.exitCode,
              timeMs: Date.now() - startTime,
              generatedFiles
            };
          }
        } else {
          // Interpreter execution (e.g., python3, node, ruby, perl, bash)
          let execCmd = langDef.localCmd!;
          let execArgs = [mainFileName];
          const execRes = await runCmd(execCmd, execArgs, req.stdin || "", tmpDir, 12000);
          const generatedFiles = await detectGeneratedArtifacts(tmpDir);

          return {
            stdout: execRes.stdout.trim(),
            stderr: execRes.stderr.trim(),
            exitCode: execRes.exitCode,
            timeMs: Date.now() - startTime,
            generatedFiles
          };
        }
      }
    }

    // 3. Remote Execution Gateway (Piston API Primary/Fallback)
    if (langDef.pistonLang) {
      try {
        const pistonRes = await fetch(PISTON_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(1500),
          body: JSON.stringify({
            language: langDef.pistonLang,
            version: "*",
            files: [{ name: mainFileName, content: req.code }],
            stdin: req.stdin || ""
          })
        });

        if (pistonRes.ok) {
          const data = await pistonRes.json();
          if (data.run) {
            return {
              stdout: (data.run.stdout || "").trim(),
              stderr: (data.run.stderr || data.compile?.stderr || "").trim(),
              exitCode: data.run.code !== undefined ? data.run.code : 0,
              timeMs: Date.now() - startTime
            };
          }
        }
      } catch (e) {}
    }

    // 4. Remote Execution Gateway (Judge0 CE API)
    if (langDef.judge0Id) {
      try {
        const judge0Res = await fetch(JUDGE0_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(1500),
          body: JSON.stringify({
            source_code: Buffer.from(req.code).toString("base64"),
            language_id: langDef.judge0Id,
            stdin: req.stdin ? Buffer.from(req.stdin).toString("base64") : "",
            base64_encoded: true
          })
        });

        if (judge0Res.ok) {
          const data = await judge0Res.json();
          
          const safeDecode = (str: string | null | undefined) => {
            if (!str) return "";
            try {
              const decoded = Buffer.from(str, "base64").toString("utf-8");
              if (/[\x00-\x08\x0E-\x1F]/.test(decoded)) return str;
              return decoded;
            } catch {
              return str;
            }
          };

          const stdout = safeDecode(data.stdout);
          const stderr = safeDecode(data.stderr) || safeDecode(data.compile_output);
          const statusId = data.status_id || 3;
          const exitCode = statusId === 3 ? 0 : statusId === 5 ? 124 : 1;

          return {
            stdout: stdout.trim(),
            stderr: stderr.trim(),
            exitCode,
            timeMs: data.time ? Math.round(parseFloat(data.time) * 1000) : Date.now() - startTime
          };
        }
      } catch (remoteErr) {}
    }

    // 5. Honest Status: Runtime Not Provisioned
    return {
      stdout: "",
      stderr: `[Runtime Status]: The execution runtime for '${langDef.name}' is not provisioned in the current sandbox environment.\nTo run '${langDef.name}', connect a container execution runner in Settings -> Execution Infrastructure.`,
      exitCode: 501,
      timeMs: 0
    };

  } finally {
    try { await fs.rm(tmpDir, { recursive: true, force: true }); } catch {}
  }
}

function checkBinaryAvailable(binary: string): Promise<boolean> {
  return new Promise((resolve) => {
    execFile("which", [binary], (err, stdout) => {
      resolve(!err && stdout.trim().length > 0);
    });
  });
}

function runCmd(
  cmd: string,
  args: string[],
  stdin: string,
  cwd: string,
  timeoutMs: number
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  return new Promise((resolve) => {
    const child = execFile(
      cmd,
      args,
      {
        cwd,
        env: getSanitizedEnv(),
        timeout: timeoutMs,
        maxBuffer: 10 * 1024 * 1024
      },
      (error, stdout, stderr) => {
        if (error && error.killed) {
          resolve({
            stdout: stdout.toString(),
            stderr: stderr.toString() + "\n[Execution Timeout]: Process exceeded 12-second limit.",
            exitCode: 124
          });
        } else {
          resolve({
            stdout: stdout.toString(),
            stderr: stderr.toString(),
            exitCode: error ? (typeof error.code === "number" ? error.code : 1) : 0
          });
        }
      }
    );

    if (stdin && child.stdin) {
      child.stdin.write(stdin);
      child.stdin.end();
    }
  });
}

async function detectGeneratedArtifacts(dir: string): Promise<{ name: string; url: string; type: string }[]> {
  const artifacts: { name: string; url: string; type: string }[] = [];
  try {
    const files = await fs.readdir(dir);
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if ([".png", ".jpg", ".jpeg", ".svg"].includes(ext)) {
        const fileBuf = await fs.readFile(path.join(dir, file));
        const mimeType = ext === ".svg" ? "image/svg+xml" : ext === ".png" ? "image/png" : "image/jpeg";
        artifacts.push({
          name: file,
          url: `data:${mimeType};base64,${fileBuf.toString("base64")}`,
          type: "image"
        });
      }
    }
  } catch (e) {}
  return artifacts;
}
