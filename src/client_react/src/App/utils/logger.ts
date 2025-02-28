export class Logger {
  constructor(readonly context: string) {}
  log(message: string) {
    console.log("%c" + `[${this.context.toUpperCase()}]: ${message}`, "color: DodgerBlue;font-weight:bold;");
  }
}