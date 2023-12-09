import { Loader2 } from "lucide-react";
import { LoadingSampleView } from "./LoadingSampleView";
import { Sample } from "./Sample";

export function RandomSampleView() {
  // const query = useRandomSamples();

  if (query.isError) {
    return (
      <ErrorSampleView
        isRefetching={query.isRefetching}
        error={query.error?.message}
      />
    );
  }

  if (query.isLoading || query.isFetching) {
    return <LoadingSampleView />;
  }

  if (!query.data && !query.isError) {
    return <EmptySampleView />;
  }

  return (
    <div className="grid gap-4 grid-auto-fit p-8 max-md:max-w-full max-md:px-5 grow">
      {query.data?.map((sample) => {
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
