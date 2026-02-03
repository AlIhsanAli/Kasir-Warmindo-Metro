'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ChefHat,
  LogOut,
  BarChart3,
  TrendingUp,
  Calendar,
  DollarSign,
  ShoppingCart,
  Package
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAdminStore } from '@/lib/stores/admin';
import Link from 'next/link';

interface ReportData {
  dailyRevenue: Array<{ date: string; revenue: number; orders: number }>;
  menuPopularity: Array<{ name: string; count: number; revenue: number }>;
  categoryStats: Array<{ name: string; value: number }>;
  totalStats: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    totalMenuItems: number;
  };
}

export default function AdminReportsPage() {
  const [reportData, setReportData] = useState<ReportData>({
    dailyRevenue: [],
    menuPopularity: [],
    categoryStats: [],
    totalStats: {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      totalMenuItems: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState('7d'); // 7d, 30d, 90d

  const router = useRouter();
  const { user, logout } = useAdminStore();

  useEffect(() => {
    if (!user) {
      router.push('/admin/login');
      return;
    }

    fetchReportData();
  }, [user, router, period]);

  const fetchReportData = async () => {
    try {
      // Fetch orders
      const ordersResponse = await fetch('/api/orders');
      const orders = ordersResponse.ok ? await ordersResponse.json() : [];

      // Fetch menu items
      const menuResponse = await fetch('/api/menu');
      const menuItems = menuResponse.ok ? await menuResponse.json() : [];

      // Calculate date range
      const now = new Date();
      const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

      // Filter orders by period
      const filteredOrders = orders.filter((order: any) =>
        new Date(order.createdAt) >= startDate
      );

      // Calculate daily revenue
      const dailyRevenueMap = new Map<string, { revenue: number; orders: number }>();
      filteredOrders.forEach((order: any) => {
        const date = new Date(order.createdAt).toISOString().split('T')[0];
        const existing = dailyRevenueMap.get(date) || { revenue: 0, orders: 0 };
        dailyRevenueMap.set(date, {
          revenue: existing.revenue + order.total,
          orders: existing.orders + 1
        });
      });

      const dailyRevenue = Array.from(dailyRevenueMap.entries())
        .map(([date, data]) => ({
          date: new Date(date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }),
          revenue: data.revenue,
          orders: data.orders
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Calculate menu popularity
      const menuCountMap = new Map<string, { count: number; revenue: number; name: string }>();
      filteredOrders.forEach((order: any) => {
        order.items.forEach((item: any) => {
          const existing = menuCountMap.get(item.menuItem.id) || {
            count: 0,
            revenue: 0,
            name: item.menuItem.name
          };
          menuCountMap.set(item.menuItem.id, {
            count: existing.count + item.quantity,
            revenue: existing.revenue + (item.menuItem.price * item.quantity),
            name: item.menuItem.name
          });
        });
      });

      const menuPopularity = Array.from(menuCountMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Calculate category stats
      const categoryMap = new Map<string, number>();
      filteredOrders.forEach((order: any) => {
        order.items.forEach((item: any) => {
          const category = item.menuItem.category || 'Lainnya';
          categoryMap.set(category, (categoryMap.get(category) || 0) + item.quantity);
        });
      });

      const categoryStats = Array.from(categoryMap.entries())
        .map(([name, value]) => ({ name, value }));

      // Calculate total stats
      const totalRevenue = filteredOrders.reduce((sum: number, order: any) => sum + order.total, 0);
      const totalOrders = filteredOrders.length;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      setReportData({
        dailyRevenue,
        menuPopularity,
        categoryStats,
        totalStats: {
          totalRevenue,
          totalOrders,
          averageOrderValue,
          totalMenuItems: menuItems.length
        }
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const COLORS = ['#d97706', '#92400e', '#fbbf24', '#f59e0b', '#d97706'];

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <ChefHat size={32} className="text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Warmindo Metro</h1>
                <p className="text-sm text-gray-600">Laporan & Analitik</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Selamat datang, {user.username}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <nav className="mb-8">
          <div className="flex gap-4">
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/menu"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
            >
              Kelola Menu
            </Link>
            <Link
              href="/admin/orders"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
            >
              Kelola Pesanan
            </Link>
            <Link
              href="/admin/reports"
              className="px-4 py-2 bg-primary text-white rounded-lg font-medium"
            >
              Laporan
            </Link>
          </div>
        </nav>

        {/* Period Selector */}
        <div className="mb-6">
          <div className="flex gap-2">
            {[
              { value: '7d', label: '7 Hari' },
              { value: '30d', label: '30 Hari' },
              { value: '90d', label: '90 Hari' }
            ].map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  period === p.value
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pendapatan</p>
                <p className="text-2xl font-bold text-foreground">
                  Rp {reportData.totalStats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <DollarSign size={24} className="text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pesanan</p>
                <p className="text-2xl font-bold text-foreground">{reportData.totalStats.totalOrders}</p>
              </div>
              <ShoppingCart size={24} className="text-primary" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rata-rata Pesanan</p>
                <p className="text-2xl font-bold text-foreground">
                  Rp {Math.round(reportData.totalStats.averageOrderValue).toLocaleString()}
                </p>
              </div>
              <TrendingUp size={24} className="text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Menu Items</p>
                <p className="text-2xl font-bold text-foreground">{reportData.totalStats.totalMenuItems}</p>
              </div>
              <Package size={24} className="text-purple-500" />
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Pendapatan Harian</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`Rp ${value.toLocaleString()}`, 'Pendapatan']}
                />
                <Bar dataKey="revenue" fill="#d97706" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Distribusi Kategori</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportData.categoryStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {reportData.categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Menu Popularity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Menu Terpopuler</h3>
          <div className="space-y-4">
            {reportData.menuPopularity.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.count} porsi terjual</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">Rp {item.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">pendapatan</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
