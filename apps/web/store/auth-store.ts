import { create } from 'zustand';

type AuthState = {
  accessToken: string | null;
  role: string | null;
  setSession: (accessToken: string, role: string) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  role: null,
  setSession: (accessToken, role) => set({ accessToken, role }),
  clearSession: () => set({ accessToken: null, role: null }),
}));
