import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import { toast } from "react-hot-toast";

// Helper function to load authUser from localStorage
const loadAuthUserFromStorage = () => {
  const storedUser = localStorage.getItem("authUser");
  return storedUser ? JSON.parse(storedUser) : null;
};

export const useAuthStore = create((set) => ({
  authUser: loadAuthUserFromStorage(), // Load from localStorage on initial load
  isChecking: true,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      const user = res.data;
      set({ authUser: user });
      localStorage.setItem("authUser", JSON.stringify(user)); // Save to localStorage
    } catch (error) {
      console.log("Error checking auth", error);
      set({ authUser: null });
      localStorage.removeItem("authUser"); // Remove from localStorage on error
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      const user = res.data;
      set({ authUser: user });
      localStorage.setItem("authUser", JSON.stringify(user)); // Save to localStorage
      toast.success("Account created successfully");
    } catch (error) {
      console.log("Error signing up", error);
      toast.error("Error creating account");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      const user = res.data;
      set({ authUser: user });
      localStorage.setItem("authUser", JSON.stringify(user)); // Save to localStorage
      toast.success("Logged in successfully");
    } catch (error) {
      console.log("Error logging in", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      localStorage.removeItem("authUser"); // Remove from localStorage on logout
      toast.success("Logged out successfully");
    } catch (error) {
      console.log("Error logging out", error);
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      const user = res.data;
      set({ authUser: user });
      localStorage.setItem("authUser", JSON.stringify(user)); // Save updated user to localStorage
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
