import { get, writable, type Writable } from "svelte/store"
import { Request } from "../utils/request"
import { http } from "../utils/http"
import { Logger } from "../utils/logger"
import type { WeekDay } from '../../../utils/time'
import type { Schedule, Slot } from "../../../entities/schedule.entity"
import { AxiosError } from "axios"
import { toastsStore } from "./toasts.store"
import type { User } from "../../../entities/user.entity"
import type { Optional, UUID } from "../../../utils/types"
import { authStore } from "./auth.store"

class SlotsStore {
  logger = new Logger('slots-store')

  masters: Writable<User[]> = writable([])
  setMasters = (masters: User[]) => {
    this.masters.update(() => masters)
  }

  mastersAvailableSlots = writable(new Map<UUID, DaySlots[]>())

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

  
  loadMasters = new Request(async (setState) => {
    setState('LOADING')
    try {
      let masters: User[] = await http.get('/users/master')
      if(Array.isArray(masters)) {
        const currentUser = get(authStore.user)
        if(currentUser?.role === 'master') {
          masters = masters.filter(m => m.id !== currentUser.id)
        }
        this.setMasters(masters)
        for (const master of masters) {
          const slots = await this.loadAvailableSlots.run(master.id)
          if(Array.isArray(slots)) {
            this.mastersAvailableSlots.update(map => {
              map.set(master.id, slots)
              return map
            })
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
        toastsStore.show(err.response.data.error, 'danger')
    }
  }

  getUser = (uuid: UUID) => get(this.masters).find(master => master.id === uuid) as User

  
}

export type DaySlots = {
  dayOfWeek: WeekDay,
  date: string,
  slots: Slot[]
}
export const slotsStore = new SlotsStore()