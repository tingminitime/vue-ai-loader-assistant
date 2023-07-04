import { ConsoleCallbackHandler } from 'langchain/callbacks'
import { ConversationalRetrievalQAChain } from 'langchain/chains'
import { OpenAI } from 'langchain/llms/openai'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { PromptTemplate } from 'langchain/prompts'
import dotenv from 'dotenv'
import usePinecone from '../utils/pinecone/usePinecone.js'
import { SYSTEM_PROMPT, QA_PROMPT } from '../utils/prompt.js'
import saveDocsLogs from './save-docs-logs.js'

dotenv.config()

const { pineconeIndex, PineconeStore } = await usePinecone()

// In Node.js defaults to process.env.OPENAI_API_KEY
const model = new OpenAI({
  temperature: 0.1, // default is 0.7
  modelName: 'gpt-3.5-turbo-0613', // Defaults is "text-davinci-003"
  callbacks: [new ConsoleCallbackHandler()],
})

const pineconeStore = await PineconeStore.fromExistingIndex(
  new OpenAIEmbeddings(),
  {
    pineconeIndex,
    textKey: 'text', // default
    namespace: 'fake-story-02',
  },
)

const chain = ConversationalRetrievalQAChain.fromLLM(
  model,
  pineconeStore.asRetriever(),
  {
    questionGeneratorTemplate: SYSTEM_PROMPT,
    // qaTemplate: QA_PROMPT,
    qaChainOptions: {
      type: 'map_reduce',
      combinePrompt: PromptTemplate.fromTemplate(QA_PROMPT),
    },
    callbacks: [new ConsoleCallbackHandler()],
    // returnSourceDocuments: true,
  },
)

const question1 = '故事的名稱是?'
const question2 = '故事裡面的人物有哪些?'

const firstChatRes = await chain
  .call(
    {
      question: question1,
      chat_history: '',
    },
    // [new ConsoleCallbackHandler()]
  )
  .catch(err => console.error(err))

console.log(firstChatRes)

const secondChatRes = await chain
  .call(
    {
      question: question2,
      chat_history: `${question1}\n${firstChatRes.text}`,
    },
    // [new ConsoleCallbackHandler()]
  )
  .catch(err => console.error(err))

console.log(secondChatRes)

// saveDocsLogs({ firstChatRes, secondChatRes }, 'chat')
