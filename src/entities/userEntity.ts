// @ts-nocheck
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { Optional, UUID } from "../utils/types"
import { Slot } from "./slotEntity"


export const roles = {
  user: 'user',
  master: 'master',
} as const

export type Role = typeof roles[keyof typeof roles]

export interface IUser {
  id: UUID
  telegram_id: Optional<string>
  firstName: Optional<string>
  lastName: Optional<string>
  birthday: Optional<Date>
  phone_number: Optional<string>
  role: Role
  bookedSlots: Slot[]
  createdSlots: Slot[]
}

@Entity()
export class User implements IUser {
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

  @OneToMany(() => Slot, slot => slot.costumer)  
  bookedSlots: Slot[]

  @OneToMany(() => Slot, slot => slot.master)  
  createdSlots: Slot[]
}
