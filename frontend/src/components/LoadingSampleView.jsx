import { Loader2 } from "lucide-react";

export function LoadingSampleView(props) {
  const progressData = props.progressData ?? "";
  console.log(progressData ?? "no sample progress data");

  return (
    <div className="grow w-full p-8 text-zinc-300 flex flex-col items-center">
      <span className="inline-flex flex-col gap-5 items-center mb-2">
        <Loader2 className="animate-spin h-9 w-9 text-indigo-300" />
        <h1 className="font-medium text-lg">generating samples...</h1>
      </span>

      {!progressData ? (
        <h3 className="text-sm text-zinc-400 text-center">
          (this may take a while)
        </h3>
      ) : (
        <>
          <h3 className="text-sm font-semibold text-zinc-400 text-center lowercase">
            currently {progressData.state_info?.status}
          </h3>
          <p className="text-sm text-zinc-400 text-center">
            <span className="font-medium">current phrase:</span>{" "}
            {progressData.state_info?.current}
          </p>
        </>
      )}
    </div>
  );
}
