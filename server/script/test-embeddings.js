import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import dotenv from 'dotenv'

dotenv.config()

const embeddings = new OpenAIEmbeddings()

const res = await embeddings.embedQuery('1')

console.log(res)
