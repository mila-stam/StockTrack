// src/features/newsPage/components/NewsDisplay.js
import React, { useEffect, useState, useRef } from 'react';
import styles from './NewsDisplay.module.css';

function NewsDisplay({ limit }) {
    const [newsArticles, setNewsArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchedRef = useRef(false);

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        const fetchNews = async () => {
            try {
                const response = await fetch('/api/news/latest');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (!Array.isArray(data)) {
                    setNewsArticles([]);
                    return;
                }

                const formatted = data.map((article, index) => ({
                    id: index,
                    title: article.title || 'No title available',
                    excerpt: article.summary || 'No summary available',
                    image:
                        article.banner_image ||
                        'https://placehold.co/600x400/cccccc/000000?text=News+Image',
                    url: article.url || '#',
                }));

                setNewsArticles(limit ? formatted.slice(0, limit) : formatted);
                setError(null);
            } catch (err) {
                console.error('NewsDisplay: Failed to fetch news:', err);
                setError('Failed to load news articles. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [limit]);

    if (loading) {
        return (
            <section className={styles.newsDisplaySection}>
                <p className={styles.infoMessage}>Loading news articles...</p>
            </section>
        );
    }

    if (error && newsArticles.length === 0) {
        return (
            <section className={styles.newsDisplaySection}>
                <p className={`${styles.infoMessage} ${styles.errorMessage}`}>
                    {error}
                </p>
            </section>
        );
    }

    if (newsArticles.length === 0) {
        return (
            <section className={styles.newsDisplaySection}>
                <p className={styles.infoMessage}>
                    No news articles available at the moment.
                </p>
            </section>
        );
    }

    return (
        <section className={styles.newsDisplaySection}>
            <div className={styles.newsGrid}>
                {newsArticles.map(article => (
                    <a
                        key={article.id}
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.newsCard}
                    >
                        <img
                            src={article.image}
                            alt={article.title}
                            className={styles.newsCardImage}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                    'https://placehold.co/600x400/cccccc/000000?text=News+Image';
                            }}
                        />
                        <div className={styles.newsCardContent}>
                            <h3 className={styles.newsCardTitle}>
                                {article.title}
                            </h3>
                            <p className={styles.newsCardExcerpt}>
                                {article.excerpt}
                            </p>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}

export default NewsDisplay;
