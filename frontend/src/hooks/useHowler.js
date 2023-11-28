import { useState, useEffect } from "react";
import { useStore } from "../store";
import { Howl } from "howler";
import { ENDPOINT } from "../const";

export const useHowler = (currentSample, shouldPlay = false) => {
  const words = useStore((state) => state.words);
  const uniqueId =
    words.length > 0 ? localStorage.getItem("uniqueId") : "default";
  const looping = useStore((state) => state.looping);
  const setCurrentSample = useStore((state) => state.setCurrentSample);

  const playbackType = looping ? "loops/" : "oneshot/";
  const AUDIO_ENDPOINT =
    ENDPOINT + playbackType + `${uniqueId}/${currentSample}`;

  const [howl, setHowl] = useState();

  useEffect(() => {
    if (shouldPlay) {
      const howl = new Howl({ src: AUDIO_ENDPOINT, loop: true });
      howl.play();
      howl.loop(looping);

      const handleEnd = () => {
        if (!looping) setCurrentSample("");
        if (!looping && !howl.playing()) setCurrentSample("");
      };
      howl.on("end", () => handleEnd());
      howl.on("loaderror", () => setCurrentSample(""));

      setHowl(howl);

      return () => {
        howl.off("end", () => handleEnd());
        howl.off("loaderror", () => setCurrentSample(""));
        howl.unload();
        setHowl();
      };
    }
  }, [shouldPlay]);

  useEffect(() => {
    if (howl) {
      howl.loop(looping);
      if (!looping && howl.playing()) {
        howl.once("end", () => setCurrentSample(""));
      }
    }
  }, [looping]);

  return howl;
};
