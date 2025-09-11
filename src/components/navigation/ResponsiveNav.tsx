'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavItem[];
  requiresAuth?: boolean;
}

interface ResponsiveNavProps {
  items: NavItem[];
  logo: React.ReactNode;
  className?: string;
  mobileMenuClassName?: string;
  navItemClassName?: string;
  activeNavItemClassName?: string;
  mobileMenuButtonClassName?: string;
  mobileMenuOpenButton?: React.ReactNode;
  mobileMenuCloseButton?: React.ReactNode;
  showMobileMenu?: boolean;
  onMobileMenuToggle?: (isOpen: boolean) => void;
}

const ResponsiveNav: React.FC<ResponsiveNavProps> = ({
  items,
  logo,
  className = '',
  mobileMenuClassName = '',
  navItemClassName = '',
  activeNavItemClassName = 'text-brand-600 dark:text-brand-400',
  mobileMenuButtonClassName = '',
  mobileMenuOpenButton,
  mobileMenuCloseButton,
  showMobileMenu: controlledMobileMenu,
  onMobileMenuToggle,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const isControlled = typeof controlledMobileMenu === 'boolean';
  const menuOpen = isControlled ? controlledMobileMenu : isMobileMenuOpen;

  // Handle scroll for navbar style changes
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    if (menuOpen) {
      toggleMobileMenu(false);
    }
  }, [pathname]);

  const toggleMobileMenu = (open: boolean) => {
    if (!isControlled) {
      setIsMobileMenuOpen(open);
    }
    onMobileMenuToggle?.(open);
  };

  // Check if a nav item or any of its children is active
  const isActive = (item: NavItem): boolean => {
    if (item.href === '/' && pathname === '/') return true;
    if (item.href !== '/' && pathname.startsWith(item.href)) return true;
    if (item.children) {
      return item.children.some(child => isActive(child));
    }
    return false;
  };

  // Render navigation items recursively
  const renderNavItems = (items: NavItem[], level = 0) => {
    return items.map((item) => (
      <div key={item.href} className="relative group">
        <Link
          href={item.href}
          className={`
            flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
            ${navItemClassName}
            ${isActive(item) ? activeNavItemClassName : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'}
            ${level > 0 ? 'pl-8' : ''}
          `}
        >
          {item.icon && <span className="mr-2">{item.icon}</span>}
          {item.name}
          {item.children && (
            <svg
              className="ml-1 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </Link>

        {item.children && (
          <div className="absolute left-0 mt-1 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="py-1">
              {renderNavItems(item.children, level + 1)}
            </div>
          </div>
        )}
      </div>
    ));
  };

  // Mobile menu content
  const mobileMenuContent = (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className={`fixed inset-x-0 top-16 z-40 bg-white dark:bg-gray-900 shadow-lg md:hidden ${mobileMenuClassName}`}
        >
          <nav className="px-2 pt-2 pb-4 space-y-1">
            {renderNavItems(items)}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <header className={`sticky top-0 z-30 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm' : 'bg-white dark:bg-gray-900'} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              {logo}
            </div>
            {/* Desktop Navigation */}
            <nav className="hidden md:ml-6 md:flex md:space-x-1">
              {renderNavItems(items)}
            </nav>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => toggleMobileMenu(!menuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500 ${mobileMenuButtonClassName}`}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {menuOpen ? (
                mobileMenuCloseButton || (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )
              ) : (
                mobileMenuOpenButton || (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuContent}
    </header>
  );
};

export default ResponsiveNav;
