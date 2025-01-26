import { Request, Response } from 'express'
import { HttpError } from '../utils/http.error';
import scheduleSchemes from '../entities/validation/schedule.schema';
import { ICreateSchedule, ISchedule } from '../entities/schedule.entity';
import scheduleService from '../services/scheduleService';


class scheduleController {
  getSchedule = (req: Request, res: Response) => {
    if(req.query.id) return scheduleService.getSchedule(req.query.id as string)
    if(req.query.tgId) return scheduleService.getSchedule(req.query.tgId as string)
    throw new HttpError(400, 'no tgId or id param')
  }
  createSchedule = (req: Request, res: Response) => {
    scheduleSchemes.creating.validateSync(req.body)
    const body: ICreateSchedule = req.body

    return scheduleService.createSchedule(body.author, body)
  }

  // deleteSlot = async (req: Request, res: Response) => {
  //   if(req.params.id) return slotService.deleteSlot(req.params.id)
  //   throw new HttpError(400, 'slot id param not found') 
  // }
  // /** забронировать слот */
  // registerSlot = (req: Request, res: Response) => {
  //   slotSchemes.register.validateSync(req.body)
  //   const { costumerID, slotID }: IRegisterSlot = req.body
  //   return slotService.register(costumerID, slotID)
  // }
}

export default new scheduleController()