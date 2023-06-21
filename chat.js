import { ConversationalRetrievalQAChain } from 'langchain/chains'
import { OpenAI } from 'langchain/llms/openai'

const model = new OpenAI({
  temperature: 0.1
})

const chain = ConversationalRetrievalQAChain.fromLLM(model)
