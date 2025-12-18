'use client';

import React from "react";
import { Feedback, STATUS_COLORS, STATUS_LABELS } from "@/types/feedback";
import { Button } from "../ui/Button";

interface FeedbackItemProps {
    feedback: Feedback;
    onUpvote: (id:string) => void;
    onEdit: (feedback: Feedback) => void;
    onDelete: (id:string) => void;
    hasUpvoted: boolean;
    isUpvoting?: boolean;
}

export const FeedbackItem: React.FC<FeedbackItemProps> = ({
    feedback,
    onUpvote,
    onEdit,
    onDelete,
    hasUpvoted,
    isUpvoting = false
}) => {
    const formatDate = (date:Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            'year': 'numeric'
        });
    };

    return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => onUpvote(feedback.id)}
            disabled={hasUpvoted || isUpvoting}
            className={`
              flex flex-col items-center justify-center
              w-12 h-12 rounded-lg border-2 transition-all
              ${hasUpvoted 
                ? 'bg-blue-600 border-blue-600 text-white cursor-not-allowed' 
                : 'bg-white border-gray-300 text-gray-600 hover:border-blue-600 hover:text-blue-600'
              }
              disabled:opacity-50
            `}
            title={hasUpvoted ? 'Already upvoted' : 'Upvote'}
          >
            <svg 
              className="w-5 h-5" 
              fill={hasUpvoted ? 'currentColor' : 'none'} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-gray-700">
            {feedback.upvotes}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {feedback.title}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${STATUS_COLORS[feedback.status]}`}>
              {STATUS_LABELS[feedback.status]}
            </span>
          </div>

          <p className="text-gray-600 mb-4 leading-relaxed">
            {feedback.description}
          </p>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-500">
              Created {formatDate(feedback.createdAt)}
            </span>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(feedback)}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this feedback?')) {
                    onDelete(feedback.id);
                  }
                }}
                className="text-red-600 hover:bg-red-50"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}