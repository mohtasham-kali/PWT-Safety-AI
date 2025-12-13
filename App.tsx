import React, { useState } from 'react';
import { PermitProvider } from './store/PermitContext';
import { ThemeProvider } from './store/ThemeContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CreatePermit from './pages/CreatePermit';
import PermitDetail from './pages/PermitDetail';
import { Menu } from 'lucide-react';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedPermitId, setSelectedPermitId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    setSelectedPermitId(null);
  };

  const handlePermitSelect = (id: string) => {
    setSelectedPermitId(id);
    setCurrentPage('detail');
  };

  const handleCreateSuccess = () => {
    navigateTo('dashboard');
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-200">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={navigateTo} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between shrink-0">
          <h1 className="font-bold text-lg text-slate-800 dark:text-white">SafetyAgent</h1>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          {currentPage === 'dashboard' && <Dashboard onSelectPermit={handlePermitSelect} />}
          {currentPage === 'create' && <CreatePermit onSuccess={handleCreateSuccess} />}
          {currentPage === 'detail' && selectedPermitId && (
            <PermitDetail permitId={selectedPermitId} onBack={() => navigateTo('dashboard')} />
          )}
          {currentPage === 'permits' && <Dashboard onSelectPermit={handlePermitSelect} />}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <PermitProvider>
        <AppContent />
      </PermitProvider>
    </ThemeProvider>
  );
};

export default App;
