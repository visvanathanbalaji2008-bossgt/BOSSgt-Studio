import { useState, useCallback, useEffect } from 'react';
import { getLanguageByExtension } from '@/components/editor/editor-config';

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
  mode?: 'edit' | 'diff';
  originalContent?: string;
}

export function useWorkspace() {
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFilePath, setActiveFilePath] = useState<string | null>(null);

  const fetchTree = useCallback(async () => {
    try {
      const res = await fetch('/api/fs?action=tree');
      if (res.ok) {
        const data = await res.json();
        setFileTree(data);
      }
    } catch (error) {
      console.error("Failed to fetch file tree", error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTree();
  }, [fetchTree]);

  const openFile = useCallback(async (path: string, name: string) => {
    const existing = openFiles.find(f => f.path === path);
    if (existing) {
      setActiveFilePath(path);
      return;
    }

    try {
      const res = await fetch(`/api/fs?action=read&path=${encodeURIComponent(path)}`);
      if (res.ok) {
        const { content } = await res.json();
        const langConfig = getLanguageByExtension(name);
        
        const newFile: OpenFile = {
          path,
          name,
          content,
          savedContent: content,
          languageId: langConfig.id,
          mode: 'edit'
        };
        
        setOpenFiles(prev => [...prev, newFile]);
        setActiveFilePath(path);
      }
    } catch (error) {
      console.error("Failed to read file", error);
    }
  }, [openFiles]);

  const openDiff = useCallback(async (path: string, name: string) => {
    try {
      const gitRes = await fetch('/api/git', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'show', payload: { file: path } })
      });
      const { content: originalContent } = await gitRes.json();

      const fsRes = await fetch(`/api/fs?action=read&path=${encodeURIComponent(path)}`);
      if (fsRes.ok) {
        const { content: modifiedContent } = await fsRes.json();
        const langConfig = getLanguageByExtension(name);
        
        const diffPath = `diff://${path}`;
        const newFile: OpenFile = {
          path: diffPath,
          name: `(Diff) ${name}`,
          content: modifiedContent,
          savedContent: modifiedContent,
          originalContent,
          mode: 'diff',
          languageId: langConfig.id
        };
        
        setOpenFiles(prev => {
          const filtered = prev.filter(f => f.path !== diffPath);
          return [...filtered, newFile];
        });
        setActiveFilePath(diffPath);
      }
    } catch (error) {
      console.error("Failed to open diff", error);
    }
  }, []);

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

    try {
      const res = await fetch('/api/fs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save', path, content: file.content })
      });
      if (res.ok) {
        setOpenFiles(prev => prev.map(f => f.path === path ? { ...f, savedContent: file.content } : f));
      }
    } catch (error) {
      console.error("Failed to save file", error);
    }
  }, [openFiles]);

  const createFile = useCallback(async (path: string) => {
    try {
      await fetch('/api/fs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_file', path, content: '' })
      });
      await fetchTree();
    } catch (error) {
      console.error(error);
    }
  }, [fetchTree]);

  const createFolder = useCallback(async (path: string) => {
    try {
      await fetch('/api/fs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_dir', path })
      });
      await fetchTree();
    } catch (error) {
      console.error(error);
    }
  }, [fetchTree]);

  const deletePath = useCallback(async (path: string) => {
    try {
      await fetch(`/api/fs?path=${encodeURIComponent(path)}`, { method: 'DELETE' });
      // If deleting an open file
      closeFile(path);
      await fetchTree();
    } catch (error) {
      console.error(error);
    }
  }, [fetchTree, closeFile]);

  const renamePath = useCallback(async (oldPath: string, newPath: string) => {
    try {
      await fetch('/api/fs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'rename', path: oldPath, newPath })
      });
      // Updating tabs if open file is renamed could be complex, for now we close it
      closeFile(oldPath);
      await fetchTree();
    } catch (error) {
      console.error(error);
    }
  }, [fetchTree, closeFile]);
  
  const updateActiveLanguage = useCallback((langId: string) => {
    if (!activeFilePath) return;
    setOpenFiles(prev => prev.map(f => f.path === activeFilePath ? { ...f, languageId: langId } : f));
  }, [activeFilePath]);

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
    renamePath,
    updateActiveLanguage,
    openDiff
  };
}
