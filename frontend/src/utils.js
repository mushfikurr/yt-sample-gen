import { twMerge as twMergeOriginal } from "tailwind-merge";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import { useStore } from "./store";
import { Howl, Howler } from "howler";

export function cn(...args) {
  return twMergeOriginal(clsx(args));
}

// TODO: Create instances of Howler objects in own Sample components.
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
    // Run on page load when a sample is first played
    if (!audioInstance.current && currentSample) {
      const AUDIO_ENDPOINT = getAudioEndpoint();
      audioInstance.current = new Howl({
        src: [AUDIO_ENDPOINT],
        loop: true,
      });
    }

    // Run when a user selects another sample
    if (currentSample && audioInstance.current) {
      const AUDIO_ENDPOINT = getAudioEndpoint();
      Howler.stop();
      audioInstance.current.unload();
      audioInstance.current = new Howl({
        src: [AUDIO_ENDPOINT],
        loop: true,
      });
      audioInstance.current.src = [AUDIO_ENDPOINT];

      audioInstance.current.play();
      Howler.volume(volume);
      audioInstance.current.loop(looping);
      console.log(audioInstance.current);

      const handleEnd = () => {
        if (!looping) setCurrentSample("");
      };

      audioInstance.current.on("end", () => handleEnd());
      audioInstance.current.on("loaderror", () => handleEnd());

      return () => {
        audioInstance.current.off("end", () => handleEnd());
        audioInstance.current.off("loaderror", () => handleEnd());
      };
    }

    // Run when user stops playing a sample (or the end of the sample)
    if (!currentSample && audioInstance.current) {
      audioInstance.current.stop();
    }

    return () => {
      audioInstance.current = null;
    };
  }, [currentSample]);

  // Run when any settings change
  useEffect(() => {
    if (audioInstance.current) {
      audioInstance.current.loop(looping);
      Howler.volume(volume);
    }
  }, [looping, volume]);

  // Run when the loop setting is changed mid-way through looping playback
  useEffect(() => {
    if (audioInstance.current?.playing() && !looping) {
      audioInstance.current?.on("end", () => setCurrentSample(""));
    }

    return () => {
      audioInstance.current?.off("end", () => setCurrentSample(""));
    };
  }, [looping]);
};
