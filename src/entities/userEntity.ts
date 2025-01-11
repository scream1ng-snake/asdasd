// @ts-nocheck
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"
import { Optional, UUID } from "../utils/types"


export const roles = {
  user: 'user',
  master: 'master',
} as const

export type Role = typeof roles[keyof typeof roles]

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: UUID

  @Column('text', { nullable: true })
  telegram_id: Optional<string>

  @Column('text', { nullable: true })
  firstName: Optional<string>

  @Column('text', { nullable: true })
  lastName: Optional<string>

  @Column('date', { nullable: true })
  birthday: Optional<Date>

  @Column('text', { nullable: true })
  phone_number: Optional<string>

  @Column('text', { default: roles.user })
  role: Role = roles.user
}
