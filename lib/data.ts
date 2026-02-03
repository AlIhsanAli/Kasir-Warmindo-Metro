import { MenuItem, Order } from './types';

// Mock data for menu items
export const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Nasi Goreng Special',
    price: 25000,
    category: 'makanan',
    stock: 50,
    available: true,
    description: 'Nasi goreng dengan telur, ayam, dan sayuran segar',
    image: '/images/nasi-goreng.jpg'
  },
  {
    id: '2',
    name: 'Ayam Bakar Madu',
    price: 30000,
    category: 'makanan',
    stock: 30,
    available: true,
    description: 'Ayam bakar dengan saus madu dan rempah-rempah',
    image: '/images/ayam-bakar.jpg'
  },
  {
    id: '3',
    name: 'Es Teh Manis',
    price: 5000,
    category: 'minuman',
    stock: 100,
    available: true,
    description: 'Teh manis dingin yang menyegarkan',
    image: '/images/es-teh.jpg'
  },
  {
    id: '4',
    name: 'Jus Jeruk',
    price: 10000,
    category: 'minuman',
    stock: 80,
    available: true,
    description: 'Jus jeruk segar tanpa gula tambahan',
    image: '/images/jus-jeruk.jpg'
  },
  {
    id: '5',
    name: 'Mie Goreng',
    price: 20000,
    category: 'makanan',
    stock: 40,
    available: true,
    description: 'Mie goreng dengan sayuran dan telur',
    image: '/images/mie-goreng.jpg'
  },
  {
    id: '6',
    name: 'Kopi Hitam',
    price: 8000,
    category: 'minuman',
    stock: 60,
    available: true,
    description: 'Kopi hitam pekat untuk pecinta kopi',
    image: '/images/kopi.jpg'
  }
];

// Mock data for orders (in-memory storage)
export let orders: Order[] = [
  {
    id: '1',
    customerName: 'John Doe',
    tableNumber: 5,
    items: [
      { menuItem: menuItems[0], quantity: 2 },
      { menuItem: menuItems[2], quantity: 1 }
    ],
    total: 55000,
    status: 'menunggu',
    createdAt: new Date('2024-01-15T10:00:00'),
    updatedAt: new Date('2024-01-15T10:00:00')
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    tableNumber: 3,
    items: [
      { menuItem: menuItems[1], quantity: 1 },
      { menuItem: menuItems[3], quantity: 2 }
    ],
    total: 50000,
    status: 'diproses',
    createdAt: new Date('2024-01-15T11:30:00'),
    updatedAt: new Date('2024-01-15T11:45:00')
  }
];

// Helper functions
export const getMenuItems = () => menuItems;

export const getMenuItemById = (id: string) => menuItems.find(item => item.id === id);

export const getOrders = () => orders;

export const getOrderById = (id: string) => orders.find(order => order.id === id);

export const addOrder = (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
  const newOrder: Order = {
    ...order,
    id: (orders.length + 1).toString(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  orders.push(newOrder);
  return newOrder;
};

export const updateOrderStatus = (id: string, status: Order['status']) => {
  const order = orders.find(o => o.id === id);
  if (order) {
    order.status = status;
    order.updatedAt = new Date();
  }
  return order;
};

export const updateMenuItemStock = (id: string, newStock: number) => {
  const item = menuItems.find(i => i.id === id);
  if (item) {
    item.stock = newStock;
    item.available = newStock > 0;
  }
};
