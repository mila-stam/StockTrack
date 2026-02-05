// src/components/AppHeader.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AppHeader.module.css';

function AppHeader() {
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link to="/" className={styles.appName}>
                    StockTrack
                </Link>

                <nav className={styles.navLinks}>
                    <Link to="/news" className={styles.navItem}>
                        News
                    </Link>
                    <Link to="/top5" className={styles.navItem}>
                        Top 5
                    </Link>
                    <Link to="/graph" className={styles.navItem}>
                        Graph
                    </Link>
                    <Link to="/predictions" className={styles.navItem}>
                        Predictions
                    </Link>
                </nav>
            </div>
        </header>
    );
}

export default AppHeader;
