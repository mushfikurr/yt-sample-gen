export function TextButton({ Icon, title, pressed, onClick }) {
  if (pressed) {
    return <TextButtonPressed onClick={onClick} Icon={Icon} title={title} />;
  }
  return (
    <button
      onClick={onClick}
      className="items-stretch shadow-sm flex justify-between gap-2 text-zinc-400 hover:text-zinc-300 transition-colors duration-150 ease-in-out"
    >
      <Icon className="aspect-square object-contain object-center w-6 overflow-hidden shrink-0 max-w-full" />
      <p className="text-base font-medium leading-4 self-center grow whitespace-nowrap my-auto">
        {title}
      </p>
    </button>
  );
}

function TextButtonPressed({ Icon, title, onClick }) {
  return (
    <button
      onClick={onClick}
      className="items-stretch shadow-sm flex justify-between gap-2 text-indigo-300 hover:text-indigo-400 active:text-indigo-300/80 transition-colors duration-150 ease-in-out"
    >
      <Icon className="aspect-square object-contain object-center w-6 overflow-hidden shrink-0 max-w-full" />
      <p className="text-base font-medium leading-4 self-center grow whitespace-nowrap my-auto">
        {title}
      </p>
    </button>
  );
}
