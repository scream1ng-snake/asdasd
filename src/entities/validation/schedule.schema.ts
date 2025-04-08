import { object, string, array, date } from 'yup';

const Slot = object().shape({
  id: string().required(),
  hhmm: string().required(),
})

const SlotArray = array().of(Slot)

const scheduleSchemes = {
  creating: object({
    author: string().required(),
    sunday: SlotArray,
    monday: SlotArray,
    tuesday: SlotArray,
    wentsday: SlotArray,
    thursday: SlotArray,
    friday: SlotArray,
    saturday: SlotArray,
  }),
  register: object({
    masterId: string().required(),
    clientId: string().required(),
    slotId: string().required(),
    date: date().required() 
  }),
  addScheduleChange: object({
    date: date().required(),
    slots: SlotArray,
    scheduleId: string().required()
  })
}
export default scheduleSchemes