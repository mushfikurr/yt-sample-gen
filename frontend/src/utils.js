import { twMerge as twMergeOriginal } from "tailwind-merge";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import { useStore } from "./store";

export function cn(...args) {
  return twMergeOriginal(clsx(args));
}

export const useAudioEndpoint = () => {
  const audioInstance = useRef();
  const looping = useStore((state) => state.looping);
  const volume = useStore((state) => state.volume);
  const currentSample = useStore((state) => state.currentSample);
  const setCurrentSample = useStore((state) => state.setCurrentSample);

  const getAudioEndpoint = () => {
    const uniqueId = localStorage.getItem("uniqueId");
    if (looping) {
      return `http://localhost:5000/loops/${uniqueId}/${currentSample}`;
    } else {
      return `http://localhost:5000/oneshot/${uniqueId}/${currentSample}`;
    }
  };

  useEffect(() => {
    if (!audioInstance.current) {
      audioInstance.current = new Audio();
    }

    if (currentSample && audioInstance.current) {
      const AUDIO_ENDPOINT = getAudioEndpoint();
      audioInstance.current.pause();
      audioInstance.current.src = AUDIO_ENDPOINT;
      audioInstance.current.play();
      audioInstance.current.volume = volume;
      audioInstance.current.loop = looping;

      const handleEnd = () => setCurrentSample("");

      audioInstance.current.addEventListener("ended", () => handleEnd());
      audioInstance.current.addEventListener("error", () => handleEnd());

      return () => {
        audioInstance.current.removeEventListener("ended", () => handleEnd());
        audioInstance.current.removeEventListener("error", () => handleEnd());
      };
    }

    if (!currentSample && audioInstance.current) {
      audioInstance.current.pause();
    }

    return () => {
      audioInstance.current = null;
    };
  }, [currentSample]);

  useEffect(() => {
    if (audioInstance.current) {
      audioInstance.current.loop = looping;
      audioInstance.current.volume = volume;
    }
  }, [looping, volume]);
};
