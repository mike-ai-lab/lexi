import Editor from "@monaco-editor/react";
import { useWorkspaceStore } from "../store/useWorkspaceStore";
import { Loader2 } from "lucide-react";

export default function EditorContainer() {
  const { files, activeFileId, updateFileContent, isSaving, currentProject } = useWorkspaceStore();
  const activeFile = files.find(f => f.id === activeFileId);

  if (!activeFile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-[#1e1e1e]">
        <div className="p-8 border-2 border-dashed border-gray-800 rounded-xl text-center max-w-xs">
          <p className="text-lg font-medium mb-2 text-gray-300">
            {currentProject ? `Empty Project: ${currentProject.name}` : 'No project selected'}
          </p>
          <p className="text-sm mb-6">
            {currentProject 
              ? 'Create your first file to start building with LexiCode.' 
              : 'Select a project or create a new one to begin.'}
          </p>
          
          {!currentProject && (
            <div className="flex items-center gap-2 text-xs bg-gray-900 p-3 rounded-lg border border-gray-800">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              Use the sidebar to create your first project.
            </div>
          )}
        </div>
      </div>
    );
  }

  const getLanguage = (type: string) => {
    switch (type) {
      case 'js': return 'javascript';
      case 'ts': return 'typescript';
      case 'jsx': return 'javascript';
      case 'tsx': return 'typescript';
      case 'html': return 'html';
      case 'css': return 'css';
      case 'json': return 'json';
      case 'md': return 'markdown';
      default: return 'plaintext';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#1e1e1e] relative">
      <div className="absolute top-4 right-8 z-10 flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest">
        {isSaving ? (
          <span className="flex items-center gap-1 text-blue-400">
            <Loader2 size={10} className="animate-spin" /> Saving...
          </span>
        ) : (
          <span className="text-gray-600">Saved</span>
        )}
      </div>
      
      <Editor
        height="100%"
        theme="vs-dark"
        path={activeFile.name}
        language={getLanguage(activeFile.type)}
        value={activeFile.content}
        onChange={(value) => updateFileContent(activeFile.id, value || '')}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          wordWrap: "on",
          automaticLayout: true,
          padding: { top: 20 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        }}
      />
    </div>
  );
}
