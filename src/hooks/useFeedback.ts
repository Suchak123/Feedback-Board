import { createFeedback, deleteFeedback, getFeedbackById, getFeedbackList, updateFeedback, upvoteFeedback } from "@/services/feedbackService";
import { CreateFeedbackInput, FeedbackListQuery, UpdateFeedbackInput, Feedback } from "@/types/feedback";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


export const feedbackKeys = {
    all: ['feedback'] as const,
    lists: () => [...feedbackKeys.all, 'list'] as const,
    list: (filters?: FeedbackListQuery) => [...feedbackKeys.lists(), filters] as const,
    details: () => [...feedbackKeys.all, 'detail'] as const,
    detail: (id:string) => [...feedbackKeys.details(), id] as const,
};

export function useFeedbackList(query?: FeedbackListQuery) {
    return useQuery({
        queryKey: feedbackKeys.list(query),
        queryFn: () => getFeedbackList(query)
    })
}

export function useFeedback(id: string) {
    return useQuery({
        queryKey: feedbackKeys.detail(id),
        queryFn: () => getFeedbackById(id),
        enabled: !!id,
    });
}

export function useCreateFeedback() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: CreateFeedbackInput) => createFeedback(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: feedbackKeys.lists()});
        },
    });
}

export function useUpdateFeedback() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data}: {id: string; data: UpdateFeedbackInput }) => updateFeedback(id, data),
        onSuccess: (updatedFeedback) => {
            queryClient.setQueryData(
                feedbackKeys.detail(updatedFeedback.id),
                updatedFeedback
            );

            queryClient.invalidateQueries({ queryKey: feedbackKeys.lists()});
        },
    });
}

export function useDeleteFeedback() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteFeedback(id),
        onSuccess: (_, deletedId) => {
            queryClient.removeQueries({ queryKey: feedbackKeys.detail(deletedId)});

            queryClient.invalidateQueries({ queryKey: feedbackKeys.lists()});
        }
    })
}


export function useUpvoteFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => upvoteFeedback(id),
    
    // Optimistic update
    onMutate: async (feedbackId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: feedbackKeys.lists() });

      // Snapshot the previous value
      const previousFeedback = queryClient.getQueriesData({ 
        queryKey: feedbackKeys.lists() 
      });

      // Optimistically update all lists
      queryClient.setQueriesData<Feedback[]>(
        { queryKey: feedbackKeys.lists() },
        (old) => {
          if (!old) return old;
          return old.map((feedback) =>
            feedback.id === feedbackId
              ? { ...feedback, upvotes: feedback.upvotes + 1 }
              : feedback
          );
        }
      );

      return { previousFeedback };
    },
    
    // On error, rollback
    onError: (err, feedbackId, context) => {
      if (context?.previousFeedback) {
        context.previousFeedback.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: feedbackKeys.lists() });
    },
  });
}