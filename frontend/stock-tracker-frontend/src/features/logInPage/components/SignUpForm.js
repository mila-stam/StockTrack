import React, { useState } from 'react';
import styles from './SignUpForm.module.css';

function SignUpForm({ onSignUpSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        setMessage('');

        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            setMessage('Password must be at least 6 characters long.');
            return;
        }

        console.log('Simulating sign up for:', { email });
        setMessage('Sign up successful! Please log in with your new credentials.');

        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };

    return (
        <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.signUpForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="signupEmail" className={styles.label}>Email:</label>
                    <input
                        type="email"
                        id="signupEmail"
                        className={styles.inputField}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        aria-label="Sign up email address"
                        placeholder="enter your email"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="signupPassword" className={styles.label}>Password:</label>
                    <input
                        type="password"
                        id="signupPassword"
                        className={styles.inputField}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        aria-label="Sign up password"
                        placeholder="create a password"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword" className={styles.label}>Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className={styles.inputField}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        aria-label="Confirm password"
                        placeholder="confirm your password"
                    />
                </div>

                {message && <p className={`${styles.message} ${message.includes('successful') ? styles.successMessage : styles.errorMessage}`}>{message}</p>}

                <button type="submit" className={styles.submitButton}>
                    Sign Up
                </button>
            </form>
        </div>
    );
}

export default SignUpForm;
