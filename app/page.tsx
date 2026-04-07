// src/app/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Terminal, Code, Plus, Briefcase, Search, UserPlus } from 'lucide-react';
import CreateProjectModal from '../components/CreateProjectModal';
import CreateOpportunityModal from '../components/CreateOpportunityModal'; // <-- NEW IMPORT

const DUMMY_ID = '11111111-1111-1111-1111-111111111111';

export default function Dashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isOppModalOpen, setIsOppModalOpen] = useState(false);

  const fetchData = async () => {
    const { data: projData } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    const { data: oppData } = await supabase.from('opportunities').select('*').order('created_at', { ascending: false });
    if (projData) {
      setProjects(projData);
      setFilteredProjects(projData);
    }
    if (oppData) setOpportunities(oppData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = projects.filter(p => 
      p.title.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query) ||
      p.tech_stack.some((tech: string) => tech.toLowerCase().includes(query))
    );
    setFilteredProjects(filtered);
  }, [searchQuery, projects]);

  // NEW: Function to handle joining a project
  const handleJoinProject = async (projectId: string) => {
    const { error } = await supabase.from('project_members').insert([
      { project_id: projectId, user_id: DUMMY_ID, role: 'Member' }
    ]);
    if (!error) {
      alert("You have joined the project!");
    } else {
      alert("You are already a member of this project.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter flex items-center gap-2">
            <Terminal className="text-blue-500" /> BuildSpace
          </h1>
          <p className="text-zinc-400">Unified developer collaboration platform.</p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text"
            placeholder="Search skills, roles, or projects... "
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 transition-all text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button 
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
          onClick={() => setIsProjectModalOpen(true)}
        >
          <Plus size={18} /> New Project
        </button>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <section className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Code className="text-green-500" /> Active Projects
          </h2>
          
          {filteredProjects.length > 0 ? filteredProjects.map((project) => (
            <div key={project.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl hover:border-zinc-700 transition-all group relative">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold group-hover:text-blue-400 transition-colors">{project.title}</h3>
                <span className="text-[10px] uppercase font-bold bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20">
                  {project.status}
                </span>
              </div>
              <p className="text-zinc-400 mb-4 text-sm leading-relaxed">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech_stack.map((tech: string) => (
                  <span key={tech} className="text-[10px] font-mono bg-zinc-800 px-2 py-1 rounded text-zinc-300 border border-zinc-700">
                    {tech}
                  </span>
                ))}
              </div>
              {/* NEW: JOIN BUTTON */}
              <button 
                onClick={() => handleJoinProject(project.id)}
                className="w-full flex items-center justify-center gap-2 py-2 bg-zinc-800 hover:bg-green-600/20 hover:text-green-400 rounded-lg text-sm font-medium transition-colors"
              >
                <UserPlus size={16} /> Join Team
              </button>
            </div>
          )) : (
            <div className="text-center py-20 bg-zinc-900/50 border border-dashed border-zinc-800 rounded-xl">
              <p className="text-zinc-500">No projects found matching "{searchQuery}"</p>
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Briefcase className="text-purple-500" /> Opportunities
            </h2>
            {/* NEW: POST OPPORTUNITY BUTTON */}
            <button 
              onClick={() => setIsOppModalOpen(true)}
              className="text-xs bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white px-3 py-1 rounded border border-purple-500/30 transition-colors"
            >
              + Post
            </button>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            {opportunities.length > 0 ? opportunities.map((opp) => (
              <div key={opp.id} className="p-4 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50 cursor-pointer transition-colors">
                <p className="text-[10px] uppercase font-bold text-purple-400 mb-1">{opp.type}</p>
                <h4 className="font-medium text-sm text-zinc-200">{opp.title}</h4>
                {opp.description && <p className="text-xs text-zinc-500 mt-2 line-clamp-2">{opp.description}</p>}
              </div>
            )) : (
              <div className="p-6 text-center text-zinc-500 text-sm">No active opportunities.</div>
            )}
          </div>
        </aside>
      </main>

      {/* MODALS */}
      <CreateProjectModal 
        isOpen={isProjectModalOpen} 
        onClose={() => setIsProjectModalOpen(false)} 
        onRefresh={fetchData} 
      />
      
      {/* NEW MODAL */}
      <CreateOpportunityModal 
        isOpen={isOppModalOpen} 
        onClose={() => setIsOppModalOpen(false)} 
        onRefresh={fetchData} 
      />

    </div>
  );
}