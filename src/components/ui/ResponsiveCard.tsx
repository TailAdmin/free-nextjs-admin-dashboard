import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ResponsiveCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  border?: boolean;
  borderColor?: string;
  backgroundColor?: string;
  fullWidth?: boolean;
  fullHeight?: boolean;
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
}

const paddingMap = {
  none: 'p-0',
  sm: 'p-2 sm:p-3',
  md: 'p-3 sm:p-4',
  lg: 'p-4 sm:p-6',
  xl: 'p-6 sm:p-8',
};

const shadowMap = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow',
  lg: 'shadow-md',
  xl: 'shadow-lg',
  '2xl': 'shadow-xl',
};

const roundedMap = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
};

const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  onClick,
  padding = 'md',
  shadow = 'md',
  rounded = 'lg',
  border = true,
  borderColor = 'border-gray-200 dark:border-gray-700',
  backgroundColor = 'bg-white dark:bg-gray-800',
  fullWidth = false,
  fullHeight = false,
  as: Component = 'div',
  ...rest
}) => {
  const baseClasses = [
    'transition-all duration-200',
    paddingMap[padding],
    shadowMap[shadow],
    roundedMap[rounded],
    border ? `border ${borderColor}` : '',
    backgroundColor,
    fullWidth ? 'w-full' : '',
    fullHeight ? 'h-full' : '',
    hoverEffect ? 'hover:shadow-lg dark:hover:shadow-lg' : '',
    className,
  ].filter(Boolean).join(' ');

  const content = (
    <Component 
      className={baseClasses}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Component>
  );

  if (hoverEffect) {
    return (
      <motion.div 
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

export default ResponsiveCard;
