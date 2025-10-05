'use client';

import Link from "next/link";
import styles from "./Home.module.css";

export default function Home() {
  const scrollToInstructions = () => {
    document.getElementById('instructions').scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <div className={styles.container}>
      {/* Hero Section - Centered */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Stay on top of your job applications.
          </h1>
          <p className={styles.heroSubtitle}>
            Job Tracker is a web app that will help you conveniently monitor your applications and keep your search for jobs organized.
          </p>
          
          <button 
            onClick={scrollToInstructions}
            className={styles.getStartedButton}
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className={styles.features}>
        <div className={styles.featureGrid}>
            
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📊</div>
            <h3>Spreadsheet View</h3>
            <p>Organize applications in a clean, filterable table</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📈</div>
            <h3>Track Progress</h3>
            <p>Monitor application status and success rates</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔍</div>
            <h3>Filter & Search</h3>
            <p>Find specific applications quickly with filters</p>
          </div>
          
        </div>
      </div>
      
      {/* Instructions Section */}
      <div id="instructions" className={styles.instructions}>
        <h2 className={styles.instructionsTitle}>How It Works</h2>
        <div className={styles.instructionsList}>
          <div className={styles.instructionItem}>
            <div className={styles.instructionNumber}>1</div>
            <div className={styles.instructionContent}>
              <h3>Upload Data</h3>
              <p>Upload JSON files containing job application data extracted from your emails</p>
            </div>
          </div>
          <div className={styles.instructionItem}>
            <div className={styles.instructionNumber}>2</div>
            <div className={styles.instructionContent}>
              <h3>View & Organize</h3>
              <p>See all your applications in a clean spreadsheet format with filtering options</p>
            </div>
          </div>
          <div className={styles.instructionItem}>
            <div className={styles.instructionNumber}>3</div>
            <div className={styles.instructionContent}>
              <h3>Track Progress</h3>
              <p>Monitor application status, interview schedules, and success rates</p>
            </div>
          </div>
        </div>
        
        <div className={styles.ctaSection}>
          <h3>Ready to get started?</h3>
          <div className={styles.ctaButtons}>
            <Link href="/pages/upload" className={styles.primaryButton}>
              Upload Email Data
            </Link>
            <Link href="/pages/spreadsheets" className={styles.secondaryButton}>
              View Spreadsheet
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
