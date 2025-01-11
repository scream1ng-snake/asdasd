import { InlineKeyboardMarkup, ReplyKeyboardMarkup, ForceReply, ReplyKeyboardRemove } from "node-telegram-bot-api"
import { frontRoutes } from "../routes/frontend_routes"
import config from "../config"
type keyboard = InlineKeyboardMarkup 
  | ReplyKeyboardMarkup 
  | ReplyKeyboardRemove 
  | ForceReply 
  | undefined


export const keyboards = {
  initial: {
    keyboard: [[{ text: 'начать' }]]
  },
  home: {
    keyboard: [
      [
        { text: 'Записаться', web_app: { url: config.frontHost + frontRoutes["/booking"] } }, 
        { text: 'Каталог', web_app: { url: config.frontHost + frontRoutes["/catalog"] } }
      ], 
      [{ text: 'Мои чеки' }], 
      [{ text: 'Связь' }]
    ]
  }
}

