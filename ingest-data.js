import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { PineconeClient } from '@pinecone-database/pinecone'
import { PineconeStore } from 'langchain/vectorstores/pinecone'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import dotenv from 'dotenv'

dotenv.config()

const filePath = './docs/fake-story_by-ChatGPT.pdf'

const pdfLoader = new PDFLoader(filePath)

const rawDocs = await pdfLoader.load()

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200
})

const docs = await splitter.splitDocuments(rawDocs)
// console.log(docs)

const pineconeClient = new PineconeClient()
await pineconeClient.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT
})

const pineconeIndex = pineconeClient.Index(process.env.PINECONE_INDEX_NAME)

// OpenAIEmbeddings will use the OpenAI API key
try {
  PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), {
    pineconeIndex,
    textKey: 'text', // default
    namespace: 'vue3-loader-ai-assistant'
  })
} catch (err) {
  console.error(err)
}
