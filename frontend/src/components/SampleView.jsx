import { Loader2, MousePointerClick, MousePointerSquare } from "lucide-react";
import { useAudioFile } from "../hooks/useAudioFile";
import { useHowler } from "../hooks/useHowler";
import { useSamples } from "../hooks/useSamples";
import { useStore } from "../store";
import { cn } from "../utils";

export function SampleView() {
  const query = useSamples();

  if (query.isError) {
    return (
      <ErrorSampleView
        isRefetching={query.isRefetching}
        error={query.error?.message}
      />
    );
  }

  if (query.isLoading || query.isFetching) {
    return <LoadingSampleView />;
  }

  if (!query.data && !query.isError) {
    return <EmptySampleView />;
  }

  return (
    <div className="grid gap-4 grid-auto-fit p-8 max-md:max-w-full max-md:px-5 grow">
      {query.data?.map((sample) => {
        return <Sample key={sample} sample={sample} />;
      })}
    </div>
  );
}

export function EmptySampleView() {
  return (
    <div className="grow w-full p-8 text-zinc-400 flex flex-col gap-4 items-center">
      <h1 className="font-medium text-lg">waiting for samples...</h1>
    </div>
  );
}

export function LoadingSampleView() {
  return (
    <div className="grow w-full p-8 text-zinc-300 flex flex-col items-center">
      <span className="inline-flex flex-col gap-5 items-center">
        <Loader2 className="animate-spin h-9 w-9 text-indigo-300" />
        <h1 className="font-medium text-lg">generating samples...</h1>
      </span>

      <h3 className="text-sm text-zinc-400">(this may take a while)</h3>
    </div>
  );
}

export function ErrorSampleView({ error, isRefetching }) {
  return (
    <div className="grow w-full p-8 text-zinc-400 flex flex-col items-center">
      <span className="inline-flex flex-col gap-5 items-center">
        {isRefetching && (
          <Loader2 className="animate-spin h-9 w-9 text-indigo-300" />
        )}
        <h1 className="font-medium text-lg">
          error generating samples{isRefetching && ". refetching..."}
        </h1>
      </span>
      <h3 className="text-sm text-zinc-500 lowercase">{error}</h3>
    </div>
  );
}

function Sample(props) {
  const setCurrentSample = useStore((state) => state.setCurrentSample);
  const currentSample = useStore((state) => state.currentSample);
  const sample = props.sample; // remove placeholder value youtubeId
  const pressed = sample === currentSample;
  useHowler(sample, pressed);
  const audioFile = useAudioFile(sample);

  const handleLeftClick = () => {
    if (pressed) {
      setCurrentSample("");
    } else {
      setCurrentSample(sample);
    }
  };

  const handleRightClick = async (e) => {
    e.preventDefault();
    await audioFile.refetch();
  };

  return (
    <button
      onClick={handleLeftClick}
      onContextMenu={(e) => {
        handleRightClick(e);
      }}
      className={cn(
        "flex flex-col items-center border border-zinc-800 text-zinc-400 transition-all duration-200 ease-in-out text-sm font-medium leading-4 whitespace-nowrap bg-zinc-900 hover:bg-[#141416] grow p-16 px-5 rounded-md",
        {
          "text-indigo-300 drop-shadow-glow border border-indigo-300 bg-[#141416]":
            pressed,
        }
      )}
    >
      <span className="transition-colors duration-150 ease-in-out">
        {sample.split(".")[0]} {audioFile.isError && "(error downloading file)"}
      </span>
      <span
        className={cn(
          "font-normal inline-flex items-center gap-1 text-zinc-600 transition-colors duration-150 ease-in-out",
          { "text-zinc-500": pressed }
        )}
      >
        <MousePointerClick className="aspect-square object-contain object-center w-4 overflow-hidden shrink-0 max-w-full" />
        <span className="font-medium">play</span> or
        <MousePointerSquare className="aspect-square object-contain object-center w-4 overflow-hidden shrink-0 max-w-full" />
        <span className="font-medium">download</span>
      </span>
    </button>
  );
}
