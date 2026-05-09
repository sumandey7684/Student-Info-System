import { create } from 'zustand';

export type UiRole = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

type UiState = {
  role: UiRole;
  commandPaletteOpen: boolean;
  setRole: (role: UiRole) => void;
  setCommandPaletteOpen: (open: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  role: 'ADMIN',
  commandPaletteOpen: false,
  setRole: (role) => set({ role }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
}));
