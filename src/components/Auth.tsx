import { signIn } from '../firebase';
import { LogIn, Sparkles } from 'lucide-react';

export default function Auth() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <div className="mx-auto w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/20">
            <span className="text-4xl font-black">L</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tighter text-white">LexiCode Workspace</h1>
          <p className="text-gray-400 text-lg">The semantic document editor for the AI era.</p>
        </div>

        <div className="bg-[#161616] p-8 rounded-3xl border border-gray-800 shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-left p-4 bg-blue-900/10 rounded-xl border border-blue-900/20">
              <Sparkles className="text-blue-400 shrink-0" size={20} />
              <p className="text-xs text-blue-200">
                Experience AI-powered semantic patching that understands your code structure.
              </p>
            </div>

            <button
              onClick={() => signIn()}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-black font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <LogIn size={20} />
              Sign in with Google
            </button>
            
            <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">
              Secure authentication via Firebase
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-8">
          {['Semantic', 'Real-time', 'Versioned'].map((feature) => (
            <div key={feature} className="text-center">
              <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">{feature}</div>
              <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-blue-600"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
