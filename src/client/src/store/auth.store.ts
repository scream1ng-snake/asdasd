import { writable, type Writable } from 'svelte/store';  
import { Logger } from '../utils/logger'
import type { IUser } from '../../../entities/userEntity'
import type { Optional } from '../../../utils/types';
import type { AppInstance } from './root.store';
import { http } from '../utils/http';
import { useTelegram } from '../utils/telegram.hook';


export const AuthStates = {
  CHECKING_AUTH: "CHECKING_AUTH",
  AUTHORIZED: "AUTHORIZED",
  AUTHORIZING: "AUTHORIZING",
  NOT_AUTHORIZED: "NOT_AUTHORIZED",
  ERROR_AUTH: "ERROR_AUTH",
} as const;
export type AuthState = typeof AuthStates[keyof typeof AuthStates];

class AuthStore {
  constructor() {
    this.state.subscribe(state => this.logger.log(state))
  }
  logger = new Logger('auth-store')

  state: Writable<AuthState> = writable(AuthStates.CHECKING_AUTH) 
  setState = (newState: AuthState) => {
    this.state.update(() => newState)
  }

  user: Writable<Optional<IUser>> = writable(null)
  setUser = (user: Optional<IUser>) => {
    this.user.update(() => user)
  }

  authorize = async (app: AppInstance) => { 
    try {
      switch (app) {
        case 'telegram':
          const { userId } = useTelegram()
          const searchParams = Object.fromEntries(new URLSearchParams(location.search))
          
          if(('tgId' in searchParams) || userId) {
            const tgId = (searchParams.tgId || userId)
            const user: Optional<IUser> = await http.get('/users', { tgId })
            if(user) {
              this.setUser(user)
              this.setState('AUTHORIZED')
            } else {
              this.setUser(null)
              this.setState('NOT_AUTHORIZED')
            }
          } else {
            throw new Error('Баганутая авторизация')
          }
          break
        case 'browser':
          throw new Error('browser auth not implemented')
          // todo browser auth strtegy with tokens
          break;
      }
    } catch (error) {
      this.setUser(null)
      this.setState('ERROR_AUTH')
      console.error(error)
    }
  }
}  

export const authStore = new AuthStore();