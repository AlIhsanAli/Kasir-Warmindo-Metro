import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, MenuItem } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item: MenuItem) => {
        const { items } = get();
        const existingItem = items.find(cartItem => cartItem.menuItem.id === item.id);

        if (existingItem) {
          set({
            items: items.map(cartItem =>
              cartItem.menuItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            )
          });
        } else {
          set({ items: [...items, { menuItem: item, quantity: 1 }] });
        }
      },
      removeItem: (itemId: string) => {
        set({ items: get().items.filter(item => item.menuItem.id !== itemId) });
      },
      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
        } else {
          set({
            items: get().items.map(item =>
              item.menuItem.id === itemId ? { ...item, quantity } : item
            )
          });
        }
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'cart-storage'
    }
  )
);
