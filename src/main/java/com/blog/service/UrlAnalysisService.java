package com.blog.service;

import com.blog.dto.UrlAnalysisResponse;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.stereotype.Service;

import java.net.URI;

@Service
public class UrlAnalysisService {

    public UrlAnalysisResponse analyzeUrl(String url) {
        UrlAnalysisResponse response = new UrlAnalysisResponse();
        response.setUrl(url);

        try {
            // Basic safety heuristics
            URI uri = new URI(url);
            String domain = uri.getHost() != null ? uri.getHost().toLowerCase() : "";

            // Check HTTPS
            if (!url.toLowerCase().startsWith("https://")) {
                response.setSafe(false);
                response.setSafetyReason("Insecure protocol: missing HTTPS encryption.");
            }
            // Mock blacklist check
            else if (domain.contains("malicious") || domain.contains("phishing") || domain.endsWith(".xyz")) {
                response.setSafe(false);
                response.setSafetyReason("Domain flagged as suspicious or high-risk.");
            } else {
                response.setSafe(true);
                response.setSafetyReason("URL uses HTTPS and domain appears clean.");
            }

            // Fetch context using Jsoup
            Document doc = Jsoup.connect(url)
                    .timeout(5000)
                    .userAgent("Mozilla/5.0")
                    .get();

            response.setTitle(doc.title());

            Element descriptionElement = doc.selectFirst("meta[name=description]");
            if (descriptionElement != null) {
                response.setDescription(descriptionElement.attr("content"));
            } else {
                // Fallback to og:description if meta description is missing
                Element ogDescription = doc.selectFirst("meta[property=og:description]");
                if (ogDescription != null) {
                    response.setDescription(ogDescription.attr("content"));
                } else {
                    response.setDescription("No description available for this page.");
                }
            }

        } catch (Exception e) {
            response.setTitle("Unknown Context");
            response.setDescription("Could not extract context: " + e.getMessage());
            // If we can't connect, flag as potentially unsafe or unreachable
            response.setSafe(false);
            response.setSafetyReason("Unable to reach the URL to verify safety.");
        }

        return response;
    }
}
