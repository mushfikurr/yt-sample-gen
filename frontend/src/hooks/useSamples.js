import { useQuery } from "react-query";
import { useStore } from "../store";
import { generateSamples } from "../requests";

export const useSamples = () => {
  const words = useStore((state) => state.words);
  if (words.length > 0) {
    return useQuery(["samples"], () => generateSamples(words, true), {
      enabled: false,
      retry: 1,
    });
  } else {
    return useQuery(["samples"], () => generateSamples(), {
      enabled: false,
      retry: 1,
    });
  }
};
