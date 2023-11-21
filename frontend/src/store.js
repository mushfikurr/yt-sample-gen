import { create } from "zustand";

export const useStore = create((set) => ({
  looping: true,
  toggleLooping: () => set((state) => ({ looping: !state.looping })),

  samples: ["hello", "hello"],
  addSample: (newSample) =>
    set((state) => ({ samples: [...state.samples, newSample] })),
  setSamples: (newSamples) => set(() => ({ samples: newSamples })),
}));
