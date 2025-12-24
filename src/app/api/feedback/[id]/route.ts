import { NextRequest, NextResponse } from "next/server";
import { getDb } from '@/lib/db';
import { updateFeedbackSchema } from "@/lib/validators";
import { FeedbackDocument, Feedback } from "@/types/feedback";
import { ObjectId } from "mongodb";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
    request: NextRequest,
    {params} : {params: Promise<{id: string}>}
) {
    try {
        const { id } = await params;

        if(!ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'Invalid feedback ID' },
                { status: 400 }
            );
        }

        const db = await getDb();
        const collection = db.collection<FeedbackDocument>('feedback');

        const feedback = await collection.findOne({ _id: new ObjectId(id) });

        if(!feedback){
            return NextResponse.json(
                { error: 'Feedback not found' },
                { status: 404}
            );
        }

        const transformedFeedback: Feedback = {
            id: feedback._id.toString(),
            title: feedback.title,
            description: feedback.description,
            status: feedback.status,
            upvotes: feedback.upvotes,
            createdAt: feedback.createdAt,
            updatedAt: feedback.updatedAt,
        };

        return NextResponse.json(
            { feedback: transformedFeedback},
            { status: 200}
        );
    } catch (error) {
        console.error('GET /api/feedback/:id error:', error);
        return NextResponse.json(
            {error: 'Failed to fetch feedback'},
            { status: 500}
        );
    }
}

export async function PATCH(
    request: NextRequest,
    {params} : {params: Promise<{id: string}>}
) {
    try {
        const { id } = await params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                {error: 'Invalid feedback ID'},
                { status: 400 }
            );
        }

        const body = await request.json()

        const validation = updateFeedbackSchema.safeParse(body);
        if(!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.issues },
                { status: 400 }
            );
        }

        const db = await getDb();
        const collection = db.collection<FeedbackDocument>('feedback');

        const updateData: any = {
            ...validation.data,
            updatedAt: new Date(),
        };

        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateData},
            { returnDocument: 'after'}
        );

        if(!result){
            return NextResponse.json(
                {error: 'Feedback not found'},
                { status: 404}
            )
        }

        const transformedFeedback: Feedback = {
            id: result._id.toString(),
            title: result.title,
            description: result.description,
            status: result.status,
            upvotes: result.upvotes,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt
        };

        return NextResponse.json(
            { feedback: transformedFeedback},
            { status: 200}
        );
    } catch (error) {
        console.error('PATCH /api/feedback/:id error:', error);
        return NextResponse.json(
            { error: 'Failed to update feedback'},
            { status: 500}
        );
    }
}

export async function DELETE(
    request:NextRequest,
    {params} : {params: Promise<{id: string}>}
) {
    try {
        const { id } = await params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid Feedback ID" },
                { status: 400}
            );
        }

        const db = await getDb();
        const collection = db.collection<FeedbackDocument>('feedback');

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0){
            return NextResponse.json(
                { error: 'Feedback not found' },
                { status: 404}
            )
        }

        return NextResponse.json(
            { message: 'Feedback deleted successfully'},
            { status: 200 }
        );
    } catch (error) {
        console.error('DELETE /api/feedback/:id error:', error);
        return NextResponse.json(
            { error: 'Failed to delete feedback' },
            { status: 500}
        )
    }
}