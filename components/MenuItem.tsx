'use client';

import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { MenuItem as MenuItemType } from '@/lib/types';
import { useCartStore } from '@/lib/stores/cart';

interface MenuItemProps {
  item: MenuItemType;
}

export default function MenuItem({ item }: MenuItemProps) {
  const { addItem, items, updateQuantity } = useCartStore();
  const cartItem = items.find(cartItem => cartItem.menuItem.id === item.id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    addItem(item);
  };

  const handleIncrease = () => {
    updateQuantity(item.id, quantity + 1);
  };

  const handleDecrease = () => {
    updateQuantity(item.id, quantity - 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="h-48 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
        <div className="text-6xl">🍽️</div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-xl font-bold text-primary">
            Rp {item.price.toLocaleString()}
          </span>
          <span className={`text-sm px-2 py-1 rounded ${
            item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {item.available ? 'Tersedia' : 'Habis'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Stok: {item.stock}</span>
          {quantity === 0 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={!item.available}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tambah
            </motion.button>
          ) : (
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDecrease}
                className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300"
              >
                <Minus size={16} />
              </motion.button>
              <span className="font-semibold w-8 text-center">{quantity}</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleIncrease}
                disabled={!item.available}
                className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-secondary disabled:opacity-50"
              >
                <Plus size={16} />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
