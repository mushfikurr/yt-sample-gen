import { create } from "zustand";
import { isLocalStorageAvailable } from "./utils";

export const useStore = create((set, get) => ({
  uniqueId: "",
  getUniqueId: () => {
    if (isLocalStorageAvailable) return localStorage.getItem("uniqueId");
    else return get((state) => state.uniqueId);
  },
  setUniqueId: () =>
    set(() => {
      let newUniqueId = crypto.randomUUID();
      if (isLocalStorageAvailable) {
        const uniqueIdFromLocalStorage = localStorage.getItem("uniqueId");
        if (!uniqueIdFromLocalStorage)
          localStorage.setItem("uniqueId", newUniqueId);
        else newUniqueId = uniqueIdFromLocalStorage;
      } else console.log("high chance local storage not accessible.");
      return { uniqueId: newUniqueId };
    }),
  looping: true,
  toggleLooping: () => set((state) => ({ looping: !state.looping })),
  volume: [0.5],
  setVolume: (newVolume) => set(() => ({ volume: newVolume })),

  words: [],
  setWords: (newWords) => set(() => ({ words: newWords })),

  currentSample: "",
  setCurrentSample: (newSample) => set(() => ({ currentSample: newSample })),
}));
