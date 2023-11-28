import { ENDPOINT } from "./const";

const JSON_HEADERS = {
  "Content-Type": "application/json",
};

const handleDownload = async (targetUrl, targetFileName) => {
  try {
    const response = await fetch(targetUrl);
    if (!response.ok) {
      throw new Error("Error downloading file", targetUrl);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = targetFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    const responseStatus = response.status;
    return responseStatus;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export async function generateSamples(words = [], withId = false) {
  let response = null;
  if (withId) {
    response = await fetch(ENDPOINT + "generate", {
      headers: JSON_HEADERS,
      method: "POST",
      body: JSON.stringify({
        uniqueId: localStorage.getItem("uniqueId"),
        words,
      }),
    });
  } else {
    response = await fetch(ENDPOINT + "generate-random", {
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
  return responseJson["processed_files"];
}
