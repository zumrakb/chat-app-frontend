import { create } from "zustand";

export const useAuthStore = create((set) => ({
  authUser: null,
  isChecking: true,
}));
