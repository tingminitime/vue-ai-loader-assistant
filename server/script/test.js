import { writeFile } from 'node:fs'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import getCurrentDateTime from '../utils/getCurrentDateTime.js'

const filePath = './docs/fake-story-02.pdf'
const dateTime = getCurrentDateTime()

const pdfLoader = new PDFLoader(filePath, { splitPages: false })
const rawPDFDocs = await pdfLoader.load()
console.log(rawPDFDocs)

writeFile(
  `./logs/raw-pdf-docs_${dateTime}.json`,
  JSON.stringify(rawPDFDocs, null, 2),
  err => {
    if (err) {
      console.error(err)
      return
    }
    console.log('Raw PDF file has been saved.')
  }
)

// const pdfSplitter = new RecursiveCharacterTextSplitter({
//   chunkSize: 300,
//   chunkOverlap: 60
// })
// const pdfDocs = await pdfSplitter.splitDocuments(rawPDFDocs)
// console.log(`Split ${pdfDocs.length} documents.`)

// const pdfDocsLog = JSON.stringify(
//   { log: pdfDocs, log_time: new Date().toLocaleString('en-US') },
//   null,
//   2
// )

// writeFile(`./logs/pdf-loader_${dateTime}.json`, pdfDocsLog, err => {
//   if (err) {
//     console.error(err)
//     return
//   }
//   console.log('Log file has been saved.')
// })
