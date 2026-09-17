import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Use service role key if available for backend, otherwise fallback to anon
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const WORKSPACE_ROOT = path.join('/tmp', 'bossgt-workspaces');

export async function syncWorkspaceToDisk(projectId: string): Promise<string> {
  const projectDir = path.join(WORKSPACE_ROOT, projectId);
  
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true });
  }

  // Fetch all files for this project
  const { data: files, error } = await supabase
    .from('files')
    .select('path, content')
    .eq('project_id', projectId);

  if (error) {
    console.error("Failed to fetch project files for sync:", error);
    throw new Error("Sync failed");
  }

  // Write files to disk
  if (files) {
    for (const file of files) {
      if (file.path.endsWith('/.keep')) continue; // Skip mock folders
      
      const fullPath = path.join(projectDir, file.path);
      const dir = path.dirname(fullPath);
      
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(fullPath, file.content || '', 'utf8');
    }
  }

  return projectDir;
}

export async function syncDiskToWorkspace(projectId: string): Promise<void> {
  const projectDir = path.join(WORKSPACE_ROOT, projectId);
  if (!fs.existsSync(projectDir)) return;

  // Read all files recursively
  const getAllFiles = (dirPath: string, arrayOfFiles: string[] = []) => {
    const files = fs.readdirSync(dirPath);
    
    files.forEach((file) => {
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        // Exclude huge dirs
        if (file !== 'node_modules' && file !== '.git' && file !== '.next') {
          arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        }
      } else {
        arrayOfFiles.push(fullPath);
      }
    });
    return arrayOfFiles;
  };

  const allFiles = getAllFiles(projectDir);
  
  // Update or insert into Supabase
  for (const fullPath of allFiles) {
    const relativePath = path.relative(projectDir, fullPath);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Check if exists
    const { data: existing } = await supabase
      .from('files')
      .select('id')
      .eq('project_id', projectId)
      .eq('path', relativePath)
      .single();
      
    if (existing) {
      await supabase
        .from('files')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('files')
        .insert({
          project_id: projectId,
          path: relativePath,
          content
        });
    }
  }
}
