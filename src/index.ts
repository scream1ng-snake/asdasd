import { BotApp } from './telegram/telegramBot'
import { ServerApp } from './server'

export const server = new ServerApp()
export const tgBot = new BotApp()