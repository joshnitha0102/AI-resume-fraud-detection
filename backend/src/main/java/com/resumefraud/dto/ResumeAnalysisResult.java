package com.resumefraud.dto;

import java.util.List;

public class ResumeAnalysisResult {
    private String resumeId;
    private String fileName;
    private double fraudScore;
    private String riskLevel;
    private List<FraudFlag> fraudFlags;
    private SkillsAnalysis skillsAnalysis;
    private ExperienceAnalysis experienceAnalysis;
    private EducationAnalysis educationAnalysis;
    private String aiSummary;
    private long analysisTimestamp;

    public ResumeAnalysisResult() {
        this.analysisTimestamp = System.currentTimeMillis();
    }

    // Getters and Setters
    public String getResumeId() { return resumeId; }
    public void setResumeId(String resumeId) { this.resumeId = resumeId; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public double getFraudScore() { return fraudScore; }
    public void setFraudScore(double fraudScore) { this.fraudScore = fraudScore; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public List<FraudFlag> getFraudFlags() { return fraudFlags; }
    public void setFraudFlags(List<FraudFlag> fraudFlags) { this.fraudFlags = fraudFlags; }

    public SkillsAnalysis getSkillsAnalysis() { return skillsAnalysis; }
    public void setSkillsAnalysis(SkillsAnalysis skillsAnalysis) { this.skillsAnalysis = skillsAnalysis; }

    public ExperienceAnalysis getExperienceAnalysis() { return experienceAnalysis; }
    public void setExperienceAnalysis(ExperienceAnalysis experienceAnalysis) { this.experienceAnalysis = experienceAnalysis; }

    public EducationAnalysis getEducationAnalysis() { return educationAnalysis; }
    public void setEducationAnalysis(EducationAnalysis educationAnalysis) { this.educationAnalysis = educationAnalysis; }

    public String getAiSummary() { return aiSummary; }
    public void setAiSummary(String aiSummary) { this.aiSummary = aiSummary; }

    public long getAnalysisTimestamp() { return analysisTimestamp; }
    public void setAnalysisTimestamp(long analysisTimestamp) { this.analysisTimestamp = analysisTimestamp; }

    // Inner classes
    public static class FraudFlag {
        private String category;
        private String description;
        private String severity;
        private double confidence;

        public FraudFlag(String category, String description, String severity, double confidence) {
            this.category = category;
            this.description = description;
            this.severity = severity;
            this.confidence = confidence;
        }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getSeverity() { return severity; }
        public void setSeverity(String severity) { this.severity = severity; }
        public double getConfidence() { return confidence; }
        public void setConfidence(double confidence) { this.confidence = confidence; }
    }

    public static class SkillsAnalysis {
        private List<String> detectedSkills;
        private List<String> suspiciousSkills;
        private double skillConsistencyScore;
        private String verdict;

        public List<String> getDetectedSkills() { return detectedSkills; }
        public void setDetectedSkills(List<String> detectedSkills) { this.detectedSkills = detectedSkills; }
        public List<String> getSuspiciousSkills() { return suspiciousSkills; }
        public void setSuspiciousSkills(List<String> suspiciousSkills) { this.suspiciousSkills = suspiciousSkills; }
        public double getSkillConsistencyScore() { return skillConsistencyScore; }
        public void setSkillConsistencyScore(double skillConsistencyScore) { this.skillConsistencyScore = skillConsistencyScore; }
        public String getVerdict() { return verdict; }
        public void setVerdict(String verdict) { this.verdict = verdict; }
    }

    public static class ExperienceAnalysis {
        private int totalYears;
        private boolean hasGaps;
        private List<String> gapPeriods;
        private boolean hasOverlaps;
        private double consistencyScore;
        private String verdict;

        public int getTotalYears() { return totalYears; }
        public void setTotalYears(int totalYears) { this.totalYears = totalYears; }
        public boolean isHasGaps() { return hasGaps; }
        public void setHasGaps(boolean hasGaps) { this.hasGaps = hasGaps; }
        public List<String> getGapPeriods() { return gapPeriods; }
        public void setGapPeriods(List<String> gapPeriods) { this.gapPeriods = gapPeriods; }
        public boolean isHasOverlaps() { return hasOverlaps; }
        public void setHasOverlaps(boolean hasOverlaps) { this.hasOverlaps = hasOverlaps; }
        public double getConsistencyScore() { return consistencyScore; }
        public void setConsistencyScore(double consistencyScore) { this.consistencyScore = consistencyScore; }
        public String getVerdict() { return verdict; }
        public void setVerdict(String verdict) { this.verdict = verdict; }
    }

    public static class EducationAnalysis {
        private List<String> detectedInstitutions;
        private List<String> flaggedInstitutions;
        private boolean hasVerifiedDegrees;
        private double credibilityScore;
        private String verdict;

        public List<String> getDetectedInstitutions() { return detectedInstitutions; }
        public void setDetectedInstitutions(List<String> detectedInstitutions) { this.detectedInstitutions = detectedInstitutions; }
        public List<String> getFlaggedInstitutions() { return flaggedInstitutions; }
        public void setFlaggedInstitutions(List<String> flaggedInstitutions) { this.flaggedInstitutions = flaggedInstitutions; }
        public boolean isHasVerifiedDegrees() { return hasVerifiedDegrees; }
        public void setHasVerifiedDegrees(boolean hasVerifiedDegrees) { this.hasVerifiedDegrees = hasVerifiedDegrees; }
        public double getCredibilityScore() { return credibilityScore; }
        public void setCredibilityScore(double credibilityScore) { this.credibilityScore = credibilityScore; }
        public String getVerdict() { return verdict; }
        public void setVerdict(String verdict) { this.verdict = verdict; }
    }
}
