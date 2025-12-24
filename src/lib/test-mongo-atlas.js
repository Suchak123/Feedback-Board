const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://feedback_admin:RWEZmD3ny37tDq4i@cluster0.icfjrux.mongodb.net/?appName=Cluster0";

async function testConnection() {
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB Atlas!");
        
        const db = client.db('feedback_board');
        const collections = await db.listCollections().toArray();
        console.log("Collections:", collections);
        
    } catch (error) {
        console.error("❌ Connection failed:", error);
    } finally {
        await client.close();
    }
}

testConnection();