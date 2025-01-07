import { dataSource } from "../db/dataSource"
import { User } from "../entities/userEntity"
import { Logger } from "../utils/logger"
type IUser = Omit<User, 'id'>

class userService {
  private logger = new Logger('users service')
  create = async (user: IUser) => {
    const repo = dataSource.getRepository(User)
    const createdUser = repo.create(user)
    const saved = await repo.save(createdUser)
    this.logger.log(`пользователь ${saved.firstName} создан`)
    return saved
  }

  getOne = async (id: UUID) => {
    const repo = dataSource.getRepository(User)
    return await repo.findOne({ where: { id }})
  }

  getByTgId = async (telegram_id: string) => {
    const repo = dataSource.getRepository(User)
    return await repo.findOne({ where: { telegram_id }})
  }

  updateByTgID = async (telegram_id: string, newData: IUser) => {
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