import { makeAutoObservable } from "mobx"
import { LoadStatesType } from "./load-states"

type F<B extends unknown[], O> = (setState: (newState: LoadStatesType) => void, ...args: B) => Promise<O>
export class Request<A extends unknown[], B> {
  run
  state: LoadStatesType = 'INITIAL'
  setState = (s: LoadStatesType) => {
    this.state = s
  }
  constructor(run:F<A, B>) {
    this.run = (...args: A) => run(this.setState, ...args)
    makeAutoObservable(this)
  }
}
