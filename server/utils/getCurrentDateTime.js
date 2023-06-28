export default function formatCurrentDateTime() {
  const d = new Date()
  const date = d.toISOString().split('T')[0]
  const time = d.toTimeString().split(' ')[0].split(':').join('')
  const dateTime = `${date}_${time}`
  return dateTime
}
