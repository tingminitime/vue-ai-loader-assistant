import express from 'express'
import { chat } from '../chatHandler.js'

const router = express.Router()

/* GET users listing. */
router.post('/', async (req, res, next) => {
  const { message, history } = req.body
  console.log('Receive message: ', message)

  if (!message) {
    res.status(400).json({
      success: false,
      message: 'Message is required'
    })
    return
  }

  try {
    const result = await chat(message, history)

    res.status(200).json({
      data: result,
      success: true
    })
  } catch (err) {
    console.error(err)
  }
})

export default router
