// src/components/AuthGuard.js
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function AuthGuard({ isLoggedIn, authCheckComplete, children }) {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const publicPaths = ['/', '/login'];
        const currentPath = location.pathname;

        if (authCheckComplete) {
            if (!isLoggedIn && !publicPaths.includes(currentPath)) {
                console.log(`AuthGuard: Not logged in and attempting to access ${currentPath}. Redirecting to /login.`);
                navigate('/login', { replace: true });
            } else if (isLoggedIn && currentPath === '/login') {
                console.log('AuthGuard: Logged in and on /login page. Redirecting to /top5.');
                navigate('/top5', { replace: true });
            }
        }
    }, [isLoggedIn, authCheckComplete, navigate, location.pathname]);

    return <>{children}</>;
}

export default AuthGuard;
