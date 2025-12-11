import { create } from "zustand";

const getInitialAuth = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("auth");
    if (stored) return JSON.parse(stored);
  }
  return { isLoggedIn: false, userId: null, email: null, profile_picture: null };
};

interface AuthState {
  isLoggedIn: boolean;
  userId: number | null;
  profile_picture: string | null;
  email: string | null;
  login: (id: number, email: string, profile_picture: string) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  ...getInitialAuth(),
  
  login: (id, email, profile_picture) => {
    const auth = { isLoggedIn: true, userId: id, email, profile_picture };
    localStorage.setItem("auth", JSON.stringify(auth));
    set(auth);
  },

  logout: () => {
    const auth = { isLoggedIn: false, userId: null, email: null, profile_picture: null };
    localStorage.setItem("auth", JSON.stringify(auth));
    set(auth);
  },
}));
