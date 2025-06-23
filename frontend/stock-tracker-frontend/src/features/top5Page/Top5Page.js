import React from 'react';
import AppHeader from '../../components/AppHeader';
import AppFooter from '../../components/AppFooter';
import StockNewsSection from '../landingPage/components/StockNewsSection';
import Top5CompaniesList from './components/Top5CompaniesList';
import styles from './Top5Page.module.css';

function Top5Page({ isLoggedIn, onLogout }) {
    return (
        <div className={styles.top5PageContainer}>
            <AppHeader isLoggedIn={isLoggedIn} onLogout={onLogout} />

            <main className={styles.mainContent}>
                <h1 className={styles.pageTitle}>Top 5 Companies by Market Cap</h1>
                <p className={styles.pageDescription}>Discover the current market leaders.</p>

                <Top5CompaniesList />

                <StockNewsSection />
            </main>

            <AppFooter />
        </div>
    );
}

export default Top5Page;
