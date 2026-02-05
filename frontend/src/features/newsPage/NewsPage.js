// src/features/newsPage/NewsPage.js
import React from 'react';
import AppHeader from '../../components/AppHeader';
import AppFooter from '../../components/AppFooter';
import NewsDisplay from './components/NewsDisplay';
import styles from './NewsPage.module.css';

function NewsPage() {
    return (
        <div className={styles.newsPageContainer}>
            <AppHeader />

            <main className={styles.mainContent}>
                <h1 className={styles.pageTitle}>Global Stock Market News</h1>
                <p className={styles.pageDescription}>
                    Stay updated with the latest financial news.
                </p>
                <NewsDisplay />
            </main>

            <AppFooter />
        </div>
    );
}

export default NewsPage;
