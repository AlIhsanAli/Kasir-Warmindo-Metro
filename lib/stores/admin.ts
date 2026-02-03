import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  isAuthenticated: boolean;
  user: { id: string; username: string } | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      login: async (username: string, password: string) => {
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });

          if (response.ok) {
            const data = await response.json();
            set({ isAuthenticated: true, user: data.user });
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      },
      logout: () => set({ isAuthenticated: false, user: null })
    }),
    {
      name: 'admin-storage'
    }
  )
);
