import { makeAutoObservable } from "mobx";
import { useTelegram } from "../hooks";
import { Logger } from "../utils";
import { AuthStore } from "./auth.store";
import config from "../utils/config";
import { ToastStore } from "./toasts.store";
import { SlotsStore } from "./slots.store";
import { AdminStore } from "./admin.store";

export class RootStore {
  logger = new Logger('Root-Store')

  toasts = new ToastStore()
  auth = new AuthStore(this)
  admin = new AdminStore(this)
  slots = new SlotsStore(this)
  constructor() {
    makeAutoObservable(this)
    
    this.instance = this.whereAppRunning()
    this.auth.authorize(this.instance)
  }

  private whereAppRunning = (): AppInstance => {
    if(config.emit_tg_in_browser) return 'telegram'

    const tg = useTelegram()
    if(tg.platform && tg.platform !== "unknown") {
      this.logger.log('мы в телеграме')
      return 'telegram'
    }
    this.logger.log('мы в браузере')
    return 'browser'
  }
  
  instance: AppInstance = 'browser'
  set appType(type: AppInstance) {
    this.instance = type
  }
}

export const AppInstances = {
  telegram: 'telegram',
  browser: 'browser',
} as const
export type AppInstance = typeof AppInstances[keyof typeof AppInstances]