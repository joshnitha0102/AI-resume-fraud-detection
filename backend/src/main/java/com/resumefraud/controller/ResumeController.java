package com.resumefraud.controller;

import com.resumefraud.dto.ResumeAnalysisResult;
import com.resumefraud.service.ResumeAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin(origins = "*")
public class ResumeController {

    @Autowired
    private ResumeAnalysisService analysisService;

    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> analyzeResume(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
            }

            String filename = file.getOriginalFilename();
            if (filename == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid file"));
            }

            ResumeAnalysisResult result = analysisService.analyzeResume(file);
            return ResponseEntity.ok(result);

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Failed to process file: " + e.getMessage()));
        }
    }

    @PostMapping("/analyze-text")
    public ResponseEntity<?> analyzeText(@RequestBody Map<String, String> request) {
        String text = request.get("text");
        if (text == null || text.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Text content is required"));
        }

        ResumeAnalysisResult result = analysisService.analyzeResumeText(text);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Resume Fraud Detection API");
        response.put("version", "1.0.0");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAnalyzed", 1247);
        stats.put("fraudDetected", 312);
        stats.put("detectionRate", "25.0%");
        stats.put("avgProcessingTime", "1.8s");
        stats.put("modelsActive", 3);
        return ResponseEntity.ok(stats);
    }
}
