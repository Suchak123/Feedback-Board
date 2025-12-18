'use client';

import { Feedback, FeedbackStatus, STATUS_LABELS } from "@/types/feedback";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";

interface FeedbackFormProps {
    onSubmit: (data: FeedbackFormData) => void;
    onCancel: () => void;
    initialData?: Feedback;
    isLoading?: boolean;
}

export interface FeedbackFormData {
    title: string;
    description: string;
    status: FeedbackStatus;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
    onSubmit,
    onCancel,
    initialData,
    isLoading = false,
}) => {
    const [formData, setFormData] = useState<FeedbackFormData>({
        title: initialData?.title || '',
        description: initialData?.description || '',
        status: initialData?.status || 'open',
    })

    const [errors, setErrors] = useState<Partial<Record<keyof FeedbackFormData, string>>>({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title,
                description: initialData.description,
                status: initialData.status,
            });
        }
    }, [initialData]);

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof FeedbackFormData, string>> = {};

        const title = formData.title || '';
        if (!title.trim()) {
        newErrors.title = 'Title is required';
        } else if (title.trim().length < 3) {
        newErrors.title = 'Title must be at least 3 characters';
        } else if (title.trim().length > 100) {
        newErrors.title = 'Title must be less than 100 characters';
        }

        const description = formData.description || '';
        if (!description.trim()) {
        newErrors.description = 'Description is required';
        } else if (description.trim().length < 10) {
        newErrors.description = 'Description must be at least 10 characters';
        } else if (description.trim().length > 500) {
        newErrors.description = 'Description must be less than 500 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if(validate()) {
            onSubmit({
                title: formData.title.trim(),
                description: formData.description.trim(),
                status: formData.status,
            });
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));

        if(errors[name as keyof FeedbackFormData]) {
            setErrors(prev => ({...prev, [name]: undefined}));
        }
    };

    const statusOptions = [
        { value: 'open', label: STATUS_LABELS.open},
        { value: 'in-progress', label: STATUS_LABELS['in-progress']},
        { value: 'done', label: STATUS_LABELS.done}
    ];

    return(
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="title" label="Title" placeholder="Enter feedback title" value={formData.title} onChange={handleChange} error={errors.title} required disabled={isLoading}/>

            <Textarea name="description" label="Description" placeholder="Describe your feedback in description" value={formData.description} onChange={handleChange} error={errors.description} required disabled={isLoading} rows={8}/>

            <Select name="status" label="Status" value={formData.status} onChange={handleChange} options={statusOptions} disabled={isLoading}/>

            <div className="flex gap-3 justify-end pt-4">
                <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={isLoading}
                >
                Cancel
                </Button>
                <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                >
                {initialData ? 'Update' : 'Create'} Feedback
                </Button>
            </div>
        </form>
    );
};