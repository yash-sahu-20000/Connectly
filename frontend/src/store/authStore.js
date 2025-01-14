import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from 'react-hot-toast'
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const authStore = create((set, get) => ({
    user: null,

    isLoggingin: false,
    isSigningUp: false,
    isLogginOut: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,
  

    isCheckingUser: true,
    checkUser: async() => {
        try {
            const res = await axiosInstance('/auth/check');
            set({ user: res.data});
            get().connectSocket();

        } catch (error) {
            set({ user: null});
            toast.error(error.response.data.message);
            console.error(error.response.data.message); 
        }finally{
            set({ isCheckingUser: false});
        }

    },

    signup: async (data) => {

        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post('/auth/signup', data);
            set({ user: res.data });
            get().connectSocket();

        } catch (error) {
            toast.error(error.response.data.message);
            console.error(error);
        }finally {
            set({ isSigningUp: false });
        }
    },

    logout: async () => {
        set({ isLogginOut: true });
        try {
            const res = await axiosInstance.post('/auth/logout');
            set({ user: null});
            toast.success(res.data.message)
            get().disconnectSocket();

        } catch (error) {
            toast.error(error.response.data.message);
            console.error(error);
        }finally{
            set({ isLogginOut: false });
        }
    },
    login: async (data) => {
        set({ isLoggingin: true });
        try {
            const res = await axiosInstance.post('/auth/login', data);
            set({ user: res.data });
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
            console.error(error.response.data.message);
        }finally{
            set({ isLoggingin: false });
        }
    },
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put('/auth/update-profile', data);
            set({ user: res.data });
            toast.success("Profile Picture updated successfully")
        } catch (error) {
            toast.error(error.response.data.message);
            console.error(error.response.data.message);
        }finally{
            set({ isUpdatingProfile: false });
        }
    },
    
    connectSocket: () => {
        const { user } = get();
        if (!user || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
            userId: user._id,
            },
        });
        socket.connect();

        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
        },
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
      },
}))