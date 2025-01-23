import { dataSource } from "../db/dataSource"
import { Slot } from "../entities/slotEntity"
import { HttpError } from "../utils/http.error"
import { Logger } from "../utils/logger"
import usersService from "./usersService"
import { StatusCodes } from 'http-status-codes'

type ISlot = {
  start: Date,
  end: Date,
}

class slotService {
  private logger = new Logger('slot service')
  create = async (author: UUID, slot: ISlot) => {
    const repo = dataSource.getRepository(Slot)

    const user = await usersService.getOne(author)
    if(user?.role === 'master') {
      const createdSlot = repo.create(slot)
      const saved = await repo.save(createdSlot)
      this.logger.log(`слот ${saved.id} создан`)
      return saved
    } else {
      throw new HttpError(StatusCodes.FORBIDDEN, 'создание слотов доступно только мастеру')
    }
  }

  getOne = async (id: UUID) => {
    const repo = dataSource.getRepository(Slot)
    return await repo.findOne({ where: { id }})
  }

  getAllByAuthor = async (authorUUID: UUID) => {
    const repo = dataSource.getRepository(Slot)
    return await repo.findOne({ where: { master: { id: authorUUID } }})
  }

  getAllByCostumer = async (costumerID: UUID) => {
    const repo = dataSource.getRepository(Slot)
    return await repo.findOne({ where: { master: { id: costumerID } }})
  }
}

type UUID = string
export default new slotService()