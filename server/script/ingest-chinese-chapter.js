/**
 * 將文件向量化並儲存至 Pinecone
 */
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import dotenv from 'dotenv'
import usePinecone from '../utils/pinecone/usePinecone.js'
import saveDocsLogs from './save-docs-logs.js'

dotenv.config()

const { pineconeIndex, PineconeStore } = await usePinecone()

// ===== 載入文件 =====
// const filePath = './docs/fake-story-03.pdf'
const filePath = './docs_private/chinese-chapter-01.pdf'
const pdfLoader = new PDFLoader(filePath)
const rawPDFDocs = await pdfLoader.load()

// ===== 將文件切塊 =====
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 300,
  chunkOverlap: 0,
})

const pdfDocs = await splitter.splitDocuments(rawPDFDocs)
console.log(`Split ${pdfDocs.length} documents.`)

saveDocsLogs(pdfDocs, 'pdf-loader')

// ===== 資料塊轉換成多維向量，儲存至資料庫 =====
/**
 * OpenAIEmbeddings 會使用到 OpenAI API key
 * Model Name: text-embedding-ada-002
 * Reference: https://openai.xiniushu.com/docs/guides/embeddings
 */
try {
  PineconeStore.fromDocuments(pdfDocs, new OpenAIEmbeddings(), {
    pineconeIndex,
    textKey: 'text', // default
    namespace: 'chinese-chapter-01',
  })
} catch (err) {
  console.error(err)
}
