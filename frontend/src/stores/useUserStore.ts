import { create } from "zustand";
import axiosInst from "../lib/axios";
import toast from "react-hot-toast";
import axios from "axios";

interface User {
  anonymousId: string;
  anonymousName: string;
  role: string;
  isEmailVerified: boolean;
}

interface userStoreInterface {
  user: User | null;
  loading: boolean;
  checkingAuth: boolean;

  signup: (email: string, password: string) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
  checkAuth: () => void;

}
const useUserStore = create<userStoreInterface>((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async (email, password) => {
    set({ loading: true });

    try {
      const res = await axiosInst.post("/auth/signup", { email, password });
      set({ user: res.data.user, loading: false });

      // Show different message based on verification requirement
      if (res.data.requiresVerification) {
        toast.success(
          "Account created! Please check your email to verify your account.",
          { duration: 5000 }
        );
      } else {
        toast.success("Account created successfully");
      }
    } catch (error) {
      set({ loading: false });

      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "An error occured");
      } else {
        toast.error("An unexpected error occured");
      }
    }
  },

  login: async (email, password) => {
    set({ loading: true });

    try {
      const res = await axiosInst.post("/auth/login", { email, password });
      set({ user: res.data.user, loading: false });

      // Check if email verification is required
      if (res.data.requiresVerification && !res.data.user.isEmailVerified) {
        toast.error(
          "Please verify your email before accessing the system. Check your inbox.",
          { duration: 5000 }
        );
      } else {
        toast.success(`Welcome back, ${res.data.user.anonymousName}!`);
      }
    } catch (error) {
      set({ loading: false });
      if (axios.isAxiosError(error) && error.response) {
        return toast.error(
          error.response?.data.message || "Login error occured"
        );
      } else {
        toast.error("Unexpected error occured");
      }
    }
  },

  logout: async () => {
    try {
      await axiosInst.post("/auth/logout");
      set({ user: null });
      toast.success("Logout successful");
    } catch (error) {
      set({ user: null });
      if (axios.isAxiosError(error) && error.response) {
        console.error("Logout error:", error.response.data?.message);
      }
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });

    try {
      const res = await axiosInst.get("/auth/profile");
      set({ user: res.data, checkingAuth: false });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status !== 401) {
          console.error("Error checking auth:", error.response?.data?.message);
        }
      }
      set({ checkingAuth: false, user: null });
    }
  },
}));

export default useUserStore;
