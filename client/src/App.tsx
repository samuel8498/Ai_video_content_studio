import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { DashboardLayout, DashboardTab } from './components/Dashboard/DashboardLayout';
import { OverviewTab } from './components/Dashboard/OverviewTab';
import { CreateProjectTab } from './components/Dashboard/CreateProjectTab';
import { ProjectStudioTab } from './components/Dashboard/ProjectStudioTab';
import { MyProjectsTab } from './components/Dashboard/MyProjectsTab';
import { SubscriptionTab } from './components/Dashboard/SubscriptionTab';
import { ProfileTab } from './components/Dashboard/ProfileTab';
import { SettingsTab } from './components/Dashboard/SettingsTab';
import { ToastContainer, ToastMessage } from './components/UI/Toast';
import { Project } from './types';

const MainAppContent: React.FC = () => {
  const { user } = useAuth();
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Stored Projects State
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeStudioProject, setActiveStudioProject] = useState<Project | null>(null);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', text: string) => {
    const id = `toast_${Date.now()}`;
    setToasts(prev => [...prev, { id, type, text }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleOpenAuth = () => setAuthModalOpen(true);
  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    setView('dashboard');
    addToast('success', 'Welcome! Authenticated successfully.');
  };

  const handleProjectGenerated = (project: Project) => {
    setProjects(prev => [project, ...prev]);
    setActiveStudioProject(project);
    setActiveTab('projects');
    addToast('success', `Generated "${project.title.slice(0, 30)}..." successfully!`);
  };

  const handleSaveProject = (updated: Project) => {
    setProjects(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    addToast('success', 'Project snapshot saved successfully.');
  };

  const handleDuplicateProject = (project: Project) => {
    const duplicated: Project = {
      ...project,
      id: `proj_${Date.now()}`,
      title: `${project.title} (Copy)`,
      created_at: new Date().toISOString()
    };
    setProjects(prev => [duplicated, ...prev]);
    addToast('info', `Duplicated project as "${duplicated.title.slice(0, 25)}..."`);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (activeStudioProject?.id === id) {
      setActiveStudioProject(null);
      setActiveTab('overview');
    }
    addToast('info', 'Project removed.');
  };

  const handleOpenStudio = (project: Project) => {
    setActiveStudioProject(project);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar
        onOpenAuth={handleOpenAuth}
        onNavigateDashboard={() => setView('dashboard')}
        onNavigateLanding={() => setView('landing')}
        isDashboardView={view === 'dashboard'}
      />

      {view === 'landing' ? (
        <main className="flex-grow">
          <LandingPage
            onOpenAuth={handleOpenAuth}
            onNavigateDashboard={() => setView('dashboard')}
          />
        </main>
      ) : (
        <DashboardLayout
          activeTab={activeTab}
          onSelectTab={tab => {
            setActiveTab(tab);
            if (tab !== 'projects' && activeStudioProject) {
              // keep activeStudioProject ready
            }
          }}
        >
          {activeTab === 'overview' && (
            <OverviewTab
              onStartCreate={() => setActiveTab('create')}
              onViewProjects={() => setActiveTab('projects')}
            />
          )}

          {activeTab === 'create' && (
            <CreateProjectTab
              onProjectGenerated={handleProjectGenerated}
              onUpgradeNeeded={() => setActiveTab('subscription')}
            />
          )}

          {activeTab === 'projects' && (
            activeStudioProject ? (
              <div className="space-y-4">
                <button
                  onClick={() => setActiveStudioProject(null)}
                  className="text-xs font-bold text-purple-400 hover:underline flex items-center gap-1"
                >
                  ← Back to Projects List
                </button>
                <ProjectStudioTab
                  project={activeStudioProject}
                  onSaveProject={handleSaveProject}
                  onDuplicateProject={handleDuplicateProject}
                />
              </div>
            ) : (
              <MyProjectsTab
                projects={projects}
                onOpenProject={handleOpenStudio}
                onDuplicateProject={handleDuplicateProject}
                onDeleteProject={handleDeleteProject}
                onNewProject={() => setActiveTab('create')}
              />
            )
          )}

          {activeTab === 'subscription' && <SubscriptionTab />}
          {activeTab === 'usage' && <ProfileTab />}
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </DashboardLayout>
      )}

      {view === 'landing' && <Footer />}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
