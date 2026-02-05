// src/components/AppFooter.js
import React from 'react';
import styles from './AppFooter.module.css';

function AppFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footerContainer}>
            <p className={styles.footerText}>
                &copy; {currentYear} StockTrack. All rights reserved.
            </p>
        </footer>
    );
}

export default AppFooter;
