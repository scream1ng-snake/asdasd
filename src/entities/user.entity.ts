import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn } from "typeorm"
import { Optional, UUID } from "../utils/types"
import { Schedule } from "./schedule.entity"
import Booking from "./booking.entity"


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
  bigImage: Optional<string>
  smallImage: Optional<string>
}

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn("uuid") id!: UUID
  @Column('text', { nullable: true }) telegram_id!: Optional<string>
  @Column('text', { nullable: true }) firstName!: Optional<string>
  @Column('text', { nullable: true }) lastName!: Optional<string>
  @Column('timestamptz', { nullable: true }) birthday!: Optional<Date>
  @Column('text', { nullable: true }) phone_number!: Optional<string>
  @Column('text', { nullable: true }) bigImage!: Optional<string>
  @Column('text', { nullable: true }) smallImage!: Optional<string>
  @Column('text', { default: roles.user }) role: Role = roles.user

  /** это расписание, его могут иметь только мастера */
  @OneToOne(() => Schedule, s => s.master) 
  @JoinColumn()
  schedule!: Schedule | null
  
  /** это брони, бронировать могут только пользователи */
  @OneToMany(() => Booking, b => b.client)
  bookings!: Booking[]

  /** те же брони, но от лица мастера */
  @OneToMany(() => Booking, b => b.master)
  books!: Booking[]
}
