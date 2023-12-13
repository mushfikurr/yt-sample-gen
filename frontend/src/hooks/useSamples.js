import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  cancelTask,
  fetchTaskId,
  fetchTaskStatus,
  generateRandomSamples,
} from "../requests";
import { useStore } from "../store";
import { useState } from "react";

const TASK_SUCCESS = "SUCCESS";
const TASK_PENDING = "PENDING";
const TASK_PROGRESS = "PROGRESS";

export const useSamples = () => {
  const words = useStore((state) => state.words);
  const [taskQueueLoadingState, setTaskQueueLoadingState] = useState(false);
  const queryClient = useQueryClient();
  const REFETCH_INTERVAL = 600;
  const RETRY_TIMES = 3;

  const unionAllErrors = (query) => query?.error;
  const taskIdQuery = useQuery("taskId", () => fetchTaskId(words), {
    enabled: false,
    retry: RETRY_TIMES,
    onSuccess: () => setTaskQueueLoadingState(true),
    onError: () => setTaskQueueLoadingState(false),
  });
  const taskId = taskIdQuery?.data;

  const isTaskSuccessful = (data) =>
    data?.state === TASK_SUCCESS ? true : false;

  const statusQuery = useQuery(
    ["samples", "status"],
    () => fetchTaskStatus(taskId),
    {
      enabled: !!taskId && taskQueueLoadingState,
      refetchInterval: (data) =>
        isTaskSuccessful(data) && taskQueueLoadingState
          ? REFETCH_INTERVAL
          : false,
      onSuccess: (data) => {
        if (isTaskSuccessful(data) && taskQueueLoadingState)
          setTaskQueueLoadingState(false);
      },
    }
  );

  const cancelTaskMutation = useMutation(cancelTask, {
    onSuccess: () => {
      setTaskQueueLoadingState(false);
      queryClient.resetQueries("taskId");
      queryClient.resetQueries(["samples", "status"]);
    },
  });

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

  const processedFilesWithWords =
    isTaskSuccessful(statusQuery?.data) && statusQuery?.data?.processed_files;
  const processedFiles = !words.length
    ? randomSamples?.data
    : processedFilesWithWords;

  const startFetchingSamples = () => {
    if (words.length) {
      console.log("there are words...");
      queryClient.invalidateQueries("taskId");
      queryClient.invalidateQueries(["samples", "status"]);
      taskIdQuery.refetch();
    } else {
      queryClient.invalidateQueries("samples");
      randomSamples.refetch();
    }
  };

  const cancelCurrentTask = () => {
    if (anyLoading && taskId && !anyErrors) {
      cancelTaskMutation.mutate(taskId);
    }
  };

  return {
    taskIdQuery,
    statusQuery,
    cancelCurrentTask,
    startFetchingSamples,
    anyErrors,
    anyLoading,
    processedFiles,
  };
};
