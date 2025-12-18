import { CreateFeedbackInput, DeleteResponse, Feedback, FeedbackListQuery, FeedbackListResponse, FeedbackResponse, UpdateFeedbackInput } from "@/types/feedback";


const API_BASE_URL = '/api/feedback';

async function fetchAPI<T>(url: string, options?:RequestInit): Promise<T> {
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if(!response.ok) {
        const error = await response.json().catch(() => ({ error: 'An error occured' }));
        throw new Error(error.error || 'An error occured');
    }
    return response.json()
}

export async function getFeedbackList(query?: FeedbackListQuery): Promise<Feedback[]> {
    const params = new URLSearchParams();

    console.log(params);

    if (query?.status) {
        params.append('status', query.status);
    }
    if (query?.sort) {
        params.append('sort', query.sort)
    }

    const url = params.toString() ? `${API_BASE_URL}?${params}` : API_BASE_URL;
    const data = await fetchAPI<FeedbackListResponse>(url);

    return data.feedback;
}

export async function getFeedbackById(id: string): Promise<Feedback> {
    const data = await fetchAPI<FeedbackResponse>(`${API_BASE_URL}/${id}`);
    return data.feedback;
}

export async function createFeedback(input: CreateFeedbackInput): Promise<Feedback> {
    const data = await fetchAPI<FeedbackResponse>(API_BASE_URL, {
        method: 'POST',
        body: JSON.stringify(input),
    })
    return data.feedback
}

export async function updateFeedback(id:string, input: UpdateFeedbackInput): Promise<Feedback> {
    const data = await fetchAPI<FeedbackResponse>(`${API_BASE_URL}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
    });

    return data.feedback;
}

export async function deleteFeedback(id:string): Promise<void> {
    await fetchAPI<DeleteResponse>(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
    });
}

export async function upvoteFeedback(id: string): Promise<Feedback> {
  const data = await fetchAPI<FeedbackResponse>(`${API_BASE_URL}/${id}/upvote`, {
    method: 'POST',
  });
  
  return data.feedback;
}

export async function removeUpvote(id: string): Promise<Feedback> {
  const data = await fetchAPI<FeedbackResponse>(`${API_BASE_URL}/${id}/upvote`, {
    method: 'DELETE',
  });
  
  return data.feedback;
}

