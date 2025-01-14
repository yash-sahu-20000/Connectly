import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { authStore } from "./authStore";

export const chatStore = create((set, get) => ({
    messages : [],
    users: [],
    selectedUser : null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get('/messages/users');
            console.log(res.data);
            set({ users: res.data});
        } catch (error) {
            toast.error(error.response.data.message);
            console.error(error.response.data.message); 
        }finally{
            set({ isUsersLoading: false });
        }

    },
    getMessages: async (contactid) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${contactid}`);
            set({ messages: res.data});
        } catch (error) {
            toast.error(error.response.data.message);
            console.error(error.response.data.message); 
        }finally{
            set({ isMessagesLoading: false });
        }
    },
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
          const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
          set({ messages: [...messages, res.data] });
        } catch (error) {
          toast.error(error.response.data.message);
        }
      },
    
      subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;
    
        const socket = authStore.getState().socket;
    
        socket.on("newMessage", (newMessage) => {
          const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
          if (!isMessageSentFromSelectedUser) return;
    
          set({
            messages: [...get().messages, newMessage],
          });
        });
      },
    
      unsubscribeFromMessages: () => {
        const socket = authStore.getState().socket;
        socket.off("newMessage");
      },
    
      setSelectedUser: (selectedUser) => set({ selectedUser })
}));