import { useStore } from "../store";
import { useHowler } from "../hooks/useHowler";
import { useAudioFile } from "../hooks/useAudioFile";
import { MousePointerClick, MousePointerSquare } from "lucide-react";
import { cn } from "../utils";

export function Sample(props) {
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
