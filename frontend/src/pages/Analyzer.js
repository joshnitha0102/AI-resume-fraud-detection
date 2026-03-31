import React, { useState, useCallback } from 'react';
import { resumeService } from '../services/api';
import './Analyzer.css';

const Analyzer = ({ navigateTo }) => {
  const [mode, setMode] = useState('file'); // 'file' | 'text'
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [loadingMsg, setLoadingMsg] = useState('');

  const LOADING_MESSAGES = [
    'Parsing resume content...',
    'Checking education credentials...',
    'Analyzing work history timeline...',
    'Scanning for skill inconsistencies...',
    'Cross-referencing institutions...',
    'Calculating fraud probability score...',
    'Generating analysis report...',
  ];

  const startLoadingMessages = () => {
    let i = 0;
    setLoadingMsg(LOADING_MESSAGES[0]);
    const interval = setInterval(() => {
      i = (i + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[i]);
    }, 1800);
    return interval;
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragging(false), []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) validateAndSetFile(dropped);
  }, []);

  const validateAndSetFile = (f) => {
    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'];
    if (!allowed.includes(f.type) && !f.name.match(/\.(pdf|doc|docx|txt)$/i)) {
      setError('Please upload a PDF, DOC, DOCX, or TXT file.');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB.');
      return;
    }
    setError('');
    setFile(f);
  };

  const handleFileInput = (e) => {
    if (e.target.files[0]) validateAndSetFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (mode === 'file' && !file) { setError('Please upload a file.'); return; }
    if (mode === 'text' && !text.trim()) { setError('Please enter resume text.'); return; }
    setError('');
    setLoading(true);
    setProgress(0);
    const interval = startLoadingMessages();
    try {
      let result;
      if (mode === 'file') {
        result = await resumeService.analyzeFile(file, setProgress);
      } else {
        result = await resumeService.analyzeText(text);
      }
      clearInterval(interval);
      navigateTo('results', result);
    } catch (err) {
      clearInterval(interval);
      setError(
        err.response?.data?.error ||
        'Failed to connect to backend. Make sure Spring Boot is running on port 8080.'
      );
      setLoading(false);
    }
  };

  const SAMPLE_RESUME = `John Smith
Email: john.smith@email.com | Phone: +1-555-0123

EDUCATION
PhD in Computer Science - Belford University (2010-2014)
B.Tech Computer Science - IIT Delhi (2006-2010)
MBA - Northwestern Polytechnic University (2015-2016)

EXPERIENCE
Senior Software Architect - TechCorp Inc (2018 - Present)
Senior Data Scientist - DataWorks LLC (2017 - Present)
Machine Learning Lead - AI Solutions (2015 - Present)
Software Developer - CodeBase (2012 - 2015)

SKILLS
Expert: Java, Python, JavaScript, TypeScript, Kotlin, Swift, C++, C#, Ruby, PHP, Go, Rust
Expert: Machine Learning, Deep Learning, TensorFlow, PyTorch, Computer Vision, NLP
Expert: Blockchain, Solidity, Ethereum, Web3, DeFi
Expert: DevOps, Docker, Kubernetes, Terraform, Jenkins, Ansible, Chef, Puppet
Expert: Data Science, Hadoop, Spark, Kafka, Elasticsearch, Cassandra, MongoDB, PostgreSQL
Expert: AWS, Azure, GCP, Digital Ocean, Heroku, Vercel

CERTIFICATIONS
PMP, CISSP, CFA, CPA, AWS Certified Solutions Architect, Google Cloud Professional,
Microsoft Azure Expert, CISCO CCNA, CEH, OSCP, CISM, CISA

ACHIEVEMENTS
Increased company revenue by 500% in first year
Reduced system downtime by 9999%
Led teams of 200+ engineers across 5 continents
Published 47 research papers in top-tier journals`;

  return (
    <div className="analyzer">
      <div className="analyzer-header">
        <span className="section-tag">FRAUD ANALYSIS ENGINE</span>
        <h1 className="analyzer-title">Analyze Resume</h1>
        <p className="analyzer-desc">
          Upload a resume file or paste the text content below. Our AI will scan it for fraud indicators.
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="mode-toggle">
        <button
          className={`mode-btn ${mode === 'file' ? 'active' : ''}`}
          onClick={() => setMode('file')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          Upload File
        </button>
        <button
          className={`mode-btn ${mode === 'text' ? 'active' : ''}`}
          onClick={() => setMode('text')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="17" y1="10" x2="3" y2="10"/>
            <line x1="21" y1="6" x2="3" y2="6"/>
            <line x1="21" y1="14" x2="3" y2="14"/>
            <line x1="17" y1="18" x2="3" y2="18"/>
          </svg>
          Paste Text
        </button>
      </div>

      <div className="analyzer-body">
        {/* File Upload */}
        {mode === 'file' && (
          <div
            className={`dropzone ${dragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !file && document.getElementById('fileInput').click()}
          >
            <input
              id="fileInput"
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              style={{ display: 'none' }}
              onChange={handleFileInput}
            />
            {file ? (
              <div className="file-info">
                <div className="file-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
                <div className="file-details">
                  <div className="file-name">{file.name}</div>
                  <div className="file-size">{(file.size / 1024).toFixed(1)} KB</div>
                </div>
                <button className="file-remove" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            ) : (
              <div className="dropzone-content">
                <div className="dropzone-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <div className="dropzone-text">
                  <strong>Drop your resume here</strong>
                  <span>or click to browse</span>
                </div>
                <div className="dropzone-hint">PDF, DOC, DOCX, TXT — Max 10MB</div>
              </div>
            )}
          </div>
        )}

        {/* Text Input */}
        {mode === 'text' && (
          <div className="text-input-area">
            <div className="textarea-header">
              <span>Paste Resume Content</span>
              <button
                className="sample-btn"
                onClick={() => setText(SAMPLE_RESUME)}
              >
                Load Sample (with fraud indicators)
              </button>
            </div>
            <textarea
              className="resume-textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the full resume text here including name, education, work experience, skills, and certifications..."
              rows={18}
            />
            <div className="char-count">{text.length} characters</div>
          </div>
        )}

        {error && (
          <div className="error-banner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="loading-overlay">
            <div className="loading-box">
              <div className="loading-spinner"></div>
              <div className="loading-title">Analyzing Resume</div>
              <div className="loading-msg">{loadingMsg}</div>
              {progress > 0 && (
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
              )}
            </div>
          </div>
        )}

        <button
          className="analyze-btn"
          onClick={handleAnalyze}
          disabled={loading || (mode === 'file' ? !file : !text.trim())}
        >
          {loading ? (
            <>
              <div className="btn-spinner"></div>
              Analyzing...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              Run Fraud Analysis
            </>
          )}
        </button>

        {/* Info cards */}
        <div className="info-cards">
          <div className="info-card">
            <div className="info-icon">🔒</div>
            <div>
              <div className="info-title">Secure Processing</div>
              <div className="info-text">Files are processed locally and not stored permanently.</div>
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon">⚡</div>
            <div>
              <div className="info-title">Fast Analysis</div>
              <div className="info-text">Results delivered in under 3 seconds on average.</div>
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon">🤖</div>
            <div>
              <div className="info-title">AI-Powered</div>
              <div className="info-text">Multiple detection algorithms running in parallel.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyzer;
