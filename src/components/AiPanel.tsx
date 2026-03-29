import React, { useState } from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { Sparkles, Send, Loader2, MessageSquare, History } from 'lucide-react';
import { getSemanticPatch, applyPatch } from '../lib/gemini';
import { motion, AnimatePresence } from 'motion/react';

export default function AiPanel() {
  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<{role: 'user' | 'ai', content: string}[]>([]);
  const { activeFileId, files, updateFileContent } = useWorkspaceStore();

  const activeFile = files.find(f => f.id === activeFileId);

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !activeFile || isProcessing) return;

    const userMsg = prompt;
    setPrompt("");
    setHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsProcessing(true);

    try {
      const patches = await getSemanticPatch(activeFile.name, activeFile.content, userMsg);
      
      if (patches && patches.length > 0) {
        const updatedContent = applyPatch(activeFile.content, patches);
        await updateFileContent(activeFile.id, updatedContent);
        setHistory(prev => [...prev, { role: 'ai', content: `Applied ${patches.length} semantic changes to ${activeFile.name}.` }]);
      } else {
        setHistory(prev => [...prev, { role: 'ai', content: "I couldn't find any specific changes to apply based on your request." }]);
      }
    } catch (error) {
      console.error(error);
      setHistory(prev => [...prev, { role: 'ai', content: "Sorry, I encountered an error while processing your request." }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#252526] border-l border-gray-700">
      <div className="p-4 border-b border-gray-700 flex items-center gap-2">
        <Sparkles size={16} className="text-blue-400" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">Semantic Assistant</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare size={32} className="mx-auto text-gray-700 mb-2" />
            <p className="text-xs text-gray-500">Ask me to modify your code semantically.</p>
          </div>
        )}
        
        <AnimatePresence initial={false}>
          {history.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-blue-900/30 text-blue-100 ml-4' : 'bg-gray-800 text-gray-300 mr-4'}`}
            >
              {msg.content}
            </motion.div>
          ))}
        </AnimatePresence>

        {isProcessing && (
          <div className="flex items-center gap-2 text-xs text-gray-500 italic">
            <Loader2 size={12} className="animate-spin" />
            Analyzing code & generating patches...
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-700 bg-[#1e1e1e]">
        {!activeFile && (
          <div className="mb-3 p-2 bg-blue-900/20 border border-blue-900/30 rounded text-[10px] text-blue-300 flex items-center gap-2">
            <Sparkles size={12} />
            <span>Select a file in the explorer to enable AI editing.</span>
          </div>
        )}
        <form onSubmit={handleAiSubmit} className="relative">
          <textarea 
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 pr-10 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
            rows={3}
            placeholder={activeFile ? `Edit ${activeFile.name}...` : "Select a file first"}
            disabled={!activeFile || isProcessing}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAiSubmit(e as any);
              }
            }}
          />
          <button 
            type="submit"
            disabled={!activeFile || isProcessing || !prompt.trim()}
            className="absolute right-3 bottom-3 p-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white rounded-md transition-colors"
          >
            <Send size={14} />
          </button>
        </form>
        <p className="mt-2 text-[10px] text-gray-600 text-center">
          Press Enter to apply semantic edits
        </p>
      </div>
    </div>
  );
}
