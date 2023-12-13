import clsx from "clsx";
import { twMerge as twMergeOriginal } from "tailwind-merge";

export function cn(...args) {
  return twMergeOriginal(clsx(args));
}

export const handleDownload = async (targetUrl, targetFileName = "") => {
  try {
    const response = await fetch(targetUrl);
    if (!response.ok) {
      throw new Error("Error downloading file", targetUrl);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    if (targetFileName) a.download = targetFileName;
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

export function isLocalStorageAvailable() {
  var test = "test";
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}
