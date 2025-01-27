import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UUID } from "../utils/types";
import { Schedule, Slot } from "./schedule.entity";

export interface IScheduleChangeCreate {
  date: Date
  slots: Slot[]
  scheduleId: UUID
}

@Entity()
class ScheduleChange {
  @PrimaryGeneratedColumn("uuid")
  id!: UUID

  @Column({ type: 'timestamptz' })
  date!: Date

  @Column("json")
  slots!: Slot[]

  @ManyToOne(() => Schedule, s => s.id)
  schedule!: Schedule
}

export default ScheduleChange