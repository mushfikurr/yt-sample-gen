import { Loader2 } from "lucide-react";
import { Sample } from "./Sample";
import { LoadingSampleView } from "./LoadingSampleView";
import { useSamples } from "../hooks/useSamples";

export function CustomSampleView() {
  // const { startFetchingSamples, generateSamplesWithWordsQuery } = useSamples();

  const samples = query.data?.processed_files;

  if (query.isError) {
    return (
      <ErrorSampleView
        isRefetching={query.isRefetching}
        error={query.error?.message}
      />
    );
  }

  if (query.isLoading && query.taskInProgress) {
    return <LoadingSampleView sampleProgressData={query.data} />;
  }

  if (query.isLoading) {
    return <LoadingSampleView />;
  }

  if (!query.data && !query.isError) {
    return <EmptySampleView />;
  }

  return (
    <div className="grid gap-4 grid-auto-fit p-8 max-md:max-w-full max-md:px-5 grow">
      {query.success &&
        samples?.map((sample) => {
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

export function ErrorSampleView({ error, isRefetching }) {
  return (
    <div className="grow w-full p-8 text-zinc-400 flex flex-col items-center">
      <span className="inline-flex flex-col gap-5 items-center">
        {isRefetching && (
          <Loader2 className="animate-spin h-9 w-9 text-indigo-300" />
        )}
        <h1 className="font-medium text-lg">
          error generating samples{isRefetching && ". refetching..."}
        </h1>
      </span>
      <h3 className="text-sm text-zinc-500 lowercase">{error}</h3>
    </div>
  );
}
