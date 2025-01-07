const contextColor = '\x1b[32m',
  resetColor = '\x1b[0m'

export class Logger {
  constructor (private readonly context: string) {}
  log(message: string) { 
    console.log(contextColor, `[${this.context}]:`, resetColor, `${message}`) 
  }
}
