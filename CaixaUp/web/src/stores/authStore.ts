import { create } from "zustand";
import { getToken, setToken, removeToken, decodeToken } from "@/lib/auth";

interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (accessToken: string) => void;
  logout: () => void;
  hydrate: () => void;
}

function userFromToken(token: string): AuthUser | null {
  const payload = decodeToken(token);
  if (!payload) return null;
  return { id: payload.userId, email: payload.email };
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: (accessToken: string) => {
    setToken(accessToken);
    const user = userFromToken(accessToken);
    set({ token: accessToken, user, isAuthenticated: !!user });
  },

  logout: () => {
    removeToken();
    set({ user: null, token: null, isAuthenticated: false });
  },

  hydrate: () => {
    const token = getToken();
    if (!token) return;

    const user = userFromToken(token);
    if (!user) {
      removeToken();
      return;
    }

    set({ token, user, isAuthenticated: true });
  },
}));

// Hydrate on module load
useAuthStore.getState().hydrate();
