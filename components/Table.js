import styles from './Table.module.css';

export default function Table({ data, columns, onDelete }) {
  if (!data || data.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateIcon}>📊</div>
        <div className={styles.emptyStateTitle}>No Data Available</div>
        <div className={styles.emptyStateMessage}>
          No job applications found. Data will appear here once applications are processed.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className={styles.tableHeaderCell}>
                {column.header}
              </th>
            ))}
            {onDelete && (
              <th className={styles.tableHeaderCell}>
                      
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex} className={styles.tableRow}>
              {columns.map((column, colIndex) => (
                <td key={colIndex} className={styles.tableCell}>
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
              {onDelete && (
                <td className={styles.tableCell}>
                  <button
                    className={styles.deleteButton}
                    onClick={() => onDelete(row.id || rowIndex)}
                    title="Delete this application"
                  >
                    ✕
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
