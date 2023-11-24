import { FolderArchive, Repeat2 } from "lucide-react";
import { useSamples } from "../requests";
import { useStore } from "../store";
import { cn } from "../utils";
import { SearchTermsDialog } from "./SearchTermsDialog";
import { TextButton } from "./TextButton";
import { VolumeSlider } from "./VolumeSlider";
import { Howler } from "howler";

export function Header(props) {
  const looping = useStore((state) => state.looping);
  const toggleLooping = useStore((state) => state.toggleLooping);
  const currentSample = useStore((state) => state.currentSample);
  const { refetch, isLoading, isRefetching } = useSamples();

  return (
    <div className="items-stretch bg-zinc-950 flex w-full flex-col p-8 max-md:max-w-full max-md:px-5 sticky top-0 z-10">
      <div className="justify-between items-stretch flex gap-5 max-md:max-w-full max-md:flex-wrap">
        <div className="items-stretch flex grow basis-[0%] flex-col">
          <h1 className="text-indigo-300 text-4xl font-semibold leading-10 whitespace-nowrap">
            <span className="text-zinc-200">yt </span>
            <span className="text-indigo-300">sample gen</span>
          </h1>
          <div className="items-stretch flex gap-1 mt-2">
            <h3 className="text-zinc-400 text-base font-medium leading-5">
              {currentSample ? "currently playing" : "waiting for sample"}
            </h3>
            <p className="text-indigo-300 text-base font-medium leading-5 whitespace-nowrap">
              {currentSample ?? ""}
            </p>
          </div>
        </div>
        {/* <div className="text-zinc-400 text-sm leading-4 whitespace-nowrap self-start">
          created by @mushfikurr
        </div> */}
      </div>
      <div className="text-zinc-200 text-xl font-semibold leading-4 whitespace-nowrap mt-7 max-md:max-w-full">
        settings
      </div>
      <div className="items-stretch flex w-full justify-between gap-5 mt-2.5 max-md:max-w-full max-md:flex-wrap">
        <div className="flex items-stretch justify-between gap-5 max-md:max-w-full max-md:flex-wrap">
          <div className="items-stretch flex justify-between gap-5 py-2 max-md:justify-center">
            <TextButton
              title={looping ? "loop" : "oneshot"}
              Icon={Repeat2}
              pressed={looping}
              onClick={() => {
                toggleLooping();
              }}
            />
          </div>
          <div className="items-stretch flex justify-between gap-5 py-2">
            <SearchTermsDialog />
            <div className="items-stretch flex justify-between gap-2">
              <TextButton title="download to .zip" Icon={FolderArchive} />
            </div>
          </div>
        </div>
        <div className="justify-end items-stretch self-center flex gap-2 my-auto">
          <VolumeSlider />
        </div>
      </div>
      <button
        onClick={() => {
          if (!isLoading || !isRefetching) {
            Howler.unload();
            refetch();
          }
        }}
        disabled={isLoading || isRefetching}
        className={cn(
          "text-zinc-300 hover:text-zinc-200 text-sm font-medium leading-6 whitespace-nowrap inline-flex justify-center items-center bg-zinc-900 border border-zinc-800 active:border-zinc-700 hover:bg-zinc-900/70 mt-8 px-7 py-5 rounded-md transition-colors duration-200 ease-in-out active:bg-zinc-900/50",
          {
            "bg-zinc-950 border border-zinc-800 hover:bg-zinc-950 active:bg-zinc-950":
              isLoading || isRefetching,
          }
        )}
      >
        {isLoading ? (
          <span className="text-zinc-500">generating...</span>
        ) : (
          "generate"
        )}
      </button>
    </div>
  );
}
