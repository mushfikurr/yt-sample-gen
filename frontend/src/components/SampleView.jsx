import { Loader2 } from "lucide-react";
import * as React from "react";
import { useQuery } from "react-query";
import { generateSamples } from "../requests";
import { useStore } from "../store";
import { cn } from "../utils";

export function SampleView(props) {
  const query = useQuery(["samples"], () => generateSamples(), {
    enabled: false,
  });
  const setHasGeneratedSamplesOnce = useStore(
    (state) => state.setHasGeneratedSamplesOnce
  );

  if (query.isLoading || query.isFetching) {
    return <LoadingSampleView />;
  }

  if (query.isSuccess) {
    setHasGeneratedSamplesOnce(true);
  }

  return (
    <div className="grid gap-4 grid-auto-fit p-8 max-md:max-w-full max-md:px-5 h-full">
      {query.data ? (
        query.data?.map((sample) => {
          return <Sample />;
        })
      ) : (
        <>
          <Sample />
        </>
      )}
    </div>
  );
}

export function EmptySampleView() {
  return (
    <div className="grow w-full p-8 text-zinc-400 flex flex-col gap-4 items-center">
      <h1 className="font-semibold text-lg">Waiting for samples...</h1>
    </div>
  );
}

export function LoadingSampleView() {
  return (
    <div className="grow w-full p-8 text-zinc-400 flex flex-col items-center">
      <span className="inline-flex flex-col gap-5 items-center">
        <Loader2 className="animate-spin h-9 w-9" />
        <h1 className="font-medium text-lg">generating samples...</h1>
      </span>

      <h3 className="text-sm text-zinc-500">(this may take a while)</h3>
    </div>
  );
}

function Sample(props) {
  const setCurrentSample = useStore((state) => state.setCurrentSample);
  const currentSample = useStore((state) => state.currentSample);
  const sample = props.sample ?? "youtubeId"; // remove placeholder value youtubeId
  const isPressed = sample === currentSample;

  const handleClick = () => {
    if (isPressed) {
      setCurrentSample("");
    } else {
      setCurrentSample(sample ?? "youtubeId");
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "border border-zinc-900 inline-flex text-zinc-400 transition-all duration-200 ease-in-out text-sm font-medium leading-4 whitespace-nowrap justify-center items-center bg-zinc-900 grow p-16 px-5 rounded-md",
        {
          "text-indigo-300 drop-shadow-glow border border-indigo-300 border-opacity-100":
            isPressed,
        }
      )}
    >
      {sample}
    </button>
  );
}
