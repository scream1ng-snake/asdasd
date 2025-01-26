import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UUID } from "../utils/types";
import { User } from "./user.entity";

@Entity()
class Booking {
  @PrimaryGeneratedColumn('uuid')
  id!: UUID

  @Column('text')
  dd_mm_yyyy!: string

  @Column('text')
  slotId!: UUID

  @ManyToOne(() => User, u => u.id)
  client!: User
}

export default Booking