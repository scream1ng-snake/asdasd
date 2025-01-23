import { dataSource } from "../db/dataSource"
import { IUser, roles, User } from "../entities/userEntity"
import { Logger } from "../utils/logger"
export type ICreateUser = Omit<IUser, 'id'>

class userService {
  private logger = new Logger('users service')
  create = async (user: ICreateUser) => {
    const repo = dataSource.getRepository(User)
    const count = await repo.count()
    if(!count) {
      user.role = roles.master
    }
    const createdUser = repo.create(user)
    const saved = await repo.save(createdUser)
    this.logger.log(`${saved.role} ${saved.firstName} создан`)
    return saved
  }

  getOne = async (id: UUID) => {
    const repo = dataSource.getRepository(User)
    return await repo.findOne({ 
      where: { id }, 
      relations: ['bookedSlots', 'createdSlots']
    })
  }

  getByTgId = async (telegram_id: string) => {
    const repo = dataSource.getRepository(User)
    return await repo.findOne({ 
      where: { telegram_id }, 
      relations: ['bookedSlots', 'createdSlots']
    })
  }

  updateByTgID = async (telegram_id: string, newData: ICreateUser) => {
    const repo = dataSource.getRepository(User)
    const user = await this.getByTgId(telegram_id)
    if(user) {
      repo.merge(user, newData)
      return await repo.save(user)
    } else {
      return undefined
    }
  }
}

type UUID = string
export default new userService()