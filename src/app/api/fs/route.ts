import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Security: Prevent path traversal
function getSafePath(relativePath: string) {
  const root = process.cwd();
  const safePath = path.resolve(/*turbopackIgnore: true*/ root, relativePath);
  if (!safePath.startsWith(root)) {
    throw new Error("Invalid path");
  }
  return safePath;
}

export interface FileNode {
  name: string;
  path: string; // Relative to project root
  type: 'file' | 'dir';
  children?: FileNode[];
}

async function buildTree(relativePath: string): Promise<FileNode[]> {
  const safePath = getSafePath(relativePath);
  const entries = await fs.readdir(/*turbopackIgnore: true*/ safePath, { withFileTypes: true });
  
  const nodes: FileNode[] = [];
  
  for (const entry of entries) {
    // Ignore hidden files and standard project artifacts
    if (entry.name.startsWith('.') || entry.name === 'node_modules') {
      continue;
    }
    
    const nodePath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
    const isDirectory = entry.isDirectory();
    
    const node: FileNode = {
      name: entry.name,
      path: nodePath,
      type: isDirectory ? 'dir' : 'file',
    };
    
    if (isDirectory) {
      node.children = await buildTree(nodePath);
    }
    
    nodes.push(node);
  }
  
  // Sort: Dirs first, then files, alphabetically
  nodes.sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === 'dir' ? -1 : 1;
  });
  
  return nodes;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    if (action === 'tree') {
      const tree = await buildTree('');
      return NextResponse.json(tree);
    } 
    else if (action === 'read') {
      const filePath = searchParams.get('path');
      if (!filePath) return NextResponse.json({ error: "Missing path" }, { status: 400 });
      const safePath = getSafePath(filePath);
      const content = await fs.readFile(safePath, 'utf-8');
      return NextResponse.json({ content });
    }
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, path: reqPath, content, newPath } = body;

    if (!reqPath) return NextResponse.json({ error: "Missing path" }, { status: 400 });
    const safePath = getSafePath(reqPath);

    if (action === 'create_file') {
      await fs.writeFile(safePath, content || '', 'utf-8');
      return NextResponse.json({ success: true });
    } 
    else if (action === 'create_dir') {
      await fs.mkdir(safePath, { recursive: true });
      return NextResponse.json({ success: true });
    } 
    else if (action === 'save') {
      await fs.writeFile(safePath, content, 'utf-8');
      return NextResponse.json({ success: true });
    } 
    else if (action === 'rename') {
      if (!newPath) return NextResponse.json({ error: "Missing newPath" }, { status: 400 });
      const safeNewPath = getSafePath(newPath);
      await fs.rename(safePath, safeNewPath);
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const reqPath = searchParams.get('path');
  
  try {
    if (!reqPath) return NextResponse.json({ error: "Missing path" }, { status: 400 });
    const safePath = getSafePath(reqPath);
    await fs.rm(safePath, { recursive: true, force: true });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
