import { ConsoleCallbackHandler } from 'langchain/callbacks'
import { ConversationalRetrievalQAChain } from 'langchain/chains'
import { OpenAI } from 'langchain/llms/openai'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import dotenv from 'dotenv'
import usePinecone from './utils/pinecone/usePinecone.js'
import { SYSTEM_PROMPT, QA_PROMPT } from './utils/prompt.js'

dotenv.config()

const { pineconeIndex, PineconeStore } = await usePinecone()

// In Node.js defaults to process.env.OPENAI_API_KEY
const model = new OpenAI({
  temperature: 0.1, // In LangChain default is 0.7
  modelName: 'gpt-3.5-turbo-0613', // In LangChain defaults is "text-davinci-003"
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
    qaTemplate: QA_PROMPT,
    callbacks: [new ConsoleCallbackHandler()],
    // returnSourceDocuments: true,
  },
)

export async function chat(message, history) {
  const res = await chain.call(
    {
      question: message,
      chat_history: history || '',
    },
    [new ConsoleCallbackHandler()],
  )

  return res
}
