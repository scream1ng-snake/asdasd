import TelegramBot, { Message } from "node-telegram-bot-api"
import usersService from "../services/usersService"
import { Logger } from "../utils/logger"
import { keyboards } from "../utils/telegramKeyboards"
import { messages } from "../telegram/messages/messages"
import createMessage, { replace } from "../telegram/messages/createMessage"
import { roles } from "../entities/userEntity"

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
        role: userExists ? userExists.role : roles.user
      }

      const keyboard = {
        reply_markup: keyboards.home
      }
      if(userExists) {
        const updated = await usersService.updateByTgID(telegram_id, data)
        if(updated) bot.sendMessage(message.chat.id, createMessage(replace.$USER$, updated.firstName ?? 'пользователь', messages.hello), keyboard)
      } else {
        const created = await usersService.create(data)
        bot.sendMessage(message.chat.id, createMessage(replace.$USER$, created.firstName ?? 'пользователь', messages.welcome), keyboard)
      }
    }
  }

  
  async getAbout(message: Message, bot: TelegramBot) {
    if(message.from?.id) {
      bot.sendMessage(message.chat.id, messages.about)
    }
  }
}
export default new botController()