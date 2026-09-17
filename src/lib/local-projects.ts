export interface LocalProject {
  id: string; // Typically "local_" + handle.name + timestamp
  name: string;
  handle: FileSystemDirectoryHandle;
  updated_at: string;
}

const LOCAL_PROJECTS_KEY = 'bossgt_local_projects';

export async function getLocalProjects(): Promise<LocalProject[]> {
  try {
    const { get } = await import('idb-keyval');
    const projects = await get<LocalProject[]>(LOCAL_PROJECTS_KEY);
    return projects || [];
  } catch (e) {
    console.error("Failed to read local projects", e);
    return [];
  }
}

export async function saveLocalProject(project: LocalProject): Promise<void> {
  try {
    const { get, set, update } = await import('idb-keyval');
    await update(LOCAL_PROJECTS_KEY, (val) => {
      const projects = (val as LocalProject[]) || [];
      // Remove any existing project with the same id
      const filtered = projects.filter(p => p.id !== project.id);
      return [project, ...filtered];
    });
  } catch (e) {
    console.error("Failed to save local project", e);
    try {
      const { get, set } = await import('idb-keyval');
      const current = await getLocalProjects();
      const filtered = current.filter(p => p.id !== project.id);
      await set(LOCAL_PROJECTS_KEY, [project, ...filtered]);
    } catch (innerErr) {
      console.error("Failed fallback save", innerErr);
    }
  }
}

export async function removeLocalProject(id: string): Promise<void> {
  try {
    const { update } = await import('idb-keyval');
    await update(LOCAL_PROJECTS_KEY, (val) => {
      const projects = (val as LocalProject[]) || [];
      return projects.filter(p => p.id !== id);
    });
  } catch (e) {
    console.error("Failed to remove local project", e);
  }
}

export async function getLocalProjectById(id: string): Promise<LocalProject | null> {
  const projects = await getLocalProjects();
  return projects.find(p => p.id === id) || null;
}
