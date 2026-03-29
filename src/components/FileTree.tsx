import React, { useEffect, useState } from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { FolderPlus, FilePlus, Trash2, ChevronRight, ChevronDown, Folder, FileText } from 'lucide-react';
import { db } from '../firebase';
import { query, collection, where, onSnapshot } from 'firebase/firestore';

export default function FileTree() {
  const { 
    projects, 
    currentProject, 
    files, 
    activeFileId, 
    fetchProjects, 
    setCurrentProject,
    setFiles,
    setActiveFile,
    createProject,
    createFile,
    deleteFile,
    deleteProject
  } = useWorkspaceStore();

  const [newProjectName, setNewProjectName] = useState('');
  const [showNewProject, setShowNewProject] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [showNewFile, setShowNewFile] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    const user = useWorkspaceStore.getState().user;
    if (!currentProject || !user) return;

    const q = query(
      collection(db, 'files'), 
      where('projectId', '==', currentProject.id),
      where('userId', '==', user.uid)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot: any) => {
      const files = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      setFiles(files);
    });

    return () => unsubscribe();
  }, [currentProject?.id, setFiles]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    await createProject(newProjectName);
    setNewProjectName('');
    setShowNewProject(false);
  };

  const handleCreateFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim() || !currentProject) return;
    const type = newFileName.split('.').pop() || 'txt';
    await createFile(currentProject.id, newFileName, type);
    setNewFileName('');
    setShowNewFile(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#252526] text-gray-300 select-none">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xs font-bold uppercase tracking-wider">Explorer</h2>
        <button 
          onClick={() => setShowNewProject(true)}
          className="p-1 hover:bg-gray-700 rounded transition"
          title="New Project"
        >
          <FolderPlus size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {showNewProject && (
          <form onSubmit={handleCreateProject} className="p-2">
            <input
              autoFocus
              className="w-full bg-gray-900 border border-blue-500 rounded px-2 py-1 text-sm outline-none"
              placeholder="Project Name..."
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onBlur={() => !newProjectName && setShowNewProject(false)}
            />
          </form>
        )}

        {projects.map(project => (
          <div key={project.id} className="group">
            <div 
              className={`flex items-center px-2 py-1 cursor-pointer hover:bg-[#2a2d2e] ${currentProject?.id === project.id ? 'bg-[#37373d] text-white' : ''}`}
              onClick={() => setCurrentProject(project)}
            >
              {currentProject?.id === project.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <Folder size={16} className="mx-1 text-blue-400" />
              <span className="text-sm truncate flex-1">{project.name}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {currentProject?.id === project.id && (
              <div className="ml-4 border-l border-gray-700">
                <div className="flex justify-between items-center px-2 py-1 hover:bg-[#2a2d2e]">
                  <span className="text-[10px] uppercase font-bold text-gray-500">Files</span>
                  <button 
                    onClick={() => setShowNewFile(true)}
                    className="p-1 hover:text-white transition"
                  >
                    <FilePlus size={14} />
                  </button>
                </div>

                {showNewFile && (
                  <form onSubmit={handleCreateFile} className="p-2">
                    <input
                      autoFocus
                      className="w-full bg-gray-900 border border-blue-500 rounded px-2 py-1 text-sm outline-none"
                      placeholder="file.js..."
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      onBlur={() => !newFileName && setShowNewFile(false)}
                    />
                  </form>
                )}

                {files.length === 0 && !showNewFile && (
                  <div className="p-4 text-center">
                    <p className="text-[10px] text-gray-500 mb-2">No files yet</p>
                    <button 
                      onClick={() => setShowNewFile(true)}
                      className="text-[10px] bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition font-bold uppercase"
                    >
                      Create File
                    </button>
                  </div>
                )}

                {files.map(file => (
                  <div 
                    key={file.id}
                    className={`group flex items-center px-2 py-1 cursor-pointer hover:bg-[#2a2d2e] ${activeFileId === file.id ? 'bg-[#37373d] text-white border-l-2 border-blue-500' : ''}`}
                    onClick={() => setActiveFile(file.id)}
                  >
                    <FileText size={14} className="mr-2 text-gray-400" />
                    <span className="text-sm truncate flex-1">{file.name}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteFile(file.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
