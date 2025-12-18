import { title } from 'process';
import { z } from 'zod';

export const feedbackStatusSchema = z.enum(['open', 'in-progress', 'done']);

export const createFeedbackSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title too long'),
    description: z.string().min(10, 'Description ,ust be at least 10 characters or more').max(500, 'Description too long'),
    status: feedbackStatusSchema.optional().default('open'),
});

export const updateFeedbackSchema = z.object({
    title: z.string().min(3).max(100).optional(),
    description: z.string().min(10).max(500).optional(),
    status: feedbackStatusSchema.optional(),
}).refine(data => Object.keys(data).length > 0, {
    message: 'At least provide one field for update'
});

export const feedbackQuerySchema = z.object({
    status: feedbackStatusSchema.optional(),
    sort: z.enum(['upvotes', 'createdAt']).optional()
});