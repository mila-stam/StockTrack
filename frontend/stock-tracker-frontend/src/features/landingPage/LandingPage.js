// src/features/landingPage/LandingPage.js
import React from 'react';
import styles from './LandingPage.module.css';
import { useNavigate } from 'react-router-dom';
import StockNewsSection from './components/StockNewsSection';
import AppHeader from '../../components/AppHeader';
import AppFooter from '../../components/AppFooter';

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className={styles.landingPageContainer}>
            <AppHeader />

            <main className={styles.mainContent}>
                <h1 className={styles.pageTitle}>StockTrack</h1>
                <p className={styles.tagline}>Your personal stock tracking solution.</p>

                <button
                    className={styles.getStartedButton}
                    onClick={() => navigate('/top5')}
                >
                    Get Started
                </button>

                <StockNewsSection limit={5} />
            </main>

            <AppFooter />
        </div>
    );
}

export default LandingPage;
