import TelegramBot from "node-telegram-bot-api"
import { Logger } from "../utils/logger"
import config from "../config"
import botController from "../controllers/botController"

export const botCommands = {
  slashStart: '/start',
  begin: 'начать'
} as const
export type botCommand = typeof botCommands[keyof typeof botCommands]

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
  }

  private botRoutes: Record<string, (msg: TelegramBot.Message, bot: TelegramBot) => Promise<any>> = {
    [botCommands.slashStart]: botController.createUser,
    [botCommands.begin]: botController.createUser,
    'sta': botController.watchMe
  }
}