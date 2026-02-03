'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ChefHat,
  LogOut,
  ShoppingCart,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  XCircle,
  ArrowLeft
} from 'lucide-react';
import { useAdminStore } from '@/lib/stores/admin';
import Link from 'next/link';
import { Order } from '@/lib/types';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'menunggu' | 'diproses' | 'diantar' | 'selesai'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const router = useRouter();
  const { user, logout } = useAdminStore();

  useEffect(() => {
    if (!user) {
      router.push('/admin/login');
      return;
    }

    fetchOrders();
  }, [user, router]);

  useEffect(() => {
    filterOrders();
  }, [orders, selectedStatus]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    if (selectedStatus === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === selectedStatus));
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    setUpdatingOrderId(orderId);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Update local state
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date().toISOString() } : order
          )
        );
      }
    } catch (error) {
      console.error('Error updating order:', error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'menunggu': return 'bg-yellow-100 text-yellow-800';
      case 'diproses': return 'bg-blue-100 text-blue-800';
      case 'diantar': return 'bg-orange-100 text-orange-800';
      case 'selesai': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'menunggu': return <Clock size={16} />;
      case 'diproses': return <Edit size={16} />;
      case 'diantar': return <ShoppingCart size={16} />;
      case 'selesai': return <CheckCircle size={16} />;
      default: return <XCircle size={16} />;
    }
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
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
                <p className="text-sm text-gray-600">Kelola Pesanan</p>
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
              className="px-4 py-2 bg-primary text-white rounded-lg font-medium"
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

        {/* Status Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Filter Status Pesanan</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', name: 'Semua', count: orders.length },
              { id: 'menunggu', name: 'Menunggu', count: orders.filter(o => o.status === 'menunggu').length },
              { id: 'diproses', name: 'Diproses', count: orders.filter(o => o.status === 'diproses').length },
              { id: 'diantar', name: 'Diantar', count: orders.filter(o => o.status === 'diantar').length },
              { id: 'selesai', name: 'Selesai', count: orders.filter(o => o.status === 'selesai').length }
            ].map((status) => (
              <button
                key={status.id}
                onClick={() => setSelectedStatus(status.id as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedStatus === status.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.name} ({status.count})
              </button>
            ))}
          </div>
        </motion.div>

        {/* Orders List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm"
        >
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-foreground">
              Daftar Pesanan ({filteredOrders.length})
            </h2>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <ShoppingCart size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada pesanan</h3>
              <p className="text-gray-600">
                {selectedStatus === 'all' ? 'Belum ada pesanan yang dibuat' : `Tidak ada pesanan dengan status ${selectedStatus}`}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">#{order.id}</h3>
                        <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Pelanggan:</span> {order.customerName}
                        </div>
                        <div>
                          <span className="font-medium">Meja:</span> {order.tableNumber}
                        </div>
                        <div>
                          <span className="font-medium">Waktu:</span> {new Date(order.createdAt).toLocaleString('id-ID')}
                        </div>
                      </div>

                      <div className="mt-3">
                        <span className="font-medium text-gray-700">Items:</span>
                        <div className="mt-1 space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="text-sm text-gray-600">
                              {item.menuItem.name} x{item.quantity} - Rp {(item.menuItem.price * item.quantity).toLocaleString()}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-6">
                      <div className="text-xl font-bold text-primary mb-4">
                        Rp {order.total.toLocaleString()}
                      </div>

                      {/* Status Update Buttons */}
                      <div className="flex flex-col gap-2">
                        {order.status === 'menunggu' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'diproses')}
                            disabled={updatingOrderId === order.id}
                            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50"
                          >
                            {updatingOrderId === order.id ? '...' : 'Proses'}
                          </button>
                        )}

                        {order.status === 'diproses' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'diantar')}
                            disabled={updatingOrderId === order.id}
                            className="px-3 py-1 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 disabled:opacity-50"
                          >
                            {updatingOrderId === order.id ? '...' : 'Antar'}
                          </button>
                        )}

                        {order.status === 'diantar' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'selesai')}
                            disabled={updatingOrderId === order.id}
                            className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:opacity-50"
                          >
                            {updatingOrderId === order.id ? '...' : 'Selesai'}
                          </button>
                        )}

                        {order.status === 'selesai' && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded">
                            ✓ Completed
                          </span>
                        )}
                      </div>
                    </div>
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
