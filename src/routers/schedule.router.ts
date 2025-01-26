import { Router } from 'express'
import asyncHandler from '../middlewares/asyncHandle'
import scheduleController from '../controllers/schedule.controller'

const scheduleRouter = Router()
scheduleRouter.post('/', asyncHandler(scheduleController.createSchedule))

export default scheduleRouter