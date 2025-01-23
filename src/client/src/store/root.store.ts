// import { writable, type Subscriber, type Writable } from 'svelte/store';  
import { Logger } from '../utils/logger';
import { useTelegram } from '../utils/telegram.hook';
import { authStore } from './auth.store';

export const AppInstances = {
  telegram: 'telegram',
  browser: 'browser',
} as const
export type AppInstance = typeof AppInstances[keyof typeof AppInstances]

class RootStore {
  logger = new Logger('root-store')
  auth = authStore

  instance: AppInstance = 'browser'
  constructor() {
    this.instance = this.whereAppRunning()
    this.auth.authorize(this.instance)
  }


  private whereAppRunning = (): AppInstance => {
    const tg = useTelegram()
    if(tg.platform && tg.platform !== "unknown") {
      this.logger.log('мы в телеграме')
      return 'telegram'
    }
    this.logger.log('мы в браузере')
    return 'browser'
  }
}  

export const rootStore = new RootStore();