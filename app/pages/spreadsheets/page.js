'use client';

import { useState, useEffect } from 'react';
import Table from '../../components/Table';
import { StatCard } from '../../components/Card';
import PieChart from '../../components/PieChart';
import styles from './Summary.module.css';

// Sample data - in production, this would come from an API or background script
import applicationsData from '../../../data/applications.json';

export default function SpreadsheetPage() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('none');

  useEffect(() => {
    // Check for uploaded data first, then fall back to sample data
    const timer = setTimeout(() => {
      const uploadedData = localStorage.getItem('uploadedApplications');
      if (uploadedData) {
        try {
          const parsedData = JSON.parse(uploadedData);
          setApplications(parsedData);
          setFilteredApplications(parsedData);
        } catch (error) {
          console.error('Error parsing uploaded data:', error);
          setApplications(applicationsData);
          setFilteredApplications(applicationsData);
        }
      } else {
        setApplications(applicationsData);
        setFilteredApplications(applicationsData);
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Filter and sort applications based on status, search query, and sort option
  useEffect(() => {
    let filtered = applications;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Filter by search query (company name)
    if (searchQuery.trim()) {
      filtered = filtered.filter(app => 
        app.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort applications
    if (sortBy !== 'none') {
      filtered = [...filtered].sort((a, b) => {
        if (sortBy === 'status') {
          // Define status priority order: Offer Extended, Interview Scheduled, Applied, Rejected
          const statusOrder = {
            'Offer Extended': 1,
            'Interview Scheduled': 2,
            'Applied': 3,
            'Rejected': 4
          };
          return statusOrder[a.status] - statusOrder[b.status];
        } else if (sortBy === 'date') {
          // Sort by application date (newest first)
          return new Date(b.dateApplied) - new Date(a.dateApplied);
        }
        return 0;
      });
    }

    setFilteredApplications(filtered);
  }, [applications, statusFilter, searchQuery, sortBy]);

  // Calculate statistics
  const stats = {
    total: applications.length,
    applied: applications.filter(app => app.status === 'Applied').length,
    interviews: applications.filter(app => app.status === 'Interview Scheduled').length,
    offers: applications.filter(app => app.status === 'Offer Extended').length,
    rejected: applications.filter(app => app.status === 'Rejected').length,
  };

  // Prepare data for pie chart
  const pieChartData = [
    {
      label: 'Applied',
      value: stats.applied,
      color: '#3b82f6' // blue
    },
    {
      label: 'Interview Scheduled',
      value: stats.interviews,
      color: '#f59e0b' // yellow
    },
    {
      label: 'Offer Extended',
      value: stats.offers,
      color: '#10b981' // green
    },
    {
      label: 'Rejected',
      value: stats.rejected,
      color: '#ef4444' // red
    }
  ].filter(item => item.value > 0); // Only show categories with data

  // Get unique statuses for filter dropdown
  const statusOptions = [
    { value: 'all', label: 'All Applications' },
    { value: 'Applied', label: 'Applied' },
    { value: 'Interview Scheduled', label: 'Interview Scheduled' },
    { value: 'Offer Extended', label: 'Offer Extended' },
    { value: 'Rejected', label: 'Rejected' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'none', label: 'No Sorting' },
    { value: 'status', label: 'Sort by Status' },
    { value: 'date', label: 'Sort by Date' }
  ];

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setSearchQuery('');
    setSortBy('none');
  };

  const handleDeleteApplication = (applicationId) => {
    const updatedApplications = applications.filter(app => app.id !== applicationId);
    setApplications(updatedApplications);
    
    // Update localStorage if data was stored there
    if (localStorage.getItem('uploadedApplications')) {
      localStorage.setItem('uploadedApplications', JSON.stringify(updatedApplications));
    }
  };

  const handleClearAll = () => {
    setApplications([]);
    setFilteredApplications([]);
    
    // Clear localStorage
    localStorage.removeItem('uploadedApplications');
  };

  // Define table columns
  const columns = [
    {
      key: 'company',
      header: 'Company',
      render: (row) => (
        <div className={styles.companyCell}>
          {row.company}
        </div>
      )
    },
    {
      key: 'position',
      header: 'Position',
      render: (row) => (
        <div className={styles.roleCell}>
          {row.position}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        const statusClass = {
          'Applied': styles.statusApplied,
          'Interview Scheduled': styles.statusInterview,
          'Offer Extended': styles.statusOffer,
          'Rejected': styles.statusRejected,
        }[row.status] || styles.statusApplied;

        return (
          <div className={styles.statusCell}>
            <span className={`${styles.statusBadge} ${statusClass}`}>
              {row.status}
            </span>
          </div>
        );
      }
    },
    {
      key: 'dateApplied',
      header: 'Date Applied',
      render: (row) => (
        <div className={styles.dateCell}>
          {new Date(row.dateApplied).toLocaleDateString()}
        </div>
      )
    },
    {
      key: 'startDate',
      header: 'Start Date',
      render: (row) => (
        <div className={styles.dateCell}>
          {row.status === 'Offer Extended' && row.startDate ? 
            new Date(row.startDate).toLocaleDateString() : 
            '-'
          }
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Job Applications Summary</h1>
          <p className={styles.subtitle}>Loading your application data...</p>
        </div>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '20px' }}>⏳</div>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Applications Summary</h1>
      </div>

      <div className={styles.stats}>
        <StatCard number={stats.total} label="Total Applications" color="blue" />
        <StatCard number={stats.applied} label="Applied" color="blue" />
        <StatCard number={stats.interviews} label="Interviews" color="yellow" />
        <StatCard number={stats.offers} label="Offers" color="green" />
        <StatCard number={stats.rejected} label="Rejected" color="red" />
      </div>

      <div className={styles.spreadsheetContainer}>
        <div className={styles.spreadsheetHeader}>
          <h2 className={styles.spreadsheetTitle}>Applications</h2>
          <p className={styles.spreadsheetSubtitle}>Manage and track all your job applications.</p>
        </div>

        <div className={styles.searchAndFilter}>
          <div className={styles.searchContainer}>
            <div className={styles.searchIcon}>🔍</div>
            <input
              type="text"
              placeholder="Search companies or positions..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className={styles.filterContainer}>
            <div className={styles.filterIcon}>🔽</div>
            <select
              className={styles.filterSelect}
              value={statusFilter}
              onChange={handleStatusFilterChange}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.sortContainer}>
            <div className={styles.sortIcon}>📊</div>
            <select
              className={styles.sortSelect}
              value={sortBy}
              onChange={handleSortChange}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Table data={filteredApplications} columns={columns} onDelete={handleDeleteApplication} />
        
        <div className={styles.resultsCount}>
          Showing {filteredApplications.length} of {applications.length} applications
          {applications.length > 0 && (
            <button 
              className={styles.clearAllButton}
              onClick={handleClearAll}
              title="Delete all applications"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Pie Chart Visualization */}
      {pieChartData.length > 0 && (
        <PieChart 
          data={pieChartData} 
          title="Pie Chart Visualization"
        />
      )}
    </div>
  );
}
