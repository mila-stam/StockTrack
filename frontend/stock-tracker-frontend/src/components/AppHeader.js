// src/components/AppHeader.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './AppHeader.module.css';

function AppHeader({ isLoggedIn, onLogout }) {
    const navigate = useNavigate();

    const handleLogoutClick = async () => {
        try {
            const response = await fetch('http://localhost:8082/api/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                console.log('AppHeader: Logout successful on backend.');
                if (onLogout) {
                    onLogout();
                }
                navigate('/');
            } else {
                console.error('AppHeader: Logout failed on backend:', response.status, response.statusText);
                if (onLogout) {
                    onLogout();
                }
                navigate('/');
            }
        } catch (error) {
            console.error('AppHeader: Network error during logout:', error);
            if (onLogout) {
                onLogout();
            }
            navigate('/');
        }
    };

    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link to="/top5" className={styles.appName}>
                    StockTrack
                </Link>

                <nav className={styles.navLinks}>
                    {isLoggedIn && (
                        <>
                            <Link to="/news" className={styles.navItem}>
                                News
                            </Link>
                            <Link to="/top5" className={styles.navItem}>
                                Top 5
                            </Link>
                            <Link to="/graph" className={styles.navItem}>
                                Graph
                            </Link>
                        </>
                    )}

                    {isLoggedIn ? (
                        <button
                            onClick={handleLogoutClick}
                            className={`${styles.navItem} ${styles.logoutButton}`}
                        >
                            Log Out
                        </button>
                    ) : null}
                </nav>
            </div>
        </header>
    );
}

export default AppHeader;
