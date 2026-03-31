import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Analyzer from './pages/Analyzer';
import Results from './pages/Results';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [analysisResult, setAnalysisResult] = useState(null);

  const navigateTo = (page, data = null) => {
    if (data) setAnalysisResult(data);
    setCurrentPage(page);
  };

  return (
    <div className="app">
      <Header currentPage={currentPage} navigateTo={navigateTo} />
      <main className="main-content">
        {currentPage === 'dashboard' && (
          <Dashboard navigateTo={navigateTo} />
        )}
        {currentPage === 'analyzer' && (
          <Analyzer navigateTo={navigateTo} />
        )}
        {currentPage === 'results' && (
          <Results result={analysisResult} navigateTo={navigateTo} />
        )}
      </main>
    </div>
  );
}

export default App;
