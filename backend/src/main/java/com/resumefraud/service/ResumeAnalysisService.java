package com.resumefraud.service;

import com.resumefraud.dto.ResumeAnalysisResult;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.regex.*;

@Service
public class ResumeAnalysisService {

    // Known diploma mills / fake universities
    private static final List<String> DIPLOMA_MILLS = Arrays.asList(
        "belford university", "rochville university", "ashwood university",
        "west coast university", "northwestern polytechnic", "axact", "bppk",
        "american commonwealth university", "kennedy western university",
        "california pacific university", "hamilton university"
    );

    // Suspicious certifications often faked
    private static final List<String> HIGH_VALUE_CERTS = Arrays.asList(
        "pmp", "cissp", "cfa", "cpa", "aws certified", "google certified",
        "microsoft certified", "cisco", "ceh", "oscp", "cism", "cisa"
    );

    // Skills that are commonly exaggerated together
    private static final Map<String, List<String>> SKILL_CONFLICT_MAP = new HashMap<>();

    static {
        SKILL_CONFLICT_MAP.put("machine learning", Arrays.asList("tensorflow", "pytorch", "scikit-learn"));
        SKILL_CONFLICT_MAP.put("blockchain", Arrays.asList("solidity", "ethereum", "web3"));
        SKILL_CONFLICT_MAP.put("devops", Arrays.asList("docker", "kubernetes", "jenkins", "terraform"));
        SKILL_CONFLICT_MAP.put("data science", Arrays.asList("python", "r", "sql", "pandas", "numpy"));
    }

    public ResumeAnalysisResult analyzeResume(MultipartFile file) throws IOException {
        String content = extractText(file);
        return performAnalysis(content, file.getOriginalFilename());
    }

    public ResumeAnalysisResult analyzeResumeText(String text) {
        return performAnalysis(text, "manual-input.txt");
    }

    private String extractText(MultipartFile file) throws IOException {
        String fileName = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
        // For PDF/DOC files in real implementation, use Apache PDFBox or Apache POI
        // For this project we treat all as text/UTF-8 for demo purposes
        return new String(file.getBytes(), StandardCharsets.UTF_8);
    }

    private ResumeAnalysisResult performAnalysis(String content, String fileName) {
        String lowerContent = content.toLowerCase();

        ResumeAnalysisResult result = new ResumeAnalysisResult();
        result.setResumeId(UUID.randomUUID().toString());
        result.setFileName(fileName);

        List<ResumeAnalysisResult.FraudFlag> flags = new ArrayList<>();

        // 1. Education Analysis
        ResumeAnalysisResult.EducationAnalysis eduAnalysis = analyzeEducation(lowerContent, flags);
        result.setEducationAnalysis(eduAnalysis);

        // 2. Skills Analysis
        ResumeAnalysisResult.SkillsAnalysis skillsAnalysis = analyzeSkills(lowerContent, flags);
        result.setSkillsAnalysis(skillsAnalysis);

        // 3. Experience Analysis
        ResumeAnalysisResult.ExperienceAnalysis expAnalysis = analyzeExperience(lowerContent, flags);
        result.setExperienceAnalysis(expAnalysis);

        // 4. Check for keyword stuffing
        checkKeywordStuffing(lowerContent, flags);

        // 5. Check for formatting anomalies
        checkFormattingAnomalies(content, flags);

        // 6. Check for unrealistic claims
        checkUnrealisticClaims(lowerContent, flags);

        result.setFraudFlags(flags);

        // Calculate fraud score
        double fraudScore = calculateFraudScore(flags, skillsAnalysis, expAnalysis, eduAnalysis);
        result.setFraudScore(Math.min(100.0, Math.max(0.0, fraudScore)));

        // Set risk level
        result.setRiskLevel(determineRiskLevel(fraudScore));

        // Generate AI summary
        result.setAiSummary(generateSummary(result));

        return result;
    }

    private ResumeAnalysisResult.EducationAnalysis analyzeEducation(String content, List<ResumeAnalysisResult.FraudFlag> flags) {
        ResumeAnalysisResult.EducationAnalysis analysis = new ResumeAnalysisResult.EducationAnalysis();
        List<String> detectedInstitutions = new ArrayList<>();
        List<String> flaggedInstitutions = new ArrayList<>();

        // Check for diploma mills
        for (String mill : DIPLOMA_MILLS) {
            if (content.contains(mill)) {
                flaggedInstitutions.add(mill);
                flags.add(new ResumeAnalysisResult.FraudFlag(
                    "EDUCATION",
                    "Diploma mill detected: '" + mill + "' is a known unaccredited institution",
                    "HIGH",
                    0.95
                ));
            }
        }

        // Check for known legitimate universities
        String[] topUniversities = {"iit", "iim", "bits", "nit", "mit", "stanford", "harvard", "oxford", "cambridge"};
        for (String uni : topUniversities) {
            if (content.contains(uni)) {
                detectedInstitutions.add(uni.toUpperCase());
            }
        }

        // Check for multiple degrees in suspiciously short time
        Pattern degreePattern = Pattern.compile("(bachelor|master|phd|b\\.tech|m\\.tech|mba|b\\.e|m\\.e)", Pattern.CASE_INSENSITIVE);
        Matcher degreeMatcher = degreePattern.matcher(content);
        int degreeCount = 0;
        while (degreeMatcher.find()) degreeCount++;

        if (degreeCount > 3) {
            flags.add(new ResumeAnalysisResult.FraudFlag(
                "EDUCATION",
                "Unusually high number of degrees claimed (" + degreeCount + "). Possible fabrication.",
                "MEDIUM",
                0.75
            ));
        }

        analysis.setDetectedInstitutions(detectedInstitutions.isEmpty() ? Arrays.asList("Not specified") : detectedInstitutions);
        analysis.setFlaggedInstitutions(flaggedInstitutions);
        analysis.setHasVerifiedDegrees(flaggedInstitutions.isEmpty() && degreeCount > 0);
        analysis.setCredibilityScore(flaggedInstitutions.isEmpty() ? (degreeCount > 3 ? 60.0 : 85.0) : 20.0);
        analysis.setVerdict(flaggedInstitutions.isEmpty() ? "No major education red flags" : "Suspicious educational credentials detected");

        return analysis;
    }

    private ResumeAnalysisResult.SkillsAnalysis analyzeSkills(String content, List<ResumeAnalysisResult.FraudFlag> flags) {
        ResumeAnalysisResult.SkillsAnalysis analysis = new ResumeAnalysisResult.SkillsAnalysis();
        List<String> detectedSkills = new ArrayList<>();
        List<String> suspiciousSkills = new ArrayList<>();

        String[] commonSkills = {
            "java", "python", "javascript", "react", "angular", "vue", "node.js",
            "spring boot", "django", "flask", "sql", "mysql", "postgresql", "mongodb",
            "docker", "kubernetes", "aws", "azure", "gcp", "machine learning",
            "deep learning", "tensorflow", "pytorch", "data science", "blockchain",
            "devops", "ci/cd", "git", "agile", "scrum", "rest api", "microservices",
            "html", "css", "typescript", "kotlin", "swift", "c++", "c#", "ruby", "php"
        };

        int skillCount = 0;
        for (String skill : commonSkills) {
            if (content.contains(skill)) {
                detectedSkills.add(skill.toUpperCase());
                skillCount++;
            }
        }

        // Check for mutually exclusive or unlikely skill combos
        boolean hasMl = content.contains("machine learning") || content.contains("deep learning");
        boolean hasBlockchain = content.contains("blockchain") || content.contains("solidity");
        boolean hasDevOps = content.contains("kubernetes") && content.contains("terraform");
        boolean hasDataSci = content.contains("data science") || content.contains("data scientist");

        int advancedDomains = (hasMl ? 1 : 0) + (hasBlockchain ? 1 : 0) + (hasDevOps ? 1 : 0) + (hasDataSci ? 1 : 0);

        if (advancedDomains >= 3) {
            suspiciousSkills.add("Multiple advanced domains claimed simultaneously");
            flags.add(new ResumeAnalysisResult.FraudFlag(
                "SKILLS",
                "Claims expertise in " + advancedDomains + " advanced technical domains (ML, Blockchain, DevOps, Data Science). Unlikely for a single professional.",
                "MEDIUM",
                0.72
            ));
        }

        // Detect keyword stuffing - skills listed without context
        if (skillCount > 30) {
            suspiciousSkills.add("Excessive skill count: " + skillCount + " skills listed");
            flags.add(new ResumeAnalysisResult.FraudFlag(
                "SKILLS",
                "Extremely large number of skills listed (" + skillCount + "). Possible keyword stuffing.",
                "MEDIUM",
                0.68
            ));
        }

        // Check for certifications without supporting skills
        for (String cert : HIGH_VALUE_CERTS) {
            if (content.contains(cert)) {
                String certUpper = cert.toUpperCase();
                if (!detectedSkills.contains(certUpper)) {
                    detectedSkills.add(certUpper + " (Cert)");
                }
            }
        }

        double consistencyScore = 100.0 - (suspiciousSkills.size() * 15) - (skillCount > 30 ? 20 : 0);
        analysis.setDetectedSkills(detectedSkills);
        analysis.setSuspiciousSkills(suspiciousSkills);
        analysis.setSkillConsistencyScore(Math.max(10.0, consistencyScore));
        analysis.setVerdict(suspiciousSkills.isEmpty() ? "Skill profile appears consistent" : "Skill discrepancies detected");

        return analysis;
    }

    private ResumeAnalysisResult.ExperienceAnalysis analyzeExperience(String content, List<ResumeAnalysisResult.FraudFlag> flags) {
        ResumeAnalysisResult.ExperienceAnalysis analysis = new ResumeAnalysisResult.ExperienceAnalysis();
        List<String> gaps = new ArrayList<>();
        boolean hasOverlaps = false;

        // Extract years mentioned
        Pattern yearPattern = Pattern.compile("(19|20)\\d{2}");
        Matcher yearMatcher = yearPattern.matcher(content);
        List<Integer> years = new ArrayList<>();
        while (yearMatcher.find()) {
            years.add(Integer.parseInt(yearMatcher.group()));
        }

        // Sort years
        Collections.sort(years);

        int totalExperienceYears = 0;
        if (!years.isEmpty()) {
            int minYear = years.get(0);
            int maxYear = years.get(years.size() - 1);
            totalExperienceYears = maxYear - minYear;

            // Check for suspicious experience claims
            if (totalExperienceYears > 30) {
                flags.add(new ResumeAnalysisResult.FraudFlag(
                    "EXPERIENCE",
                    "Experience span of " + totalExperienceYears + " years seems unusually long.",
                    "LOW",
                    0.55
                ));
            }
        }

        // Check for experience vs education timeline conflicts
        boolean claimsEarlyExperience = content.contains("2010") || content.contains("2008") || content.contains("2009");
        boolean claimsHighDegree = content.contains("phd") || content.contains("doctorate");

        if (claimsEarlyExperience && claimsHighDegree && totalExperienceYears > 10) {
            flags.add(new ResumeAnalysisResult.FraudFlag(
                "EXPERIENCE",
                "Timeline conflict: PhD + extensive early career experience may indicate fabricated dates.",
                "MEDIUM",
                0.65
            ));
            gaps.add("Possible timeline conflict between education and work experience");
        }

        // Detect overlapping job claims (simple heuristic)
        Pattern jobPattern = Pattern.compile("(present|current|till date|ongoing)", Pattern.CASE_INSENSITIVE);
        Matcher jobMatcher = jobPattern.matcher(content);
        int currentJobCount = 0;
        while (jobMatcher.find()) currentJobCount++;

        if (currentJobCount > 1) {
            hasOverlaps = true;
            flags.add(new ResumeAnalysisResult.FraudFlag(
                "EXPERIENCE",
                "Multiple simultaneous 'current' job positions detected (" + currentJobCount + "). Possible fabrication.",
                "HIGH",
                0.85
            ));
        }

        // Check for impossible experience (senior role at young age)
        boolean claimsSenior = content.contains("senior") || content.contains("lead") || content.contains("principal") || content.contains("architect");
        if (claimsSenior && totalExperienceYears < 2) {
            flags.add(new ResumeAnalysisResult.FraudFlag(
                "EXPERIENCE",
                "Claims senior-level positions with very limited experience duration.",
                "HIGH",
                0.80
            ));
        }

        analysis.setTotalYears(totalExperienceYears);
        analysis.setHasGaps(!gaps.isEmpty());
        analysis.setGapPeriods(gaps);
        analysis.setHasOverlaps(hasOverlaps);
        analysis.setConsistencyScore(hasOverlaps ? 25.0 : (gaps.isEmpty() ? 88.0 : 60.0));
        analysis.setVerdict(hasOverlaps ? "Critical overlap detected in work history" : (gaps.isEmpty() ? "Experience timeline appears consistent" : "Minor inconsistencies in experience timeline"));

        return analysis;
    }

    private void checkKeywordStuffing(String content, List<ResumeAnalysisResult.FraudFlag> flags) {
        // Count repetitive keywords
        String[] buzzwords = {"innovative", "synergy", "passionate", "results-driven", "dynamic", "team player", "self-motivated", "go-getter"};
        int buzzwordCount = 0;
        for (String word : buzzwords) {
            if (content.contains(word)) buzzwordCount++;
        }

        if (buzzwordCount >= 5) {
            flags.add(new ResumeAnalysisResult.FraudFlag(
                "CONTENT_QUALITY",
                "Excessive use of generic buzzwords (" + buzzwordCount + " detected). May indicate AI-generated or template-copied content.",
                "LOW",
                0.55
            ));
        }
    }

    private void checkFormattingAnomalies(String content, List<ResumeAnalysisResult.FraudFlag> flags) {
        // Check for very short resume (possibly hiding info)
        if (content.trim().length() < 200) {
            flags.add(new ResumeAnalysisResult.FraudFlag(
                "FORMAT",
                "Resume content is unusually brief. May be hiding relevant information.",
                "LOW",
                0.50
            ));
        }

        // Check for suspicious contact info patterns
        Pattern emailPattern = Pattern.compile("[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}");
        Matcher emailMatcher = emailPattern.matcher(content);
        int emailCount = 0;
        while (emailMatcher.find()) emailCount++;

        if (emailCount > 3) {
            flags.add(new ResumeAnalysisResult.FraudFlag(
                "FORMAT",
                "Multiple email addresses found (" + emailCount + "). Possible identity confusion.",
                "MEDIUM",
                0.60
            ));
        }
    }

    private void checkUnrealisticClaims(String content, List<ResumeAnalysisResult.FraudFlag> flags) {
        // Check for unrealistic achievement numbers
        Pattern percentPattern = Pattern.compile("(\\d{3,})%");
        Matcher percentMatcher = percentPattern.matcher(content);
        while (percentMatcher.find()) {
            int percent = Integer.parseInt(percentMatcher.group(1));
            if (percent > 100 && percent < 1000) { // reasonable flag range
                flags.add(new ResumeAnalysisResult.FraudFlag(
                    "CLAIMS",
                    "Suspicious percentage claim found: " + percent + "%. Verify authenticity.",
                    "MEDIUM",
                    0.70
                ));
            }
        }

        // Check for 100% proficiency claims across too many tools
        long expertCount = Arrays.stream(content.split("\\s+"))
            .filter(w -> w.equals("expert") || w.equals("proficient") || w.equals("advanced"))
            .count();

        if (expertCount > 10) {
            flags.add(new ResumeAnalysisResult.FraudFlag(
                "CLAIMS",
                "Claims expert/proficient level in " + expertCount + " areas. Possibly overstated competency.",
                "MEDIUM",
                0.68
            ));
        }
    }

    private double calculateFraudScore(
        List<ResumeAnalysisResult.FraudFlag> flags,
        ResumeAnalysisResult.SkillsAnalysis skills,
        ResumeAnalysisResult.ExperienceAnalysis exp,
        ResumeAnalysisResult.EducationAnalysis edu
    ) {
        double score = 0;

        for (ResumeAnalysisResult.FraudFlag flag : flags) {
            switch (flag.getSeverity()) {
                case "HIGH":   score += 20 * flag.getConfidence(); break;
                case "MEDIUM": score += 12 * flag.getConfidence(); break;
                case "LOW":    score += 5  * flag.getConfidence(); break;
            }
        }

        // Factor in consistency scores
        double avgConsistency = (skills.getSkillConsistencyScore() + exp.getConsistencyScore() + edu.getCredibilityScore()) / 3.0;
        score += (100 - avgConsistency) * 0.3;

        return score;
    }

    private String determineRiskLevel(double score) {
        if (score >= 70) return "CRITICAL";
        if (score >= 45) return "HIGH";
        if (score >= 20) return "MEDIUM";
        return "LOW";
    }

    private String generateSummary(ResumeAnalysisResult result) {
        StringBuilder sb = new StringBuilder();
        sb.append("AI Analysis Complete. ");

        int flagCount = result.getFraudFlags().size();
        long highFlags = result.getFraudFlags().stream().filter(f -> "HIGH".equals(f.getSeverity())).count();

        switch (result.getRiskLevel()) {
            case "CRITICAL":
                sb.append("This resume exhibits CRITICAL fraud indicators. ");
                sb.append(flagCount + " suspicious patterns detected, including " + highFlags + " high-severity issues. ");
                sb.append("Strong recommendation: DO NOT proceed with this candidate without thorough verification.");
                break;
            case "HIGH":
                sb.append("This resume shows HIGH risk of misrepresentation. ");
                sb.append(flagCount + " issues found requiring immediate attention. ");
                sb.append("Conduct detailed background checks before proceeding.");
                break;
            case "MEDIUM":
                sb.append("This resume has MODERATE risk indicators. ");
                sb.append(flagCount + " areas of concern identified. ");
                sb.append("Recommend verifying key credentials and employment history.");
                break;
            default:
                sb.append("This resume shows LOW risk of fraud. ");
                sb.append(flagCount > 0 ? flagCount + " minor concern(s) noted but no major red flags detected. " : "No significant red flags detected. ");
                sb.append("Standard verification procedures recommended.");
        }

        sb.append(" Fraud Score: " + String.format("%.1f", result.getFraudScore()) + "/100.");
        return sb.toString();
    }
}
