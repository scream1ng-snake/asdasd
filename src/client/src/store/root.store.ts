// import { writable, type Subscriber, type Writable } from 'svelte/store';  
import { get } from 'svelte/store';
import config from '../utils/config';
import { Logger } from '../utils/logger';
import { useTelegram } from '../utils/telegram.hook';
import { authStore } from './auth.store';
import { slotsStore } from './slots.store';
import { toastsStore } from './toasts.store';

export const AppInstances = {
  telegram: 'telegram',
  browser: 'browser',
} as const
export type AppInstance = typeof AppInstances[keyof typeof AppInstances]

class RootStore {
  logger = new Logger('root-store')
  auth = authStore
  toasts = toastsStore
  slots = slotsStore

  instance: AppInstance = 'browser'
  constructor() {
    this.instance = this.whereAppRunning()
    this.auth.authorize(this.instance).then(() => {
      const state = get(authStore.state)
      const user = get(authStore.user)
      if(user?.id && state === 'AUTHORIZED') {
        this.slots.loadMasters.run()
        // this.slots.loadAvailableSlots.run(user.id)
      }
    })
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
}  

export const rootStore = new RootStore();