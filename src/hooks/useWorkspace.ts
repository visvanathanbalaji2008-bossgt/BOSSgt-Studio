// @ts-nocheck
import { useState, useCallback, useEffect, useRef } from 'react';
import { getLanguageByExtension } from '@/components/editor/editor-config';
import { supabase } from '@/lib/supabase';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';


export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'dir';
  children?: FileNode[];
}

export interface OpenFile {
  path: string;
  name: string;
  content: string;
  savedContent: string;
  languageId: string;
  mode?: 'edit' | 'diff' | 'preview';
  originalContent?: string;
}

export function useWorkspace(projectId?: string | null) {
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFilePath, setActiveFilePath] = useState<string | null>(null);
  const [terminalOutput, setTerminalOutput] = useState<string>("");

  const openFilesRef = useRef<OpenFile[]>(openFiles);
  useEffect(() => {
    openFilesRef.current = openFiles;
  }, [openFiles]);

  // Helper to build a tree from flat paths
  const buildTreeFromPaths = (paths: string[]): FileNode[] => {
    const root: FileNode[] = [];
    
    paths.forEach(path => {
      const parts = path.split('/');
      let currentLevel = root;
      
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isFile = i === parts.length - 1;
        const currentPath = parts.slice(0, i + 1).join('/');
        
        let node = currentLevel.find(n => n.name === part);
        if (!node) {
          node = {
            name: part,
            path: currentPath,
            type: isFile ? 'file' : 'dir',
            children: isFile ? undefined : []
          };
          currentLevel.push(node);
        }
        
        if (!isFile) {
          currentLevel = node.children!;
        }
      }
    });

    // Sort dirs first, then files
    const sortTree = (nodes: FileNode[]) => {
      nodes.sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === 'dir' ? -1 : 1;
      });
      nodes.forEach(n => n.children && sortTree(n.children));
    };
    
    sortTree(root);
    return root;
  };

  const openFile = useCallback(async (path: string, name?: string) => {
    const fileName = name || path.split('/').pop() || path;
    
    const existing = openFilesRef.current.find(f => f.path === path);
    if (existing) {
      setActiveFilePath(path);
      return;
    }

    let content = '';
    
    if (!projectId) {
      const localFiles = JSON.parse(localStorage.getItem('bossgt_files') || '[]');
      const file = localFiles.find((f: any) => f.path === path);
      if (!file) {
        console.error(`Failed to read file ${path}: File not found in localStorage.`);
        return;
      }
      content = file.content;
    } else {
      try {
        const { data, error } = await supabase
          .from('files')
          .select('content')
          .eq('project_id', projectId)
          .eq('path', path)
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        
        if (!data) {
          throw new Error('File not found in database');
        }
        content = data.content || '';
      } catch (err: any) {
        console.warn(`Failed to read file from Supabase, checking local storage.`, err);
        const localFiles = JSON.parse(localStorage.getItem('bossgt_files') || '[]');
        const file = localFiles.find((f: any) => f.path === path);
        if (!file) {
          return;
        }
        content = file.content;
      }
    }

    let langId = getLanguageByExtension(fileName).id;
    try {
      const overrides = JSON.parse(localStorage.getItem('bossgt_lang_overrides') || '{}');
      if (overrides[path]) {
        langId = overrides[path];
      }
    } catch (e) {}

    const newFile: OpenFile = {
      path,
      name: fileName,
      content: content,
      savedContent: content,
      languageId: langId,
      mode: 'edit'
    };

    setOpenFiles(prev => {
      if (prev.some(f => f.path === path)) {
        return prev.map(f => f.path === path ? newFile : f);
      }
      return [...prev, newFile];
    });
    setActiveFilePath(path);
  }, [projectId]);

  const closeFile = useCallback((path: string) => {
    setOpenFiles(prev => {
      const filtered = prev.filter(f => f.path !== path);
      setActiveFilePath(current => {
        if (current === path) {
          return filtered.length > 0 ? filtered[filtered.length - 1].path : null;
        }
        return current;
      });
      return filtered;
    });
  }, []);

  const fetchTree = useCallback(async () => {
    if (!projectId) {
      let localFiles = JSON.parse(localStorage.getItem('bossgt_files') || '[]');
      if (localFiles.length === 0) {
        localFiles = [
          { path: 'main.py', content: '# Welcome to BOSSgt Studio\nprint("Hello from BOSSgt Studio Neural Forge!")\n', updated_at: new Date().toISOString() },
          { path: 'README.md', content: '# BOSSgt Studio Project\nIsolated 200-language execution environment.\n', updated_at: new Date().toISOString() }
        ];
        localStorage.setItem('bossgt_files', JSON.stringify(localFiles));
      }
      const paths = Array.from(new Set(localFiles.map((f: any) => f.path)));
      setFileTree(buildTreeFromPaths(paths));
      if (paths.length > 0 && openFilesRef.current.length === 0) {
        openFile(paths[0]);
      }
      return;
    }
    
    try {
      const { data, error } = await (supabase
        .from('files')
        .select('path')
        .eq('project_id', projectId) as any);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const paths = Array.from(new Set(data.map((f: any) => f.path)));
        setFileTree(buildTreeFromPaths(paths));
        if (paths.length > 0 && openFilesRef.current.length === 0) {
          openFile(paths[0]);
        }
      } else {
        // Seed default initial files for new cloud project
        const defaultFiles = [
          { project_id: projectId, path: 'main.py', content: '# Welcome to BOSSgt Studio\nprint("Hello from BOSSgt Studio Neural Forge!")\n' },
          { project_id: projectId, path: 'README.md', content: '# BOSSgt Studio Project\nIsolated 200-language execution environment.\n' }
        ];
        await supabase.from('files').insert(defaultFiles as any);
        setFileTree(buildTreeFromPaths(['main.py', 'README.md']));
        if (openFilesRef.current.length === 0) {
          openFile('main.py');
        }
      }
    } catch (err: any) {
      console.warn("Supabase fetch failed, falling back to local storage.", err);
      let localFiles = JSON.parse(localStorage.getItem('bossgt_files') || '[]');
      if (localFiles.length === 0) {
        localFiles = [
          { path: 'main.py', content: '# Welcome to BOSSgt Studio\nprint("Hello from BOSSgt Studio Neural Forge!")\n', updated_at: new Date().toISOString() },
          { path: 'README.md', content: '# BOSSgt Studio Project\nIsolated 200-language execution environment.\n', updated_at: new Date().toISOString() }
        ];
        localStorage.setItem('bossgt_files', JSON.stringify(localFiles));
      }
      const paths = Array.from(new Set(localFiles.map((f: any) => f.path)));
      setFileTree(buildTreeFromPaths(paths));
      if (paths.length > 0 && openFilesRef.current.length === 0) {
        openFile(paths[0]);
      }
    }
  }, [projectId, openFile]);

  useEffect(() => {
    fetchTree();
  }, [fetchTree]);

  const updateFileContent = useCallback((path: string, newContent: string) => {
    setOpenFiles(prev => prev.map(f => f.path === path ? { ...f, content: newContent } : f));
  }, []);

  const saveFile = useCallback(async (path: string) => {
    const file = openFilesRef.current.find(f => f.path === path);
    if (!file) return;

    if (!projectId) {
      const localFiles = JSON.parse(localStorage.getItem('bossgt_files') || '[]');
      const index = localFiles.findIndex((f: any) => f.path === path);
      if (index > -1) {
        localFiles[index].content = file.content;
        localFiles[index].updated_at = new Date().toISOString();
        localStorage.setItem('bossgt_files', JSON.stringify(localFiles));
      }
      setOpenFiles(prev => prev.map(f => f.path === path ? { ...f, savedContent: file.content } : f));
      return;
    }

    try {
      const { error } = await supabase
        .from('files')
        .update({ content: file.content, updated_at: new Date().toISOString() })
        .eq('project_id', projectId)
        .eq('path', path);

      if (error) throw error;
      
      await supabase.from('projects').update({ updated_at: new Date().toISOString() }).eq('id', projectId);
    } catch (err) {
      console.warn("Failed to save file to Supabase, saving to local storage.", err);
      const localFiles = JSON.parse(localStorage.getItem('bossgt_files') || '[]');
      const index = localFiles.findIndex((f: any) => f.path === path);
      if (index > -1) {
        localFiles[index].content = file.content;
        localFiles[index].updated_at = new Date().toISOString();
      } else {
        localFiles.push({ path, content: file.content, updated_at: new Date().toISOString() });
      }
      localStorage.setItem('bossgt_files', JSON.stringify(localFiles));
    }
    
    setOpenFiles(prev => prev.map(f => f.path === path ? { ...f, savedContent: file.content } : f));
  }, [projectId]);

  const createFile = useCallback(async (path: string) => {
    if (!projectId) {
      const localFiles = JSON.parse(localStorage.getItem('bossgt_files') || '[]');
      if (localFiles.find((f: any) => f.path === path)) {
        console.warn(`File ${path} already exists.`);
        await openFile(path);
        return;
      }
      localFiles.push({ path, content: '', updated_at: new Date().toISOString() });
      localStorage.setItem('bossgt_files', JSON.stringify(localFiles));
      await fetchTree();
      await openFile(path);
      return;
    }
    
    try {
      const { data: existing } = await supabase
        .from('files')
        .select('id')
        .eq('project_id', projectId)
        .eq('path', path)
        .limit(1)
        .maybeSingle();
        
      if (existing) {
        console.warn(`File ${path} already exists.`);
        await openFile(path);
        return;
      }

      const { error } = await supabase
        .from('files')
        .insert({ project_id: projectId, path, content: '' });
        
      if (error) throw error;
    } catch (err: any) {
      console.warn(`Create file error for ${path}, saving locally.`, err);
      const localFiles = JSON.parse(localStorage.getItem('bossgt_files') || '[]');
      if (!localFiles.find((f: any) => f.path === path)) {
        localFiles.push({ path, content: '', updated_at: new Date().toISOString() });
        localStorage.setItem('bossgt_files', JSON.stringify(localFiles));
      }
    }
    
    await fetchTree();
    await openFile(path);
  }, [fetchTree, projectId, openFile]);

  const createFolder = useCallback(async (path: string) => {
    const keepPath = `${path}/.keep`;
    if (!projectId) {
      const localFiles = JSON.parse(localStorage.getItem('bossgt_files') || '[]');
      if (!localFiles.find((f: any) => f.path === keepPath)) {
        localFiles.push({ path: keepPath, content: '', updated_at: new Date().toISOString() });
        localStorage.setItem('bossgt_files', JSON.stringify(localFiles));
      }
      fetchTree();
      return;
    }
    
    try {
      const { error } = await supabase
        .from('files')
        .insert({ project_id: projectId, path: keepPath, content: '' });
      if (error) throw error;
    } catch (err) {
      console.warn("Create folder error, saving locally.", err);
      const localFiles = JSON.parse(localStorage.getItem('bossgt_files') || '[]');
      if (!localFiles.find((f: any) => f.path === keepPath)) {
        localFiles.push({ path: keepPath, content: '', updated_at: new Date().toISOString() });
        localStorage.setItem('bossgt_files', JSON.stringify(localFiles));
      }
    }
    fetchTree();
  }, [fetchTree, projectId]);

  const deletePath = useCallback(async (path: string) => {
    if (!projectId) {
      let localFiles = JSON.parse(localStorage.getItem('bossgt_files') || '[]');
      localFiles = localFiles.filter((f: any) => !f.path.startsWith(path));
      localStorage.setItem('bossgt_files', JSON.stringify(localFiles));
      closeFile(path);
      fetchTree();
      return;
    }
    
    try {
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('project_id', projectId)
        .ilike('path', `${path}%`);

      if (error) throw error;
    } catch (err) {
      console.warn("Delete error, trying locally.", err);
      let localFiles = JSON.parse(localStorage.getItem('bossgt_files') || '[]');
      localFiles = localFiles.filter((f: any) => !f.path.startsWith(path));
      localStorage.setItem('bossgt_files', JSON.stringify(localFiles));
    }
    closeFile(path);
    fetchTree();
  }, [fetchTree, closeFile, projectId]);

  const renamePath = useCallback(async (oldPath: string, newPath: string) => {
    if (!projectId) {
      const localFiles = JSON.parse(localStorage.getItem('bossgt_files') || '[]');
      localFiles.forEach((f: any) => {
        if (f.path.startsWith(oldPath)) {
          f.path = f.path.replace(oldPath, newPath);
          f.updated_at = new Date().toISOString();
        }
      });
      localStorage.setItem('bossgt_files', JSON.stringify(localFiles));
      closeFile(oldPath);
      fetchTree();
      return;
    }
    
    try {
      const { data, error: readErr } = await supabase
        .from('files')
        .select('id, path')
        .eq('project_id', projectId)
        .ilike('path', `${oldPath}%`);
        
      if (readErr) throw readErr;
      
      if (data) {
        for (const f of data) {
          const updatedPath = f.path.replace(oldPath, newPath);
          await supabase.from('files').update({ path: updatedPath, updated_at: new Date().toISOString() }).eq('id', f.id);
        }
      }
    } catch (err) {
      console.warn("Rename error, trying locally.", err);
      const localFiles = JSON.parse(localStorage.getItem('bossgt_files') || '[]');
      localFiles.forEach((f: any) => {
        if (f.path.startsWith(oldPath)) {
          f.path = f.path.replace(oldPath, newPath);
          f.updated_at = new Date().toISOString();
        }
      });
      localStorage.setItem('bossgt_files', JSON.stringify(localFiles));
    }

    closeFile(oldPath);
    fetchTree();
  }, [fetchTree, closeFile, projectId]);

  const updateActiveLanguage = useCallback((langId: string) => {
    if (!activeFilePath) return;
    try {
      const overrides = JSON.parse(localStorage.getItem('bossgt_lang_overrides') || '{}');
      overrides[activeFilePath] = langId;
      localStorage.setItem('bossgt_lang_overrides', JSON.stringify(overrides));
    } catch (e) {}
    setOpenFiles(prev => prev.map(f => f.path === activeFilePath ? { ...f, languageId: langId } : f));
  }, [activeFilePath]);

  const openDiff = useCallback(async (path?: string, name?: string) => {
    // Disabled Git Diff for public version
    alert("Source control is disabled in the public cloud IDE.");
  }, []);

  const downloadProject = useCallback(async () => {
    if (!projectId) {
      alert("No project loaded.");
      return;
    }

    const { data, error } = await supabase
      .from('files')
      .select('path, content')
      .eq('project_id', projectId);

    if (error || !data) {
      alert("Failed to fetch project files for download.");
      return;
    }

    const zip = new JSZip();
    data.forEach(file => {
      // Don't include mock folders
      if (file.path.endsWith('/.keep')) return;
      zip.file(file.path, file.content || "");
    });

    try {
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "project.zip");
    } catch (e) {
      console.error("Failed to generate zip", e);
      alert("Failed to generate project zip.");
    }
  }, [projectId]);

  return {
    fileTree,
    openFiles,
    activeFilePath,
    openFile,
    closeFile,
    updateFileContent,
    saveFile,
    createFile,
    createFolder,
    deletePath,
    deleteNode: deletePath,
    renamePath,
    renameNode: renamePath,
    updateActiveLanguage,
    openDiff,
    downloadProject,
    githubToken: "",
    setGithubToken: (token: string) => {},
    projectId,
    terminalOutput,
    setTerminalOutput,
    setFileLanguage: (path: string, langId: string) => {
      try {
        const overrides = JSON.parse(localStorage.getItem('bossgt_lang_overrides') || '{}');
        overrides[path] = langId;
        localStorage.setItem('bossgt_lang_overrides', JSON.stringify(overrides));
      } catch (e) {}
      setOpenFiles(prev => prev.map(f => f.path === path ? { ...f, languageId: langId } : f));
    },
    setFileMode: (path: string, mode: 'edit' | 'diff' | 'preview') => {
      setOpenFiles(prev => prev.map(f => f.path === path ? { ...f, mode } : f));
    }
  };
}
