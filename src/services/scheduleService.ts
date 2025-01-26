import { dataSource } from "../db/dataSource"
import { ISchedule, Schedule } from "../entities/schedule.entity"
import { HttpError } from "../utils/http.error"
import { Logger } from "../utils/logger"
import usersService from "./usersService"

class ScheduleService {
  private logger = new Logger('slot service')
  createSchedule = async (author: UUID, payload: ISchedule) => {
    const repo = dataSource.getRepository(Schedule)

    const user = await usersService.getOne(author)
    if(user?.role === 'master') {
      const existingSchedule = await repo.findOne({ where: { master: { id: author }}})
      if(existingSchedule) {
        const updated = repo.merge(existingSchedule, payload)
        const saved = await repo.save(updated)
        this.logger.log(`расписание ${saved.id} обновлено`)
        return saved
      } else {
        const created = repo.create(payload)
        created.master = user
        const saved = await repo.save(created)
        this.logger.log(`расписание ${saved.id} создано`)
        return saved
      }
    } else {
      throw new HttpError(403, 'создание слотов доступно только мастеру')
    }
  }

  getSchedule = async (author: UUID) => {
    const master = await usersService.getOne(author)
    if(!master) throw new HttpError(400, 'такого мастера нет')

    if(master.role !== 'master') throw new HttpError(400, 'расписание есть только у мастера')

    return master.schedule
  }
  getScheduleByTgId = async (tgId: string) => {
    const master = await usersService.getByTgId(tgId)
    if(!master) throw new HttpError(400, 'такого мастера нет')

    if(master.role !== 'master') throw new HttpError(400, 'расписание есть только у мастера')

    return master.schedule
  }

  // register = async (costumerID: UUID, slotID: UUID) => {
  //   const repo = dataSource.getRepository(Slot)
  //   const user = await usersService.getOne(costumerID)
  //   const slot = await this.getOne(slotID)

  //   if(!user) throw new HttpError(400, 'user not found')
  //   if(!slot) throw new HttpError(400, 'slot not found')

  //   if(costumerID === slot.master.id) throw new HttpError(421, 'unprocessible entity')

  //   slot.costumer = user
  //   return await repo.save(slot)
  // }




}

type UUID = string
export default new ScheduleService()