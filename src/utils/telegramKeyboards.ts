import { InlineKeyboardMarkup, ReplyKeyboardMarkup, ForceReply, ReplyKeyboardRemove } from "node-telegram-bot-api"
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
      [{ text: 'записаться' }, { text: 'каталог' }], 
      [{ text: 'мои чеки' }], 
      [{ text: 'связь' }]
    ]
  }
}

