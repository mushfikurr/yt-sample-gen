import * as Dialog from "@radix-ui/react-dialog";
import { TextButton } from "./TextButton";
import { Cross, CrossIcon, Search, X } from "lucide-react";
import { useState } from "react";
import { cn } from "../utils";

export function SearchTermsDialog() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <TextButton title="search terms" Icon={Search} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-20 bg-black/10 backdrop-blur-sm" />

        <Dialog.Content
          className={cn(
            "fixed z-50",
            "min-w-fit max-w-lg max-h-screen rounded-lg p-8 md:w-full",
            "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            "bg-zinc-950 border border-zinc-800 drop-shadow-sm",
            "focus:outline-none focus-visible:ring focus-visible:ring-indigo-300 focus-visible:ring-opacity-75"
          )}
        >
          <Dialog.Title className="text-xl font-semibold text-zinc-300">
            search terms
          </Dialog.Title>
          <Dialog.Description className="mt-3 text-sm font-medium text-zinc-400">
            modify the search terms to generate samples from. each line should
            be an individual word
          </Dialog.Description>
          <form className="mt-6 space-y-2 max-h-screen">
            <fieldset>
              <label
                htmlFor="firstName"
                className="text-md font-medium text-zinc-300"
              >
                words
              </label>
              <textarea
                id="words"
                type="text"
                placeholder="bird&#10;noise&#10;sample&#10;wind&#10;ambience&#10;sound"
                className={cn(
                  "mt-3 w-full h-64 rounded-md px-3 py-2.5 transition-colors duration-200 ease-in-out",
                  "text-sm text-zinc-300 placeholder:text-zinc-500",
                  "border bg-zinc-900 hover:bg-zinc-900/70 active:bg-zinc-900/70 border-zinc-800",
                  "focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-300 focus-visible:ring-opacity-75 focus-visible:bg-zinc-900/70"
                )}
              />
            </fieldset>
          </form>
          <div className="mt-4 flex justify-end">
            <Dialog.Close
              className={cn(
                "text-zinc-300 hover:text-zinc-200 text-sm font-medium leading-6 whitespace-nowrap inline-flex justify-center items-center bg-zinc-900 border border-zinc-800 hover:bg-zinc-900/70 active:border-zinc-700 mt-8 px-7 py-2 rounded-md transition-colors duration-200 ease-in-out active:bg-zinc-900/50"
                // {
                //   "bg-zinc-950 border-2 border-zinc-900 hover:bg-zinc-950 active:bg-zinc-950":
                //     isLoading,
                // }
              )}
            >
              Save
            </Dialog.Close>
          </div>
          <Dialog.Close
            className={cn(
              "absolute top-3.5 right-3.5 inline-flex items-center justify-center rounded-full p-1",
              "focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-300 focus-visible:ring-opacity-75"
            )}
          >
            <X className="aspect-square object-contain object-center w-6 overflow-hidden shrink-0 max-w-full text-zinc-400 hover:text-zinc-300 transition-colors duration-200 ease-in-out" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
