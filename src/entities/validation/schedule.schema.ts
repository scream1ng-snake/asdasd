import { object, string, array } from 'yup';

const Slot = object().shape({
  id: string().required(),
  from: string().required(),
  to: string().required(),
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
}
export default scheduleSchemes