import { useQuery } from "react-query";

const JSON_HEADERS = {
  "Content-Type": "application/json",
};

async function generateSamples(id) {
  const response = await fetch("http://localhost:5000/generate", {
    headers: JSON_HEADERS,
    method: "POST",
    body: JSON.stringify({ uniqueId: localStorage.getItem("uniqueId") }),
  });
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

export const useSamples = () =>
  useQuery(["samples"], () => generateSamples(), {
    enabled: false,
    retry: 3,
  });
