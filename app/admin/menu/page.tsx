'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Edit,
  Trash2,
  ChefHat,
  LogOut,
  Package,
  DollarSign
} from 'lucide-react';
import { useAdminStore } from '@/lib/stores/admin';
import Link from 'next/link';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  available: boolean;
  description?: string;
}

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'makanan',
    stock: '',
    available: true,
    description: ''
  });

  const router = useRouter();
  const { user, logout } = useAdminStore();

  useEffect(() => {
    if (!user) {
      router.push('/admin/login');
      return;
    }

    fetchMenuItems();
  }, [user, router]);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu');
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const itemData = {
      name: formData.name,
      price: parseInt(formData.price),
      category: formData.category,
      stock: parseInt(formData.stock),
      available: formData.available,
      description: formData.description
    };

    try {
      const url = editingItem ? `/api/menu/${editingItem.id}` : '/api/menu';
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });

      if (response.ok) {
        fetchMenuItems();
        setShowForm(false);
        setEditingItem(null);
        resetForm();
      } else {
        alert('Gagal menyimpan menu item');
      }
    } catch (error) {
      console.error('Error saving menu item:', error);
      alert('Terjadi kesalahan');
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      category: item.category,
      stock: item.stock.toString(),
      available: item.available,
      description: item.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus item ini?')) return;

    try {
      const response = await fetch(`/api/menu/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchMenuItems();
      } else {
        alert('Gagal menghapus menu item');
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
      alert('Terjadi kesalahan');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: 'makanan',
      stock: '',
      available: true,
      description: ''
    });
  };

  const cancelEdit = () => {
    setShowForm(false);
    setEditingItem(null);
    resetForm();
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
                <p className="text-sm text-gray-600">Kelola Menu</p>
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
              className="px-4 py-2 bg-primary text-white rounded-lg font-medium"
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

        {/* Add Menu Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary font-medium"
          >
            <Plus size={20} />
            Tambah Menu Baru
          </button>
        </div>

        {/* Menu Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6 mb-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {editingItem ? 'Edit Menu' : 'Tambah Menu Baru'}
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Menu *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Harga (Rp) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="makanan">Makanan</option>
                  <option value="minuman">Minuman</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stok *
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  min="0"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.available}
                  onChange={(e) => setFormData({...formData, available: e.target.checked})}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="available" className="ml-2 text-sm text-gray-700">
                  Tersedia
                </label>
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary font-medium"
                >
                  {editingItem ? 'Update' : 'Simpan'}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Batal
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-600 mt-2">Memuat menu...</p>
            </div>
          ) : menuItems.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Package size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Belum ada menu</p>
            </div>
          ) : (
            menuItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{item.category}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.available ? 'Tersedia' : 'Habis'}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Harga:</span>
                      <span className="font-semibold text-primary">Rp {item.price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Stok:</span>
                      <span className="font-medium">{item.stock}</span>
                    </div>
                  </div>

                  {item.description && (
                    <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 font-medium"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 font-medium"
                    >
                      <Trash2 size={16} />
                      Hapus
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
