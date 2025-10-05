'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Upload.module.css';

export default function UploadPage() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadedData, setUploadedData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const processMboxFile = useCallback(async () => {
    if (!selectedFile) {
      setError('No file selected');
      return;
    }

    try {
      setError(null);
      setIsProcessing(true);
      setUploadStatus('Sending .mbox file to backend for processing...');

      // Create FormData to send file to backend
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Call backend API
      const response = await fetch('http://localhost:8003/extract', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.statusText}`);
      }
    

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to process .mbox file');
      }

      setUploadStatus('Processing results...');
      
      // Use ChatGPT extracted data
      let processedData = [];
      
      if (result.data && result.data.length > 0) {
        processedData = result.data.map((item, index) => ({
          id: item.id || Date.now() + index,
          company: item.company || 'Unknown Company',
          position: item.position || 'Unknown Position',
          dateApplied: item.dateApplied || new Date().toISOString().split('T')[0],
          startDate: item.startDate || null,
          status: item.status || 'Applied'
        }));
        
        setUploadStatus(`Successfully extracted ${processedData.length} job applications from .mbox file!`);
      } else {
        setUploadStatus('No job applications found in the .mbox file');
      }

      setUploadedData(processedData);
      
      // Store in localStorage for the spreadsheet page
      localStorage.setItem('uploadedApplications', JSON.stringify(processedData));
      
      // Store ChatGPT response for potential analysis
      if (result.raw_response) {
        localStorage.setItem('chatgptResponse', result.raw_response);
      }
      
    } catch (err) {
      setError(err.message);
      setUploadStatus('Processing failed');
    } finally {
      setIsProcessing(false);
    }
}, [selectedFile]);

  const handleFileSelect = useCallback(async (file) => {
    if (!file) return;

    // Only allow .mbox files
    if (!file.name.endsWith('.mbox')) {
      setError('Please select a .mbox file');
      return;
    }

    setSelectedFile(file);
    setError(null);
    setUploadStatus(`Selected file: ${file.name}`);
  }, []);

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
    setSelectedFile(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Upload Email Data</h1>
        <p className={styles.subtitle}>Upload your .mbox file to extract job applications</p>
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
                {isDragOver ? '📁' : '📧'}
              </div>
              
              <h3 className={styles.dropZoneTitle}>
                {isDragOver ? 'Drop your .mbox file here' : 'Drag & drop your .mbox file'}
              </h3>
              
              <p className={styles.dropZoneSubtitle}>
                or click to browse files
              </p>

              <input
                type="file"
                accept=".mbox"
                onChange={handleFileInputChange}
                className={styles.fileInput}
                id="fileInput"
                disabled={isProcessing}
              />
              
              <label htmlFor="fileInput" className={styles.browseButton}>
                Browse .mbox Files
              </label>

              {selectedFile && (
                <div className={styles.selectedFile}>
                  <p>Selected: {selectedFile.name}</p>
                  <button 
                    className={styles.processButton}
                    onClick={processMboxFile}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Process with AI'}
                  </button>
                </div>
              )}

              {isProcessing && (
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
            <h3 className={styles.successTitle}>Processing Complete!</h3>
            <p className={styles.successMessage}>
              Successfully processed {uploadedData.length} job applications from your .mbox file.
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