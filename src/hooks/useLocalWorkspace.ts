// @ts-nocheck
import { useState, useCallback, useEffect } from 'react';
import { getLanguageByExtension } from '@/components/editor/editor-config';
import { getLocalProjectById } from '@/lib/local-projects';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'dir';
  children?: FileNode[];
  handle?: FileSystemHandle;
}

export interface OpenFile {
  path: string;
  name: string;
  content: string;
  savedContent: string;
  languageId: string;
  mode?: 'edit' | 'diff';
  originalContent?: string;
}

export function useLocalWorkspace(projectId?: string | null) {
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFilePath, setActiveFilePath] = useState<string | null>(null);
  const [rootHandle, setRootHandle] = useState<FileSystemDirectoryHandle | null>(null);

  // Fallback map to resolve path -> handle, since building a tree is easier than traversing handles repeatedly
  const [handleMap, setHandleMap] = useState<Map<string, FileSystemHandle>>(new Map());

  const fetchTree = useCallback(async () => {
    if (!projectId || !projectId.startsWith("local_")) return;
    
    try {
      const project = await getLocalProjectById(projectId);
      if (!project || !project.handle) return;
      
      const handle = project.handle;
      
      // Request permission if needed
      const permission = await handle.queryPermission({ mode: 'readwrite' });
      if (permission !== 'granted') {
        const newPerm = await handle.requestPermission({ mode: 'readwrite' });
        if (newPerm !== 'granted') {
          console.error("Permission denied for local project folder");
          return;
        }
      }

      setRootHandle(handle);

      const newHandleMap = new Map<string, FileSystemHandle>();
      
      // Recursive function to read directory
      const readDir = async (dirHandle: FileSystemDirectoryHandle, currentPath: string): Promise<FileNode[]> => {
        const nodes: FileNode[] = [];
        // @ts-expect-error values() is part of the API
        for await (const entry of dirHandle.values()) {
          const path = currentPath ? `${currentPath}/${entry.name}` : entry.name;
          newHandleMap.set(path, entry);
          
          if (entry.kind === 'file') {
            nodes.push({ name: entry.name, path, type: 'file', handle: entry });
          } else if (entry.kind === 'directory') {
            const children = await readDir(entry as FileSystemDirectoryHandle, path);
            nodes.push({ name: entry.name, path, type: 'dir', children, handle: entry });
          }
        }
        
        nodes.sort((a, b) => {
          if (a.type === b.type) return a.name.localeCompare(b.name);
          return a.type === 'dir' ? -1 : 1;
        });
        
        return nodes;
      };

      const tree = await readDir(handle, "");
      setHandleMap(newHandleMap);
      setFileTree(tree);
      
    } catch (err) {
      console.error("Failed to load local directory", err);
    }
  }, [projectId]);

  useEffect(() => {
    fetchTree();
  }, [fetchTree]);

  const openFile = useCallback(async (path: string, name?: string) => {
    if (!rootHandle) return;
    const fileName = name || path.split('/').pop() || path;
    
    const existing = openFiles.find(f => f.path === path);
    if (existing) {
      setActiveFilePath(path);
      return;
    }

    const handle = handleMap.get(path) as FileSystemFileHandle;
    if (!handle || handle.kind !== 'file') return;

    try {
      const file = await handle.getFile();
      const content = await file.text();
      const langConfig = getLanguageByExtension(fileName);
      
      const newFile: OpenFile = {
        path,
        name: fileName,
        content,
        savedContent: content,
        languageId: langConfig.id,
        mode: 'edit'
      };

      setOpenFiles(prev => [...prev, newFile]);
      setActiveFilePath(path);
    } catch (err: any) {
      const errMsg = err.message || JSON.stringify(err);
      console.error(`Failed to read local file ${path}: ${errMsg}`, err);
      alert(`Failed to read local file ${path}: ${errMsg}`);
    }
  }, [openFiles, rootHandle, handleMap]);

  const closeFile = useCallback((path: string) => {
    setOpenFiles(prev => {
      const filtered = prev.filter(f => f.path !== path);
      if (activeFilePath === path) {
        setActiveFilePath(filtered.length > 0 ? filtered[filtered.length - 1].path : null);
      }
      return filtered;
    });
  }, [activeFilePath]);

  const updateFileContent = useCallback((path: string, newContent: string) => {
    setOpenFiles(prev => prev.map(f => f.path === path ? { ...f, content: newContent } : f));
  }, []);

  const saveFile = useCallback(async (path: string) => {
    const file = openFiles.find(f => f.path === path);
    if (!file) return;

    const handle = handleMap.get(path) as FileSystemFileHandle;
    if (!handle || handle.kind !== 'file') return;

    try {
      // @ts-expect-error createWritable is part of the API
      const writable = await handle.createWritable();
      await writable.write(file.content);
      await writable.close();

      setOpenFiles(prev => prev.map(f => f.path === path ? { ...f, savedContent: file.content } : f));
    } catch (err) {
      console.error("Failed to save local file", err);
      alert("Failed to save local file. Permission may be denied.");
    }
  }, [openFiles, handleMap]);

  const createFile = useCallback(async (path: string) => {
    if (!rootHandle) return;
    const parts = path.split('/');
    const name = parts.pop();
    if (!name) return;
    
    let currentHandle = rootHandle;
    
    try {
      // Traverse to correct dir
      for (const part of parts) {
        currentHandle = await currentHandle.getDirectoryHandle(part, { create: true });
      }
      
      
      // Create file
      await currentHandle.getFileHandle(name, { create: true });
      await fetchTree();
      await openFile(path);
    } catch (err: any) {
      const errMsg = err.message || JSON.stringify(err);
      console.error(`Failed to create local file ${path}: ${errMsg}`, err);
      alert(`Failed to create local file ${path}: ${errMsg}`);
    }
  }, [rootHandle, fetchTree, openFile]);

  const createFolder = useCallback(async (path: string) => {
    if (!rootHandle) return;
    const parts = path.split('/');
    let currentHandle = rootHandle;
    
    try {
      for (const part of parts) {
        currentHandle = await currentHandle.getDirectoryHandle(part, { create: true });
      }
      await fetchTree();
    } catch (err) {
      console.error("Failed to create folder", err);
    }
  }, [rootHandle, fetchTree]);

  const deletePath = useCallback(async (path: string) => {
    if (!rootHandle) return;
    const parts = path.split('/');
    const name = parts.pop();
    if (!name) return;
    
    let currentHandle = rootHandle;
    try {
      for (const part of parts) {
        currentHandle = await currentHandle.getDirectoryHandle(part);
      }
      
      const targetHandle = handleMap.get(path);
      if (targetHandle?.kind === 'directory') {
        // @ts-expect-error removeEntry recursive is part of the API
        await currentHandle.removeEntry(name, { recursive: true });
      } else {
        await currentHandle.removeEntry(name);
      }
      
      closeFile(path);
      await fetchTree();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  }, [rootHandle, handleMap, closeFile, fetchTree]);

  const renamePath = useCallback(async (oldPath: string, newPath: string) => {
    alert("Rename is not fully supported by the browser File System Access API yet. Please create a new file and delete the old one.");
  }, []);

  const updateActiveLanguage = useCallback((langId: string) => {
    if (!activeFilePath) return;
    setOpenFiles(prev => prev.map(f => f.path === activeFilePath ? { ...f, languageId: langId } : f));
  }, [activeFilePath]);

  const openDiff = useCallback(async (path?: string, name?: string) => {
    // Disabled Git Diff for local version
    alert("Source control is disabled in the local workspace.");
  }, []);

  const downloadProject = useCallback(async () => {
    alert("You are already working locally on your computer!");
  }, []);

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
    projectId: 'local',
    terminalOutput: "",
    setTerminalOutput: () => {},
    setFileLanguage: (path: string, langId: string) => {
      setOpenFiles(prev => prev.map(f => f.path === path ? { ...f, languageId: langId } : f));
    },
    setFileMode: (path: string, mode: 'edit' | 'diff' | 'preview') => {
      setOpenFiles(prev => prev.map(f => f.path === path ? { ...f, mode } : f));
    }
  };
}
