import { ConsoleCallbackHandler } from 'langchain/callbacks'
import { ConversationalRetrievalQAChain } from 'langchain/chains'
import { OpenAI } from 'langchain/llms/openai'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { PromptTemplate } from 'langchain/prompts'
import { BufferMemory } from 'langchain/memory'
import dotenv from 'dotenv'
import usePinecone from '../utils/pinecone/usePinecone.js'
import { QA_GENERATOR_PROMPT, QA_PROMPT } from '../utils/prompt.js'
import saveDocsLogs from './save-docs-logs.js'

dotenv.config()

const { pineconeIndex, PineconeStore } = await usePinecone()

// In Node.js defaults to process.env.OPENAI_API_KEY
const model = new OpenAI({
  streaming: true,
  temperature: 0.1, // default is 0.7
  modelName: 'gpt-3.5-turbo-0613', // Defaults is "text-davinci-003"
  callbacks: [new ConsoleCallbackHandler()],
})

// ===== 實例化資料庫，準備後續對話使用 =====
const pineconeStore = await PineconeStore.fromExistingIndex(
  new OpenAIEmbeddings(),
  {
    pineconeIndex,
    textKey: 'text', // default
    namespace: 'fake-story-03',
  },
)

// ===== 實例化有聊天記憶功能的對話鏈 =====
const chain = ConversationalRetrievalQAChain.fromLLM(
  model,
  pineconeStore.asRetriever(4), // k值預設為4，代表回傳前4個最相似的文件
  {
    memory: new BufferMemory({
      memoryKey: 'chat_history',
      inputKey: 'question',
      outputKey: 'text',
      returnMessages: true,
    }),
    questionGeneratorTemplate: QA_GENERATOR_PROMPT,
    qaChainOptions: {
      type: 'stuff',
      prompt: PromptTemplate.fromTemplate(QA_PROMPT),
      // If type is "map_reduce", then the following are required:
      // combineMapPrompt: PromptTemplate.fromTemplate(QA_GENERATOR_PROMPT),
      // combinePrompt: PromptTemplate.fromTemplate(QA_PROMPT),

      //If type is "refine", then the following are required:
      // questionPrompt: PromptTemplate.fromTemplate(QA_PROMPT),
    },
    callbacks: [new ConsoleCallbackHandler()], // 印出對話鏈事件紀錄
    returnSourceDocuments: false, // 可以設定為 true，會回傳資料庫中查詢到的文件
    verbose: false,
  },
)

const questions = [
  '故事的名稱是?',
  '目前有哪些章節?',
  '故事中出現哪些人物?',
  '瑞安、艾莉絲、凱文這三個人的關係是什麼?',
]

async function askMultipleQuestions(questions) {
  const chatChain = []
  for (let i = 0; i < questions.length; i++) {
    const chatChainItem = await chain.call({
      question: questions[i],
    })
    chatChain.push({
      question: questions[i],
      answer: chatChainItem.text,
    })
  }
  return chatChain
}

const chatChainRes = await askMultipleQuestions(questions)
console.log('chatChainRes: ', chatChainRes)

saveDocsLogs(chatChainRes, 'test-chat')
