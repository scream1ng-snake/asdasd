import { writable, type Writable } from 'svelte/store';

type ToastType = 'danger' | 'success' | 'info'
export type Toast = {
  message: string
  type: ToastType
}

class ToastStore {
  messages: Writable<Toast[]> = writable([])

  show(message: string, type: ToastType = 'info') {
    let allMessages: Toast[] = []
    const newToast = { message, type }
    this.messages.update(messages => {
      allMessages = [...messages, newToast]
      return allMessages
    })

    let timeout: ReturnType<typeof setTimeout> | null = null;
    timeout = setTimeout(() => {
      const index = allMessages.indexOf(newToast)
      if (index > -1) {
        this.closeMessage(index);
      }
    }, 3000);
  }

  closeMessage(index: number) {
    this.messages.update(messages => {
      messages.splice(index, 1)
      return messages
    })
  }
}  

export const toastsStore = new ToastStore();