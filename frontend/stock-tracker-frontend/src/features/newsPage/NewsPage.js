import React from 'react';
import AppHeader from '../../components/AppHeader';
import AppFooter from '../../components/AppFooter';
import NewsDisplay from './components/NewsDisplay';
import styles from './NewsPage.module.css';

function NewsPage({ isLoggedIn, onLogout }) {
    return (
        <div className={styles.newsPageContainer}>
            <AppHeader isLoggedIn={isLoggedIn} onLogout={onLogout} />

            <main className={styles.mainContent}>
                <h1 className={styles.pageTitle}>Global Stock Market News</h1>
                <p className={styles.pageDescription}>Stay updated with the latest happenings in the financial world.</p>
                <NewsDisplay />
            </main>

            <AppFooter />
        </div>
    );
}

export default NewsPage;
