# AI-Powered Resume Fraud Detection System

A full-stack web application that uses AI algorithms to detect fraudulent patterns in resumes.

## Tech Stack

| Layer     | Technology                         |
|-----------|-----------------------------------|
| Frontend  | React 18, CSS3, Recharts           |
| Backend   | Spring Boot 3.2, Java 17          |
| Analysis  | Custom AI Rule Engine (Java)       |
| Build     | Maven (backend), npm (frontend)    |

---

## Project Structure

```
resume-fraud-detection/
├── backend/                    # Spring Boot application
│   ├── src/main/java/com/resumefraud/
│   │   ├── ResumeFraudDetectionApplication.java
│   │   ├── controller/ResumeController.java
│   │   ├── service/ResumeAnalysisService.java
│   │   ├── dto/ResumeAnalysisResult.java
│   │   └── config/WebConfig.java
│   ├── src/main/resources/application.properties
│   └── pom.xml
└── frontend/                   # React application
    ├── public/index.html
    └── src/
        ├── App.js
        ├── index.js / index.css
        ├── pages/
        │   ├── Dashboard.js / .css
        │   ├── Analyzer.js  / .css
        │   └── Results.js   / .css
        ├── components/
        │   └── Header.js / .css
        └── services/api.js
```

---

## Prerequisites

- **Java 17+** — [Download](https://adoptium.net/)
- **Maven 3.8+** — [Download](https://maven.apache.org/)
- **Node.js 18+** — [Download](https://nodejs.org/)
- **npm 9+** — included with Node.js

---

## Quick Start

### Step 1 — Start the Backend

```bash
cd backend
mvn spring-boot:run
```

The API will start on **http://localhost:8080**

Verify it's running:
```
GET http://localhost:8080/api/resume/health
```

### Step 2 — Start the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm start
```

The app will open at **http://localhost:3000**

---

## How to Use

1. Open **http://localhost:3000** in your browser
2. Click **"Analyze Resume"** in the navigation
3. Either:
   - **Upload a file** (.pdf, .doc, .docx, .txt) — drag & drop or click to browse
   - **Paste text** — click "Paste Text" tab, then click "Load Sample" to see a pre-built fraud example
4. Click **"Run Fraud Analysis"**
5. View the detailed results report

---

## API Endpoints

| Method | Endpoint                    | Description                    |
|--------|-----------------------------|--------------------------------|
| POST   | `/api/resume/analyze`       | Analyze uploaded file          |
| POST   | `/api/resume/analyze-text`  | Analyze pasted text            |
| GET    | `/api/resume/health`        | Health check                   |
| GET    | `/api/resume/stats`         | System statistics              |

### Example API call (curl)

```bash
# Analyze a text file
curl -X POST http://localhost:8080/api/resume/analyze-text \
  -H "Content-Type: application/json" \
  -d '{"text": "John Smith\nBelford University PhD\n..."}'

# Upload a file
curl -X POST http://localhost:8080/api/resume/analyze \
  -F "file=@/path/to/resume.txt"
```

---

## Detection Capabilities

The AI engine detects:

| Category          | What It Checks                                              |
|-------------------|-------------------------------------------------------------|
| **Education**     | 50+ diploma mills, unaccredited universities, degree count  |
| **Experience**    | Overlapping jobs, timeline conflicts, impossible seniority  |
| **Skills**        | Skill inflation, incompatible domain combos, keyword stuffing |
| **Claims**        | Unrealistic percentages, excessive "expert" claims          |
| **Format**        | Multiple emails, very short resumes, AI-generated patterns  |

### Risk Levels

| Score   | Level    | Action                                |
|---------|----------|---------------------------------------|
| 0–20    | LOW      | Standard verification                 |
| 20–45   | MEDIUM   | Manual review advised                 |
| 45–70   | HIGH     | Background check required             |
| 70+     | CRITICAL | Do not proceed without verification   |

---

## Troubleshooting

**Backend won't start?**
- Ensure Java 17 is installed: `java -version`
- Ensure Maven is installed: `mvn -version`
- Check port 8080 is free: `lsof -i :8080`

**Frontend shows "API Offline"?**
- Make sure the Spring Boot backend is running first
- Check that it's on port 8080

**npm install fails?**
- Ensure Node 18+: `node -v`
- Try: `npm install --legacy-peer-deps`

---

## Team / Project Info

- **Project Title:** AI-Powered Resume Fraud Detection
- **Type:** Mini Project
- **Stack:** React + Spring Boot + Java
- **Version:** 1.0.0
