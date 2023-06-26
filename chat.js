import { ConversationalRetrievalQAChain } from 'langchain/chains'
import { OpenAI } from 'langchain/llms/openai'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { PineconeStore } from 'langchain/vectorstores/pinecone'
import { PineconeClient } from '@pinecone-database/pinecone'
import { BufferMemory } from 'langchain/memory'
import dotenv from 'dotenv'

dotenv.config()

// In Node.js defaults to process.env.OPENAI_API_KEY
const model = new OpenAI({
  temperature: 0.1
  // modelName: 'gpt-3.5-turbo-0613' // Defaults to "text-davinci-003" if no model provided
})

const pineconeClient = new PineconeClient()
await pineconeClient.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT
})

const pineconeIndex = pineconeClient.Index(process.env.PINECONE_INDEX_NAME)

const pineconeStore = await PineconeStore.fromExistingIndex(
  new OpenAIEmbeddings(),
  {
    pineconeIndex,
    textKey: 'text', // default
    namespace: 'fake-story-02'
  }
)

const chain = ConversationalRetrievalQAChain.fromLLM(
  model,
  pineconeStore.asRetriever(),
  {
    // memory: new BufferMemory({
    //   memoryKey: 'chat_history' // Must be set to "chat_history"
    // })
    // returnSourceDocuments: true
  }
)

const res = await chain.call({
  question: '請問此故事的名稱為何?',
  chat_history: []
})

console.log(res)

const secondRes = await chain.call({
  // question: '故事中出現的人物名稱為何?',
  question: '我剛剛問的問題是什麼?',
  chat_history: ['請問此故事的名稱為何?', res.text]
})

console.log(secondRes)
