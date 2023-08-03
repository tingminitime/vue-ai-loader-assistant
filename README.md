## vue-ai-assistant

Node.js + LangChainJS + OpenAI / Azure OpenAI

### Technologies

- node.js: v18
- vue
- langchain
- openai

### Client Setup

```bash
cd client
pnpm install
```

### Server Setup

```bash
cd server
npm install
```

#### Ingest document

Document from `server/docs`

```bash
node ingest-data.js
```

#### Environment Variables

Copy `server/.env.example` to `server/.env`.

```env
OPENAI_API_KEY= # OpenAI API Key
PINECONE_API_KEY= # Pinecone API Key
PINECONE_INDEX_NAME= # Pinecone Index Name ( e.g. ai-assistant-test )
PINECONE_ENVIRONMENT= # Pinecone Index Environment (e.g. us-west1-gcp-free)
AZURE_OPENAI_API_KEY= # Azure OpenAI API Key
AZURE_OPENAI_API_INSTANCE_NAME= # Azure OpenAI API Instance Name
AZURE_OPENAI_API_DEPLOYMENT_NAME= # Azure OpenAI API Deployment Name
AZURE_OPENAI_API_VERSION= # Azure OpenAI API Version
AZURE_OPENAI_BASE_PATH= # Azure OpenAI API Base Path
AZURE_OPENAI_EMBEDDINGS_API_DEPLOYMENT_NAME= # Azure OpenAI Embeddings API Deployment Name
```

#### Test Chat

1. Add `logs` folder to `server` directory.

2. Run `node script/test-chat.js`

## Reference

- [实现一个 AI 聊天机器人 LangChain & OpenAI](https://youtu.be/u3yn4UiL6-s)
