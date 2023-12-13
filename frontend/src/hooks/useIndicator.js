import { useEffect, useState } from "react";

export const useIndicator = () => {
  const [indicator, setIndicator] = useState("...");

  useEffect(() => {
    if (indicator === "....") setIndicator("");
    let timeout = setTimeout(() => {
      setIndicator((prev) => (prev += "."));
    }, [700]);

    return () => {
      clearTimeout(timeout);
    };
  }, [indicator]);

  return indicator;
};
