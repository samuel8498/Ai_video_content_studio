import React, { useState } from 'react';
import {
  FolderKanban,
  Search,
  Filter,
  PlusCircle,
  Copy,
  Trash2,
  ExternalLink,
  Download,
  Calendar,
  Clock,
  Sparkles,
  FileText
} from 'lucide-react';
import { Project } from '../../types';

interface MyProjectsTabProps {
  projects: Project[];
  onOpenProject: (project: Project) => void;
  onDuplicateProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  onNewProject: () => void;
}

export const MyProjectsTab: React.FC<MyProjectsTabProps> = ({
  projects,
  onOpenProject,
  onDuplicateProject,
  onDeleteProject,
  onNewProject
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.input_content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || p.input_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const exportProjectAsTxt = (project: Project) => {
    const text = `====================================\n${project.title}\n====================================\nTarget Audience: ${project.target_audience}\nAspect Ratio: ${project.aspect_ratio}\n\n[HOOK]\n${project.script.hook}\n\n[INTRO]\n${project.script.intro}\n\n[SCENES]\n${project.script.sections.map(s => `Scene ${s.scene_number} (${s.heading}):\nNarration: ${s.narration}\nVisual: ${s.visual_suggestion}\nDuration: ${s.estimated_duration_sec}s\n`).join('\n')}\n[OUTRO]\n${project.script.outro}\n\n[YOUTUBE SEO TITLE]\n${project.youtube_title}\n\n[DESCRIPTION]\n${project.seo_description}\n`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.replace(/[^a-zA-Z0-9]/g, '_')}_script.txt`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-purple-400" /> Stored Video Projects ({projects.length})
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">Manage, edit, export, or duplicate your AI pre-productions.</p>
        </div>

        <button
          onClick={onNewProject}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Create New Project
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search projects by title, topic, or script keyword..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="sm:col-span-4 relative">
          <Filter className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="w-full bg-[#111827] border border-white/10 rounded-2xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Input Sources</option>
            <option value="topic">Topic / Idea</option>
            <option value="blog">Blog Posts</option>
            <option value="article">Articles</option>
            <option value="pdf">PDF Documents</option>
            <option value="url">Website URLs</option>
          </select>
        </div>
      </div>

      {/* Projects Grid or Empty State */}
      {filteredProjects.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-white/10 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-purple-600/10 text-purple-400 mx-auto flex items-center justify-center">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Projects Found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            {searchQuery ? 'No stored projects match your search query.' : 'You have not generated any video projects yet.'}
          </p>
          <button
            onClick={onNewProject}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-all inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Start First AI Generation
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map(project => (
            <div
              key={project.id}
              className="glass-panel p-5 rounded-2xl border border-white/10 glass-panel-hover flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                    {project.input_type}
                  </span>
                  <span className="text-[11px] text-gray-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-500" /> ~{project.script?.total_duration_sec || 45}s
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                  {project.title}
                </h3>

                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed italic">
                  "{project.script?.hook || project.input_content}"
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenProject(project)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 text-white hover:bg-purple-500 transition-all flex items-center gap-1"
                  >
                    Open Studio <ExternalLink className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => exportProjectAsTxt(project)}
                    title="Export TXT Script"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onDuplicateProject(project)}
                    title="Duplicate Project"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteProject(project.id)}
                    title="Delete Project"
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
