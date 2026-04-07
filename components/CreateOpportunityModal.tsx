// src/components/CreateOpportunityModal.tsx
"use client";
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { X, Loader2 } from 'lucide-react';

const DUMMY_ID = '11111111-1111-1111-1111-111111111111';

export default function CreateOpportunityModal({ isOpen, onClose, onRefresh }: any) {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('Looking for teammates');
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('opportunities').insert([
      { creator_id: DUMMY_ID, type, title, description }
    ]);

    if (!error) {
      onRefresh();
      onClose();
      setTitle("");
      setDescription("");
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Post an Opportunity</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white"><X size={20}/></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase">Opportunity Type</label>
            <select 
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 mt-1 focus:border-purple-500 outline-none text-white"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option>Looking for teammates</option>
              <option>Hiring for project roles</option>
              <option>Hackathon team openings</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase">Title</label>
            <input 
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 mt-1 focus:border-purple-500 outline-none"
              placeholder="e.g. Need a UI Designer for Web App"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase">Details (Optional)</label>
            <textarea 
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 mt-1 h-24 focus:border-purple-500 outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-500 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={20}/> : "Post Opportunity"}
          </button>
        </form>
      </div>
    </div>
  );
}