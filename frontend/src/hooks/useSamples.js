import { useQuery, useQueryClient } from "react-query";
import {
  fetchTaskId,
  fetchTaskStatus,
  generateRandomSamples,
} from "../requests";
import { useStore } from "../store";
import { useState } from "react";

export const useSamples = () => {
  const words = useStore((state) => state.words);
  const [taskQueueLoadingState, setTaskQueueLoadingState] = useState(false);
  const queryClient = useQueryClient();
  const TASK_SUCCESS = "SUCCESS";
  const TASK_PENDING = "PENDING";
  const TASK_PROGRESS = "PROGRESS";
  const REFETCH_INTERVAL = 600;
  const RETRY_TIMES = 3;

  const unionAllErrors = (query) => {
    return query?.error;
  };

  const taskIdQuery = useQuery("taskId", () => fetchTaskId(words), {
    enabled: false,
    retry: RETRY_TIMES,
    onSuccess: () => {
      setTaskQueueLoadingState(true);
    },
  });
  const taskId = taskIdQuery?.data;

  const isTaskSuccessful = (data) => {
    return data && data.successful ? true : false;
  };
  const statusQuery = useQuery(
    ["samples", "status"],
    () => fetchTaskStatus(taskId),
    {
      enabled: !!taskId,
      refetchInterval: (data) => {
        isTaskSuccessful(data) ? REFETCH_INTERVAL : false;
      },
      onSuccess: (data) => {
        if (isTaskSuccessful(data)) {
          console.log(TASK_SUCCESS, data);
          setTaskQueueLoadingState(false);
        } else console.log(TASK_PROGRESS, data);
      },
    }
  );
  const taskQueueErrors =
    unionAllErrors(taskIdQuery) || unionAllErrors(statusQuery);
  const taskQueueLoading =
    taskIdQuery.isFetching || statusQuery.isFetching || taskQueueLoadingState;

  const randomSamples = useQuery(["samples"], () => generateRandomSamples(), {
    enabled: false,
    retry: RETRY_TIMES,
  });
  const randomSamplesError = unionAllErrors(randomSamples);
  const randomSamplesLoading = randomSamples.isFetching;

  // Unify all errors/loading states no matter what type of sample generation
  const anyErrors = taskQueueErrors || randomSamplesError;
  const anyLoading = taskQueueLoading || randomSamplesLoading;

  const processedFiles =
    randomSamples?.data ||
    (isTaskSuccessful(statusQuery?.data) && statusQuery?.data?.processed_files);
  console.log(processedFiles);

  const startFetchingSamples = () => {
    if (words.length) {
      queryClient.invalidateQueries(["taskId"]);
      queryClient.invalidateQueries([["samples", "status"]]);
      taskIdQuery.refetch();
    } else {
      queryClient.invalidateQueries("samples");
      randomSamples.refetch();
    }
  };

  return {
    taskIdQuery,
    statusQuery,
    startFetchingSamples,
    anyErrors,
    anyLoading,
    processedFiles,
  };
};
