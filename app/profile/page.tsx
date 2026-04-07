// src/app/profile/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, GitBranch, Award, Save, Loader2, Plus, X } from 'lucide-react';

const DUMMY_ID = '11111111-1111-1111-1111-111111111111';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    async function getProfile() {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', DUMMY_ID)
        .single();
      if (data) setProfile(data);
      setLoading(false);
    }
    getProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        bio: profile.bio,
        skills: profile.skills,
        github_url: profile.github_url
      })
      .eq('id', DUMMY_ID);
    
    if (!error) alert("Profile Updated!");
    setSaving(false);
  };

  const addSkill = () => {
    if (newSkill && !profile.skills.includes(newSkill)) {
      setProfile({ ...profile, skills: [...profile.skills, newSkill] });
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((s: string) => s !== skillToRemove)
    });
  };

  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" /></div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Developer Profile</h1>
            <p className="text-zinc-400">Manage your presence on BuildSpace.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save Changes
          </button>
        </header>

        <div className="grid gap-6">
          {/* Basic Info */}
          <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2"><User size={20} className="text-blue-400"/> General</h2>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Full Name</label>
              <input 
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                value={profile.full_name}
                onChange={(e) => setProfile({...profile, full_name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Bio</label>
              <textarea 
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 h-24 focus:outline-none focus:border-blue-500 transition-colors"
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
              />
            </div>
          </section>

          {/* Skills Section */}
          <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2"><Award size={20} className="text-purple-400"/> Skills & Tech Stack</h2>
            <div className="flex gap-2">
              <input 
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                placeholder="e.g. Next.js, Rust, C++"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSkill()}
              />
              <button onClick={addSkill} className="bg-zinc-800 hover:bg-zinc-700 p-2 rounded-lg border border-zinc-700">
                <Plus size={24} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill: string) => (
                <span key={skill} className="flex items-center gap-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-sm">
                  {skill}
                  <button onClick={() => removeSkill(skill)}><X size={14} className="hover:text-white"/></button>
                </span>
              ))}
            </div>
          </section>

          {/* Links */}
          <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2"><GitBranch size={20} /> Social Links</h2>
            <div className="relative">
              <GitBranch size={18} className="absolute left-3 top-3 text-zinc-500" />
              <input 
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-zinc-500"
                placeholder="github.com/your-username"
                value={profile.github_url || ""}
                onChange={(e) => setProfile({...profile, github_url: e.target.value})}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}