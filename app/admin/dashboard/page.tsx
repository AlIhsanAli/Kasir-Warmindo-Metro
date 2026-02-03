'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ChefHat,
  LogOut,
  ShoppingCart,
  DollarSign,
  Package,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react';
import { useAdminStore } from '@/lib/stores/admin';
import Link from 'next/link';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalMenuItems: number;
  pendingOrders: number;
  todayRevenue: number;
  todayOrders: number;
}

interface RecentOrder {
  id: string;
  customerName: string;
  tableNumber: number;
  total: number;
  status: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalMenuItems: 0,
    pendingOrders: 0,
    todayRevenue: 0,
    todayOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const { user, logout } = useAdminStore();

  useEffect(() => {
    if (!user) {
      router.push('/admin/login');
      return;
    }

    fetchDashboardData();
  }, [user, router]);

  const fetchDashboardData = async () => {
    try {
      // Fetch orders
      const ordersResponse = await fetch('/api/orders');
      const orders = ordersResponse.ok ? await ordersResponse.json() : [];

      // Fetch menu items
      const menuResponse = await fetch('/api/menu');
      const menuItems = menuResponse.ok ? await menuResponse.json() : [];

      // Calculate stats
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.total, 0);
      const pendingOrders = orders.filter((order: any) => order.status === 'menunggu').length;

      // Today's stats
      const today = new Date().toDateString();
      const todayOrders = orders.filter((order: any) =>
        new Date(order.createdAt).toDateString() === today
      );
      const todayRevenue = todayOrders.reduce((sum: number, order: any) => sum + order.total, 0);

      setStats({
        totalOrders,
        totalRevenue,
        totalMenuItems: menuItems.length,
        pendingOrders,
        todayRevenue,
        todayOrders: todayOrders.length
      });

      // Get recent orders (last 5)
      setRecentOrders(orders.slice(-5).reverse());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

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
                <p className="text-sm text-gray-600">Dashboard Admin</p>
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
              className="px-4 py-2 bg-primary text-white rounded-lg font-medium"
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
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
            >
              Laporan
            </Link>
          </div>
        </nav>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pesanan</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalOrders}</p>
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
                <p className="text-sm text-gray-600">Total Pendapatan</p>
                <p className="text-2xl font-bold text-foreground">Rp {stats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign size={24} className="text-green-500" />
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
                <p className="text-2xl font-bold text-foreground">{stats.totalMenuItems}</p>
              </div>
              <Package size={24} className="text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pesanan Pending</p>
                <p className="text-2xl font-bold text-foreground">{stats.pendingOrders}</p>
              </div>
              <Clock size={24} className="text-orange-500" />
            </div>
          </motion.div>
        </div>

        {/* Today's Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Statistik Hari Ini</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Pesanan Hari Ini</p>
                <p className="text-xl font-bold text-foreground">{stats.todayOrders}</p>
              </div>
              <TrendingUp size={24} className="text-primary" />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Pendapatan Hari Ini</p>
                <p className="text-xl font-bold text-foreground">Rp {stats.todayRevenue.toLocaleString()}</p>
              </div>
              <DollarSign size={24} className="text-green-500" />
            </div>
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-foreground">Pesanan Terbaru</h2>
            <Link
              href="/admin/orders"
              className="text-primary hover:text-secondary font-medium"
            >
              Lihat Semua
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Belum ada pesanan</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-foreground">#{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customerName} - Meja {order.tableNumber}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">Rp {order.total.toLocaleString()}</p>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.status === 'selesai' ? 'bg-green-100 text-green-800' :
                      order.status === 'diproses' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'menunggu' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
