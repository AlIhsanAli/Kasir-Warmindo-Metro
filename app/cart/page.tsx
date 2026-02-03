'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Minus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/lib/stores/cart';
import Link from 'next/link';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore();
  const total = getTotal();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-primary hover:text-secondary mb-8"
          >
            <ArrowLeft size={20} />
            Kembali ke Menu
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🛒</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Keranjang Kosong</h1>
            <p className="text-gray-600 mb-6">Belum ada menu yang dipilih</p>
            <Link
              href="/menu"
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary inline-block"
            >
              Mulai Memesan
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-primary hover:text-secondary mb-8"
        >
          <ArrowLeft size={20} />
          Kembali ke Menu
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm"
        >
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-foreground">Keranjang Pesanan</h1>
            <p className="text-gray-600">{items.length} item{items.length > 1 ? 's' : ''} dalam keranjang</p>
          </div>

          <div className="divide-y">
            {items.map((item, index) => (
              <motion.div
                key={item.menuItem.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 flex items-center gap-4"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🍽️</span>
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-foreground">{item.menuItem.name}</h3>
                  <p className="text-gray-600 text-sm">{item.menuItem.description}</p>
                  <p className="text-primary font-semibold mt-1">
                    Rp {item.menuItem.price.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => handleQuantityChange(item.menuItem.id, item.quantity - 1)}
                      className="w-8 h-8 bg-white rounded-md flex items-center justify-center hover:bg-gray-200"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.menuItem.id, item.quantity + 1)}
                      className="w-8 h-8 bg-primary text-white rounded-md flex items-center justify-center hover:bg-secondary"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.menuItem.id)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-primary">
                    Rp {(item.menuItem.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium">Total Pesanan:</span>
              <span className="text-2xl font-bold text-primary">Rp {total.toLocaleString()}</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={clearCart}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-medium"
              >
                Kosongkan Keranjang
              </button>
              <Link
                href="/confirm"
                className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-secondary font-medium text-center"
              >
                Konfirmasi Pesanan
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
