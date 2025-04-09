import moment from "moment"
import { dataSource } from "../db/dataSource"
import { ISchedule, Schedule, Slot } from "../entities/schedule.entity"
import { HttpError } from "../utils/http.error"
import { Logger } from "../utils/logger"
import { formatDate, inMilliseconds, maxTime, weekDays } from "../utils/time"
import usersService from "./usersService"
import { range } from "../utils/range"
import Booking, { IConfirmBooking, IRegisterSlot } from "../entities/booking.entity"
import ScheduleChange, { IScheduleChangeCreate } from "../entities/scheduleChanges,enitty"
import { StatusCodes } from "http-status-codes"
import { tgBot } from ".."

class ScheduleService {
  private logger = new Logger('slot service')
  createSchedule = async (author: UUID, payload: ISchedule) => {
    const repo = dataSource.getRepository(Schedule)

    const user = await usersService.getOne(author)
    if(user?.role === 'master') {
      const existingSchedule = await repo.findOne({ where: { master: { id: author }}})
      if(existingSchedule) {
        const updated = repo.merge(existingSchedule, payload)
        const saved = await repo.save(updated)
        this.logger.log(`расписание ${saved.id} обновлено`)
        return saved
      } else {
        const created = repo.create(payload)
        created.master = user
        const saved = await repo.save(created)
        this.logger.log(`расписание ${saved.id} создано`)
        return saved
      }
    } else {
      throw new HttpError(403, 'создание слотов доступно только мастеру')
    }
  }

  async getAvailableSlots(masterId: UUID, start = new Date(), daysCount = 14) {
    // debugger
    // валидируем хозяйна
    const master = await usersService.getOne(masterId)

    if (!master || master.role !== 'master') 
      throw new HttpError(400, 'такого мастера нет')
    
    if (!master.schedule) 
      throw new HttpError(400, `мастер ${master.getName()} еще не создал расписание`) 
    
    let result = []
    const days = range(daysCount)

    // грузим сразу брони и изменения в расписании
    const [bookings, changes] = await Promise.all([
      this.getBookings(masterId, start, daysCount),
      this.getChanges(master.schedule.id, start, daysCount)
    ])

    for (const day of days) {
      const now = new Date()
      const targetDate = new Date(start.getTime() + (day * inMilliseconds.day))
      const targetDay = weekDays[targetDate.getDay()]
      const isToday = moment(targetDate).isSame(moment(now), 'day')
      const targetDaySlots = isToday
        ? master.schedule![targetDay].filter(slot => {
          const mm = now.getMinutes()
          const hh = now.getHours()
          const [slothh, slotmm] = slot.hhmm.split(":").map(Number)
          return (hh * 60 + mm + inMilliseconds.hour) < (slothh * 60 + slotmm) 
        })
        : master.schedule![targetDay]

      const hasScheduleChange = changes.find(scheduleChange => {
        return moment(scheduleChange.date).isSame(moment(targetDate), 'day')
      })
      
      let slots: Slot[] = []
      
      if(hasScheduleChange) {
         for (const slot of hasScheduleChange.slots) {
          const alreadyBooked = bookings.find(booking => 
            moment(booking.date).isSame(moment(targetDate), 'day') && booking.hhmm === slot.hhmm
          )
          if (!alreadyBooked) slots.push(slot)
        }
      } else {
        for (const slot of targetDaySlots) {
          const alreadyBooked = bookings.find(booking => 
            moment(booking.date).isSame(moment(targetDate), 'day') && booking.hhmm === slot.hhmm
          )
          if (!alreadyBooked) slots.push(slot)
        }
      }


      
      result.push({
        dayOfWeek: targetDay,
        date: targetDate,
        slots
      })
    }
    return result
  }

  private async getBookings(masterId: UUID, startDate = new Date(), daysLimit = 14) {
    const repo = dataSource.getRepository(Booking)
    repo.find({ where: { master: { id: masterId }} })

    const endDate = new Date()
    endDate.setDate(startDate.getDate() + daysLimit)  

    const bookings = await repo
      .createQueryBuilder('booking')
      .where('booking.masterId = :masterId', { masterId })
      .andWhere('booking.date >= :startDate', { startDate })  
      .andWhere('booking.date <= :endDate', { endDate })  
      .getMany();  

    return bookings; 
  }

  private async getChanges(scheduleId: UUID, startDate = new Date(), daysLimit = 14) {
    const changesRepo = dataSource.getRepository(ScheduleChange)

    const endDate = new Date()
    endDate.setDate(startDate.getDate() + daysLimit)

    return changesRepo
      .createQueryBuilder("schedule_change")  
      .where("schedule_change.date >= :startDate", { startDate })  
      .andWhere("schedule_change.date <= :endDate", { endDate })
      .andWhere("schedule_change.scheduleId = :scheduleId", { scheduleId })
      .getMany()
  }


  register = async (dto: IRegisterSlot) => {
    debugger
    const [master, client] = await Promise.all([
      usersService.getOne(dto.masterId), 
      usersService.getOne(dto.clientId),
    ])

    if (!master || master.role !== 'master') 
      throw new HttpError(400, 'такого мастера нет')
    
    if (!master.schedule) 
      throw new HttpError(400, `мастер ${master.getName()} еще не создал расписание`) 

    if (!client || client.role !== 'user')
      throw new HttpError(400, 'такого пользвоателя нет')

    // грузим сразу брони и изменения в расписании
    const [bookings, changes] = await Promise.all([
      this.getBookings(master.id, new Date(dto.date), 0),
      this.getChanges(master.schedule.id, new Date(dto.date), 0)
    ])

    const hasChanges = changes.find(change => 
      moment(change.date).isSame(moment(dto.date), 'day')
    )
    let slotExists: Slot | undefined
    if(hasChanges) {
      slotExists = hasChanges.slots.find(slot => slot.hhmm === dto.hhmm)
      if(!slotExists) 
        throw new HttpError(
          StatusCodes.BAD_REQUEST, 
          'нет слота с таким slotId в изменениях расписания'
        )
    } else {
      const targetDay = weekDays[new Date(dto.date).getDay()]
      const targetDaySlots = master.schedule![targetDay]
      slotExists = targetDaySlots.find(slot => slot.hhmm === dto.hhmm)
      if(!slotExists) 
        throw new HttpError(
          StatusCodes.BAD_REQUEST, 
          'нет слота с таким slotId в базовом расписании'
        )
    }

    const alreadyBooked = bookings.find(book => book.hhmm === dto.hhmm)
    if(alreadyBooked) 
      throw new HttpError(
        StatusCodes.BAD_REQUEST, 
        'слот уже занят'
      )

    const repo = dataSource.getRepository(Booking)
    const booking = repo.create({
      hhmm: dto.hhmm,
      date: new Date(dto.date),
      master,
      client
    })
    const saved = await repo.save(booking)
    if(master.telegram_id) 
      tgBot.bot.sendMessage(
        master.telegram_id,
        `${client.getName()} забронировал(-а) окошко на ${formatDate(saved.date.toISOString())} в ${saved.hhmm}`,
        {  
          reply_markup: {  
            inline_keyboard: [  
              [  
                {  
                    text: 'Подтвердить запись ✅',  
                    callback_data: 'booking_confirm/' + booking.id, 
                },
                {  
                    text: 'Удалить запись ❌',  
                    callback_data: 'booking_delete/' + booking.id
                }  
              ]  
            ]  
          }  
        }
      )
    if(client.telegram_id) 
      tgBot.bot.sendMessage(
        client.telegram_id, 
        `Вы записались к ${master.getName()} на ${formatDate(saved.date.toISOString())} в ${saved.hhmm}`
      )

    this.logger.log(`${saved.client.getName()} забронировал слот ${slotExists.hhmm} у ${saved.master.getName()}`)
    return saved
  }

  addScheduleChange = async (data: IScheduleChangeCreate) => {
    const repo = dataSource.getRepository(Schedule)
    const schedule = await repo.findOne({ where: { id: data.scheduleId }})
    if(!schedule) 
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'распсиание не найдено'
      )

    const maxTimeOnDay = maxTime(new Date(data.date))

    const changesRepo = dataSource.getRepository(ScheduleChange)
    const created = changesRepo.create({
      date: maxTimeOnDay,
      slots: data.slots,
      schedule
    })
    return changesRepo.save(created)
  }

  confirmBooking = async (payload: IConfirmBooking) => {
    const repo = dataSource.getRepository(Booking)
    const targetBooking = await repo.findOne({ 
      where: { id: payload.bookingId },
      relations: ['master', 'client']
    })
    if(!targetBooking) 
      throw new HttpError(404, 'бронь не найдена')
    if(targetBooking.master.id !== payload.masterId) 
      throw new HttpError(403, 'Вы не можете подтверждать записи')

    if(targetBooking.confirmed) return targetBooking
    targetBooking.confirmed = true
    const saved = await repo.save(targetBooking)
    if(targetBooking.client.telegram_id) 
      tgBot.bot.sendMessage(
        targetBooking.client.telegram_id, 
        `Запись подтверждена ${formatDate(targetBooking.date.toISOString())} ${targetBooking.hhmm}`
      )
    if(targetBooking.master.telegram_id)
      tgBot.bot.sendMessage(targetBooking.master.telegram_id, 'Вы подтвердили')
    this.logger.log('Запись подтверждена ' + saved.id)
    return saved
  }

  deleteBooking = async (payload: IConfirmBooking) => {
    const repo = dataSource.getRepository(Booking)
    const targetBooking = await repo.findOne({ 
      where: { id: payload.bookingId },
      relations: ['master', 'client']
    })
    if(!targetBooking) 
      throw new HttpError(404, 'бронь не найдена')
    if(targetBooking.master.id !== payload.masterId) 
      throw new HttpError(403, 'Вы не можете удалять записи')

    const deleted = await repo.remove(targetBooking)
    if(deleted.client.telegram_id) {
      tgBot.bot.sendMessage(
        deleted.client.telegram_id,
        `Запись отменена на ${formatDate(deleted.date.toISOString())} ${deleted.hhmm}`
      )
    }
    if(targetBooking.master.telegram_id)
      tgBot.bot.sendMessage(targetBooking.master.telegram_id, 'Вы удалили')
    this.logger.log('Запись удалена ' + deleted.id)
    return deleted
  }
}

type UUID = string
export default new ScheduleService()