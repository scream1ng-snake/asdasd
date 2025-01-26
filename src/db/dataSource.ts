import { DataSource } from "typeorm"
import config from "../config"
import { User } from "../entities/user.entity"
import { Schedule } from "../entities/schedule.entity"
import Booking from "../entities/booking.entity"

export const dataSource = new DataSource({
    // @ts-ignore
    type: config.db.type,
    host: config.db.host,
    port: config.db.port,
    username: config.db.user,
    password: config.db.password,
    database: config.db.database,
    entities: [User, Schedule, Booking],
    logging: false,
    synchronize: true,
})
