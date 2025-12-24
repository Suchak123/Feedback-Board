import { NextRequest, NextResponse} from 'next/server';
import { getDb } from '@/lib/db';
import { FeedbackDocument, Feedback } from '@/types/feedback';
import { createFeedbackSchema, feedbackQuerySchema } from '@/lib/validators';


export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get('status');
        const sort = searchParams.get('sort');

        const queryValidation = feedbackQuerySchema.safeParse({
            status: status || undefined,
            sort: sort || undefined,
        });

        if (!queryValidation.success) {
            return NextResponse.json(
                { error: 'Invalid query parameters', details: queryValidation.error.issues},
                {status: 400}
            );
        }

        const db = await getDb();
        const collection = db.collection<FeedbackDocument>('feedback')

        const filter: any = {};
        if(queryValidation.data.status){
            filter.status = queryValidation.data.status
        }

        const sortOptions: any = {}
        if(queryValidation.data.sort === 'upvotes'){
            sortOptions.upvotes = -1;
        } else {
            sortOptions.createdAt = -1
        }

        const feedbackList = await collection
        .find(filter)
        .sort(sortOptions)
        .toArray();

        const transformedFeedback: Feedback[] = feedbackList.map(item => ({
            id: item._id.toString(),
            title: item.title,
            description: item.description,
            status: item.status,
            upvotes: item.upvotes,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
        }));

        return NextResponse.json(
            { feedback: transformedFeedback},
            { status: 200}
        );
    } catch (error) {
        console.error('GET /api/feedback error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch feedback'},
            { status: 500}
        )
    }
}

export async function POST(request:NextRequest) {
    try {
        const body = await request.json();

        const validation = createFeedbackSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.issues},
                {status: 400}
            );
        }

        const db = await getDb();
        const collection = db.collection<FeedbackDocument>('feedback');

        const now = new Date();

        const newFeedback = {
            title: validation.data.title,
            description: validation.data.description,
            status: validation.data.status,
            upvotes: 0,
            createdAt: now,
            updatedAt: now,
        }
        
        const result = await collection.insertOne(newFeedback as any);

        const createdFeedback: Feedback = {
            id: result.insertedId.toString(),
            title: newFeedback.title,
            description: newFeedback.description,
            status: newFeedback.status,
            upvotes: newFeedback.upvotes,
            createdAt: newFeedback.createdAt,
            updatedAt: newFeedback.updatedAt
        };

        return NextResponse.json(
            {feedback: createdFeedback},
            {status: 201}
        )
    } catch (error) {
        console.error('POST /api/feedback error:', error);
        return NextResponse.json(
            {error: 'Failed to create feedback'},
            {status: 500}
        )
    }
}