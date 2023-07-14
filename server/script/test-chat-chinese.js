import { ConsoleCallbackHandler } from 'langchain/callbacks'
import { ConversationalRetrievalQAChain } from 'langchain/chains'
import { OpenAI } from 'langchain/llms/openai'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { PromptTemplate } from 'langchain/prompts'
import chalk from 'chalk'
import dotenv from 'dotenv'
import usePinecone from '../utils/pinecone/usePinecone.js'
import {
  QA_GENERATOR_PROMPT,
  QA_PROMPT,
  NORMAL_PROMPT,
  OPEN_PROMPT,
} from '../utils/prompt.js'
import saveDocsLogs from './save-docs-logs.js'

dotenv.config()

const { pineconeIndex, PineconeStore } = await usePinecone()

let costInfo = []

const totalCostHandler = tokenUsage => {
  costInfo.push({
    tokenUsage,
    totalCost: parseFloat(
      ((tokenUsage?.totalTokens / 1000) * 0.002).toFixed(4),
    ),
  })
}

// OpenAI
const model = new ChatOpenAI({
  temperature: 0.1, // default is 0.7
  modelName: 'gpt-3.5-turbo-0613', // Defaults is "text-davinci-003"
  // streaming: true,
  callbacks: [
    new ConsoleCallbackHandler(),
    {
      handleLLMEnd: async output => {
        console.log(output.llmOutput?.tokenUsage)
        totalCostHandler(output.llmOutput?.tokenUsage)
      },
      // async handleLLMNewToken(token) {
      //   process.stdout.write(chalk.green(token))
      // },
    },
  ],
})

// Azure OpenAI
// const model = new ChatOpenAI({
//   temperature: 0.1, // default is 0.7
//   modelName: 'gpt-35-turbo',
//   streaming: true,
//   azureOpenAIApiKey: process.env.AZ_OPENAI_API_KEY,
//   azureOpenAIApiInstanceName: process.env.AZ_OPENAI_API_INSTANCE_NAME,
//   azureOpenAIApiDeploymentName: process.env.AZ_OPENAI_API_DEPLOYMENT_NAME,
//   azureOpenAIApiVersion: process.env.AZ_OPENAI_API_VERSION,
//   azureOpenAIBasePath: process.env.AZ_OPENAI_BASE_PATH,
//   callbacks: [
//     new ConsoleCallbackHandler(),
//     {
//       handleLLMEnd: async output => {
//         console.log(output.llmOutput?.tokenUsage)
//         totalCostHandler(output.llmOutput?.tokenUsage)
//       },
//       // async handleLLMNewToken(token) {
//       //   process.stdout.write(chalk.green(token))
//       // },
//     },
//   ],
// })

const azureEmbeddings = new OpenAIEmbeddings({
  azureOpenAIApiKey: process.env.AZ_OPENAI_API_KEY,
  azureOpenAIApiDeploymentName:
    process.env.AZ_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
  azureOpenAIApiInstanceName: process.env.AZ_OPENAI_API_INSTANCE_NAME,
  azureOpenAIApiVersion: process.env.AZ_OPENAI_API_VERSION,
})

// ===== 實例化資料庫，準備後續對話使用 =====
const pineconeStore = await PineconeStore.fromExistingIndex(
  new OpenAIEmbeddings(),
  // azureEmbeddings,
  {
    pineconeIndex,
    textKey: 'text', // default
    namespace: 'chinese-chapter-01',
  },
)

// ===== 實例化有聊天記憶功能的對話鏈 =====
function initChain(prompt) {
  return ConversationalRetrievalQAChain.fromLLM(
    model,
    pineconeStore.asRetriever(5), // k值預設為4，代表回傳前k個最相似的文件
    {
      questionGeneratorTemplate: QA_GENERATOR_PROMPT,
      qaChainOptions: {
        type: 'stuff',
        prompt: PromptTemplate.fromTemplate(prompt),
      },
      callbacks: [new ConsoleCallbackHandler()], // 印出對話鏈事件紀錄
      returnSourceDocuments: false, // 可以設定為 true，會回傳資料庫中查詢到的文件
      verbose: false,
    },
  )
}

const chinese_questions = [
  {
    question:
      '請用至少300字繁體中文回答以下問題:\n請介紹桃花源記的作者生平、詩文風格。',
    select_prompt: QA_PROMPT,
  },
  {
    question:
      '請用至少300字繁體中文回答以下問題:\n請列出桃花源記詩文全文，並白話說明文章解析。',
    select_prompt: OPEN_PROMPT,
  },
  {
    question:
      '請用至少300字繁體中文回答以下問題:\n請歸納出本文出現的成語，並說明成語釋義。',
    select_prompt: QA_PROMPT,
  },
  {
    question:
      '請用至少300字繁體中文回答以下問題:\n請出三題與本文內容相關的考題，題型分別為選擇題、問答題、填充題。考題方向可考形音義、成語、作者文化、文本涵義等。',
    select_prompt: NORMAL_PROMPT,
  },
  {
    question:
      '請用至少300字繁體中文回答以下問題:\n請列出過去與本文有關的高中學測的歷屆考題與答案解析。',
    select_prompt: NORMAL_PROMPT,
  },
]

async function askMultipleQuestions(questions) {
  const chatChain = []
  for (let i = 0; i < questions.length; i++) {
    const chatChainItem = await initChain(questions[i].select_prompt).call({
      question: questions[i].question,
      chat_history: '', // 獨立提問，不需要聊天紀錄
    })
    chatChain.push({
      question_info: questions[i],
      answer: chatChainItem.text,
      costInfo: costInfo[i],
    })
  }
  return chatChain
}

const chatChainRes = await askMultipleQuestions(chinese_questions)
// console.log('chatChainRes: ', chatChainRes)

saveDocsLogs(chatChainRes, 'test-single-chinese')
