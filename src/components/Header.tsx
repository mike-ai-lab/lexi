import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { logOut } from '../firebase';
import { LogOut, User, Share2, Download, Settings } from 'lucide-react';

export default function Header() {
  const { currentProject, user } = useWorkspaceStore();

  return (
    <header className="h-12 border-b border-gray-700 bg-[#1e1e1e] flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">L</div>
          <span className="text-sm font-bold tracking-tight">LexiCode</span>
        </div>
        
        {currentProject && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="text-gray-700">/</span>
            <span className="hover:text-gray-300 cursor-pointer transition">{currentProject.name}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 mr-4">
          <button className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition" title="Share">
            <Share2 size={16} />
          </button>
          <button className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition" title="Export">
            <Download size={16} />
          </button>
          <button className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition" title="Settings">
            <Settings size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2 pl-4 border-l border-gray-800">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-400 font-medium leading-none">{user?.displayName || 'User'}</span>
            <button 
              onClick={() => logOut()}
              className="text-[9px] text-gray-600 hover:text-red-400 transition uppercase font-bold tracking-tighter"
            >
              Sign Out
            </button>
          </div>
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full border border-gray-700" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 border border-gray-700">
              <User size={16} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
