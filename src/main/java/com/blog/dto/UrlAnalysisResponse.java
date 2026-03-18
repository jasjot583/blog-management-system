package com.blog.dto;

public class UrlAnalysisResponse {
    private String url;
    private String title;
    private String description;
    private boolean safe;
    private String safetyReason;

    // Constructors
    public UrlAnalysisResponse() {
    }

    public UrlAnalysisResponse(String url, String title, String description, boolean safe, String safetyReason) {
        this.url = url;
        this.title = title;
        this.description = description;
        this.safe = safe;
        this.safetyReason = safetyReason;
    }

    // Getters and Setters
    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isSafe() {
        return safe;
    }

    public void setSafe(boolean safe) {
        this.safe = safe;
    }

    public String getSafetyReason() {
        return safetyReason;
    }

    public void setSafetyReason(String safetyReason) {
        this.safetyReason = safetyReason;
    }
}
