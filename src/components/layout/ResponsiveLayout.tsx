'use client';

import React, { useState, useEffect } from 'react';
import { useSidebar } from '@/context/SidebarContext';
import AppSidebar from '@/layout/AppSidebar';
import AppHeader from '@/layout/AppHeader';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showHeader?: boolean;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  showSidebar = true,
  showHeader = true,
}) => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Calculate main content margin based on sidebar state
  const getMainContentMargin = () => {
    if (!showSidebar) return 'lg:ml-0';
    if (isMobile) return isMobileOpen ? 'ml-0' : 'ml-0';
    return isExpanded || isHovered ? 'lg:ml-64' : 'lg:ml-20';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {showSidebar && <AppSidebar />}
      
      <div className={`min-h-screen transition-all duration-300 ease-in-out ${getMainContentMargin()}`}>
        {showHeader && <AppHeader />}
        
        <main className="p-4 md:p-6 max-w-[2000px] mx-auto">
          {children}
        </main>
        
        {/* Mobile navigation for bottom bar on small screens */}
        {isMobile && showHeader && (
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 lg:hidden z-40">
            <div className="flex justify-around items-center h-16">
              <button 
                className="flex flex-col items-center justify-center p-2 text-gray-500 dark:text-gray-400 hover:text-brand-500 w-full h-full"
                aria-label="Home"
                title="Home"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-xs mt-1">Home</span>
              </button>
              
              <button 
                className="flex flex-col items-center justify-center p-2 text-gray-500 dark:text-gray-400 hover:text-brand-500 w-full h-full"
                aria-label="Search"
                title="Search"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-xs mt-1">Search</span>
              </button>
              
              <button 
                className="flex flex-col items-center justify-center p-2 text-gray-500 dark:text-gray-400 hover:text-brand-500 w-full h-full"
                aria-label="Profile"
                title="Profile"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-xs mt-1">Profile</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsiveLayout;
