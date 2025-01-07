import TelegramBot, { Message } from "node-telegram-bot-api"
import usersService from "../services/usersService"
import { Logger } from "../utils/logger"
import { userStages } from "../entities/userEntity"

class botController {
  logger = new Logger('tg bot controller')
  async createUser(message: Message, bot: TelegramBot) {
    if(message.from?.id) {
      const telegram_id = String(message.from.id)
      const { first_name, last_name } = message.from
      const userExists = await usersService.getByTgId(telegram_id)
      const data = {
        telegram_id,
        firstName: first_name ?? null,
        lastName: last_name ?? null,
        phone_number: message.contact?.phone_number ?? null,
        birthday: null,
        stage: userExists?.stage ?? userStages.onHome 
      }

      const keyboard = {
        reply_markup: {
          keyboard: [[{ text: 'записаться' }, { text: 'каталог' }], [{ text: 'мои чеки' }], [{ text: 'связь' }]]
        }
      }
      if(userExists) {
        const updated = await usersService.updateByTgID(telegram_id, data)
        if(updated) bot.sendMessage(message.chat.id, 'Давно не виделись, ' + updated.firstName, keyboard)
      } else {
        const created = await usersService.create(data)
        bot.sendMessage(message.chat.id, 'Добро пожаловать, ' + created.firstName, keyboard)
      }
    }
  }
}
export default new botController()