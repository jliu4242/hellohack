'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Upload.module.css';

export default function UploadPage() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadedData, setUploadedData] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  const validateEmailData = (data) => {
    if (!Array.isArray(data)) {
      throw new Error('JSON must contain an array of email objects');
    }

    const requiredFields = ['id', 'company', 'position', 'dateApplied', 'startDate', 'status'];
    
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      for (const field of requiredFields) {
        if (!item[field]) {
          throw new Error(`Item ${i + 1} is missing required field: ${field}`);
        }
      }
    }

    return data;
  };

  const processUploadedData = useCallback(async (fileContent) => {
    try {
      setError(null);
      setIsUploading(true);
      setUploadStatus('Parsing JSON...');

      const jsonData = JSON.parse(fileContent);
      const validatedData = validateEmailData(jsonData);

      setUploadStatus('Processing applications...');
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Transform data to match our application format
      const processedData = validatedData.map((item, index) => ({
        id: item.id || Date.now() + index,
        company: item.company,
        position: item.position,
        dateApplied: item.dateApplied || new Date().toISOString().split('T')[0],
        startDate: item.startDate || null,
        status: item.status || 'Applied'
      }));

      setUploadedData(processedData);
      setUploadStatus('Upload successful!');
      
      // Store in localStorage for the spreadsheet page
      localStorage.setItem('uploadedApplications', JSON.stringify(processedData));
      
    } catch (err) {
      setError(err.message);
      setUploadStatus('Upload failed');
    } finally {
      setIsUploading(false);
    }
}, []);

  const handleFileSelect = useCallback(async (file) => {
    if (!file) return;

    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      setError('Please select a JSON file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      processUploadedData(e.target.result);
    };
    reader.readAsText(file);
  }, [processUploadedData]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  }, [handleFileSelect]);

  const handleViewSpreadsheet = () => {
    router.push('/pages/spreadsheets');
  };

  const handleUploadAnother = () => {
    setUploadedData(null);
    setUploadStatus(null);
    setError(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Upload Email Data</h1>
      </div>

      <div className={styles.content}>
        {!uploadedData ? (
          <div
            className={`${styles.dropZone} ${isDragOver ? styles.dragOver : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className={styles.dropZoneContent}>
              <div className={styles.uploadIcon}>
                {isDragOver ? '📁' : '📤'}
              </div>
              
              <h3 className={styles.dropZoneTitle}>
                {isDragOver ? 'Drop your JSON file here' : 'Drag & drop your JSON file'}
              </h3>
              
              <p className={styles.dropZoneSubtitle}>
                or click to browse files
              </p>

              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileInputChange}
                className={styles.fileInput}
                id="fileInput"
                disabled={isUploading}
              />
              
              <label htmlFor="fileInput" className={styles.browseButton}>
                {isUploading ? 'Processing...' : 'Browse Files'}
              </label>

              {isUploading && (
                <div className={styles.progressBar}>
                  <div className={styles.progressFill}></div>
                </div>
              )}

              {uploadStatus && (
                <div className={`${styles.status} ${error ? styles.error : styles.success}`}>
                  {uploadStatus}
                </div>
              )}

              {error && (
                <div className={styles.errorDetails}>
                  <strong>Error:</strong> {error}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.successContainer}>
            <div className={styles.successIcon}>✅</div>
            <h3 className={styles.successTitle}>Upload Successful!</h3>
            <p className={styles.successMessage}>
              Successfully processed {uploadedData.length} job applications from your JSON file.
            </p>
            
            <div className={styles.successActions}>
              <button 
                className={styles.primaryButton}
                onClick={handleViewSpreadsheet}
              >
                View Spreadsheet
              </button>
              <button 
                className={styles.secondaryButton}
                onClick={handleUploadAnother}
              >
                Upload Another File
              </button>
            </div>
          </div>
        )}

        
      </div>
    </div>
  );
}
