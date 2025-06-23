import React from 'react';
import styles from './LandingPage.module.css';
import { useNavigate } from 'react-router-dom';
import StockNewsSection from './components/StockNewsSection';
import AppHeader from '../../components/AppHeader';
import AppFooter from '../../components/AppFooter';


function LandingPage() {
    const navigate = useNavigate();

    const handleGetStartedClick = () => {
        console.log('Get Started button clicked!');
        navigate('/login');
    };

    return (
        <div className={styles.landingPageContainer}>
            <AppHeader isLoggedIn={false} />

            <main className={styles.mainContent}>
                <h1 className={styles.pageTitle}>StockTrack</h1>
                <p className={styles.tagline}>Your personal stock tracking solution.</p>

                <button
                    className={styles.getStartedButton}
                    onClick={handleGetStartedClick}
                >
                    Get Started
                </button>

                <StockNewsSection />
            </main>

            <AppFooter />
        </div>
    );
}

export default LandingPage;
