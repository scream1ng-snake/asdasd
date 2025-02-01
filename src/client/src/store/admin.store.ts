import { get, writable, type Writable } from 'svelte/store';  
import { Logger } from '../utils/logger'
import type { IUser, User } from '../../../entities/user.entity'
import type { Optional } from '../../../utils/types';
import type { AppInstance } from './root.store';
import { http } from '../utils/http';
import { useTelegram } from '../utils/telegram.hook';
import { toastsStore } from './toasts.store';
import { Popup } from '../utils/popup';
import type { WeekDay } from '../../../utils/time';
import type { ICreateSchedule, ISchedule, Schedule } from '../../../entities/schedule.entity';
import { authStore } from './auth.store';
import { Request } from '../utils/request';

class AdminStore {
  logger = new Logger('admin-store')

  editScheduleDayPopup = new Popup()

  selectedDay: Optional<WeekDay> = null
  editScheduleDay = (day: WeekDay) => {
    this.selectedDay = day
    this.editScheduleDayPopup.open()
  }
  editingSchedule: Writable<Optional<ISchedule>> = writable(null)

  constructor() {
    authStore.user.subscribe(state => {
      if(state && state.schedule) {
        this.editingSchedule.update(() => ({
          ...state.schedule as Schedule
        }))
      }
    })
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
    this.editingSchedule.update(() => schedule)
  }


  addSlot = new Popup()

  saveSchedule = async () => {
    const newSchedule = get(this.editingSchedule)
    const currentUser = get(authStore.user)
    if(newSchedule && currentUser) {
      const schedule = { 
        author: currentUser.id, 
        ...newSchedule
      }
      await this.updateCreateSchedule.run(schedule)
      this.editScheduleDayPopup.close()
    }
  }

  updateCreateSchedule = new Request(async (setState, schedule: ICreateSchedule) => {
    try {
      setState("LOADING")
      const result: Schedule = await http.post("/schedule", schedule)
      if(result) {
        authStore.user.update(user => {
          if(user?.schedule) user.schedule = result
          return user
        })
        setState("COMPLETED")
      }
    } catch (error) {
      setState("FAILED")
      console.error(error)
    }
  })
}  

export const adminStore = new AdminStore();