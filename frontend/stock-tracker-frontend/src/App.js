import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from './features/landingPage/LandingPage';
import LoginPage from './features/logInPage/LoginPage';
import Top5Page from './features/top5Page/Top5Page';
import NewsPage from './features/newsPage/NewsPage';
import GraphPage from './features/graphPage/GraphPage';
import PredictionPage from './features/predictionPage/PredictionPage';
import AuthGuard from './components/AuthGuard';
import './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authCheckComplete, setAuthCheckComplete] = useState(false);

    const checkAuthStatus = async () => {
        try {
            const response = await fetch('http://localhost:8082/api/news/all', {
                method: 'HEAD',
                credentials: 'include'
            });

            if (response.ok) {
                setIsLoggedIn(true);
                console.log('App.js: User is already logged in.');
            } else if (response.status === 401 || response.status === 403) {
                setIsLoggedIn(false);
                console.log('App.js: User is not logged in or session expired (401/403).');
            } else {
                console.error('App.js: Error checking auth status:', response.status, response.statusText);
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.error('App.js: Network error during auth check:', error);
            setIsLoggedIn(false);
        } finally {
            setAuthCheckComplete(true);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        console.log('App.js: Login success handler triggered.');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        console.log('App.js: Logout handler triggered.');
    };

    if (!authCheckComplete) {
        return (
            <div className="App">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.5rem', color: '#4a5568' }}>
                    Loading application...
                </div>
            </div>
        );
    }

    return (
        <Router>
            <div className="App">
                <AuthGuard isLoggedIn={isLoggedIn} authCheckComplete={authCheckComplete}>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />

                        <Route path="/top5" element={<Top5Page isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
                        <Route path="/news" element={<NewsPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
                        <Route path="/graph" element={<GraphPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
                        <Route path="/predictions" element={<PredictionPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />

                        <Route path="*" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
                    </Routes>
                </AuthGuard>
            </div>
        </Router>
    );
}

export default App;
