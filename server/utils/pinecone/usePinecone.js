import { PineconeStore } from 'langchain/vectorstores/pinecone'
import { PineconeClient } from '@pinecone-database/pinecone'
import dotenv from 'dotenv'

dotenv.config()

/**
 * Returns pineconeIndex and PineconeStore
 * @returns {object} { pineconeIndex, PineconeStore }
 */
export default async function usePinecone() {
  const pineconeClient = new PineconeClient()
  await pineconeClient.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT
  })

  const pineconeIndex = pineconeClient.Index(process.env.PINECONE_INDEX_NAME)

  return {
    pineconeIndex,
    PineconeStore
  }
}
