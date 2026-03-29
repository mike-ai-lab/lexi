/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { useWorkspaceStore } from './store/useWorkspaceStore';
import FileTree from './components/FileTree';
import EditorContainer from './components/EditorContainer';
import AiPanel from './components/AiPanel';
import Header from './components/Header';
import Auth from './components/Auth';

export default function App() {
  const { user, setUser } = useWorkspaceStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [setUser]);

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="flex h-screen w-screen bg-[#1e1e1e] text-white overflow-hidden font-sans">
      {/* Left Sidebar: File Tree */}
      <aside className="w-64 border-r border-gray-700 flex flex-col shrink-0">
        <FileTree />
      </aside>

      {/* Center: Editor */}
      <main className="flex-1 flex flex-col min-w-0">
        <Header />
        <div className="flex-1 relative overflow-hidden">
          <EditorContainer />
        </div>
      </main>

      {/* Right Sidebar: AI Assistant */}
      <aside className="w-80 border-l border-gray-700 bg-[#252526] shrink-0">
        <AiPanel />
      </aside>
    </div>
  );
}

