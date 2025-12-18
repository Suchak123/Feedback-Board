import { NextRequest, NextResponse } from "next/server";
import { getDb } from '@/lib/db';
import { FeedbackDocument, Feedback} from '@/types/feedback';
import { ObjectId } from "mongodb";
import { error } from "console";

export async function POST(
    request:NextRequest,
    context : {params: Promise<{id: string}>}
) {
    try {
        const { id } = await context.params;

        if(!ObjectId.isValid(id)){
            return NextResponse.json(
                { error: 'Invalid Feedback ID'},
                { status: 400 }
            );
        }

        const db = await getDb();
        const collection = db.collection<FeedbackDocument>('feedback');

        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            {
                $inc: { upvotes:1 },
                $set: { updatedAt: new Date() }
            },
            { returnDocument: 'after'}
        );

        if(!result) {
            return NextResponse.json(
                { error: 'Feedback not found' },
                {status: 404}
            );
        }

        const transformedFeedback: Feedback = {
            id: result._id.toString(),
            title: result.title,
            description: result.description,
            status: result.status,
            upvotes: result.upvotes,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
        };

        return NextResponse.json(
            { feedback: transformedFeedback },
            { status: 200}
        );
    } catch (error) {
        console.error('POST /api/feedback/:id/upvote/error:', error);
        return NextResponse.json(
            { error: 'Failed to upvote feedback'},
            { status: 500}
        );
    }
}

export async function DELETE(
    request: NextRequest,
    context : {params: Promise<{id: string}>}
) {
    try {
        const { id } = await context.params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'Invalid feedback ID'},
                { status: 400}
            );
        }

        const db = await getDb();
        const collection = db.collection<FeedbackDocument>('feedback');

        const feedback = await collection.findOne({ _id: new ObjectId(id) });

        if(!feedback) {
            return NextResponse.json(
                { error: 'Feedback not found'},
                { status: 404}
            );
        }

        const newUpvotes = Math.max(0, feedback.upvotes - 1);

        const result = await collection.findOneAndUpdate(
            {_id: new ObjectId(id) },
            {
                $set: {
                    upvotes: newUpvotes,
                    updatedAt: new Date()
                }
            },
            { returnDocument: 'after'}
        );

        if(!result) {
            return NextResponse.json(
                { error: 'Feedback not found' },
                { status: 404}
            );
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
            { feedback: transformedFeedback },
            { status: 200 }
        );
    } catch (error) {
        console.error('DELETE /api/feedback/:id/upvote error:', error);
        return NextResponse.json(
            { error: 'Failed to remove upvote' },
            { status: 500}
        )
    }
}