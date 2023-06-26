/**
 * 將文件向量化並儲存至 Pinecone
 */
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { PineconeClient } from '@pinecone-database/pinecone'
import { PineconeStore } from 'langchain/vectorstores/pinecone'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import dotenv from 'dotenv'

dotenv.config()

const filePath = './docs/fake-story-02.pdf'

const pdfLoader = new PDFLoader(filePath)

const rawDocs = await pdfLoader.load()

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 100
})

const docs = await splitter.splitDocuments(rawDocs)
// console.log(docs)

const pineconeClient = new PineconeClient()
await pineconeClient.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT
})

const pineconeIndex = pineconeClient.Index(process.env.PINECONE_INDEX_NAME)

/**
 * OpenAIEmbeddings will use the OpenAI API key
 * Model Name : text-embedding-ada-002
 * Refer : https://openai.xiniushu.com/docs/guides/embeddings
 */
try {
  PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), {
    pineconeIndex,
    textKey: 'text', // default
    namespace: 'fake-story-02'
  })
} catch (err) {
  console.error(err)
}
