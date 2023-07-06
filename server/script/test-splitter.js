import { writeFile } from 'node:fs'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import {
  RecursiveCharacterTextSplitter,
  CharacterTextSplitter,
} from 'langchain/text_splitter'
import { Document } from 'langchain/document'
import saveDocsLogs from './save-docs-logs.js'

const filePath = './docs/fake-story-03.pdf'
const text = `Hi.\n\nI'm Harrison.\n\nHow? Are? You?\nOkay then f f f f.
This is a weird text to write, but gotta test the splittingggg some how.\n\n
Bye!\n\n-H.`

const document = new Document({ pageContent: text })

const pdfLoader = new PDFLoader(filePath)
const rawPDFDocs = await pdfLoader.load()

const pdfSplitter = new CharacterTextSplitter({
  chunkSize: 300,
  chunkOverlap: 60,
})

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 12,
  chunkOverlap: 6,
})

const pdfDocs = await pdfSplitter.splitDocuments(rawPDFDocs)
const docs = await textSplitter.splitDocuments([document])
console.log(`PDF split ${pdfDocs.length} documents.`)
console.log(`Text split ${docs.length} documents.`)

saveDocsLogs(rawPDFDocs, 'raw-pdf')
// saveDocsLogs(pdfDocs, 'pdf')
// saveDocsLogs(docs, 'text')
