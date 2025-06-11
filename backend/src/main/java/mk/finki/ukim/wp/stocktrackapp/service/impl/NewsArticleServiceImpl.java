package mk.finki.ukim.wp.stocktrackapp.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import mk.finki.ukim.wp.stocktrackapp.service.interfaces.NewsArticleService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class NewsArticleServiceImpl implements NewsArticleService {

    @Value("${alphavantage.news.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public NewsArticleServiceImpl(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    @Override
    public List<Map<String, Object>> fetchLatestNews() {
        String url = String.format(
                "https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=%s",
                apiKey
        );
        String jsonResponse = restTemplate.getForObject(url, String.class);
        List<Map<String, Object>> articles = new ArrayList<>();
        try {
            JsonNode root = objectMapper.readTree(jsonResponse);
            JsonNode feed = root.path("feed");
            if (feed.isArray()) {
                for (JsonNode node : feed) {
                    Map<String, Object> article = new HashMap<>();
                    article.put("title", node.path("title").asText());
                    article.put("url", node.path("url").asText());
                    article.put("summary", node.path("summary").asText());
                    article.put("banner_image", node.path("banner_image").asText());
                    articles.add(article);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return articles;
    }
}
