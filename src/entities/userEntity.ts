// @ts-nocheck
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"
import { Optional, UUID } from "../utils/types"


export const userStages = {
  onHome: 'onHome',
  onBooking: 'onBooking',
  onCatalog: 'onCatalog',
  onPayment: 'onPayment',
} as const

export type userStage = typeof userStages[keyof typeof userStages]

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

  @Column('text', { default: userStages.onHome })
  stage: userStage = userStages.onHome
}
