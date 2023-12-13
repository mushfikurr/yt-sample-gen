import { useQuery } from "react-query";
import { ENDPOINT } from "../const";
import { useStore } from "../store";
import { handleDownload } from "../utils";

export const useAudioFile = (sampleFileName) => {
  const words = useStore((state) => state.words);
  const looping = useStore((state) => state.looping);
  const getUniqueId = useStore((state) => state.uniqueId);

  const uniqueId = words.length > 0 ? getUniqueId() : "default";
  const playbackType = looping ? "loops/" : "oneshot/";
  const AUDIO_ENDPOINT =
    ENDPOINT + playbackType + `${uniqueId}/${sampleFileName}`;
  const targetFileName = (looping ? "loop_" : "oneshot_") + sampleFileName;

  return useQuery(
    ["audioFile", sampleFileName],
    () => handleDownload(AUDIO_ENDPOINT, targetFileName),
    {
      enabled: false,
      retry: 2,
    }
  );
};
