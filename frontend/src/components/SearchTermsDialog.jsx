import * as Dialog from "@radix-ui/react-dialog";
import { Search, X } from "lucide-react";
import { useRef, useState } from "react";
import { useStore } from "../store";
import { cn } from "../utils";
import { TextButton } from "./TextButton";

export function SearchTermsDialog() {
  const ERROR_MESSAGE_INVALID =
    "there must be at least 4 words on a seperate line";
  const words = useStore((state) => state.words);
  const setWords = useStore((state) => state.setWords);

  const [isOpen, setIsOpen] = useState(false);
  const [wordsInput, setWordsInput] = useState(words.join(""));
  const [isWordsInputValid, setIsWordsInputValid] = useState(true); // true: untyped / success || false: invalid

  const validateInput = (input) => input.split("\n")?.length > 3;
  const handleSaveClick = (e) => {
    if (validateInput(wordsInput)) {
      setIsWordsInputValid(true);
      setWords(wordsInput.split("\n"));
    } else {
      e.preventDefault();
      setIsWordsInputValid(false);
    }
  };
  const handleChange = (e) => {
    if (!isWordsInputValid && validateInput(wordsInput)) {
      setIsWordsInputValid(true);
    }
    setWordsInput(e.target.value);
  };

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
                placeholder="bird&#10;noise&#10;sample&#10;wind&#10;ambience&#10;sound&#10;(a longer list provides more unique sample combinations)"
                onChange={(e) => handleChange(e)}
                value={wordsInput}
                className={cn(
                  "mt-3 w-full h-64 rounded-md px-3 py-2.5 transition-colors duration-200 ease-in-out",
                  "text-sm text-zinc-300 placeholder:text-zinc-500",
                  "border bg-zinc-900 hover:bg-zinc-900/70 active:bg-zinc-900/70 border-zinc-800",
                  "focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-300 focus-visible:ring-opacity-75 focus-visible:bg-zinc-900/70",
                  {
                    "border border-red-400 focus-visible:ring-none":
                      !isWordsInputValid,
                  }
                )}
              />
            </fieldset>
          </form>
          {!isWordsInputValid && (
            <div className="mt-4 text-red-400 text-sm">
              <p>{ERROR_MESSAGE_INVALID}</p>
            </div>
          )}
          <div className="flex justify-end gap-4">
            <button
              className={cn(
                "text-zinc-300 hover:text-zinc-200 text-sm font-medium leading-6 whitespace-nowrap inline-flex justify-center items-center bg-zinc-900 border border-zinc-800 hover:bg-zinc-900/70 active:border-zinc-700 mt-8 px-7 py-2 rounded-md transition-colors duration-200 ease-in-out active:bg-zinc-900/50"
              )}
              onClick={() => {
                setWords([]);
                setWordsInput("");
              }}
            >
              clear
            </button>
            <Dialog.Close
              className={cn(
                "text-zinc-300 hover:text-zinc-200 text-sm font-medium leading-6 whitespace-nowrap inline-flex justify-center items-center bg-zinc-900 border border-zinc-800 hover:bg-zinc-900/70 active:border-zinc-700 mt-8 px-7 py-2 rounded-md transition-colors duration-200 ease-in-out active:bg-zinc-900/50"
              )}
              onClick={(e) => handleSaveClick(e)}
            >
              save
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
