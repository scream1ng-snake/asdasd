import { makeAutoObservable } from "mobx";
import { AppInstance, RootStore } from "./root.store";
import { http, Logger } from "../utils";
import { useTelegram } from "../hooks";
import { User } from '../../../../entities/user.entity'

export const AuthStates = {
  CHECKING_AUTH: "CHECKING_AUTH",
  AUTHORIZED: "AUTHORIZED",
  AUTHORIZING: "AUTHORIZING",
  NOT_AUTHORIZED: "NOT_AUTHORIZED",
  ERROR_AUTH: "ERROR_AUTH",
} as const;
export type AuthStateType = typeof AuthStates[keyof typeof AuthStates];

export class AuthStore {
  logger = new Logger('Auth-Store')
  root: RootStore;
  state: AuthStateType = AuthStates.CHECKING_AUTH;

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this)
  }

  get isAuth() { return this.state === AuthStates.AUTHORIZED }
  get isFailed() { return this.state === AuthStates.NOT_AUTHORIZED }
  get isAuthorizing() { return this.state === AuthStates.AUTHORIZING }
  get isCheckingAuth() { return this.state === AuthStates.CHECKING_AUTH }

  setState(state: AuthStateType) {
    this.state = state;
  }

  user: Optional<User> = null
  setUser(user: Optional<User>) {
    this.user = user
  }

  authorize = async (app: AppInstance) => { 
    try {
      switch (app) {
        case 'telegram':
          const { userId } = useTelegram()
          const searchParams = Object.fromEntries(new URLSearchParams(window.location.search))
          
          if(('tgId' in searchParams) || userId) {
            const tgId = (searchParams.tgId || userId)
            const user: Optional<User> = await http.get('/users', { tgId })
            if(user) {
              this.setUser(user)
              this.setState('AUTHORIZED')
              this.root.toasts.show(`Привет, ${user.firstName} 👋🖐😃`)
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
