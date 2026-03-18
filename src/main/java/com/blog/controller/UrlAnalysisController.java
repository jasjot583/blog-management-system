package com.blog.controller;

import com.blog.dto.UrlAnalysisRequest;
import com.blog.dto.UrlAnalysisResponse;
import com.blog.service.UrlAnalysisService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/url")
public class UrlAnalysisController {

    private final UrlAnalysisService urlAnalysisService;

    public UrlAnalysisController(UrlAnalysisService urlAnalysisService) {
        this.urlAnalysisService = urlAnalysisService;
    }

    @PostMapping("/analyze")
    public UrlAnalysisResponse analyze(@RequestBody UrlAnalysisRequest request) {
        return urlAnalysisService.analyzeUrl(request.getUrl());
    }
}
