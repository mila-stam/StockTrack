import React, { useState, useEffect } from 'react';
import styles from './NewsDisplay.module.css';

function NewsDisplay() {
    const [newsArticles, setNewsArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('http://localhost:8082/api/news/all', {
                    credentials: 'include'
                });

                if (!response.ok) {
                    if (response.status === 204) {
                        setNewsArticles([]);
                        console.log("NewsDisplay: No content for all news articles.");
                        setError("No news articles available at the moment.");
                    } else if (response.status === 401 || response.status === 403) {
                        setError("Authentication required to view all news. Please log in.");
                        console.error(`NewsDisplay: Access denied (${response.status}) for /api/news/all.`);
                    }
                    else {
                        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
                    }
                } else {
                    const data = await response.json();
                    const formattedArticles = data.map(article => ({
                        id: article.id,
                        image: article.bannerImage || 'https://placehold.co/600x400/cccccc/000000?text=News+Image',
                        category: article.source || 'Market News',
                        title: article.title,
                        excerpt: article.summary,
                        date: new Date(
                            parseInt(article.timePublished.substring(0, 4)),
                            parseInt(article.timePublished.substring(4, 6)) - 1,
                            parseInt(article.timePublished.substring(6, 8))
                        ).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                        readTime: `${Math.ceil(article.summary.split(' ').length / 150)} min read`
                    }));
                    setNewsArticles(formattedArticles);
                    setError(null);
                }
            } catch (e) {
                console.error("NewsDisplay: Failed to fetch all news articles:", e);
                setError("Failed to load news articles. Please try again later. (Network or server issue)");
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (loading) {
        return (
            <section className={styles.newsDisplaySection}>
                <p className={styles.infoMessage}>Loading news articles...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className={styles.newsDisplaySection}>
                <p className={`${styles.infoMessage} ${styles.errorMessage}`}>{error}</p>
            </section>
        );
    }

    if (newsArticles.length === 0) {
        return (
            <section className={styles.newsDisplaySection}>
                <p className={styles.infoMessage}>No news articles available at the moment.</p>
            </section>
        );
    }

    return (
        <section className={styles.newsDisplaySection}>
            <div className={styles.newsGrid}>
                {newsArticles.map(article => (
                    <div key={article.id} className={styles.newsCard}>
                        {article.image && (
                            <img
                                src={article.image}
                                alt={article.title}
                                className={styles.newsCardImage}
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/cccccc/000000?text=News+Image'; }}
                            />
                        )}
                        <div className={styles.newsCardContent}>
                            <span className={styles.newsCardCategory}>{article.category}</span>
                            <h3 className={styles.newsCardTitle}>{article.title}</h3>
                            <p className={styles.newsCardExcerpt}>{article.excerpt}</p>
                            <div className={styles.newsCardMeta}>
                                <span className={styles.newsCardDate}>{article.date}</span>
                                <span className={styles.newsCardReadTime}>{article.readTime}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default NewsDisplay;
