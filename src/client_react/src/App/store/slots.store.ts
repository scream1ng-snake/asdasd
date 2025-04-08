
import { Request } from "../utils/request"
import { http } from "../utils/http"
import { Logger } from "../utils/logger"
import { Popup, type WeekDay } from '../utils'
import type { Schedule, Slot } from "../../../../entities/schedule.entity"
import { AxiosError } from "axios"
import { ToastStore } from "./toasts.store"
import type { User } from "../../../../entities/user.entity"
import { AuthStore } from "./auth.store"
import { makeAutoObservable } from "mobx"
import { RootStore } from "./root.store"
import Booking from "../../../../entities/booking.entity"

export class SlotsStore {
  confirmSlotPopup = new Popup<{ slot: Slot, date: string, master: User }>()
  constructor(readonly root: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true })
  }
  logger = new Logger('slots-store')

  masters: User[] = []
  setMasters = (masters: User[]) => {
    this.masters = masters
  }

  mastersAvailableSlots = new Map<UUID, DaySlots[]>()

  loadAvailableSlots = new Request(async (setState, masterId: string) => {
    setState('LOADING')
    try {
      const daySlots: DaySlots[] = await http.get('/schedule/available', { masterId }) 
      if(Array.isArray(daySlots)) {
        setState('COMPLETED')
        this.logger.log('слоты загружены')
        return daySlots
      }
      return []
    } catch (err) {
      setState('FAILED')
      this.handleError(err)
    }
  })

  getSlotById(id: UUID) {
    let slot = null
    Array.from(this.mastersAvailableSlots.values()).forEach(item => {
      item.forEach(daySlots => {
        const targetSlot = daySlots.slots.find(slot => slot.id === id)
        if(targetSlot) slot = targetSlot
      })
    })
    return slot as Optional<Slot>
  }

  
  loadMasters = new Request(async (setState) => {
    setState('LOADING')
    try {
      let masters: User[] = await http.get('/users/master')
      if(Array.isArray(masters)) {
        const currentUser = this.root.auth.user
        if(currentUser?.role === 'master') {
          masters = masters.filter(m => m.id !== currentUser.id)
        }
        this.setMasters(masters)
        for (const master of masters) {
          const slots = await this.loadAvailableSlots.run(master.id)
          if(Array.isArray(slots)) {
            this.mastersAvailableSlots.set(master.id, slots)
          }
        }
        setState('COMPLETED')
      }
    } catch (error) {
      setState('FAILED')
      this.handleError(error)
    }
  })

  private handleError(err: unknown) {
    console.error(err)
    if(err instanceof AxiosError) {
      if(err.response?.data?.error) 
        this.root.toasts.show(err.response.data.error, 'danger')
    }
  }

  getUser = (uuid: UUID) => this.masters.find(master => master.id === uuid) as User


  bookingSlot = new Request(async (setState, masterId: UUID, slot: Slot, date: string) => {
    try {
      setState('LOADING')
      const client = this.root.auth.user
      if(!client) throw new Error('Не авторизован')
      if(masterId === client.id) throw new Error('Нельзя самому себе заказывать')

      
      const response: Booking = await http.post("/schedule/booking", {
        masterId,
        clientId: client.id,
        slotId: slot.id,
        hhmm: slot.hhmm,
        date
      })
      if(response) {
        this.root.auth.user?.bookings.push(response)
        this.confirmSlotPopup.close()
        setState('COMPLETED')
        this.root.toasts.show('Успешно забронили окошко', 'success')
        this.loadMasters.run()
      }
    } catch (error) {
      setState('FAILED')
      this.handleError(error)
    }
  })
}

export type DaySlots = {
  dayOfWeek: WeekDay,
  date: string,
  slots: Slot[]
}