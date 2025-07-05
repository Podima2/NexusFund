import { useState } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { DashboardPage } from './components/pages/DashboardPage';
import { ExplorePage } from './components/pages/ExplorePage';
import { CreateCampaignPage } from './components/pages/CreateCampaignPage';

type Page = 'dashboard' | 'explore' | 'create';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      
      {currentPage === 'dashboard' && (
        <DashboardPage onNavigate={handleNavigate} />
      )}
      
      {currentPage === 'explore' && (
        <ExplorePage />
      )}
      
      {currentPage === 'create' && (
        <CreateCampaignPage onNavigate={handleNavigate} />
      )}
      
      <Footer />
    </div>
  );
}

export default App;