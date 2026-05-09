import { create } from 'zustand';

type Role = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

type UiState = {
  theme: 'light' | 'dark';
  role: Role;
  setTheme: (theme: UiState['theme']) => void;
  setRole: (role: Role) => void;
};

export const useUiStore = create<UiState>((set) => ({
  theme: 'light',
  role: 'ADMIN',
  setTheme: (theme) => set({ theme }),
  setRole: (role) => set({ role }),
}));
