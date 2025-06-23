import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import styles from './LoginPage.module.css';

function LoginPage({ onLoginSuccess }) {
    const [currentView, setCurrentView] = useState('login');

    const handleToggleView = (view) => {
        setCurrentView(view);
    };

    return (
        <div className={styles.loginPageContainer}>
            <h1 className={styles.pageTitle}>
                {currentView === 'login' ? 'Log In to StockTrack' : 'Sign Up for StockTrack'}
            </h1>

            <div className={styles.toggleButtons}>
                <button
                    className={`${styles.toggleButton} ${currentView === 'login' ? styles.active : ''}`}
                    onClick={() => handleToggleView('login')}
                    aria-pressed={currentView === 'login'}
                >
                    Log In
                </button>
                <button
                    className={`${styles.toggleButton} ${currentView === 'signup' ? styles.active : ''}`}
                    onClick={() => handleToggleView('signup')}
                    aria-pressed={currentView === 'signup'}
                >
                    Sign Up
                </button>
            </div>

            {currentView === 'login' ? (
                <LoginForm onLoginSuccess={onLoginSuccess} />
            ) : (
                <SignUpForm onSignUpSuccess={() => setCurrentView('login')} />
            )}
        </div>
    );
}

export default LoginPage;
