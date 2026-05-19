import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set) => ({
      isDark: true,
      toggleTheme: () =>
        set((state) => {
          const newDark = !state.isDark;
          document.documentElement.classList.toggle('light', !newDark);
          return { isDark: newDark };
        }),
      initTheme: () =>
        set((state) => {
          document.documentElement.classList.toggle('light', !state.isDark);
          return state;
        }),
    }),
    { name: 'theme-preference' }
  )
);

export default useThemeStore;
