import React, { ReactNode } from 'react';

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: {
    xs?: string | number;
    sm?: string | number;
    md?: string | number;
    lg?: string | number;
    xl?: string | number;
    '2xl'?: string | number;
  } | string | number;
  autoFit?: boolean;
  autoFill?: boolean;
  minChildWidth?: string;
  maxChildWidth?: string;
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className = '',
  cols = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = { xs: 2, sm: 3, md: 4, lg: 6 },
  autoFit = false,
  autoFill = false,
  minChildWidth,
  maxChildWidth,
}) => {
  // Generate responsive grid template columns
  const getGridTemplateColumns = () => {
    if (autoFit) {
      return 'repeat(auto-fit, minmax(min(100%, 20rem), 1fr))';
    }
    
    if (autoFill) {
      return 'repeat(auto-fill, minmax(min(100%, 20rem), 1fr))';
    }

    if (minChildWidth || maxChildWidth) {
      const minWidth = minChildWidth || 'min-content';
      const maxWidth = maxChildWidth || '1fr';
      return `repeat(auto-fill, minmax(min(100%, ${minWidth}), ${maxWidth}))`;
    }

    // Default to responsive columns if no auto layout is specified
    return [
      `repeat(${cols.xs || 1}, 1fr)`,
      cols.sm !== undefined && `(min-width: 640px) repeat(${cols.sm}, 1fr)`,
      cols.md !== undefined && `(min-width: 768px) repeat(${cols.md}, 1fr)`,
      cols.lg !== undefined && `(min-width: 1024px) repeat(${cols.lg}, 1fr)`,
      cols.xl !== undefined && `(min-width: 1280px) repeat(${cols.xl}, 1fr)`,
      cols['2xl'] !== undefined && `(min-width: 1536px) repeat(${cols['2xl']}, 1fr)`,
    ]
      .filter(Boolean)
      .join(', ');
  };

  // Generate gap classes
  const getGap = () => {
    if (typeof gap === 'string' || typeof gap === 'number') {
      return gap;
    }

    return [
      gap.xs && `gap-${gap.xs}`,
      gap.sm && `sm:gap-${gap.sm}`,
      gap.md && `md:gap-${gap.md}`,
      gap.lg && `lg:gap-${gap.lg}`,
      gap.xl && `xl:gap-${gap.xl}`,
      gap['2xl'] && `2xl:gap-${gap['2xl']}`,
    ]
      .filter(Boolean)
      .join(' ');
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: getGridTemplateColumns(),
    gap: getGap(),
    width: '100%',
  };

  return (
    <div 
      className={`grid ${className}`}
      style={{
        ...(autoFit || autoFill || minChildWidth || maxChildWidth ? gridStyle : {}),
      }}
    >
      {children}
    </div>
  );
};

export default ResponsiveGrid;
