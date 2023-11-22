import { RefreshCcw, Search } from "lucide-react";
import { useStore } from "../store";
import { TextButton } from "./TextButton";
import { useQueryClient } from "react-query";
import * as Dialog from "@radix-ui/react-dialog";
import { WordsModal } from "./WordsModal";

export function Header(props) {
  const looping = useStore((state) => state.looping);
  const toggleLooping = useStore((state) => state.toggleLooping);
  const hasGeneratedSampleOnce = useStore(
    (state) => state.hasGeneratedSampleOnce
  );
  const queryClient = useQueryClient();

  return (
    <div className="items-stretch bg-zinc-950 flex w-full flex-col p-8 max-md:max-w-full max-md:px-5 sticky top-0">
      <div className="justify-between items-stretch flex gap-5 max-md:max-w-full max-md:flex-wrap">
        <div className="items-stretch flex grow basis-[0%] flex-col">
          <div className="text-indigo-300 text-4xl font-semibold leading-10 whitespace-nowrap">
            <span className="text-zinc-200">yt </span>
            <span className="text-indigo-300">sample gen</span>
          </div>
          <div className="items-stretch flex gap-1 mt-2">
            <div className="text-zinc-400 text-base font-medium leading-5">
              currently playing
            </div>
            <div className="text-indigo-300 text-base font-medium leading-5 whitespace-nowrap">
              youtubeid
            </div>
          </div>
        </div>
        <div className="text-zinc-400 text-sm leading-4 whitespace-nowrap self-start">
          created by @mushfikurr
        </div>
      </div>
      <div className="text-zinc-200 text-xl font-semibold leading-4 whitespace-nowrap mt-7 max-md:max-w-full">
        settings
      </div>
      <div className="items-stretch flex w-full justify-between gap-5 mt-2.5 max-md:max-w-full max-md:flex-wrap">
        <div className="flex items-stretch justify-between gap-5 max-md:max-w-full max-md:flex-wrap">
          <div className="items-stretch flex justify-between gap-5 py-2 max-md:justify-center">
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <TextButton
                  title={looping ? "loop on" : "loop off"}
                  Icon={RefreshCcw}
                  pressed={looping}
                  onClick={() => {
                    toggleLooping();
                  }}
                />
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay />
                <Dialog.Content>
                  <WordsModal />
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
          <div className="items-stretch flex justify-between gap-5 py-2">
            <TextButton title="search terms" Icon={Search} />
            <div className="items-stretch flex justify-between gap-2">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/c84f86f4-739f-4ea4-bd20-e63f4aa83d36?apiKey=3558a84a4f3942fcb082385cb40cd5e5&"
                className="aspect-square object-contain object-center w-6 overflow-hidden shrink-0 max-w-full"
              />
              <div className="text-zinc-400 text-base font-medium leading-4 self-center grow whitespace-nowrap my-auto">
                download to .zip
              </div>
            </div>
          </div>
        </div>
        <div className="justify-end items-stretch self-center flex gap-2 my-auto">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/f7c81ac3-3a5a-48ce-9009-bd819aa90421?apiKey=3558a84a4f3942fcb082385cb40cd5e5&"
            className="aspect-square object-contain object-center w-6 overflow-hidden shrink-0 max-w-full"
          />
          <div className="text-zinc-400 text-base font-medium leading-4 self-center grow whitespace-nowrap my-auto">
            help
          </div>
        </div>
      </div>
      <button
        onClick={() => {
          queryClient.refetchQueries({ queryKey: ["samples"] });
        }}
        className="text-zinc-200 hover:text-zinc-100 text-sm font-medium leading-6 whitespace-nowrap inline-flex justify-center items-center bg-zinc-900 hover:bg-zinc-900/70 mt-8 px-5 py-5 rounded-md transition-colors duration-150 ease-in-out active:bg-zinc-900/90"
      >
        {hasGeneratedSampleOnce ? "regenerate" : "generate"}
      </button>
    </div>
  );
}
