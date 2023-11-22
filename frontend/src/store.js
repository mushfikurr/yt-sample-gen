import { create } from "zustand";

export const useStore = create((set) => ({
  looping: true,
  toggleLooping: () => set((state) => ({ looping: !state.looping })),
  hasGeneratedSamplesOnce: false,
  setHasGeneratedSamplesOnce: (flag) =>
    set((state) => ({
      hasGeneratedSamplesOnce: flag,
    })),

  currentSample: "",
  setCurrentSample: (newSample) => set(() => ({ currentSample: newSample })),
}));
