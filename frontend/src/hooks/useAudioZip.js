import { useQuery } from "react-query";
import { ENDPOINT } from "../const";
import { useStore } from "../store";
import { handleDownload } from "../utils";

export const useAudioZip = () => {
  const words = useStore((state) => state.words);
  const looping = useStore((state) => state.looping);

  const uniqueId =
    words.length > 0 ? localStorage.getItem("uniqueId") : "default";
  const playbackType = looping ? "loop" : "oneshot";
  const AUDIO_ENDPOINT = ENDPOINT + "zip/" + `${uniqueId}/${playbackType}`;

  return useQuery(["zippedAudio"], () => handleDownload(AUDIO_ENDPOINT), {
    enabled: false,
    retry: 2,
  });
};
