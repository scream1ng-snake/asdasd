import { UUID } from "../utils/types"

export const botCommands = {
  slashStart: '/start',
  begin: 'начать',
  link: 'связь'
} as const
export type botCommand = typeof botCommands[keyof typeof botCommands]
