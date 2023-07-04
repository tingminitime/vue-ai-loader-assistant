/**
 * 將文件向量化並儲存至 Pinecone
 */
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
// import { PineconeClient } from '@pinecone-database/pinecone'
// import { PineconeStore } from 'langchain/vectorstores/pinecone'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import dotenv from 'dotenv'
import usePinecone from '../utils/pinecone/usePinecone.js'
import saveDocsLogs from './save-docs-logs.js'

dotenv.config()

const { pineconeIndex, PineconeStore } = await usePinecone()

// ===== 載入文件 =====
const filePath = './docs/fake-story-02.pdf'
const pdfLoader = new PDFLoader(filePath)
const rawDocs = await pdfLoader.load()

// ===== 將文件切塊 =====
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 300,
  chunkOverlap: 60
})

const docs = await splitter.splitDocuments(rawDocs)
console.log(`Split ${docs.length} documents.`)

saveDocsLogs(docs, 'pdf')

// ===== 資料塊轉換成多維向量，儲存至資料庫 =====
/**
 * OpenAIEmbeddings 會使用到 OpenAI API key
 * Model Name: text-embedding-ada-002
 * Reference: https://openai.xiniushu.com/docs/guides/embeddings
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
