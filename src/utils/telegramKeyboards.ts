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
    keyboard: [[{ text: 'Начать' }]]
  },
  home: (tgId: string) => (
    {
      keyboard: [
        [
          { 
            text: 'Записаться', 
            web_app: { 
              url: config.frontHost + frontRoutes["/booking"] + "?tgId=" + tgId 
            } 
          }, 
          { 
            text: 'Каталог', 
            web_app: { 
              url: config.frontHost + frontRoutes["/catalog"] + "?tgId=" + tgId 
            } 
          }
        ], 
        [{ text: 'Мои чеки' }], 
        [{ text: 'Связь' }]
      ]
    }
  ),
  master: (tgId: string) => ({
    keyboard: [
      [
        { 
          text: 'Админка', 
          web_app: { 
            url: config.frontHost + frontRoutes['/admin'] + "?tgId=" + tgId 
          } 
        }
      ]
    ]
  })
}

