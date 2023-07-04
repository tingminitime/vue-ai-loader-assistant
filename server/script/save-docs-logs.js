import { writeFile } from 'node:fs'
import getCurrentDateTime from '../utils/getCurrentDateTime.js'

export default function saveDocsLogs(docs, type = 'pdf') {
  const logData = JSON.stringify(
    { log: docs, log_time: new Date().toLocaleString('en-US') },
    null,
    2
  )

  const dateTime = getCurrentDateTime()

  writeFile(`./logs/${type}-loader_${dateTime}.json`, logData, err => {
    if (err) {
      console.error(err)
      return
    }
    console.log('Log file has been saved.')
  })
}
