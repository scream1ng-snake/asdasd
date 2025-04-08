import { Request, Response } from 'express'
import { HttpError } from '../utils/http.error';
import scheduleSchemes from '../entities/validation/schedule.schema';
import { ICreateSchedule } from '../entities/schedule.entity';
import scheduleService from '../services/scheduleService';


class scheduleController {
  createSchedule = (req: Request, res: Response) => {
    scheduleSchemes.creating.validateSync(req.body)
    const body: ICreateSchedule = req.body

    return scheduleService.createSchedule(body.author, body)
  }

  getAvailable = (req: Request, res: Response) => {
    if(req.query.masterId) 
      return scheduleService.getAvailableSlots(req.query.masterId as string)

    throw new HttpError(400, 'no masterId')
  }

  /** забронировать слот */
  registerSlot = (req: Request, res: Response) => {
    scheduleSchemes.register.validateSync(req.body)
    return scheduleService.register(req.body)
  }

  /** добавить изменение в расписание для одного дня */
  addScheduleChange = (req: Request, res: Response) => {
    scheduleSchemes.addScheduleChange.validateSync(req.body)
    return scheduleService.addScheduleChange(req.body)
  }

  confirmBooking = (req: Request, res: Response) => {
    scheduleSchemes.confirmBooking.validateSync(req.body)
    return scheduleService.confirmBooking(req.body)
  }

  deleteBooking = (req: Request, res: Response) => {
    scheduleSchemes.confirmBooking.validateSync(req.body)
    return scheduleService.deleteBooking(req.body)
  }
}

export default new scheduleController()