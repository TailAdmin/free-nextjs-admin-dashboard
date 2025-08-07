"use client";

import React, { useState, useEffect } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    Filler,
} from 'chart.js';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    Filler,
);

// Mock data - replace with your actual data fetching logic
const mockUserData = [
    { month: "Jan", users: 120, active: 100 },
    { month: "Feb", users: 150, active: 130 },
    { month: "Mar", users: 180, active: 160 },
    { month: "Apr", users: 200, active: 180 },
    { month: "May", users: 250, active: 220 },
    { month: "Jun", users: 300, active: 280 },
];

const mockGroupData = [
    { name: "Admin", value: 10 },
    { name: "Manager", value: 25 },
    { name: "Employee", value: 180 },
    { name: "Guest", value: 85 },
];

const mockActivityData = [
    { day: "Senin", logins: 45, posts: 12 },
    { day: "Selasa", logins: 52, posts: 18 },
    { day: "Rabu", logins: 38, posts: 8 },
    { day: "Kamis", logins: 61, posts: 22 },
    { day: "Jumat", logins: 55, posts: 15 },
    { day: "Sabtu", logins: 28, posts: 6 },
    { day: "Minggu", logins: 32, posts: 9 },
];

interface StatCardProps {
    title: string;
    value: string | number;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
    icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, icon }) => {
    const changeColor = changeType === 'positive' ? 'text-green-600' : 
                       changeType === 'negative' ? 'text-red-600' : 'text-gray-600';
    
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
                    <p className={`text-sm mt-1 ${changeColor}`}>
                        {change}
                    </p>
                </div>
                <div className="text-3xl">{icon}</div>
            </div>
        </div>
    );
};

// Type for chart visibility settings
interface ChartVisibilityState {
    userGrowth: boolean;
    groupDistribution: boolean;
    weeklyActivity: boolean;
    recentActivity: boolean;
}

// Type for stored user preferences
interface UserChartPreferences {
    username: string;
    chartVisibility: ChartVisibilityState;
    lastUpdated: number;
}

export default function StatisticsPage() {
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
    const [isLoading, setIsLoading] = useState(true);
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    
    // You should replace this with your actual user context or auth hook
    // For example: const { user } = useAuth() or const { user } = useUser()
    const currentUser = { username: 'john_doe' }; // Replace with actual user data
    
    const defaultChartVisibility: ChartVisibilityState = {
        userGrowth: true,
        groupDistribution: true,
        weeklyActivity: true,
        recentActivity: true
    };

    const [chartVisibility, setChartVisibility] = useState<ChartVisibilityState>(defaultChartVisibility);

    useEffect(() => {
        // Load chart preferences from localStorage when component mounts
        const loadChartPreferences = () => {
            try {
                const stored = localStorage.getItem('chartPreferences');
                if (stored) {
                    const preferences: UserChartPreferences = JSON.parse(stored);
                    
                    // Check if the stored preferences are for the current user
                    if (preferences.username === currentUser.username) {
                        // Check if preferences are not too old (optional: expire after 30 days)
                        const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
                        const isNotExpired = (Date.now() - preferences.lastUpdated) < thirtyDaysInMs;
                        
                        if (isNotExpired) {
                            setChartVisibility(preferences.chartVisibility);
                        } else {
                            // Remove expired preferences
                            localStorage.removeItem('chartPreferences');
                        }
                    } else {
                        // Different user - remove old preferences
                        localStorage.removeItem('chartPreferences');
                    }
                }
            } catch (error) {
                console.warn('Failed to load chart preferences:', error);
                // If there's an error parsing, remove the corrupted data
                localStorage.removeItem('chartPreferences');
            }
        };

        loadChartPreferences();
    }, [currentUser.username]);

    useEffect(() => {
        // Save chart preferences to localStorage whenever chartVisibility changes
        const saveChartPreferences = () => {
            try {
                const preferences: UserChartPreferences = {
                    username: currentUser.username,
                    chartVisibility: chartVisibility,
                    lastUpdated: Date.now()
                };
                
                localStorage.setItem('chartPreferences', JSON.stringify(preferences));
            } catch (error) {
                console.warn('Failed to save chart preferences:', error);
            }
        };

        // Only save if we have a valid user and the visibility has changed from default
        if (currentUser.username) {
            saveChartPreferences();
        }
    }, [chartVisibility, currentUser.username]);

    useEffect(() => {
        // Simulate data loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeRange]);

    const handleTimeRangeChange = (range: 'week' | 'month' | 'year') => {
        setIsLoading(true);
        setTimeRange(range);
    };

    const toggleChartVisibility = (chartKey: keyof ChartVisibilityState) => {
        setChartVisibility(prev => ({
            ...prev,
            [chartKey]: !prev[chartKey]
        }));
    };

    const handleManageCharts = () => {
        setIsManageModalOpen(true);
    };

    const showAllCharts = () => {
        setChartVisibility(defaultChartVisibility);
    };

    const clearChartPreferences = () => {
        // Function to manually clear preferences (useful for logout)
        try {
            localStorage.removeItem('chartPreferences');
            setChartVisibility(defaultChartVisibility);
        } catch (error) {
            console.warn('Failed to clear chart preferences:', error);
        }
    };

    // Utility function to export for use in logout functionality
    // You can call this from your logout function: StatisticsPage.clearUserPreferences()
    const clearUserPreferences = () => {
        clearChartPreferences();
    };

    // Chart configurations
    const userGrowthData = {
        labels: mockUserData.map(item => item.month),
        datasets: [
            {
                label: 'Total Pengguna',
                data: mockUserData.map(item => item.users),
                backgroundColor: 'rgba(59, 130, 246, 0.6)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 2,
            },
            {
                label: 'Pengguna Aktif',
                data: mockUserData.map(item => item.active),
                backgroundColor: 'rgba(16, 185, 129, 0.6)',
                borderColor: 'rgb(16, 185, 129)',
                borderWidth: 2,
            }
        ]
    };

    const groupDistributionData = {
        labels: mockGroupData.map(item => item.name),
        datasets: [
            {
                data: mockGroupData.map(item => item.value),
                backgroundColor: [
                    'rgba(136, 132, 216, 0.8)',
                    'rgba(130, 202, 157, 0.8)',
                    'rgba(255, 198, 88, 0.8)',
                    'rgba(255, 115, 0, 0.8)',
                ],
                borderColor: [
                    'rgb(136, 132, 216)',
                    'rgb(130, 202, 157)',
                    'rgb(255, 198, 88)',
                    'rgb(255, 115, 0)',
                ],
                borderWidth: 2,
            }
        ]
    };

    const activityData = {
        labels: mockActivityData.map(item => item.day),
        datasets: [
            {
                label: 'Login',
                data: mockActivityData.map(item => item.logins),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
            },
            {
                label: 'Postingan',
                data: mockActivityData.map(item => item.posts),
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'rgb(239, 68, 68)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: '#6B7280',
                    font: {
                        size: 12,
                    },
                },
            },
            tooltip: {
                backgroundColor: '#1F2937',
                titleColor: '#F9FAFB',
                bodyColor: '#F9FAFB',
                borderColor: '#374151',
                borderWidth: 1,
                cornerRadius: 8,
            },
        },
        scales: {
            x: {
                grid: {
                    color: '#374151',
                    drawBorder: false,
                },
                ticks: {
                    color: '#6B7280',
                },
            },
            y: {
                grid: {
                    color: '#374151',
                    drawBorder: false,
                },
                ticks: {
                    color: '#6B7280',
                },
            },
        },
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    color: '#6B7280',
                    font: {
                        size: 12,
                    },
                    padding: 20,
                },
            },
            tooltip: {
                backgroundColor: '#1F2937',
                titleColor: '#F9FAFB',
                bodyColor: '#F9FAFB',
                borderColor: '#374151',
                borderWidth: 1,
                cornerRadius: 8,
            },
        },
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-64 mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="h-80 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                        <div className="h-80 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Statistik Dashboard</h1>
                
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleManageCharts}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center space-x-2"
                    >
                        <span>⚙️</span>
                        <span>Kelola Grafik</span>
                    </button>
                    
                    <div className="flex space-x-2">
                        {(['week', 'month', 'year'] as const).map((range) => (
                            <button
                                key={range}
                                onClick={() => handleTimeRangeChange(range)}
                                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                    timeRange === range
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                }`}
                            >
                                {range === 'week' ? 'Minggu' : range === 'month' ? 'Bulan' : 'Tahun'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Pengguna"
                    value="1,250"
                    change="+12% dari bulan lalu"
                    changeType="positive"
                    icon="👥"
                />
                <StatCard
                    title="Pengguna Aktif"
                    value="982"
                    change="+8% dari bulan lalu"
                    changeType="positive"
                    icon="⚡"
                />
                <StatCard
                    title="Grup Aktif"
                    value="45"
                    change="+3 grup baru"
                    changeType="positive"
                    icon="🏢"
                />
                <StatCard
                    title="Rata-rata Login"
                    value="78%"
                    change="-2% dari bulan lalu"
                    changeType="negative"
                    icon="📊"
                />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* User Growth Chart */}
                {chartVisibility.userGrowth && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 relative">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Pertumbuhan Pengguna
                            </h2>
                            <button
                                onClick={() => toggleChartVisibility('userGrowth')}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded transition-colors"
                                title="Sembunyikan grafik"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="h-80">
                            <Bar data={userGrowthData} options={chartOptions} />
                        </div>
                    </div>
                )}

                {/* Group Distribution */}
                {chartVisibility.groupDistribution && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 relative">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Distribusi Grup
                            </h2>
                            <button
                                onClick={() => toggleChartVisibility('groupDistribution')}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded transition-colors"
                                title="Sembunyikan grafik"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="h-80">
                            <Doughnut data={groupDistributionData} options={pieOptions} />
                        </div>
                    </div>
                )}
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Activity Chart */}
                {chartVisibility.weeklyActivity && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 relative">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Aktivitas Mingguan
                            </h2>
                            <button
                                onClick={() => toggleChartVisibility('weeklyActivity')}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded transition-colors"
                                title="Sembunyikan grafik"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="h-80">
                            <Line data={activityData} options={chartOptions} />
                        </div>
                    </div>
                )}

                {/* Recent Activity Table */}
                {chartVisibility.recentActivity && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 relative">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Aktivitas Terkini
                            </h2>
                            <button
                                onClick={() => toggleChartVisibility('recentActivity')}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded transition-colors"
                                title="Sembunyikan panel"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="overflow-y-auto max-h-80">
                            <div className="space-y-3">
                                {[
                                    { user: "John Doe", action: "Login ke sistem", time: "5 menit yang lalu" },
                                    { user: "Jane Smith", action: "Membuat grup baru", time: "12 menit yang lalu" },
                                    { user: "Bob Johnson", action: "Update profil", time: "25 menit yang lalu" },
                                    { user: "Alice Brown", action: "Upload dokumen", time: "1 jam yang lalu" },
                                    { user: "Charlie Wilson", action: "Join grup Marketing", time: "2 jam yang lalu" },
                                    { user: "Diana Davis", action: "Logout dari sistem", time: "3 jam yang lalu" },
                                ].map((activity, index) => (
                                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">{activity.user}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{activity.action}</p>
                                        </div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Performa Sistem</h3>
                    <p className="text-3xl font-bold mb-1">99.9%</p>
                    <p className="text-blue-100">Uptime bulan ini</p>
                </div>
                
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Kepuasan Pengguna</h3>
                    <p className="text-3xl font-bold mb-1">4.8/5</p>
                    <p className="text-green-100">Rating rata-rata</p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Storage Digunakan</h3>
                    <p className="text-3xl font-bold mb-1">1.2TB</p>
                    <p className="text-purple-100">dari 5TB tersedia</p>
                </div>
            </div>

            {/* Chart Management Modal */}
            {isManageModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Kelola Tampilan Grafik
                                </h2>
                                <button
                                    onClick={() => setIsManageModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div>
                                        <h3 className="font-medium text-gray-900 dark:text-white">Pertumbuhan Pengguna</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Grafik batang perbandingan pengguna</p>
                                    </div>
                                    <button
                                        onClick={() => toggleChartVisibility('userGrowth')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                            chartVisibility.userGrowth ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                chartVisibility.userGrowth ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div>
                                        <h3 className="font-medium text-gray-900 dark:text-white">Distribusi Grup</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Grafik donat pembagian grup</p>
                                    </div>
                                    <button
                                        onClick={() => toggleChartVisibility('groupDistribution')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                            chartVisibility.groupDistribution ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                chartVisibility.groupDistribution ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div>
                                        <h3 className="font-medium text-gray-900 dark:text-white">Aktivitas Mingguan</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Grafik garis aktivitas harian</p>
                                    </div>
                                    <button
                                        onClick={() => toggleChartVisibility('weeklyActivity')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                            chartVisibility.weeklyActivity ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                chartVisibility.weeklyActivity ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div>
                                        <h3 className="font-medium text-gray-900 dark:text-white">Aktivitas Terkini</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Daftar aktivitas pengguna terbaru</p>
                                    </div>
                                    <button
                                        onClick={() => toggleChartVisibility('recentActivity')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                            chartVisibility.recentActivity ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                chartVisibility.recentActivity ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end mt-6 space-x-3">
                                <button
                                    onClick={() => setIsManageModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                                >
                                    Tutup
                                </button>
                                <button
                                    onClick={() => {
                                        setChartVisibility({
                                            userGrowth: true,
                                            groupDistribution: true,
                                            weeklyActivity: true,
                                            recentActivity: true
                                        });
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Tampilkan Semua
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}