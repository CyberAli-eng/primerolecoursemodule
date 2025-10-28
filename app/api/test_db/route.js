import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET() {
  try {
    console.log('🔍 Testing MongoDB connection...');
    console.log('MONGO_URL exists:', !!process.env.MONGO_URL);
    console.log('DB_NAME:', process.env.DB_NAME);

    const client = new MongoClient(process.env.MONGO_URL);
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const collections = await db.listCollections().toArray();
    await client.close();

    return NextResponse.json({ ok: true, db: process.env.DB_NAME, collections });
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    return NextResponse.json(
      { ok: false, error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}
