'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChefHat, Users, Clock, Star, ArrowRight, QrCode } from 'lucide-react';
import Link from 'next/link';
import { MenuItem } from '@/lib/types';
import { menuItems } from '@/lib/data';

export default function Home() {
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Load featured menu items
    setFeaturedItems(menuItems.slice(0, 6)); // Show first 6 items
  }, []);

  const handleStartOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerName.trim() && tableNumber.trim()) {
      router.push(`/menu?table=${tableNumber}&name=${encodeURIComponent(customerName)}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-8"
            >
              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
                <ChefHat className="w-8 h-8 text-primary" />
                <span className="text-xl font-bold text-foreground">Warmindo Metro</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold text-foreground mb-6"
            >
              Pesan Makanan
              <span className="block text-primary">Tanpa Antri</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
            >
              Scan QR code meja Anda dan pesan makanan favorit dengan mudah.
              Nikmati pengalaman makan yang modern dan efisien.
            </motion.p>

            {/* Customer Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onSubmit={handleStartOrder}
              className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 mb-12"
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Nama Anda
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Nomor Meja
                  </label>
                  <input
                    type="number"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="Contoh: 5"
                    min="1"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-4 rounded-lg hover:bg-secondary transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Mulai Memesan
                  <ArrowRight className="inline-block ml-2 w-5 h-5" />
                </button>
              </div>
            </motion.form>

            {/* QR Code Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center"
            >
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3">
                <QrCode className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Scan QR Code di Meja Anda
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Kenapa Memilih Warmindo Metro?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Pengalaman pesan makan yang modern, cepat, dan nyaman untuk semua pelanggan.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: "Pesan Cepat",
                description: "Proses pemesanan hanya dalam hitungan menit tanpa perlu memanggil pelayan."
              },
              {
                icon: Users,
                title: "Tanpa Login",
                description: "Langsung pesan tanpa perlu registrasi atau login. Cukup scan QR code saja."
              },
              {
                icon: Star,
                title: "Menu Berkualitas",
                description: "Berbagai pilihan makanan dan minuman dengan kualitas terbaik dari chef berpengalaman."
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-8 bg-gray-50 rounded-2xl hover:shadow-lg transition-all duration-300"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Menu Terpopuler
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nikmati berbagai pilihan menu favorit pelanggan kami.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <ChefHat className="w-16 h-16 text-primary/60" />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-foreground">{item.name}</h3>
                    <span className="text-primary font-bold">
                      Rp {item.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.available ? 'Tersedia' : 'Habis'}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">{item.category}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button
              onClick={() => router.push('/menu')}
              className="bg-primary text-white px-8 py-4 rounded-lg hover:bg-secondary transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-flex items-center gap-2"
            >
              Lihat Semua Menu
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <ChefHat className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold">Warmindo Metro</span>
            </div>
            <Link
              href="/admin/login"
              className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-primary transition-colors flex items-center gap-2"
            >
              <Users size={16} />
              Masuk sebagai Admin
            </Link>
          </div>
          <div className="text-center mt-8">
            <p className="text-gray-300 mb-4">
              Sistem pemesanan modern untuk pengalaman makan yang lebih baik.
            </p>
            <p className="text-sm text-gray-400">
              © 2024 Warmindo Metro. Dibuat dengan ❤️ untuk pelanggan terbaik.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
