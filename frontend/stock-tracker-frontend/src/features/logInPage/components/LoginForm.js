import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.css';

function LoginForm({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');

        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        try {
            const response = await fetch('http://localhost:8082/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString(),
                credentials: 'include'
            });

            if (response.ok) {
                setMessage('Login successful! Redirecting to dashboard...');
                onLoginSuccess();
                navigate('/top5');
            } else if (response.status === 401) {
                setMessage('Login failed: Invalid email or password.');
            } else {
                setMessage(`Login failed with status: ${response.status}`);
                console.error('Login backend response not OK:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Network error during login:', error);
            setMessage('Network error. Could not connect to the server. Check backend is running on port 8082.');
        }
    };

    return (
        <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="loginEmail" className={styles.label}>Email:</label>
                    <input
                        type="email"
                        id="loginEmail"
                        className={styles.inputField}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        aria-label="Login email address"
                        placeholder="enter your email (e.g., user@example.com)"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="loginPassword" className={styles.label}>Password:</label>
                    <input
                        type="password"
                        id="loginPassword"
                        className={styles.inputField}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        aria-label="Login password"
                        placeholder="enter your password (e.g., password123)"
                    />
                </div>

                {message && <p className={`${styles.message} ${message.includes('successful') ? styles.successMessage : styles.errorMessage}`}>{message}</p>}

                <button type="submit" className={styles.submitButton}>
                    Log In
                </button>
            </form>
        </div>
    );
}

export default LoginForm;
