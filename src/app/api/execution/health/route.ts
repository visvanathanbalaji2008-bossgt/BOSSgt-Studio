import { NextResponse } from "next/server";
import { LANGUAGE_REGISTRY } from "@/lib/language-registry";
import os from "os";

export const runtime = "nodejs";

export async function GET() {
  const activeRuntimes = Object.keys(LANGUAGE_REGISTRY).length;

  return NextResponse.json({
    status: "healthy",
    engine: "BOSSgt Studio Sandboxed Execution Gateway",
    judge0Integration: "active",
    nclEngine: "active",
    availableRuntimesCount: activeRuntimes,
    system: {
      platform: os.platform(),
      cpus: os.cpus().length,
      freeMemory: `${Math.round(os.freemem() / 1024 / 1024)} MB`,
      totalMemory: `${Math.round(os.totalmem() / 1024 / 1024)} MB`
    },
    sandbox: {
      isolation: "chroot_temp_workspace",
      timeoutMs: 12000,
      memoryLimit: "512MB",
      networkAccess: "isolated"
    }
  });
}
