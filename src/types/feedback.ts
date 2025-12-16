import { ObjectId } from 'mongodb';

export type FeedbackStatus = 'open' | 'in-progress' | 'done';

export interface FeedbackDocument {
    _id: ObjectId;
    title: string;
    description: string;
    status: FeedbackStatus;
    upvotes: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Feedback {
    id: string;
    title: string;
    description: string;
    status: FeedbackStatus;
    upvotes: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateFeedbackInput {
    title: string;
    description: string;
    status?: FeedbackStatus;
}

export interface UpdateFeedbackInput {
    title?: string;
    description?: string;
    status?: FeedbackStatus;
}

export interface FeedbackListQuery {
    status?: FeedbackStatus;
    sort?: 'upvotes' | 'createdAt';
}

export interface FeedbackResponse {
    feedback: Feedback;
}

export interface FeedbackListResponse{
    feedback: Feedback[];
}

export interface ErrorResponse{
    error: string;
    details?: any[];
}

export interface DeleteResponse{
    message: string;
}

export type SortOption = 'upvotes' | 'createdAt';

export const STATUS_COLORS: Record<FeedbackStatus, string> = {
    'open': 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    'done': 'bg-green-100 text-green-800',
};

export const STATUS_LABELS: Record<FeedbackStatus, string> = {
    'open': 'Open',
    'in-progress': 'In Progress',
    'done': 'Done',
}

export const FEEDBACK_STATUSES: FeedbackStatus[] = ['open', 'in-progress', 'done'];

export const SORT_OPTIONS: { value: SortOption; label: string}[] = [
    { value: 'createdAt', label: 'Newest First'},
    { value: 'upvotes', label: 'Most Upvoted'}
];

