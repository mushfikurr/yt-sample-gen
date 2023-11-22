import { forwardRef } from "react";

export const TextButton = forwardRef(
  ({ Icon, title, pressed, onClick }, ref) => {
    if (pressed) {
      return (
        <TextButtonPressed
          ref={ref}
          onClick={onClick}
          Icon={Icon}
          title={title}
        />
      );
    }
    return (
      <button
        onClick={onClick}
        ref={ref}
        className="items-stretch shadow-sm flex justify-between gap-2 text-zinc-400 hover:text-zinc-300 transition-colors duration-150 ease-in-out"
      >
        <Icon className="aspect-square object-contain object-center w-6 overflow-hidden shrink-0 max-w-full" />
        <p className="text-base font-medium leading-4 self-center grow whitespace-nowrap my-auto">
          {title}
        </p>
      </button>
    );
  }
);

export const TextButtonPressed = forwardRef(({ Icon, title, onClick }, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className="items-stretch flex justify-between gap-2 text-indigo-300 hover:text-indigo-400 active:text-indigo-300/80 transition-colors duration-150 ease-in-out"
    >
      <Icon className="aspect-square object-contain object-center w-6 overflow-hidden shrink-0 max-w-full drop-shadow-glow" />
      <p className="text-base font-medium leading-4 self-center grow whitespace-nowrap my-auto drop-shadow-glow">
        {title}
      </p>
    </button>
  );
});
