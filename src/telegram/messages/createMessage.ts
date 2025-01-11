export const replace = {
  '$USER$': '$USER$',
} as const


type From = typeof replace[keyof typeof replace]

function createMessage(key: typeof replace.$USER$, username: string, text: string): string

function createMessage(replace: From, to: string, text: string): string {
  return text.split(replace).join(to)
}

export default createMessage
