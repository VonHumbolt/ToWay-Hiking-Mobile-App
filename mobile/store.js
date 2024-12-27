import { create } from "zustand";

export const useTrackingStore = create((set) => ({
    tracking: null,
    coordinatesFromUser: [],
    time: 0,
    distance: 0,
    averageSpeed: 0,
    startTracking: (tracking) => set((state) => ({...state, tracking: tracking})),
    startOrUpdateTime: (time) => set((state) => ({...state, time: time})),
    updateUserCoordinates: (coords) => set((state) => ({...state, coordinatesFromUser: coords})),
    updateDistance: (distance) => set((state) => ({...state, distance: distance})),
    updateAverageSpeed: (speed) => set((state) => ({...state, averageSpeed: speed})),
    endTracking: () => set((state) => ({tracking: null}))
}))