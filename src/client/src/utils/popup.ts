import { writable } from "svelte/store"

export class Popup {
  show = writable(false)
  open() {
    this.show.update(() => true)
  }
  close() {
    this.show.update(() => false)
  }

  constructor() {
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
  }
}