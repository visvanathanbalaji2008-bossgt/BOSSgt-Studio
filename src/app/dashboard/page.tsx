"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { Folder, Plus, Trash2, Clock, Terminal, Monitor } from "lucide-react";
import { useRouter } from "next/navigation";
import { getLocalProjects, LocalProject, saveLocalProject, removeLocalProject } from "@/lib/local-projects";

interface Project {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export default function Dashboard() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [localProjects, setLocalProjects] = useState<LocalProject[]>([]);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState<'cloud' | 'local'>('cloud');

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      // Load Local Projects
      const local = await getLocalProjects();
      if (mounted) setLocalProjects(local);

      // Load Cloud Projects
      if (!loading && !session) {
        if (mounted) setFetching(false);
        return;
      }

      if (session) {
        if (mounted) setFetching(true);
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("updated_at", { ascending: false }) as any;

        if (!error && data) {
          if (mounted) setProjects(data);
        }
        if (mounted) setFetching(false);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [session, loading]);

  const createCloudProject = async () => {
    if (!session) return alert("Please sign in first");
    
    const name = prompt("Enter cloud project name:", "New Project");
    if (!name) return;

    const { data, error } = await supabase
      .from("projects")
      .insert([{ name, user_id: session.user.id }] as any)
      .select() as any;

    if (error) {
      alert("Error creating project: " + error.message);
    } else if (data && data.length > 0) {
      router.push(`/editor?projectId=${data[0].id}`);
    }
  };

  const openLocalProject = async () => {
    try {
      // @ts-expect-error File System Access API
      const handle = await window.showDirectoryPicker();
      const id = "local_" + handle.name + "_" + Date.now();
      const newLocalProject: LocalProject = {
        id,
        name: handle.name,
        handle,
        updated_at: new Date().toISOString()
      };
      
      await saveLocalProject(newLocalProject);
      setLocalProjects(prev => [newLocalProject, ...prev]);
      router.push(`/editor?projectId=${id}`);
    } catch (e) {
      console.log("Local folder selection cancelled or failed", e);
    }
  };

  const deleteProject = async (e: React.MouseEvent, id: string, type: 'cloud' | 'local') => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to remove this ${type} project?`)) return;

    if (type === 'cloud') {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) {
        alert("Error deleting project: " + error.message);
      } else {
        setProjects(projects.filter(p => p.id !== id));
      }
    } else {
      await removeLocalProject(id);
      setLocalProjects(localProjects.filter(p => p.id !== id));
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
      <TopNavigation />
      
      <div className="flex-1 overflow-y-auto p-8 bg-editor">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">My Projects</h1>
              <p className="text-foreground/60">Manage your cloud workspaces and local folders.</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={openLocalProject}
                className="flex items-center gap-2 px-4 py-2 bg-panel border border-panel-border text-foreground rounded-md font-medium hover:bg-foreground/5 transition-colors shadow-sm"
              >
                <Monitor size={18} />
                Open Local Folder
              </button>
              <button
                onClick={createCloudProject}
                className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-md font-medium hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20"
              >
                <Plus size={18} />
                New Cloud Project
              </button>
            </div>
          </div>

          <div className="flex border-b border-panel-border mb-8 gap-6">
            <button 
              onClick={() => setActiveTab('cloud')}
              className={`pb-3 font-medium transition-colors border-b-2 ${activeTab === 'cloud' ? 'text-accent border-accent' : 'text-foreground/50 border-transparent hover:text-foreground'}`}
            >
              ☁ Cloud Projects
            </button>
            <button 
              onClick={() => setActiveTab('local')}
              className={`pb-3 font-medium transition-colors border-b-2 ${activeTab === 'local' ? 'text-accent border-accent' : 'text-foreground/50 border-transparent hover:text-foreground'}`}
            >
              💻 Local Projects
            </button>
          </div>

          {activeTab === 'cloud' ? (
            !session ? (
              <div className="flex flex-col items-center justify-center p-12 bg-panel border border-panel-border rounded-xl text-center">
                <Terminal size={48} className="text-foreground/20 mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">Sign in to view your projects</h2>
                <p className="text-foreground/60 mb-6 max-w-md">
                  Create an account or sign in to start building and saving projects in the cloud.
                </p>
              </div>
            ) : fetching ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 bg-panel border border-panel-border/50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-panel-border rounded-xl text-center bg-foreground/5">
                <Folder size={48} className="text-foreground/20 mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">No cloud projects yet</h2>
                <p className="text-foreground/60 mb-6">Create your first cloud workspace to start coding.</p>
                <button
                  onClick={createCloudProject}
                  className="flex items-center gap-2 px-4 py-2 bg-panel border border-panel-border text-foreground rounded-md font-medium hover:bg-foreground/5 transition-colors"
                >
                  <Plus size={18} />
                  Create Cloud Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => router.push(`/editor?projectId=${project.id}`)}
                    className="group relative flex flex-col p-5 bg-panel border border-panel-border rounded-xl hover:border-accent/50 hover:shadow-lg transition-all cursor-pointer overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2.5 bg-accent/10 text-accent rounded-lg">
                        <Folder size={20} fill="currentColor" className="opacity-80" />
                      </div>
                      <button
                        onClick={(e) => deleteProject(e, project.id, 'cloud')}
                        className="p-1.5 text-foreground/40 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete Project"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <h3 className="font-semibold text-lg text-foreground mb-1 truncate">
                      {project.name}
                    </h3>
                    
                    <div className="flex items-center gap-1.5 text-xs text-foreground/50 mt-auto pt-4 border-t border-panel-border/50">
                      <Clock size={12} />
                      <span>Updated {new Date(project.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            localProjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-panel-border rounded-xl text-center bg-foreground/5">
                <Monitor size={48} className="text-foreground/20 mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">No local projects mounted</h2>
                <p className="text-foreground/60 mb-6">Open a local folder on your computer to start coding locally.</p>
                <button
                  onClick={openLocalProject}
                  className="flex items-center gap-2 px-4 py-2 bg-panel border border-panel-border text-foreground rounded-md font-medium hover:bg-foreground/5 transition-colors"
                >
                  <Monitor size={18} />
                  Open Local Folder
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {localProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => router.push(`/editor?projectId=${project.id}`)}
                    className="group relative flex flex-col p-5 bg-panel border border-panel-border rounded-xl hover:border-accent/50 hover:shadow-lg transition-all cursor-pointer overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2.5 bg-green-500/10 text-green-400 rounded-lg">
                        <Monitor size={20} className="opacity-80" />
                      </div>
                      <button
                        onClick={(e) => deleteProject(e, project.id, 'local')}
                        className="p-1.5 text-foreground/40 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove Local Project"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <h3 className="font-semibold text-lg text-foreground mb-1 truncate">
                      {project.name}
                    </h3>
                    
                    <div className="flex items-center gap-1.5 text-xs text-foreground/50 mt-auto pt-4 border-t border-panel-border/50">
                      <Clock size={12} />
                      <span>Last accessed {new Date(project.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
