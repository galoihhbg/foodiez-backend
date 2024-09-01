import express from 'express'
import CommentController from '../app/controllers/CommentController.js'

const router = express.Router()

router.get('/', CommentController.getComments)

export default router