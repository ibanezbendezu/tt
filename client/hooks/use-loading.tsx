import {create} from "zustand";

type LoadingStore = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useLoading = create<LoadingStore>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false}),
}));
