import { ConsoleCallbackHandler } from 'langchain/callbacks'
import { ConversationalRetrievalQAChain } from 'langchain/chains'
import { OpenAI } from 'langchain/llms/openai'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import dotenv from 'dotenv'
import usePinecone from './utils/pinecone/usePinecone.js'
import { QA_GENERATOR_PROMPT, QA_PROMPT } from './utils/prompt.js'

dotenv.config()

const { pineconeIndex, PineconeStore } = await usePinecone()

// In Node.js defaults to process.env.OPENAI_API_KEY
const model = new OpenAI({
  temperature: 0.1, // default is 1
  modelName: 'gpt-3.5-turbo-0613',
  callbacks: [new ConsoleCallbackHandler()], // 印出 OpenAI 事件紀錄
})

// ===== 資料庫實例化，準備後續對話使用 =====
const pineconeStore = await PineconeStore.fromExistingIndex(
  new OpenAIEmbeddings(),
  {
    pineconeIndex,
    textKey: 'text', // default
    namespace: 'fake-story-03',
  },
)

// ===== 聊天記憶功能的對話鏈實例化 =====
const chain = ConversationalRetrievalQAChain.fromLLM(
  model,
  pineconeStore.asRetriever(4),
  {
    memory: new BufferMemory({
      memoryKey: 'chat_history',
      inputKey: 'question',
      outputKey: 'text',
      returnMessages: true,
    }),
    questionGeneratorTemplate: QA_GENERATOR_PROMPT,
    qaChainOptions: {
      type: 'stuff', // Chain Type
      prompt: PromptTemplate.fromTemplate(QA_PROMPT),
    },
    callbacks: [new ConsoleCallbackHandler()], // 印出對話鏈事件紀錄
    returnSourceDocuments: false, // 若設定為 true，會回傳資料庫中查詢到的文件
  },
)

export async function chat(message, history) {
  const res = await chain.call(
    {
      question: message,
      // chat_history: history || '',
    },
    [new ConsoleCallbackHandler()],
  )

  return res
}
