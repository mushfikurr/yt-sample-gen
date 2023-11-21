import { Loader2 } from "lucide-react";
import * as React from "react";
import { useQuery } from "react-query";
import { generateSamples } from "../requests";

export function SampleView(props) {
  const query = useQuery(["samples"], () => generateSamples(), {
    enabled: false,
  });

  if (query.isLoading || query.isFetching) {
    return <LoadingSampleView />;
  }

  return (
    <div className="grid gap-4 grid-auto-fit p-8 max-md:max-w-full max-md:px-5 h-full">
      {query.data ? (
        query.data?.map((sample) => {
          return <Sample />;
        })
      ) : (
        <EmptySampleView />
      )}
    </div>
  );
}

export function EmptySampleView() {
  return (
    <div className="grow w-full p-8 text-zinc-400 flex flex-col gap-4 items-center">
      <h1 className="font-semibold text-lg">Waiting for samples...</h1>
    </div>
  );
}

export function LoadingSampleView() {
  return (
    <div className="grow w-full p-8 text-zinc-400 flex flex-col items-center">
      <span className="inline-flex flex-col gap-5 items-center">
        <Loader2 className="animate-spin h-9 w-9" />
        <h1 className="font-medium text-lg">generating samples...</h1>
      </span>

      <h3 className="text-sm text-zinc-500">(this may take a while)</h3>
    </div>
  );
}

function Sample() {
  return (
    <div className="inline-flex text-zinc-400 text-sm font-medium leading-4 whitespace-nowrap justify-center items-center bg-zinc-900 grow p-16 px-5 rounded-md">
      youtubeId
    </div>
  );
}
