import express from 'express'
import RestaurantController from '../app/controllers/RestaurantController.js'

const router = express.Router()

router.get('/reviews', RestaurantController.getRestaurantByID)
router.post('/index', RestaurantController.getRestaurants)

export default router