"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import { Bar, Line } from 'react-chartjs-2';
import apiClient from "@/lib/axiosConfig";
import { useDocumentStore } from "@/lib/stores/useDocumentStore";
import { useAuthStore } from "@/lib/stores/useAuthStore";

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

import { toast } from "sonner";


// Toast component
interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    const bgColor = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    }[type];

    const icon = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    }[type];

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 animate-slide-in-right max-w-md`}>
            <span className="text-lg">{icon}</span>
            <span className="text-sm font-medium">{message}</span>
            <button
                onClick={onClose}
                className="ml-4 text-white hover:text-gray-200 text-lg font-bold"
            >
                ×
            </button>
        </div>
    );
};

interface StatCardProps {
    title: string;
    value: string | number;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
    icon: string;
    isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, icon, isLoading = false }) => {
    const changeColor = changeType === 'positive' ? 'text-green-600' : 
                       changeType === 'negative' ? 'text-red-600' : 'text-gray-600';
    
    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            </div>
        );
    }
    
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

interface DocumentType {
    id: string;
    name: string;
}

interface ApiResponse {
    document_type_name: string;
    result: {
        series?: Array<{id: string, created_at: string}>;
        sum?: number;
        average_series?: Array<{day: string, count: number}>;
        median?: number;
        mode?: number | string;
    };
}

interface ChartVisibilityState {
    seriesChart: boolean;
    averageSeriesChart: boolean;
    statisticsCards: boolean;
    templatesList: boolean;
}

interface ToastMessage {
    id: number;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
}

export default function SignatureStatisticsPage() {
    const { token } = useAuthStore();
    
    const [selectedType, setSelectedType] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    
    // Statistics data
    const [seriesData, setSeriesData] = useState<any>(null);
    const [sumData, setSumData] = useState<number>(0);
    const [averageSeriesData, setAverageSeriesData] = useState<any>(null);
    const [medianData, setMedianData] = useState<number>(0);
    const [modeData, setModeData] = useState<number | string>(0);
    const [documentTypeName, setDocumentTypeName] = useState<string>('');

    // Chart visibility management
    const defaultChartVisibility: ChartVisibilityState = {
        seriesChart: true,
        averageSeriesChart: true,
        statisticsCards: true,
        templatesList: true
    };

    const [chartVisibility, setChartVisibility] = useState<ChartVisibilityState>(defaultChartVisibility);
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    const [isTemplateFilterModalOpen, setIsTemplateFilterModalOpen] = useState(false);
    
    // Template filter settings
    const [visibleTemplates, setVisibleTemplates] = useState<{[key: string]: boolean}>({});
    
    const {
        templates,
        loading,
        error,
        fetchTemplates,
        deleteTemplate,
    } = useDocumentStore();

    // Toast functions
    const addToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    // Load template filter settings from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('templateFilterSettings');
        if (saved) {
            try {
                setVisibleTemplates(JSON.parse(saved));
            } catch (err) {
                console.error('Error parsing template filter settings:', err);
                toast.error('Gagal memuat pengaturan filter template');
            }
        }
    }, [addToast]);

    // Save template filter settings to localStorage
    const saveTemplateFilterSettings = useCallback((settings: {[key: string]: boolean}) => {
        try {
            localStorage.setItem('templateFilterSettings', JSON.stringify(settings));
            setVisibleTemplates(settings);
            toast.success('Pengaturan filter template berhasil disimpan');
        } catch (err) {
            console.error('Error saving template filter settings:', err);
            toast.error('Gagal menyimpan pengaturan filter template');
        }
    }, [addToast]);

    // Initialize template visibility when templates load
    useEffect(() => {
        if (templates.length > 0 && Object.keys(visibleTemplates).length === 0) {
            const initialSettings: {[key: string]: boolean} = {};
            templates.forEach(template => {
                initialSettings[template.id] = true; // Show all by default
            });
            setVisibleTemplates(initialSettings);
        }
    }, [templates, visibleTemplates]);

    // Get filtered templates
    const filteredTemplates = templates.filter(template => visibleTemplates[template.id] !== false);

    // Fetch statistics data
    const fetchStatistics = useCallback(async (operation: string): Promise<ApiResponse | null> => {
        try {
            const response = await apiClient.get(`/signatures/statistics/${operation}/${selectedType}/`);
            return response.data;
        } catch (err: any) {
            console.error(`Error fetching ${operation} statistics:`, err);
            const errorMessage = err?.response?.data?.error || `Gagal mengambil statistik ${operation}`;
            toast.error(errorMessage);
            return null;
        }
    }, [selectedType, addToast]);

    // Load templates on mount
    useEffect(() => {
        const loadTemplates = async () => {
            if (typeof token === "string") {
                try {
                    await fetchTemplates(token);
                    toast.success('Template berhasil dimuat');
                } catch (err) {
                    console.error('Error fetching templates:', err);
                    toast.error('Gagal memuat template dokumen');
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
                toast.error('Token tidak valid');
            }
        };
        
        loadTemplates();
    }, [token, fetchTemplates, addToast]);

    const processSeriesData = useCallback((series: Array<{id: string, created_at: string}>) => {
        // Group data by month for chart display
        const monthlyData: {[key: string]: number} = {};
        
        series.forEach(item => {
            const date = new Date(item.created_at);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
        });

        const sortedMonths = Object.keys(monthlyData).sort();
        
        return {
            labels: sortedMonths.map(month => {
                const [year, monthNum] = month.split('-');
                const date = new Date(parseInt(year), parseInt(monthNum) - 1);
                return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short' });
            }),
            datasets: [
                {
                    label: 'Jumlah Dokumen',
                    data: sortedMonths.map(month => monthlyData[month]),
                    backgroundColor: 'rgba(59, 130, 246, 0.6)',
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 2,
                }
            ]
        };
    }, []);

    const processAverageSeriesData = useCallback((averageSeries: Array<{day: string, count: number}>) => {
        return {
            labels: averageSeries.map(item => {
                const date = new Date(item.day);
                return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
            }),
            datasets: [
                {
                    label: 'Dokumen per Hari',
                    data: averageSeries.map(item => item.count),
                    borderColor: 'rgb(16, 185, 129)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: 'rgb(16, 185, 129)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                }
            ]
        };
    }, []);

    const fetchAllStatistics = useCallback(async () => {
        setIsDataLoading(true);
        
        try {
            // Fetch all statistics concurrently
            const [seriesRes, sumRes, averageSeriesRes, medianRes, modeRes] = await Promise.all([
                fetchStatistics('series'),
                fetchStatistics('sum'),
                fetchStatistics('average-series'),
                fetchStatistics('median'),
                fetchStatistics('mode')
            ]);

            let hasData = false;

            // Process series data for chart
            if (seriesRes?.result?.series) {
                const chartData = processSeriesData(seriesRes.result.series);
                setSeriesData(chartData);
                setDocumentTypeName(seriesRes.document_type_name);
                hasData = true;
            }

            // Process sum data
            if (sumRes?.result?.sum !== undefined) {
                setSumData(sumRes.result.sum);
                hasData = true;
            }

            // Process average series data for chart
            if (averageSeriesRes?.result?.average_series) {
                const chartData = processAverageSeriesData(averageSeriesRes.result.average_series);
                setAverageSeriesData(chartData);
                hasData = true;
            }

            // Process median data
            if (medianRes?.result?.median !== undefined) {
                setMedianData(medianRes.result.median);
                hasData = true;
            }

            // Process mode data
            if (modeRes?.result?.mode !== undefined) {
                setModeData(modeRes.result.mode);
                hasData = true;
            }

            if (hasData) {
                toast.success('Statistik berhasil dimuat');
            } else {
                toast.warning('Tidak ada data statistik untuk jenis dokumen ini');
            }

        } catch (err) {
            console.error('Error fetching all statistics:', err);
            toast.error('Gagal mengambil data statistik');
        } finally {
            setIsDataLoading(false);
        }
    }, [fetchStatistics, processSeriesData, processAverageSeriesData, addToast]);

    // Fetch statistics data when document type changes
    useEffect(() => {
        if (selectedType) {
            fetchAllStatistics();
        }
    }, [selectedType, fetchAllStatistics]);

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

    const toggleChartVisibility = (chartKey: keyof ChartVisibilityState) => {
        setChartVisibility(prev => ({
            ...prev,
            [chartKey]: !prev[chartKey]
        }));
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
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Toast notifications */}
            <div className="fixed top-4 right-4 space-y-2 z-50">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Statistik Tanda Tangan Digital</h1>
                
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setIsTemplateFilterModalOpen(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center space-x-2"
                    >
                        <span>🔍</span>
                        <span>Filter Template</span>
                    </button>
                    
                    <button
                        onClick={() => setIsManageModalOpen(true)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center space-x-2"
                    >
                        <span>⚙️</span>
                        <span>Kelola Tampilan</span>
                    </button>
                    
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Pilih Jenis Dokumen</option>
                        {filteredTemplates.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {documentTypeName && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Statistik untuk: <span className="text-blue-600">{documentTypeName}</span>
                    </h2>
                </div>
            )}

            {/* Statistics Cards */}
            {chartVisibility.statisticsCards && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Dokumen"
                        value={sumData}
                        change="Total dokumen ditandatangani"
                        changeType="neutral"
                        icon="📄"
                        isLoading={isDataLoading}
                    />
                    <StatCard
                        title="Median Harian"
                        value={medianData}
                        change="Nilai tengah dokumen per hari"
                        changeType="neutral"
                        icon="📊"
                        isLoading={isDataLoading}
                    />
                    <StatCard
                        title="Mode Harian"
                        value={modeData}
                        change="Nilai yang paling sering muncul"
                        changeType="neutral"
                        icon="📈"
                        isLoading={isDataLoading}
                    />
                    <StatCard
                        title="Status"
                        value={selectedType ? "Aktif" : "Pilih Dokumen"}
                        change={selectedType ? "Data siap ditampilkan" : "Belum ada data"}
                        changeType={selectedType ? "positive" : "neutral"}
                        icon="✅"
                    />
                </div>
            )}

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Series Chart */}
                {chartVisibility.seriesChart && seriesData && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 relative">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Tren Bulanan Dokumen
                            </h2>
                            <button
                                onClick={() => toggleChartVisibility('seriesChart')}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded transition-colors"
                                title="Sembunyikan grafik"
                            >
                                ✕
                            </button>
                        </div>
                        {isDataLoading ? (
                            <div className="h-80 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            <div className="h-80">
                                <Bar data={seriesData} options={chartOptions} />
                            </div>
                        )}
                    </div>
                )}

                {/* Average Series Chart */}
                {chartVisibility.averageSeriesChart && averageSeriesData && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 relative">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Rata-rata Dokumen Harian
                            </h2>
                            <button
                                onClick={() => toggleChartVisibility('averageSeriesChart')}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded transition-colors"
                                title="Sembunyikan grafik"
                            >
                                ✕
                            </button>
                        </div>
                        {isDataLoading ? (
                            <div className="h-80 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            <div className="h-80">
                                <Line data={averageSeriesData} options={chartOptions} />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Document Types List */}
            {chartVisibility.templatesList && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 relative">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Jenis Dokumen Tersedia ({filteredTemplates.length} dari {templates.length})
                        </h2>
                        <button
                            onClick={() => toggleChartVisibility('templatesList')}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded transition-colors"
                            title="Sembunyikan daftar"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredTemplates.map((type) => (
                            <div
                                key={type.id}
                                onClick={() => setSelectedType(type.id)}
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                    selectedType === type.id
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium text-gray-900 dark:text-white">{type.name}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">ID: {type.id}</p>
                                    </div>
                                    {selectedType === type.id && (
                                        <span className="text-blue-600 text-xl">✓</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Template Filter Modal */}
            {isTemplateFilterModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Filter Template Dokumen
                                </h2>
                                <button
                                    onClick={() => setIsTemplateFilterModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Pilih template mana yang ingin ditampilkan di dropdown dan daftar template.
                            </p>

                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {templates.map((template) => (
                                    <div
                                        key={template.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                    >
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900 dark:text-white">{template.name}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">ID: {template.id}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                const newSettings = {
                                                    ...visibleTemplates,
                                                    [template.id]: !visibleTemplates[template.id]
                                                };
                                                setVisibleTemplates(newSettings);
                                            }}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                visibleTemplates[template.id] !== false ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                    visibleTemplates[template.id] !== false ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                            />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between mt-6 space-x-3">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => {
                                            const allVisible: {[key: string]: boolean} = {};
                                            templates.forEach(template => {
                                                allVisible[template.id] = true;
                                            });
                                            setVisibleTemplates(allVisible);
                                        }}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                                    >
                                        Tampilkan Semua
                                    </button>
                                    <button
                                        onClick={() => {
                                            const allHidden: {[key: string]: boolean} = {};
                                            templates.forEach(template => {
                                                allHidden[template.id] = false;
                                            });
                                            setVisibleTemplates(allHidden);
                                        }}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
                                    >
                                        Sembunyikan Semua
                                    </button>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => setIsTemplateFilterModalOpen(false)}
                                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={() => {
                                            saveTemplateFilterSettings(visibleTemplates);
                                            setIsTemplateFilterModalOpen(false);
                                        }}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Chart Management Modal */}
            {isManageModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Kelola Tampilan Dashboard
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
                                        <h3 className="font-medium text-gray-900 dark:text-white">Kartu Statistik</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Kartu informasi statistik</p>
                                    </div>
                                    <button
                                        onClick={() => toggleChartVisibility('statisticsCards')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                            chartVisibility.statisticsCards ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                chartVisibility.statisticsCards ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div>
                                        <h3 className="font-medium text-gray-900 dark:text-white">Tren Bulanan</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Grafik batang tren dokumen</p>
                                    </div>
                                    <button
                                        onClick={() => toggleChartVisibility('seriesChart')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                            chartVisibility.seriesChart ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                chartVisibility.seriesChart ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div>
                                        <h3 className="font-medium text-gray-900 dark:text-white">Rata-rata Harian</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Grafik garis rata-rata dokumen</p>
                                    </div>
                                    <button
                                        onClick={() => toggleChartVisibility('averageSeriesChart')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                            chartVisibility.averageSeriesChart ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                chartVisibility.averageSeriesChart ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div>
                                        <h3 className="font-medium text-gray-900 dark:text-white">Daftar Jenis Dokumen</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Daftar jenis dokumen tersedia</p>
                                    </div>
                                    <button
                                        onClick={() => toggleChartVisibility('templatesList')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                            chartVisibility.templatesList ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                chartVisibility.templatesList ? 'translate-x-6' : 'translate-x-1'
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
                                        setChartVisibility(defaultChartVisibility);
                                        setIsManageModalOpen(false);
                                        toast.info('Tampilan dashboard telah direset');
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

            <style jsx>{`
                @keyframes slide-in-right {
                    0% {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    100% {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}