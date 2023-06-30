import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { writeFileSync } from 'node:fs'
import multer from 'multer'

const router = express.Router()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './docs')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(pdf)$/)) {
      return cb(new Error('Please upload a PDF'))
    }
    cb(null, true)
  }
})

router.post('/pdf', upload.single('pdf-file'), async (req, res, next) => {
  console.log(req)
  res.status(200).json({
    success: true
  })
})

export default router
