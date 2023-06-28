import { PineconeClient } from '@pinecone-database/pinecone'
import dotenv from 'dotenv'

dotenv.config()

const pineconeClient = new PineconeClient()
await pineconeClient.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT
})

const indexDescription = await pineconeClient.describeIndex({
  indexName: process.env.PINECONE_INDEX_NAME
})

console.log('indexDescription: ', indexDescription)
