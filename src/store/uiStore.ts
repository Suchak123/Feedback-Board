import { Feedback, FeedbackStatus, SortOption } from "@/types/feedback";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface UIState {

    isModalOpen: boolean;
    editingFeedback: Feedback | null;

    statusFilter?: FeedbackStatus;
    sortOrder: SortOption;

    openModal: () => void;
    closeModal: () => void;
    setEditingFeedback: (feedback: Feedback | null) => void;
    setStatusFilter: (status?: FeedbackStatus) => void;
    setSortOrder: (sort: SortOption) => void;
    resetFilters: () => void;
}

export const useUIStore = create<UIState>()(
    devtools(
        persist(
            (set) => ({
                isModalOpen: false,
                editingFeedback: null,
                statusFilter: undefined,
                sortOrder: 'createdAt',

                openModal: () => set({ isModalOpen: true}),
                closeModal: () => set({ isModalOpen: false, editingFeedback: null}),

                setEditingFeedback: (feedback) => set({ editingFeedback: feedback, isModalOpen: true}),

                setStatusFilter: (status) => set({ statusFilter: status }),
                setSortOrder: (sort) => set({ sortOrder: sort}),
                resetFilters: () => set({ statusFilter: undefined, sortOrder: 'createdAt'}),
            }),
            {
                name: 'feedback-ui-store',
                partialize: (state) => ({
                    statusFilter: state.statusFilter,
                    sortOrder: state.sortOrder,
                })
            }
        ),
        { name: 'UIStore' }
    )
);