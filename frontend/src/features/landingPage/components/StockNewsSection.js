import React, { useState, useEffect, useRef } from 'react';
import styles from './StockNewsSection.module.css';

function StockNewsSection({ limit }) {
    const [newsItems, setNewsItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchNews = async () => {
            try {
                const response = await fetch('/api/news/latest');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (!Array.isArray(data)) {
                    setNewsItems([]);
                    return;
                }

                const formatted = data.map((item, index) => ({
                    id: index,
                    title: item.title,
                    summary: item.summary,
                    image: item.banner_image || 'https://placehold.co/400x250/cccccc/000000?text=No+Image',
                    url: item.url
                }));

                // 🔑 APPLY LIMIT IF PROVIDED
                setNewsItems(limit ? formatted.slice(0, limit) : formatted);
                setError(null);
            } catch (e) {
                console.error('Failed to fetch news:', e);
                setError('Failed to load news.');
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [limit]);

    if (loading) {
        return <p className={styles.infoMessage}>Loading news...</p>;
    }

    if (error && newsItems.length === 0) {
        return <p className={`${styles.infoMessage} ${styles.errorMessage}`}>{error}</p>;
    }

    if (newsItems.length === 0) {
        return <p className={styles.infoMessage}>No news available.</p>;
    }

    return (
        <section className={styles.newsSection}>
            <div className={styles.newsGrid}>
                {newsItems.map(news => (
                    <a
                        key={news.id}
                        href={news.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.newsCard}
                    >
                        <img
                            src={news.image}
                            alt={news.title}
                            className={styles.newsImage}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/400x250/cccccc/000000?text=No+Image';
                            }}
                        />
                        <div className={styles.newsContent}>
                            <h3 className={styles.newsTitle}>{news.title}</h3>
                            <p className={styles.newsSummary}>{news.summary}</p>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}

export default StockNewsSection;
