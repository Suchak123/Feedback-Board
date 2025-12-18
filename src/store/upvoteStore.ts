import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UpvoteState {
  upvotedIds: string[];
  addUpvote: (id: string) => void;
  removeUpvote: (id: string) => void;
  hasUpvoted: (id: string) => boolean;
  clearUpvotes: () => void;
}

export const useUpvoteStore = create<UpvoteState>()(
  persist(
    (set, get) => ({
      upvotedIds: [],
      
      addUpvote: (id) =>
        set((state) => ({
          upvotedIds: state.upvotedIds.includes(id)
            ? state.upvotedIds
            : [...state.upvotedIds, id],
        })),
      
      removeUpvote: (id) =>
        set((state) => ({
          upvotedIds: state.upvotedIds.filter((upvotedId) => upvotedId !== id),
        })),
      
      hasUpvoted: (id) => get().upvotedIds.includes(id),
      
      clearUpvotes: () => set({ upvotedIds: [] }),
    }),
    {
      name: 'feedback-upvotes',
    }
  )
);