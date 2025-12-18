'use client';

import React from "react";
import { FeedbackStatus, SortOption, FEEDBACK_STATUSES, STATUS_LABELS, SORT_OPTIONS } from "@/types/feedback";

interface FeedbackFiltersProps {
    currentStatus?: FeedbackStatus;
    currentSort: SortOption;
    onStatusChange: (status?: FeedbackStatus) => void;
    onSortChange: (sort: SortOption) => void;
}

export const FeedbackFilters: React.FC<FeedbackFiltersProps> = ({
    currentStatus,
    currentSort,
    onStatusChange,
    onSortChange
}) => {
    return (
        <div className="bg-white border-b border-gray-200 p-4">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                    <button onClick={() => onStatusChange(undefined)} className={`
                        px-4 py-2 rounded-lg font-medium transition-colors
                        ${!currentStatus
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                        `}
                    >
                       All 
                    </button>
                    {FEEDBACK_STATUSES.map((status) => (
                        <button key={status} onClick={() => onStatusChange(status)}
                        className={`
                            px-4 py-2 rounded-lg font-medium transition-colors
                            ${currentStatus === status
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
                            `}
                        >
                            {STATUS_LABELS[status]}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <label htmlFor="sort" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                        Sort by:
                    </label>
                    <select id="sort" 
                    value={currentSort}
                    onChange={(e) => onSortChange(e.target.value as SortOption)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 bg-white cursor-pointer"
                    >
                        {SORT_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}