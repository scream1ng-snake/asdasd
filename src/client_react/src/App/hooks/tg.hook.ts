
declare global {
  interface Window {
    Telegram: any;
  }
}

const tg = window?.Telegram?.WebApp ?? null;

export function useTelegram() {
  const colors = {
    bg_color: tg.themeParams.bg_color as string,
    text_color: tg.themeParams.text_color as string,
    hint_color: tg.themeParams.hint_color as string,
    button_color: tg.themeParams.button_color as string,
    button_text_color: tg.themeParams.button_text_color as string,
    secondary_bg_color: tg.themeParams.secondary_bg_color as string,
  }
  const CloudStorage = {
    setItem(key: string, value: string) {
      return tg.CloudStorage.setItem(key, value)
    },
    getItem(key: string) {
      return tg.CloudStorage.getItem(key) as string
    },
  }
  
  const isUserAvailable = () => Boolean(tg?.initDataUnsafe?.user?.id)
  const isInTelegram = () => tg.platform && tg.platform !== "unknown"
  
  return {
    tg, 
    colors,
    user: tg?.initDataUnsafe?.user, 
    // userId: tg?.initDataUnsafe?.user?.id ?? '5780004797', 
    userId: tg?.initDataUnsafe?.user?.id, 
    queryId: tg?.initDataUnsafe?.query_id, 
    colorScheme: tg?.colorScheme,
    CloudStorage,
    isInTelegram, 
    isUserAvailable, 
    platform: tg.platform as "web" | "telegram" | "tdesktop" | "android" | "ios" | "unknown"
  }
}