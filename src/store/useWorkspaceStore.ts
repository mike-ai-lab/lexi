import { create } from 'zustand';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { db, auth } from '../firebase';

export interface Project {
  id: string;
  name: string;
  createdAt: any;
  userId: string;
}

export interface FileData {
  id: string;
  projectId: string;
  name: string;
  path: string;
  type: string;
  content: string;
  lastModified: any;
  userId: string;
}

interface WorkspaceState {
  projects: Project[];
  currentProject: Project | null;
  files: FileData[];
  activeFileId: string | null;
  isSaving: boolean;
  isLoading: boolean;
  user: any | null;

  setUser: (user: any) => void;
  fetchProjects: () => void;
  setCurrentProject: (project: Project | null) => void;
  setFiles: (files: FileData[]) => void;
  setActiveFile: (fileId: string | null) => void;
  
  createProject: (name: string) => Promise<void>;
  createFile: (projectId: string, name: string, type: string) => Promise<void>;
  updateFileContent: (fileId: string, newContent: string) => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  projects: [],
  currentProject: null,
  files: [],
  activeFileId: null,
  isSaving: false,
  isLoading: false,
  user: null,

  setUser: (user) => set({ user }),

  fetchProjects: () => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, 'projects'), 
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    
    onSnapshot(q, (snapshot) => {
      const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      set({ projects });
    });
  },

  setCurrentProject: (project) => set({ currentProject: project, activeFileId: null, files: [] }),
  
  setFiles: (files) => {
    set({ files });
    if (files.length > 0 && !get().activeFileId) {
      set({ activeFileId: files[0].id });
    }
  },

  setActiveFile: (fileId) => set({ activeFileId: fileId }),

  createProject: async (name) => {
    const user = auth.currentUser;
    if (!user) return;
    await addDoc(collection(db, 'projects'), {
      name,
      userId: user.uid,
      createdAt: serverTimestamp()
    });
  },

  createFile: async (projectId, name, type) => {
    const user = auth.currentUser;
    if (!user) return;
    await addDoc(collection(db, 'files'), {
      projectId,
      name,
      path: name,
      type,
      content: '',
      lastModified: serverTimestamp(),
      userId: user.uid
    });
  },

  updateFileContent: async (fileId, newContent) => {
    set({ isSaving: true });
    try {
      await updateDoc(doc(db, 'files', fileId), {
        content: newContent,
        lastModified: serverTimestamp()
      });
    } finally {
      set({ isSaving: false });
    }
  },

  deleteFile: async (fileId) => {
    await deleteDoc(doc(db, 'files', fileId));
    if (get().activeFileId === fileId) {
      set({ activeFileId: null });
    }
  },

  deleteProject: async (projectId) => {
    await deleteDoc(doc(db, 'projects', projectId));
    if (get().currentProject?.id === projectId) {
      set({ currentProject: null, files: [], activeFileId: null });
    }
  }
}));
