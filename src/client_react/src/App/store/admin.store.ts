import { Logger } from '../utils/logger'
import { Request, http, Popup, type WeekDay } from '../utils';
import type { ICreateSchedule, ISchedule, Schedule } from '../../../../entities/schedule.entity';
import { RootStore } from './root.store';
import { makeAutoObservable, reaction } from 'mobx';
import Booking, { IConfirmBooking } from '../../../../entities/booking.entity';
import { AxiosError } from 'axios';


export class AdminStore {
  logger = new Logger('admin-store')

  editScheduleDayPopup = new Popup()
  watchBook = new Popup<Booking>()

  selectedDay: Optional<WeekDay> = null
  editScheduleDay = (day: WeekDay) => {
    this.selectedDay = day
    this.editScheduleDayPopup.open()
  }
  editingSchedule: Optional<ISchedule> = null

  constructor(readonly root: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true })
    reaction(
      () => this.root.auth.user,
      (state) => {
        if(state && state.schedule) {
          this.editingSchedule = state.schedule
        }
      }
    )
  }

  createEmptySchedule = () => {
    const schedule: ISchedule = {
      sunday: [], 
      monday: [], 
      tuesday: [], 
      wentsday: [],
      thursday: [], 
      friday: [], 
      saturday: [],
    } 
    this.editingSchedule = schedule
    this.saveSchedule()
  }


  addSlot = new Popup()

  saveSchedule = async () => {
    const master = this.root.auth.user
    if(this.editingSchedule && master && master.role === 'master') {
      const schedule = { 
        author: master.id, 
        ...this.editingSchedule
      }
      this.updateCreateSchedule.run(schedule).then(() => {
        this.root.toasts.show('Сохранили', 'success')
        this.editScheduleDayPopup.close()
      }).catch(() => {
        this.root.toasts.show('Не получается сохранить', 'danger')
      })
    }
  }

  updateCreateSchedule = new Request(async (setState, schedule: ICreateSchedule) => {
    try {
      setState("LOADING")
      const result: Schedule = await http.post("/schedule", schedule)
      if(result) {
        this.root.auth.user!.schedule = result
        setState("COMPLETED")
      }
    } catch (error) {
      setState("FAILED")
      console.error(error)
    }
  })

  confirmBooking = new Request(async (setState, payload: IConfirmBooking) => {
    try {
      setState("LOADING")
      const result: Booking = await http.post("schedule/confirmBooking", payload)
      if(result) {
        const targetBooking = this.root.auth.user?.books.find(book => 
          book.id === payload.bookingId
        )
        if(targetBooking) targetBooking.confirmed = true
        setState("COMPLETED")
        this.watchBook.close()
        this.root.toasts.show('Подтверждено')
      }
    } catch (error) {
      setState("FAILED")
      if(error instanceof AxiosError) {
        if(error.response?.data.error) this.root.toasts.show(error.response?.data.error, 'danger')
      }
      this.watchBook.close()
      console.error(error)
    }
  })
}  
