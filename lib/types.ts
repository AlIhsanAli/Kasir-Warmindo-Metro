export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'makanan' | 'minuman';
  stock: number;
  available: boolean;
  image?: string;
  description?: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  tableNumber: number;
  items: CartItem[];
  total: number;
  status: 'menunggu' | 'diproses' | 'diantar' | 'selesai';
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminUser {
  id: string;
  username: string;
  password: string; // In real app, hash this
}

export interface FinancialReport {
  date: string;
  totalRevenue: number;
  totalTransactions: number;
  topItems: { name: string; count: number }[];
}
