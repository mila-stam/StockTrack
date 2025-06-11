package mk.finki.ukim.wp.stocktrackapp.repository;

import mk.finki.ukim.wp.stocktrackapp.models.NewsArticle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsArticleRepository extends JpaRepository<NewsArticle, Long> {
}
