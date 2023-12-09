import { cn } from "../utils";
import { useSamples } from "../hooks/useSamples";
import { Howler } from "howler";

export function GenerateSamplesButton() {
  const { startFetchingSamples, anyLoading } = useSamples();

  const handleClick = () => {
    if (!anyLoading) {
      Howler.unload();
      startFetchingSamples();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={anyLoading}
      className={cn(
        "text-zinc-300 hover:text-zinc-200 text-sm font-medium leading-6 whitespace-nowrap inline-flex justify-center items-center bg-zinc-900 border border-zinc-800 active:border-zinc-700 hover:bg-zinc-900/70 mt-8 px-7 py-5 rounded-md transition-colors duration-200 ease-in-out active:bg-zinc-900/50",
        {
          "bg-zinc-950 border border-zinc-800 hover:bg-zinc-950 active:bg-zinc-950":
            anyLoading,
        }
      )}
    >
      {anyLoading ? (
        <span className="text-zinc-500">generating...</span>
      ) : (
        "generate"
      )}
    </button>
  );
}
