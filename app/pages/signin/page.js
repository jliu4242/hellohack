'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic';
import styles from './Signin.module.css';

// disable SSR for FirebaseUI (browser only)
const FirebaseAuthUI = dynamic(() => import('../../components/firebaseAuthUI.js'), { ssr: false });

export default function Signin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // TODO: Implement actual authentication logic
        console.log('Sign in attempt:', { email, password });
        
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            alert('Sign in functionality will be implemented with Firebase Auth');
        }, 1000);
    };

    return (
        <div className={styles.container}>
            <div className={styles.signinCard}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Welcome Back</h1>
                    <p className={styles.subtitle}>Sign in to your Job Tracker account</p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.firebaseAuthContainer}>
                        <FirebaseAuthUI />
                    </div>

                    <div className={styles.divider}>
                        <div className={styles.dividerLine}></div>
                        <span className={styles.dividerText}>OR CONTINUE WITH EMAIL</span>
                        <div className={styles.dividerLine}></div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Email</label>
                        <input 
                            type='email' 
                            placeholder='Enter your email' 
                            value={email}
                            autoComplete='email'
                            onChange={e => setEmail(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Password</label>
                        <input 
                            type='password' 
                            placeholder='Enter your password' 
                            value={password}
                            autoComplete='current-password'
                            onChange={e => setPassword(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className={styles.signinButton}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>

                    <div className={styles.signupLink}>
                        Don't have an account? <a href="#">Sign Up</a>
                    </div>
                </form>
            </div>
        </div>
    )
}

