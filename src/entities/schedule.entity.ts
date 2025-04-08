import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { UUID } from "../utils/types"
import { User } from "./user.entity"
import ScheduleChange from "./scheduleChanges,enitty"

export interface Slot {
  id: UUID
  hhmm: string
}

export interface ISchedule {
  sunday: Slot[]
  monday: Slot[]
  tuesday: Slot[]
  wentsday: Slot[]
  thursday: Slot[]
  friday: Slot[]
  saturday: Slot[]
}

export type ICreateSchedule = ISchedule & { author: UUID }



@Entity()
export class Schedule implements ISchedule {
  @PrimaryGeneratedColumn("uuid") id!: UUID
  @Column("json") sunday!: Slot[]
  @Column("json") monday!: Slot[]
  @Column("json") tuesday!: Slot[]
  @Column("json") wentsday!: Slot[]
  @Column("json") thursday!: Slot[]
  @Column("json") friday!: Slot[]
  @Column("json") saturday!: Slot[]
  @OneToOne(() => User, u => u.schedule)
  master!: User

  @OneToMany(() => ScheduleChange, sc => sc.schedule)
  changes!: ScheduleChange[]
}
