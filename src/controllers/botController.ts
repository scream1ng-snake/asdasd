import TelegramBot, { Message } from "node-telegram-bot-api"
import usersService, { ICreateUser } from "../services/usersService"
import { Logger } from "../utils/logger"
import { keyboards } from "../utils/telegramKeyboards"
import { messages } from "../telegram/messages/messages"
import createMessage, { replace } from "../telegram/messages/createMessage"
import { roles } from "../entities/user.entity"
import { botService } from "../services/botService"

class botController {
  logger = new Logger('tg bot controller')
  async createUser(message: Message, bot: TelegramBot) { // todo оптимизировать скорость
    if(message.from?.id) {
      const telegram_id = String(message.from.id)
      const { first_name, last_name } = message.from
      const userExists = await usersService.getByTgId(telegram_id)
      const images = await botService.getProfileImage(bot, message.chat.id)
      const data: ICreateUser = {
        telegram_id,
        firstName: first_name ?? null,
        lastName: last_name ?? null,
        phone_number: message.contact?.phone_number ?? null,
        birthday: null,
        bigImage: images?.big || null,
        smallImage: images?.small ?? null,
        role: userExists ? userExists.role : roles.user,
      }

      const keyboard = {
        reply_markup: keyboards.home(telegram_id)
      }
      const adminKeyboard = {
        reply_markup: keyboards.master(telegram_id)
      }
      
      if(userExists) {
        const updated = await usersService.updateByTgID(telegram_id, data)
        if(updated) {
          if(updated.role === 'master') {
            bot.sendMessage(message.chat.id, createMessage(replace.$USER$, updated.firstName ?? 'админ', messages.welcomeMaster), adminKeyboard)
          } else {
            bot.sendMessage(message.chat.id, createMessage(replace.$USER$, updated.firstName ?? 'пользователь', messages.hello), keyboard)
          }
        }
      } else {
        const created = await usersService.create(data)
        if(created.role === 'master') {
          bot.sendMessage(message.chat.id, createMessage(replace.$USER$, created.firstName ?? 'админ', messages.welcomeMaster), adminKeyboard)
        } else {
          bot.sendMessage(message.chat.id, createMessage(replace.$USER$, created.firstName ?? 'пользователь', messages.welcome), keyboard)
        }
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