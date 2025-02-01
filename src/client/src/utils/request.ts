import { writable, type Writable } from "svelte/store";

export const LoadStates = {
  INITIAL: "INITIAL",
  LOADING: "LOADING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const

export type LoadState = typeof LoadStates[keyof typeof LoadStates];

type F<B extends unknown[], O> = (setState: (newState: LoadState) => void, ...args: B) => Promise<O>
export class Request<A extends unknown[], B> {
  run
  state: Writable<LoadState> = writable('INITIAL')
  setState = (s: LoadState) => {
    this.state.update(() => s)
  }
  constructor(run:F<A, B>) {
    this.run = (...args: A) => run(this.setState, ...args)
    
  }
}