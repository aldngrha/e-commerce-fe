import { create } from "zustand/react";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string;
  full_name: string;
  email: string;
  role: string;
  member_since: string;
}

interface AuthStoreState {
  isLoggedIn: boolean;
  payload: JwtPayload | null;
  role: "customer" | "admin";
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  isLoggedIn: false,
  payload: null,
  role: "customer",
  login: (token: string) =>
    set((state) => {
      try {
        const claims = jwtDecode<JwtPayload>(token);
        return {
          ...state,
          payload: claims,
          isLoggedIn: true,
          role: claims.role === "admin" ? "admin" : "customer",
        };
      } catch {
        return {
          ...state,
        };
      }
    }),
  logout: () =>
    set((state) => {
      return {
        ...state,
        isLoggedIn: false,
        payload: null,
        role: "customer",
      };
    }),
}));
