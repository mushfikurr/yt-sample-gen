import { ENDPOINT } from "./const";
import { useStore } from "./store";

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

export async function fetchTaskId(words) {
  const response = await fetch(ENDPOINT + "generate", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({
      uniqueId: localStorage.getItem("uniqueId"),
      words,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error["message"] ?? "internal server error retrieving task id."
    );
  }

  const responseJson = await response.json();
  return responseJson["task_id"];
}

export async function fetchTaskStatus(taskId) {
  const response = await fetch(ENDPOINT + "result/" + taskId, {
    headers: JSON_HEADERS,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error["message"] ?? "internal server error retrieving task id."
    );
  }

  const responseJson = await response.json();
  return responseJson;
}

export async function generateRandomSamples() {
  const response = await fetch(ENDPOINT + "generate-random", {
    headers: JSON_HEADERS,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error["message"] ?? "internal server error. try again in a few minutes"
    );
  }

  const responseJson = await response.json();
  return responseJson["processed_files"];
}
