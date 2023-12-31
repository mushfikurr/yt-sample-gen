import { Repeat2 } from "lucide-react";
import { useStore } from "../store";
import { GenerateSamplesButton } from "./GenerateSamplesButton";
import { SearchTermsDialog } from "./SearchTermsDialog";
import { TextButton } from "./TextButton";
import { VolumeSlider } from "./VolumeSlider";

export function Header() {
  const looping = useStore((state) => state.looping);
  const toggleLooping = useStore((state) => state.toggleLooping);
  const currentSample = useStore((state) => state.currentSample);

  const generateLink = (id) => `https://www.youtube.com/watch?v=${id}`;

  return (
    <div className="items-stretch bg-zinc-950 flex w-full flex-col p-8 max-md:max-w-full max-md:px-5 sticky top-0 z-10">
      <div className="justify-between items-stretch flex gap-5 max-md:max-w-full max-md:flex-wrap">
        <div className="items-stretch flex grow basis-[0%] flex-col">
          <h1 className="text-indigo-300 text-4xl font-semibold leading-10 whitespace-nowrap">
            <span className="text-zinc-200">yt </span>
            <span className="text-indigo-300">sample gen</span>
          </h1>
          <div className="items-stretch flex gap-1 mt-2">
            {currentSample && (
              <a
                href={generateLink(currentSample)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 text-base font-medium leading-5 group"
              >
                <span className="group-hover:text-zinc-300 transition-colors duration-200 ease-in-out">
                  currently playing
                </span>{" "}
                <span className="text-indigo-300 group-hover:text-indigo-200 transition-colors duration-200 ease-in-out">
                  {currentSample}
                </span>
              </a>
            )}
            {!currentSample && (
              <h3 className="text-zinc-400 text-base font-medium leading-5">
                waiting for sample
              </h3>
            )}
          </div>
        </div>
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
          </div>
        </div>
        <div className="justify-end items-stretch self-center flex gap-2 my-auto">
          <VolumeSlider />
        </div>
      </div>
      <GenerateSamplesButton />
    </div>
  );
}
