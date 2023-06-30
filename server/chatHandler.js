import { ConsoleCallbackHandler } from 'langchain/callbacks'
import { ConversationalRetrievalQAChain } from 'langchain/chains'
import { OpenAI } from 'langchain/llms/openai'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { PineconeStore } from 'langchain/vectorstores/pinecone'
import { PineconeClient } from '@pinecone-database/pinecone'
import dotenv from 'dotenv'

dotenv.config()

// In Node.js defaults to process.env.OPENAI_API_KEY
const model = new OpenAI({
  temperature: 0.1,
  modelName: 'gpt-3.5-turbo-0613', // Defaults to "text-davinci-003" if no model provided
  callbacks: [new ConsoleCallbackHandler()]
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

const CONDENSED_PROMPT = `
給定以下對話記錄和一個後續問題，將後續問題重新描述為一個獨立的問題。
對話記錄: {chat_history}
後續問題: {question}
獨立問題: 
`

const QA_PROMPT = `
你是一個懂中文且有用的 AI 助手，請使用以下上下文訊息並以中文回答最後的問題，如果你不知道答案，只需要說你不知道，不要試圖猜測、編造答案；如果問題與上下文無關，請禮貌回答你只能回答相關問題。

{context}

問題: {question}
回答: 
`

const chain = ConversationalRetrievalQAChain.fromLLM(
  model,
  pineconeStore.asRetriever(),
  {
    questionGeneratorTemplate: CONDENSED_PROMPT,
    qaTemplate: QA_PROMPT,
    // qaChainOptions: {
    //   type: 'map_reduce'
    // },
    returnSourceDocuments: true
  }
)

export async function chat(message, history) {
  const res = await chain.call(
    {
      question: message,
      chat_history: history || ''
    },
    [new ConsoleCallbackHandler()]
  )

  return res
}
