'use client';

import React from "react";
import { Feedback } from "@/types/feedback";
import { FeedbackItem } from "./FeedbackItem";

interface FeedbackListProps {
    feedback: Feedback[];
    onUpvote: (id:string) => void;
    onEdit: (feedback: Feedback) => void;
    onDelete: (id:string) => void;
    getUpvotedIds: () => string[];
    isUpvoting?: string | null;
    isLoading?: boolean;
}

export const FeedbackList: React.FC<FeedbackListProps> = ({
    feedback,
    onUpvote,
    onEdit,
    onDelete,
    getUpvotedIds,
    isUpvoting,
    isLoading
}) => {
    const upvotedIds = getUpvotedIds();

    if (isLoading) {
        return (
        <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        );
    }

    if (feedback.length === 0) {
    return (
      <div className="text-center py-12">
        <svg 
          className="mx-auto h-12 w-12 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No feedback yet</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new feedback item.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
        {feedback.map((item) => (
            <FeedbackItem 
                key={item.id}
                feedback={item}
                onUpvote={onUpvote}
                onEdit={onEdit}
                onDelete={onDelete}
                hasUpvoted={upvotedIds.includes(item.id)}
                isUpvoting={isUpvoting === item.id}
            />
        ))}
    </div>
  );
}