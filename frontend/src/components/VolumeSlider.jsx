import * as Slider from "@radix-ui/react-slider";
import { Volume2 } from "lucide-react";
import { cn } from "../utils";
import { Howler } from "howler";
import { useState, useEffect } from "react";

export function VolumeSlider() {
  const [volume, setVolume] = useState([0.5]);

  useEffect(() => {}, [Howler.volume()]);

  return (
    <div className="group inline-flex gap-2">
      <Volume2 className="text-zinc-400 aspect-square object-contain object-center w-6 overflow-hidden shrink-0 max-w-full group-hover:text-zinc-300 transition-all duration-200 ease-in-out" />

      <Slider.Root
        defaultValue={[0.4]}
        max={1}
        min={0}
        step={0.1}
        className="relative flex w-32 touch-none items-center"
        onValueChange={(value) => {
          setVolume(value);
          Howler.volume(value);
        }}
        value={volume}
      >
        <Slider.Track className="relative h-2 w-full grow rounded-full bg-zinc-900 border border-zinc-800">
          <Slider.Range className="absolute h-full rounded-full bg-indigo-300 group-hover:bg-indigo-200 transition-colors duration-200 ease-in-out" />
        </Slider.Track>
        <Slider.Thumb
          className={cn(
            "block h-5 w-5 rounded-full bg-zinc-400 border border-zinc-800 transition-colors duration-200 ease-in-out",
            "focus:outline-none focus-visible:ring-2",
            "group-hover:bg-zinc-300"
          )}
        />
      </Slider.Root>
    </div>
  );
}
