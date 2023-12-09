import { Loader2 } from "lucide-react";
import { LoadingSampleView } from "./LoadingSampleView";
import { Sample } from "./Sample";
import { useSamples } from "../hooks/useSamples";

export function SampleView() {
  const { anyErrors, anyLoading, statusQuery, processedFiles } = useSamples();

  if (anyErrors) {
    return <ErrorSampleView error={anyErrors?.message} />;
  }

  if (anyLoading) {
    return <LoadingSampleView progressData={statusQuery?.data} />;
  }

  if (!processedFiles || !processedFiles.length) {
    return <EmptySampleView />;
  }

  return (
    <div className="grid gap-4 grid-auto-fit p-8 max-md:max-w-full max-md:px-5 grow">
      {processedFiles?.map((sample) => {
        return <Sample key={sample} sample={sample} />;
      })}
    </div>
  );
}

export function EmptySampleView() {
  return (
    <div className="grow w-full p-8 text-zinc-400 flex flex-col gap-4 items-center">
      <h1 className="font-medium text-lg">waiting for samples...</h1>
    </div>
  );
}

export function ErrorSampleView({ error }) {
  return (
    <div className="grow w-full p-8 text-zinc-400 flex flex-col items-center">
      <span className="inline-flex flex-col gap-5 items-center">
        <h1 className="font-medium text-lg">error generating samples.</h1>
      </span>
      <h3 className="text-sm text-zinc-500 lowercase">{error}</h3>
    </div>
  );
}
