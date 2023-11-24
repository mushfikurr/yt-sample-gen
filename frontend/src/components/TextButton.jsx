import { forwardRef } from "react";
import { cn } from "../utils";

export const TextButton = forwardRef(({ children, ...props }, ref) => {
  const { Icon, title, pressed, onClick } = props;
  return (
    <button
      onClick={onClick}
      ref={ref}
      className={cn(
        "items-stretch shadow-sm flex justify-between gap-2 text-zinc-400 hover:text-zinc-300 transition-colors duration-200 ease-in-out",
        {
          "text-indigo-300 hover:text-indigo-200 active:text-indigo-200":
            pressed,
        }
      )}
    >
      <Icon className="aspect-square object-contain object-center w-6 overflow-hidden shrink-0 max-w-full" />
      <p
        className={cn(
          "text-base font-medium leading-4 self-center grow whitespace-nowrap my-auto",
          { "": pressed }
        )}
      >
        {title}
      </p>
      {children}
    </button>
  );
});
