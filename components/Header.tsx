'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, Menu } from 'lucide-react';
import { useCartStore } from '@/lib/stores/cart';
import Link from 'next/link';

interface HeaderProps {
  onCartClick: () => void;
  onMenuClick?: () => void;
}

export default function Header({ onCartClick, onMenuClick }: HeaderProps) {
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white shadow-sm border-b sticky top-0 z-30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/menu" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">WM</span>
            </div>
            <span className="font-bold text-xl text-foreground">Warmindo Metro</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className="p-2 hover:bg-gray-100 rounded-lg md:hidden"
              >
                <Menu size={24} />
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="relative p-2 hover:bg-gray-100 rounded-lg"
            >
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {itemCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
