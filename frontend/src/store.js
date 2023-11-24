import { create } from "zustand";

export const useStore = create((set) => ({
  looping: true,
  toggleLooping: () => set((state) => ({ looping: !state.looping })),
  volume: [0.5],
  setVolume: (newVolume) => set(() => ({ volume: newVolume })),

  currentSample: "",
  setCurrentSample: (newSample) => set(() => ({ currentSample: newSample })),
}));
