import { PineconeClient } from '@pinecone-database/pinecone'
import dotenv from 'dotenv'

dotenv.config()

const pineconeClient = new PineconeClient()
await pineconeClient.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT
})

const pineconeIndex = pineconeClient.Index(process.env.PINECONE_INDEX_NAME)

await pineconeIndex.delete1({
  deleteAll: true,
  namespace: ['fake-story-02']
})
