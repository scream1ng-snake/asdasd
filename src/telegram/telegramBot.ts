import TelegramBot from "node-telegram-bot-api"
import { Logger } from "../utils/logger"
import config from "../config"
import botController from "../controllers/botController"
import { botCommands } from "./types"
import scheduleService from "../services/scheduleService"
import usersService from "../services/usersService"



export class BotApp {
  logger = new Logger('telegram bot')
  public bot: TelegramBot
  constructor() {
    const token = config.tg.botToken
    if(!token) {
      console.error('No tg token')
      process.exit(1)
    }
    this.bot = new TelegramBot(token, { polling: true })
    this.configureBot()
    this.logger.log('bot started' )
  }

  private configureBot() {
    this.bot.on('message', async (msg) => {
      if(msg.text) {
        if(this.botRoutes[msg.text]) {
          this.botRoutes[msg.text.toLocaleLowerCase()](msg, this.bot)
        } else {
          this.bot.sendMessage(msg.chat.id, 'бот такое не умеет(')
        }
      }
    })
    this.bot.on('callback_query', async query => {  
      const chatId = query.message?.chat.id  

      if(query.data && chatId) {
        if(query.data && typeof query.data === 'string') {
          const [command, entityId] = query.data.split("/")
          const user = await usersService.getByTgId(chatId.toString())
          switch (command) {
            case 'booking_confirm':
              if(user) {
                await scheduleService.confirmBooking({ bookingId: entityId, masterId: user.id })
                this.bot.answerCallbackQuery(query.id)
              }
              break;
            case 'booking_delete':
              if(user) {
                await scheduleService.deleteBooking({ bookingId: entityId, masterId: user.id })
                this.bot.answerCallbackQuery(query.id)
              }
              break;
          }
          this.bot.editMessageReplyMarkup({} as any, {  
            chat_id: chatId,  
            message_id: query.message!.message_id  
          });  
        }
      }
    });  
  }

  private botRoutes: Record<string, (msg: TelegramBot.Message, bot: TelegramBot) => Promise<any>> = {
    [botCommands.slashStart]: botController.createUser,
    [botCommands.begin]: botController.createUser,
    [botCommands.link]: botController.getAbout
  }
}
