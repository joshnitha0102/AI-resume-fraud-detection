import React, { useEffect, useRef } from 'react';
import './Results.css';

const getRiskColor = (level) => {
  switch (level) {
    case 'CRITICAL': return '#ff3366';
    case 'HIGH':     return '#ff9500';
    case 'MEDIUM':   return '#ffd60a';
    case 'LOW':      return '#00ff9d';
    default:         return '#00d4ff';
  }
};

const getSeverityColor = (sev) => {
  switch (sev) {
    case 'HIGH':   return '#ff3366';
    case 'MEDIUM': return '#ff9500';
    case 'LOW':    return '#ffd60a';
    default:       return '#8899bb';
  }
};

const ScoreGauge = ({ score, riskLevel }) => {
  const color = getRiskColor(riskLevel);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="score-gauge">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12"/>
        <circle
          cx="70" cy="70" r="54"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
          style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: 'stroke-dashoffset 1.2s ease' }}
        />
        <text x="70" y="64" textAnchor="middle" fill={color} fontSize="28" fontWeight="700" fontFamily="Space Mono">
          {Math.round(score)}
        </text>
        <text x="70" y="82" textAnchor="middle" fill="#4a6080" fontSize="11" fontFamily="DM Sans">
          FRAUD SCORE
        </text>
      </svg>
      <div className="gauge-risk" style={{ color }}>
        {riskLevel} RISK
      </div>
    </div>
  );
};

const FlagCard = ({ flag, index }) => {
  const color = getSeverityColor(flag.severity);
  return (
    <div className="flag-card" style={{ animationDelay: `${index * 0.08}s`, borderLeftColor: color }}>
      <div className="flag-header">
        <span className="flag-category">{flag.category}</span>
        <span className="flag-severity" style={{ color, background: `${color}18`, border: `1px solid ${color}30` }}>
          {flag.severity}
        </span>
        <span className="flag-confidence">{Math.round(flag.confidence * 100)}% confidence</span>
      </div>
      <div className="flag-desc">{flag.description}</div>
    </div>
  );
};

const ScoreBar = ({ label, score, color }) => (
  <div className="score-bar-row">
    <div className="score-bar-label">{label}</div>
    <div className="score-bar-track">
      <div
        className="score-bar-fill"
        style={{ width: `${score}%`, background: color }}
      ></div>
    </div>
    <div className="score-bar-val" style={{ color }}>{Math.round(score)}%</div>
  </div>
);

const Results = ({ result, navigateTo }) => {
  const reportRef = useRef();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!result) {
    return (
      <div className="results-empty">
        <div className="empty-icon">🔍</div>
        <h2>No Analysis Results</h2>
        <p>Please run a resume analysis first.</p>
        <button className="btn-primary" onClick={() => navigateTo('analyzer')}>
          Go to Analyzer
        </button>
      </div>
    );
  }

  const riskColor = getRiskColor(result.riskLevel);
  const highFlags = result.fraudFlags?.filter(f => f.severity === 'HIGH') || [];
  const medFlags  = result.fraudFlags?.filter(f => f.severity === 'MEDIUM') || [];
  const lowFlags  = result.fraudFlags?.filter(f => f.severity === 'LOW') || [];

  const formatDate = (ts) =>
    ts ? new Date(ts).toLocaleString() : 'N/A';

  return (
    <div className="results" ref={reportRef}>
      {/* Top bar */}
      <div className="results-topbar">
        <button className="back-btn" onClick={() => navigateTo('analyzer')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          New Analysis
        </button>
        <div className="results-meta">
          <span className="meta-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            </svg>
            {result.fileName}
          </span>
          <span className="meta-divider">·</span>
          <span className="meta-item">{formatDate(result.analysisTimestamp)}</span>
          <span className="meta-divider">·</span>
          <span className="meta-item">ID: {result.resumeId?.slice(0, 8)}...</span>
        </div>
      </div>

      {/* Hero Summary */}
      <div className="results-hero" style={{ borderColor: `${riskColor}30` }}>
        <ScoreGauge score={result.fraudScore} riskLevel={result.riskLevel} />
        <div className="hero-summary">
          <div className="summary-risk-badge" style={{ color: riskColor, background: `${riskColor}15`, border: `1px solid ${riskColor}30` }}>
            ⚠ {result.riskLevel} RISK DETECTED
          </div>
          <h2 className="summary-title">Analysis Complete</h2>
          <p className="summary-ai">{result.aiSummary}</p>
          <div className="summary-flags-count">
            {highFlags.length > 0 && <span className="flag-count high">{highFlags.length} High</span>}
            {medFlags.length > 0  && <span className="flag-count medium">{medFlags.length} Medium</span>}
            {lowFlags.length > 0  && <span className="flag-count low">{lowFlags.length} Low</span>}
            {result.fraudFlags?.length === 0 && <span className="flag-count clean">✓ No flags</span>}
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="results-grid">
        <section className="results-card">
          <div className="card-title">Consistency Scores</div>
          <div className="scores-list">
            <ScoreBar
              label="Skill Consistency"
              score={result.skillsAnalysis?.skillConsistencyScore || 0}
              color="#00d4ff"
            />
            <ScoreBar
              label="Experience Consistency"
              score={result.experienceAnalysis?.consistencyScore || 0}
              color="#00ff9d"
            />
            <ScoreBar
              label="Education Credibility"
              score={result.educationAnalysis?.credibilityScore || 0}
              color="#ffd60a"
            />
          </div>
        </section>

        {/* Quick Stats */}
        <section className="results-card">
          <div className="card-title">Quick Stats</div>
          <div className="quick-stats">
            <div className="qstat">
              <div className="qstat-val">{result.fraudFlags?.length || 0}</div>
              <div className="qstat-label">Total Flags</div>
            </div>
            <div className="qstat">
              <div className="qstat-val" style={{ color: '#ff3366' }}>{highFlags.length}</div>
              <div className="qstat-label">High Severity</div>
            </div>
            <div className="qstat">
              <div className="qstat-val">{result.experienceAnalysis?.totalYears || 0}y</div>
              <div className="qstat-label">Exp. Span</div>
            </div>
            <div className="qstat">
              <div className="qstat-val">{result.skillsAnalysis?.detectedSkills?.length || 0}</div>
              <div className="qstat-label">Skills Found</div>
            </div>
          </div>
        </section>
      </div>

      {/* Fraud Flags */}
      {result.fraudFlags?.length > 0 && (
        <section className="results-card full-width">
          <div className="card-title">
            Detected Fraud Indicators
            <span className="card-badge">{result.fraudFlags.length}</span>
          </div>
          <div className="flags-list">
            {result.fraudFlags.map((flag, i) => (
              <FlagCard key={i} flag={flag} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      <div className="results-grid">
        <section className="results-card">
          <div className="card-title">Education Analysis</div>
          <div className="analysis-detail">
            <div className="detail-row">
              <span className="detail-label">Credibility Score</span>
              <span className="detail-val" style={{ color: '#ffd60a' }}>
                {result.educationAnalysis?.credibilityScore?.toFixed(0)}%
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Flagged Institutions</span>
              <span className="detail-val" style={{ color: result.educationAnalysis?.flaggedInstitutions?.length > 0 ? '#ff3366' : '#00ff9d' }}>
                {result.educationAnalysis?.flaggedInstitutions?.length > 0
                  ? result.educationAnalysis.flaggedInstitutions.join(', ')
                  : 'None'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Detected Institutions</span>
              <span className="detail-val">
                {result.educationAnalysis?.detectedInstitutions?.join(', ') || 'None'}
              </span>
            </div>
            <div className="detail-verdict">{result.educationAnalysis?.verdict}</div>
          </div>
        </section>

        {/* Experience */}
        <section className="results-card">
          <div className="card-title">Experience Analysis</div>
          <div className="analysis-detail">
            <div className="detail-row">
              <span className="detail-label">Experience Span</span>
              <span className="detail-val">{result.experienceAnalysis?.totalYears || 0} years</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Overlapping Jobs</span>
              <span className="detail-val" style={{ color: result.experienceAnalysis?.hasOverlaps ? '#ff3366' : '#00ff9d' }}>
                {result.experienceAnalysis?.hasOverlaps ? '⚠ Detected' : '✓ None'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Timeline Gaps</span>
              <span className="detail-val" style={{ color: result.experienceAnalysis?.hasGaps ? '#ff9500' : '#00ff9d' }}>
                {result.experienceAnalysis?.hasGaps ? '⚠ Found' : '✓ None'}
              </span>
            </div>
            <div className="detail-verdict">{result.experienceAnalysis?.verdict}</div>
          </div>
        </section>
      </div>

      {/* Skills */}
      <section className="results-card full-width">
        <div className="card-title">Skills Analysis</div>
        <div className="skills-body">
          <div className="skills-col">
            <div className="skills-col-title">Detected Skills</div>
            <div className="skills-tags">
              {result.skillsAnalysis?.detectedSkills?.map((s, i) => (
                <span key={i} className="skill-tag">{s}</span>
              ))}
            </div>
          </div>
          {result.skillsAnalysis?.suspiciousSkills?.length > 0 && (
            <div className="skills-col">
              <div className="skills-col-title suspicious">Suspicious Patterns</div>
              <div className="skills-tags">
                {result.skillsAnalysis.suspiciousSkills.map((s, i) => (
                  <span key={i} className="skill-tag suspicious-tag">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="skills-verdict">{result.skillsAnalysis?.verdict}</div>
      </section>

      {/* Actions */}
      <div className="results-actions">
        <button className="btn-primary" onClick={() => navigateTo('analyzer')}>
          Analyze Another Resume
        </button>
        <button className="btn-secondary" onClick={() => window.print()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8"/>
          </svg>
          Print Report
        </button>
      </div>
    </div>
  );
};

export default Results;
