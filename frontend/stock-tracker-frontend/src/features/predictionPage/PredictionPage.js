import React from 'react';
import AppHeader from '../../components/AppHeader';
import AppFooter from '../../components/AppFooter';
import styles from './PredictionPage.module.css';

function PredictionPage({ isLoggedIn, onLogout }) {
    return (
        <div className={styles.predictionPageContainer}>
            <AppHeader isLoggedIn={isLoggedIn} onLogout={onLogout} />

            <main className={styles.mainContent}>
                <div className={styles.messageBox}>
                    <h1 className={styles.messageTitle}>Exciting Developments Ahead!</h1>
                    <p className={styles.messageText}>
                        We're currently training our advanced prediction models to bring you insightful stock forecasts.
                        Stay tuned for powerful market insights, coming to you soon!
                    </p>
                    <div className={styles.loadingSpinner}></div>
                </div>
            </main>

            <AppFooter />
        </div>
    );
}

export default PredictionPage;
