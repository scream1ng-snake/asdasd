import { Router } from 'express'
import asyncHandler from '../middlewares/asyncHandle'
import scheduleController from '../controllers/schedule.controller'

const scheduleRouter = Router()
scheduleRouter.post('/', asyncHandler(scheduleController.createSchedule))
scheduleRouter.get('/available', asyncHandler(scheduleController.getAvailable))
scheduleRouter.post('/booking', asyncHandler(scheduleController.registerSlot))
scheduleRouter.delete('/booking', asyncHandler(scheduleController.deleteBooking))
scheduleRouter.post('/change', asyncHandler(scheduleController.addScheduleChange))
scheduleRouter.post('/confirmBooking', asyncHandler(scheduleController.confirmBooking))

export default scheduleRouter