import { create } from "zustand";

export const useTrackingStore = create((set) => ({
    tracking: null,
    startOrUpdateTracking: (tracking) => set((state) => ({tracking: tracking})),
    endTracking: () => set((state) => ({tracking: null}))
}))