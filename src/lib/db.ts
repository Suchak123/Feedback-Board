import { MongoClient, Db } from 'mongodb';

const uri: string = process.env.MONGODB_URI || '';

const options = {};

let clientPromise: Promise<MongoClient> | null = null;

declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
    console.log(uri);
    if (!uri) {
        throw new Error('MongoDB URI not specified.');
    }

    if (process.env.NODE_ENV === 'development') {
        if (!global._mongoClientPromise) {
            const client = new MongoClient(uri, options);
            global._mongoClientPromise = client.connect();
        }
        return global._mongoClientPromise;
    } else {
        if (!clientPromise) {
            const client = new MongoClient(uri, options);
            clientPromise = client.connect();
        }
        return clientPromise;
    }
}

export default getClientPromise;

export async function getDb(): Promise<Db> {
    if (!uri) {
        throw new Error('MongoDB URI not specified.');
    }
    
    const client = await getClientPromise();
    const dbName = process.env.MONGO_DB_NAME || 'feedback_board';
    return client.db(dbName);
}

