import { create } from 'zustand';

export const useGlobalStore = create((set) => ({
  // State variables
  user: null,
  currencySymbol: '₹',
  currencyCode: 'INR',
  theme: 'light',

  //Actions to update state
  setUser: (user) => set({ user }),
  setCurrencySymbol: (currencySymbol) => set({ currencySymbol }),
  setCurrencyCode: (currencyCode) => set({ currencyCode }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));
