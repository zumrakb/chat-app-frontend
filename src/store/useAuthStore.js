import { create } from "zustand";
import axiosInstance from "../lib/axios.js";

import { toast } from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isChecking: true,
  isLoggingIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      console.log({ authUser: res.data });
    } catch (error) {
      console.log("Error checking auth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (error) {
      console.log("Error signing up", error);

      toast.error("Error creating account");
    } finally {
      set({ isSigningUp: false });
    }
  },
}));
