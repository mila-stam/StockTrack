import React, { useState, useEffect } from 'react';
import styles from './StockNewsSection.module.css';

function StockNewsSection() {
    const [newsItems, setNewsItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('http://localhost:8082/api/news/latest');
                if (!response.ok) {
                    if (response.status === 204) {
                        setNewsItems([]);
                        console.log("No content for latest news.");
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                } else {
                    const data = await response.json();
                    const formattedNews = data.map(item => ({
                        id: item.id,
                        image: item.bannerImage || 'https://placehold.co/400x250/cccccc/000000?text=No+Image',
                        title: item.title,
                        summary: item.summary,
                        date: new Date(
                            parseInt(item.timePublished.substring(0, 4)),
                            parseInt(item.timePublished.substring(4, 6)) - 1,
                            parseInt(item.timePublished.substring(6, 8))
                        ).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                    }));
                    setNewsItems(formattedNews);
                }
            } catch (e) {
                console.error("Failed to fetch latest news:", e);
                setError("Failed to load latest news. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (loading) {
        return (
            <section className={styles.newsSection}>
                <h2 className={styles.sectionTitle}>Latest Stock News</h2>
                <p className={styles.infoMessage}>Loading latest news...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className={styles.newsSection}>
                <h2 className={styles.sectionTitle}>Latest Stock News</h2>
                <p className={`${styles.infoMessage} ${styles.errorMessage}`}>{error}</p>
            </section>
        );
    }

    if (newsItems.length === 0) {
        return (
            <section className={styles.newsSection}>
                <h2 className={styles.sectionTitle}>Latest Stock News</h2>
                <p className={styles.infoMessage}>No latest news available at the moment.</p>
            </section>
        );
    }

    return (
        <section className={styles.newsSection}>
            <h2 className={styles.sectionTitle}>Latest Stock News</h2>
            <div className={styles.newsGrid}>
                {newsItems.map(news => (
                    <div key={news.id} className={styles.newsCard}>
                        {news.image && (
                            <img
                                src={news.image}
                                alt={news.title}
                                className={styles.newsImage}
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x250/cccccc/000000?text=No+Image'; }}
                            />
                        )}
                        <div className={styles.newsContent}>
                            <h3 className={styles.newsTitle}>{news.title}</h3>
                            <p className={styles.newsSummary}>{news.summary}</p>
                            <span className={styles.newsDate}>{news.date}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default StockNewsSection;