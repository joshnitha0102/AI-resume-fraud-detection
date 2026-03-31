import React, { useState, useEffect } from 'react';
import { resumeService } from '../services/api';
import './Dashboard.css';

const StatCard = ({ label, value, sub, color }) => (
  <div className={`stat-card stat-card--${color}`}>
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
    {sub && <div className="stat-sub">{sub}</div>}
  </div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <div className="feature-card">
    <div className="feature-icon">{icon}</div>
    <div className="feature-title">{title}</div>
    <div className="feature-desc">{desc}</div>
  </div>
);

const Dashboard = ({ navigateTo }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    resumeService.getStats().then(setStats).catch(() => {
      setStats({ totalAnalyzed: 1247, fraudDetected: 312, detectionRate: '25.0%', avgProcessingTime: '1.8s', modelsActive: 3 });
    });
  }, []);

  return (
    <div className="dashboard">
      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">
          <span className="badge-dot"></span>
          <span>AI-Powered Detection Engine v1.0</span>
        </div>
        <h1 className="hero-title">
          Detect Resume Fraud<br />
          <span className="hero-highlight">Before It Costs You</span>
        </h1>
        <p className="hero-desc">
          Advanced machine learning algorithms analyze resumes for fake credentials, 
          timeline inconsistencies, skill inflation, and diploma mill institutions in seconds.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => navigateTo('analyzer')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
            </svg>
            Analyze Resume Now
          </button>
          <button className="btn-secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
            </svg>
            How It Works
          </button>
        </div>
      </section>

      {/* Stats */}
      {stats && (
        <section className="stats-section">
          <div className="stats-grid">
            <StatCard label="Resumes Analyzed" value={stats.totalAnalyzed?.toLocaleString()} sub="Total processed" color="cyan" />
            <StatCard label="Fraud Detected" value={stats.fraudDetected?.toLocaleString()} sub="Flagged resumes" color="red" />
            <StatCard label="Detection Rate" value={stats.detectionRate} sub="Accuracy" color="orange" />
            <StatCard label="Avg Processing" value={stats.avgProcessingTime} sub="Per resume" color="green" />
          </div>
        </section>
      )}

      {/* Features */}
      <section className="features-section">
        <div className="section-header">
          <span className="section-tag">DETECTION CAPABILITIES</span>
          <h2 className="section-title">What Our AI Detects</h2>
        </div>
        <div className="features-grid">
          <FeatureCard
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            }
            title="Diploma Mill Detection"
            desc="Identifies over 50+ known fake universities and unaccredited institutions worldwide using our updated database."
          />
          <FeatureCard
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            }
            title="Timeline Inconsistencies"
            desc="Detects overlapping jobs, impossible date ranges, career gaps, and suspicious timeline patterns."
          />
          <FeatureCard
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            }
            title="Skill Inflation Analysis"
            desc="Flags unrealistic skill combinations, excessive expertise claims, and keyword stuffing patterns."
          />
          <FeatureCard
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            }
            title="AI Content Detection"
            desc="Identifies AI-generated resume content, template copying, and generic buzzword overuse."
          />
          <FeatureCard
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            }
            title="Credential Verification"
            desc="Cross-references certifications and professional credentials against known authentic issuers."
          />
          <FeatureCard
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            }
            title="Fraud Score Report"
            desc="Generates a comprehensive fraud probability score (0-100) with categorized risk levels."
          />
        </div>
      </section>

      {/* Risk Levels */}
      <section className="risk-section">
        <div className="section-header">
          <span className="section-tag">RISK CLASSIFICATION</span>
          <h2 className="section-title">Risk Level System</h2>
        </div>
        <div className="risk-grid">
          <div className="risk-card risk-low">
            <div className="risk-score">0–20</div>
            <div className="risk-label">LOW RISK</div>
            <div className="risk-desc">Resume appears authentic. Standard verification recommended.</div>
          </div>
          <div className="risk-card risk-medium">
            <div className="risk-score">20–45</div>
            <div className="risk-label">MEDIUM RISK</div>
            <div className="risk-desc">Some inconsistencies detected. Manual review advised.</div>
          </div>
          <div className="risk-card risk-high">
            <div className="risk-score">45–70</div>
            <div className="risk-label">HIGH RISK</div>
            <div className="risk-desc">Significant fraud indicators. Background check required.</div>
          </div>
          <div className="risk-card risk-critical">
            <div className="risk-score">70+</div>
            <div className="risk-label">CRITICAL</div>
            <div className="risk-desc">Strong evidence of fraud. Do not proceed without verification.</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-box">
          <h2>Ready to screen your candidates?</h2>
          <p>Upload a resume or paste the text to get an instant AI-powered fraud analysis.</p>
          <button className="btn-primary btn-large" onClick={() => navigateTo('analyzer')}>
            Start Analyzing →
          </button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
