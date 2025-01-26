import TelegramBot from "node-telegram-bot-api"

class BotService {
  getProfileImage = async (bot: TelegramBot, chatId: number) => {
    const chat = await bot.getChat(chatId)
    if (chat.photo) {
      const [small, big] = await Promise.all([
        bot.getFileLink(chat.photo.small_file_id),
        bot.getFileLink(chat.photo.big_file_id),
      ])
      if(small && big) return { small, big }
    }
  }
}
export const botService = new BotService()