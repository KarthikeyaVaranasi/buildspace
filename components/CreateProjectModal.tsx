// src/components/CreateProjectModal.tsx
"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Plus, Loader2 } from 'lucide-react';

// Using your dummy ID for the hackathon prototype
const DUMMY_ID = '11111111-1111-1111-1111-111111111111';

export default function CreateProjectModal({ isOpen, onClose, onRefresh }: any) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tech, setTech] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);

  const addTech = () => {
    if (tech && !techStack.includes(tech)) {
      setTechStack([...techStack, tech]);
      setTech("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('projects').insert([
      { 
        title, 
        description, 
        tech_stack: techStack, 
        creator_id: DUMMY_ID,
        status: 'Recruiting' 
      }
    ]);

    if (!error) {
      onRefresh(); // Updates the main dashboard instantly
      onClose();   // Closes the popup
      setTitle("");
      setDescription("");
      setTechStack([]);
    } else {
      console.error(error);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Launch New Project</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white"><X size={20}/></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase">Project Title</label>
            <input 
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 mt-1 focus:border-blue-500 outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase">Description</label>
            <textarea 
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 mt-1 h-32 focus:border-blue-500 outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase">Tech Stack (Press Enter)</label>
            <div className="flex gap-2 mt-1">
              <input 
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:border-blue-500 outline-none"
                value={tech}
                onChange={(e) => setTech(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
              />
              <button type="button" onClick={addTech} className="bg-zinc-800 px-3 rounded-lg border border-zinc-700"><Plus size={18}/></button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {techStack.map(t => (
                <span key={t} className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded uppercase font-bold">{t}</span>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={20}/> : "Publish Project"}
          </button>
        </form>
      </div>
    </div>
  );
}