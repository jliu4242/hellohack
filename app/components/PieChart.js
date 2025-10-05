'use client';

import styles from './PieChart.module.css';

export default function PieChart({ data, title = "Pie Chart Visualization" }) {
  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  if (total === 0) {
    return (
      <div className={styles.pieChartContainer}>
        <h3 className={styles.pieChartTitle}>{title}</h3>
        <div className={styles.noDataMessage}>No data available for visualization</div>
      </div>
    );
  }

  // Calculate cumulative percentages for pie slices
  let cumulativePercentage = 0;
  const slices = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const startAngle = (cumulativePercentage / 100) * 360;
    const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
    
    cumulativePercentage += percentage;
    
    return {
      ...item,
      percentage: Math.round(percentage),
      startAngle,
      endAngle,
      index
    };
  });

  // Create conic-gradient string for the pie chart
  const conicGradient = slices.map((slice, index) => {
    const startAngle = slice.startAngle;
    const endAngle = slice.endAngle;
    return `${slice.color} ${startAngle}deg ${endAngle}deg`;
  }).join(', ');

  return (
    <div className={styles.pieChartContainer}>
      <h3 className={styles.pieChartTitle}>{title}</h3>
      
      <div className={styles.pieChartWrapper}>
        <div className={styles.pieChartInner}>
          <div 
            className={styles.pieChart}
            style={{
              background: `conic-gradient(${conicGradient})`
            }}
          />
          <div className={styles.pieChartHole}>
            <div className={styles.centerContent}>
              <div className={styles.totalNumber}>{total}</div>
              <div className={styles.totalLabel}>Total</div>
            </div>
          </div>
        </div>
        
        <div className={styles.legend}>
          {slices.map((slice, index) => (
            <div key={index} className={styles.legendItem}>
              <div 
                className={styles.legendColor} 
                style={{ backgroundColor: slice.color }}
              />
              <span className={styles.legendLabel}>{slice.label}</span>
              <span className={styles.legendValue}>
                {slice.value} ({slice.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
