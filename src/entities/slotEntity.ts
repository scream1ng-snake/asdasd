// @ts-nocheck
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm"
import { Optional, UUID } from "../utils/types"
import { User } from "./userEntity"


@Entity()
export class Slot {
  @PrimaryGeneratedColumn("uuid")
  id: UUID

  @Column('date')
  start: Date

  @Column('date')
  end: Date

  @ManyToOne(() => User, user => user.bookedSlots)
  costumer: User

  @ManyToOne(() => User, user => user.createdSlots)
  master: User
}
