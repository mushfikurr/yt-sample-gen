import { useQuery } from "react-query";
import { useStore } from "./store";

const JSON_HEADERS = {
  "Content-Type": "application/json",
};

async function generateSamples(words = [], withId = false) {
  let response = null;
  if (withId) {
    console.log("has words, generating with id");
    response = await fetch("http://localhost:5000/generate", {
      headers: JSON_HEADERS,
      method: "POST",
      body: JSON.stringify({
        uniqueId: localStorage.getItem("uniqueId"),
        words,
      }),
    });
  } else {
    response = await fetch("http://localhost:5000//generate-random", {
      headers: JSON_HEADERS,
    });
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error["message"] ?? "internal server error. try again in a few minutes"
    );
  }

  const responseJson = await response.json();
  console.log(responseJson);
  return responseJson["processed_files"];
}

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
