import React, { useState, useEffect } from 'react';
import { resumeService } from '../services/api';
import './Header.css';

const Header = ({ currentPage, navigateTo }) => {
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await resumeService.getHealth();
        setBackendStatus('online');
      } catch {
        setBackendStatus('offline');
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo" onClick={() => navigateTo('dashboard')}>
          <div className="logo-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect x="2" y="2" width="24" height="24" rx="4" stroke="#00d4ff" strokeWidth="1.5"/>
              <path d="M8 14L12 18L20 10" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="14" cy="14" r="6" stroke="#00d4ff" strokeWidth="0.5" strokeDasharray="2 2"/>
            </svg>
          </div>
          <div className="logo-text">
            <span className="logo-main">ResumeGuard</span>
            <span className="logo-sub">AI FRAUD DETECTION</span>
          </div>
        </div>

        <nav className="nav">
          <button
            className={`nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => navigateTo('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`nav-btn ${currentPage === 'analyzer' ? 'active' : ''}`}
            onClick={() => navigateTo('analyzer')}
          >
            Analyze Resume
          </button>
          {currentPage === 'results' && (
            <button className="nav-btn active">Results</button>
          )}
        </nav>

        <div className="header-status">
          <div className={`status-dot ${backendStatus}`}></div>
          <span className="status-text">
            {backendStatus === 'online' ? 'API Online' : backendStatus === 'offline' ? 'API Offline' : 'Connecting...'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
