'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import MenuItem from '@/components/MenuItem';
import Cart from '@/components/Cart';
import { MenuItem as MenuItemType } from '@/lib/types';

function MenuPageContent() {
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItemType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'makanan' | 'minuman'>('all');
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);

  const searchParams = useSearchParams();
  const tableNumber = searchParams?.get('table') || '1';

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [menuItems, selectedCategory]);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu');
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Failed to fetch menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    if (selectedCategory === 'all') {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(menuItems.filter(item => item.category === selectedCategory));
    }
  };

  const categories = [
    { id: 'all', name: 'Semua', count: menuItems.length },
    { id: 'makanan', name: 'Makanan', count: menuItems.filter(item => item.category === 'makanan').length },
    { id: 'minuman', name: 'Minuman', count: menuItems.filter(item => item.category === 'minuman').length }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onCartClick={() => setShowCart(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Selamat Datang di Warmindo Metro
          </h1>
          <p className="text-lg text-gray-600">
            Pilih menu favorit Anda
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white rounded-lg shadow-sm p-1 flex gap-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as any)}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </motion.div>

        {/* Menu Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredItems.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </motion.div>

        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">Tidak ada menu tersedia dalam kategori ini</p>
          </motion.div>
        )}
      </main>

      {/* Cart Sidebar */}
      <Cart isOpen={showCart} onClose={() => setShowCart(false)} />
    </div>
  );
}

export default function MenuClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <MenuPageContent />
    </Suspense>
  );
}
