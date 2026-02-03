'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, User, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/lib/stores/cart';
import Link from 'next/link';

export default function ConfirmPage() {
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const searchParams = useSearchParams();
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();

  const total = getTotal();
  const defaultTableNumber = searchParams.get('table') || '1';

  useEffect(() => {
    setTableNumber(defaultTableNumber);
  }, [defaultTableNumber]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || items.length === 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          tableNumber: parseInt(tableNumber),
          items
        })
      });

      if (response.ok) {
        const order = await response.json();
        setOrderId(order.id);
        setOrderPlaced(true);
        clearCart();
      } else {
        alert('Gagal membuat pesanan. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Keranjang Kosong</h1>
          <p className="text-gray-600 mb-6">Silakan pilih menu terlebih dahulu</p>
          <Link
            href="/menu"
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary"
          >
            Kembali ke Menu
          </Link>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle size={80} className="text-green-500 mx-auto mb-6" />
          </motion.div>

          <h1 className="text-2xl font-bold text-foreground mb-2">Pesanan Berhasil!</h1>
          <p className="text-gray-600 mb-4">Nomor pesanan: #{orderId}</p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
              <Clock size={16} />
              <span>Estimasi waktu: 15-20 menit</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <MapPin size={16} />
              <span>Meja {tableNumber}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/menu"
              className="block w-full bg-primary text-white py-3 rounded-lg hover:bg-secondary font-medium"
            >
              Pesan Lagi
            </Link>
            <Link
              href="/"
              className="block w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-medium"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-primary hover:text-secondary mb-6"
        >
          <ArrowLeft size={20} />
          Kembali ke Keranjang
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm"
        >
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-foreground">Konfirmasi Pesanan</h1>
            <p className="text-gray-600">Lengkapi data Anda untuk menyelesaikan pesanan</p>
          </div>

          <form onSubmit={handleSubmitOrder} className="p-6 space-y-6">
            {/* Customer Information */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <User size={20} />
                Informasi Pelanggan
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Masukkan nama Anda"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Meja *
                  </label>
                  <input
                    type="number"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="Nomor meja"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Ringkasan Pesanan</h2>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                {items.map((item, index) => (
                  <motion.div
                    key={item.menuItem.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <span className="font-medium">{item.menuItem.name}</span>
                      <span className="text-gray-500 ml-2">x{item.quantity}</span>
                    </div>
                    <span className="font-semibold">
                      Rp {(item.menuItem.price * item.quantity).toLocaleString()}
                    </span>
                  </motion.div>
                ))}

                <div className="border-t pt-3 flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary">Rp {total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !customerName.trim()}
              className="w-full bg-primary text-white py-4 rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
            >
              {isSubmitting ? 'Memproses...' : `Konfirmasi Pesanan - Rp ${total.toLocaleString()}`}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
