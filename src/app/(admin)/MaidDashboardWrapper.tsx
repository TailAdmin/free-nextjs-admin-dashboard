'use client';

import dynamic from 'next/dynamic';

// Import the MaidDashboard component with SSR disabled
const MaidDashboard = dynamic(() => import('@/components/maid/MaidDashboard'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ),
});

export default function MaidDashboardWrapper() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <MaidDashboard />
    </main>
  );
}
