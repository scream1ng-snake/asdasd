import { writable, type Writable } from 'svelte/store';



class ToastStore {
  messages: Writable<string[]> = writable([])

  show(text: string) {
    let allMessages: string[] = []
    this.messages.update(messages => {
      allMessages = [...messages, text]
      return allMessages
    })
    const index = allMessages.indexOf(text);

    let timeout: ReturnType<typeof setTimeout> | null = null;
    timeout = setTimeout(() => {
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