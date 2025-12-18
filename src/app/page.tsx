'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { FeedbackFilters } from '@/components/feedback/FeedbackFilters';
import { FeedbackList } from '@/components/feedback/FeedbackList';
import { FeedbackForm, FeedbackFormData } from '@/components/feedback/FeedbackForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useUIStore } from '@/store/uiStore';
import { useUpvoteStore } from '@/store/upvoteStore';
import {
  useFeedbackList,
  useCreateFeedback,
  useUpdateFeedback,
  useDeleteFeedback,
  useUpvoteFeedback,
} from '@/hooks/useFeedback';
import { Feedback } from '@/types/feedback';

export default function Home() {
  const {
    isModalOpen,
    editingFeedback,
    statusFilter,
    sortOrder,
    openModal,
    closeModal,
    setEditingFeedback,
    setStatusFilter,
    setSortOrder,
  } = useUIStore();

  const { hasUpvoted, addUpvote } = useUpvoteStore();

  const { data: feedbackList = [], isLoading, error } = useFeedbackList({
    status: statusFilter,
    sort: sortOrder,
  });

  const createMutation = useCreateFeedback();
  const updateMutation = useUpdateFeedback();
  const deleteMutation = useDeleteFeedback();
  const upvoteMutation = useUpvoteFeedback();

  const handleCreate = async (data: FeedbackFormData) => {
    try {
      await createMutation.mutateAsync(data);
      closeModal();
    } catch (error) {
      console.error('Failed to create feedback:', error);
      alert('Failed to create feedback. Please try again.');
    }
  };

  const handleUpdate = async (data: FeedbackFormData) => {
    if (!editingFeedback) return;

    try {
      await updateMutation.mutateAsync({
        id: editingFeedback.id,
        data,
      });
      closeModal();
    } catch (error) {
      console.error('Failed to update feedback:', error);
      alert('Failed to update feedback. Please try again.');
    }
  };

  const handleUpvote = async (id: string) => {
    if (hasUpvoted(id)) {
      alert('You have already upvoted this feedback!');
      return;
    }

    try {
      await upvoteMutation.mutateAsync(id);
      addUpvote(id);
    } catch (error) {
      console.error('Failed to upvote feedback:', error);
      alert('Failed to upvote. Please try again.');
    }
  };

  const handleEdit = (feedback: Feedback) => {
    setEditingFeedback(feedback);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feedback?')) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete feedback:', error);
      alert('Failed to delete feedback. Please try again.');
    }
  };

  const handleCloseModal = () => {
    closeModal();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <svg
              className="mx-auto h-12 w-12 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-red-900">
              Failed to load feedback
            </h3>
            <p className="mt-1 text-sm text-red-700">
              {error instanceof Error ? error.message : 'An error occurred'}
            </p>
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <FeedbackFilters
        currentStatus={statusFilter}
        currentSort={sortOrder}
        onStatusChange={setStatusFilter}
        onSortChange={setSortOrder}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="primary" size="lg" onClick={openModal}>
            + Create Feedback
          </Button>
        </div>

        <FeedbackList
          feedback={feedbackList}
          onUpvote={handleUpvote}
          onEdit={handleEdit}
          onDelete={handleDelete}
          getUpvotedIds={() => useUpvoteStore.getState().upvotedIds}
          isUpvoting={upvoteMutation.isPending ? upvoteMutation.variables : null}
          isLoading={isLoading}
        />
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingFeedback ? 'Edit Feedback' : 'Create New Feedback'}
      >
        <FeedbackForm
          onSubmit={editingFeedback ? handleUpdate : handleCreate}
          onCancel={handleCloseModal}
          initialData={editingFeedback || undefined}
          isLoading={
            editingFeedback
              ? updateMutation.isPending
              : createMutation.isPending
          }
        />
      </Modal>
    </div>
  );
}