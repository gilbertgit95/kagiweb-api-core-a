import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

const mongod = MongoMemoryServer.create();

export async function connectDB() {
  try {
    const uri = await (await mongod).getUri();
    await mongoose.connect(uri);
  } catch (error) {
    console.log('DB connect error');
  }
}

export async function disconnectDB() {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await (await mongod).stop()
  } catch (error) {
    console.log('DB disconnect error');
  }
}

export async function clearDatabase() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
     const collection = collections[key];
     await collection.deleteMany({});
  }
}