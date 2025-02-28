import { makeAutoObservable } from "mobx"

type ToastType = 'danger' | 'success' | 'info'
export type Toast = {
  message: string
  type: ToastType
}

export class ToastStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }
  messages: Toast[] = []

  show(message: string, type: ToastType = 'info') {
    const newToast = { message, type }
    this.messages = [...this.messages, newToast]
    const index = this.messages.length - 1
    let timeout: ReturnType<typeof setTimeout> | null = null;
    timeout = setTimeout(() => {
      this.closeMessage(index)
    }, 3000);
  }

  closeMessage(index: number) {
    this.messages.splice(index, 1)
  }
}  
