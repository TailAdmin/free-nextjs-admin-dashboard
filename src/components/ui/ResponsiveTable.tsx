'use client';

import React from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
  hideOnMobile?: boolean;
}

interface ResponsiveTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  emptyMessage?: string;
  className?: string;
  rowClassName?: string;
  headerClassName?: string;
  onRowClick?: (row: T) => void;
}

const ResponsiveTable = <T extends Record<string, any>>({
  data,
  columns,
  keyField,
  emptyMessage = 'No data available',
  className = '',
  rowClassName = '',
  headerClassName = '',
  onRowClick,
}: ResponsiveTableProps<T>) => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  if (data.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  // For mobile view, we'll show a card-based layout
  if (isMobile) {
    return (
      <div className="space-y-2">
        {data.map((row, rowIndex) => (
          <div 
            key={String(row[keyField] || rowIndex)}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 ${rowClassName} ${
              onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700' : ''
            }`}
            onClick={() => onRowClick?.(row)}
          >
            <div className="space-y-2">
              {columns.map((column, colIndex) => {
                if (column.hideOnMobile) return null;
                
                const cellContent = typeof column.accessor === 'function' 
                  ? column.accessor(row)
                  : row[column.accessor];
                
                return (
                  <div key={colIndex} className="flex justify-between">
                    <span className="font-medium text-gray-500 dark:text-gray-400">
                      {column.header}:
                    </span>
                    <span className="text-right">
                      {cellContent !== undefined ? cellContent : '—'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Desktop/tablet view - standard table
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-gray-200 dark:divide-gray-700 ${className}`}>
        <thead className={`bg-gray-50 dark:bg-gray-800 ${headerClassName}`}>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${
                  column.hideOnMobile ? 'hidden md:table-cell' : ''
                } ${column.headerClassName || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row, rowIndex) => (
            <tr 
              key={String(row[keyField] || rowIndex)}
              className={`${rowClassName} ${
                onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700' : ''
              }`}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${
                    column.hideOnMobile ? 'hidden md:table-cell' : ''
                  } ${column.cellClassName || ''} ${column.className || ''}`}
                >
                  {typeof column.accessor === 'function'
                    ? column.accessor(row)
                    : row[column.accessor] !== undefined
                    ? row[column.accessor]
                    : '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResponsiveTable;
