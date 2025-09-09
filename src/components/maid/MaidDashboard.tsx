'use client';

import { useEffect, useState } from 'react';
import { FiBriefcase, FiUnlock, FiCheckCircle, FiEye } from 'react-icons/fi';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  change?: number;
  iconBgColor?: string;
  iconTextColor?: string;
}

interface ActivityItem {
  id: number;
  type: 'job_request' | 'unlock' | 'match' | 'view';
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const StatCard = ({ title, value, icon, change, iconBgColor = 'bg-blue-100', iconTextColor = 'text-blue-600' }: StatCardProps) => (
  <div className="bg-white rounded-lg shadow-sm p-6 dark:bg-gray-800">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{value}</p>
        {change !== undefined && (
          <span className={`text-sm ${change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% from last month
          </span>
        )}
      </div>
      <div className={`${iconBgColor} ${iconTextColor} p-3 rounded-lg`}>
        {icon}
      </div>
    </div>
  </div>
);

const ActivityItem = ({ type, title, description, time, read }: ActivityItem) => {
  const getIcon = () => {
    switch (type) {
      case 'job_request':
        return <FiBriefcase className="text-blue-600" />;
      case 'unlock':
        return <FiUnlock className="text-purple-600" />;
      case 'match':
        return <FiCheckCircle className="text-green-600" />;
      case 'view':
        return <FiEye className="text-yellow-600" />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex items-start p-4 border-b border-gray-100 dark:border-gray-700 ${!read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
      <div className="flex-shrink-0 mt-1 mr-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50">
          {getIcon()}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
};

const MaidDashboard = () => {
  // Mock data - in a real app, this would come from an API
  const [stats, setStats] = useState({
    jobRequests: 0,
    unlocks: 0,
    matchedJobs: 0,
    profileViews: 0,
  });

  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      // In a real app, you would fetch this data from your API
      setTimeout(() => {
        setStats({
          jobRequests: 24,
          unlocks: 18,
          matchedJobs: 7,
          profileViews: 156,
        });

        setActivities([
          {
            id: 1,
            type: 'job_request',
            title: 'New Job Request',
            description: 'You have a new cleaning request for a 3-bedroom apartment',
            time: '10 minutes ago',
            read: false,
          },
          {
            id: 2,
            type: 'unlock',
            title: 'Contact Unlocked',
            description: 'Your contact information was unlocked by a potential client',
            time: '2 hours ago',
            read: true,
          },
          {
            id: 3,
            type: 'match',
            title: 'New Job Match',
            description: 'A new job matches your skills and availability',
            time: '1 day ago',
            read: true,
          },
          {
            id: 4,
            type: 'view',
            title: 'Profile Viewed',
            description: 'Your profile was viewed by a potential client',
            time: '2 days ago',
            read: true,
          },
        ]);

        setIsLoading(false);
      }, 500);
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Job Requests"
          value={stats.jobRequests}
          icon={<FiBriefcase className="w-6 h-6" />}
          change={12}
          iconBgColor="bg-blue-100"
          iconTextColor="text-blue-600"
        />
        <StatCard
          title="Total Unlocks"
          value={stats.unlocks}
          icon={<FiUnlock className="w-6 h-6" />}
          change={8}
          iconBgColor="bg-purple-100"
          iconTextColor="text-purple-600"
        />
        <StatCard
          title="Matched Jobs"
          value={stats.matchedJobs}
          icon={<FiCheckCircle className="w-6 h-6" />}
          change={5}
          iconBgColor="bg-green-100"
          iconTextColor="text-green-600"
        />
        <StatCard
          title="Profile Views"
          value={stats.profileViews}
          icon={<FiEye className="w-6 h-6" />}
          change={24}
          iconBgColor="bg-yellow-100"
          iconTextColor="text-yellow-600"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-gray-800">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} {...activity} />
          ))}
        </div>
        <div className="p-4 text-center border-t border-gray-100 dark:border-gray-700">
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            View all activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaidDashboard;
