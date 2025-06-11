package mk.finki.ukim.wp.stocktrackapp.service.interfaces;

import java.util.List;
import java.util.Map;

public interface NewsArticleService {
    List<Map<String, Object>> fetchLatestNews();
}
