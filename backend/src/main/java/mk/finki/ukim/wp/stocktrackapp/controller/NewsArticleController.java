package mk.finki.ukim.wp.stocktrackapp.controller;

import mk.finki.ukim.wp.stocktrackapp.service.interfaces.NewsArticleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "http://localhost:3000")
public class NewsArticleController {

    private final NewsArticleService newsArticleService;

    public NewsArticleController(NewsArticleService newsArticleService) {
        this.newsArticleService = newsArticleService;
    }

    @GetMapping("/latest")
    public ResponseEntity<List<Map<String, Object>>> getLatestNews() {
        List<Map<String, Object>> news = newsArticleService.fetchLatestNews();
        return ResponseEntity.ok(news);
    }
}
