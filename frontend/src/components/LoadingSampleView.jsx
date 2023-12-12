import { Loader2 } from "lucide-react";
import { useIndicator } from "../hooks/useIndicator";

export function LoadingSampleView(props) {
  const progressData = props.progressData ?? "";
  const status = progressData.state_info?.status ?? "pending";
  const currentPhrase = progressData.state_info?.current
    ? "phrase: " + progressData.state_info?.current
    : "waiting for task";
  const indicator = useIndicator();

  return (
    <div className="grow w-full p-8 text-zinc-300 flex flex-col items-center">
      <span className="inline-flex flex-col gap-5 items-center mb-2">
        <Loader2 className="animate-spin h-9 w-9 text-indigo-300" />
        <h1 className="font-medium text-lg">generating samples {indicator}</h1>
      </span>

      {!progressData ? (
        <h3 className="text-sm text-zinc-400 text-center">
          (this may take a while)
        </h3>
      ) : (
        <>
          <h3 className="text-sm font-semibold text-zinc-400 text-center lowercase">
            currently {status}
          </h3>
          <p className="text-sm text-zinc-400 text-center">{currentPhrase}</p>
        </>
      )}
    </div>
  );
}
