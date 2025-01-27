import moment from "moment"
import util from "util"



const weekDays = [
  'sunday',
  'monday',
  'tuesday',
  'wentsday',
  'thursday',
  'friday',
  'saturday',
]

const inMilliseconds = {
  second: 1000,
  minute: 60 * 1000,
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
}

const scheduleWeek = {
  sunday: [
    { id: 1, from: '16:00', to: '17:00' },
    { id: 2, from: '17:00', to: '18:00' },
  ],
  monday: [
    { id: 3, from: '16:00', to: '17:00' },
  ],
  tuesday: [
    { id: 4, from: '16:00', to: '17:00' },
  ],
  wentsday: [
    { id: 5, from: '16:00', to: '17:00' },
  ],
  thursday: [
    { id: 6, from: '16:00', to: '17:00' },
  ],
  friday: [
    { id: 7, from: '16:00', to: '17:00' },
  ],
  saturday: [],
}
console.log(JSON.stringify(scheduleWeek))

const changesInSchedule = [
  { 
    dd_mm_yy: '25_01_2025',
    slots: [
      { id: 8, from: '11:00', to: '12:00' },
      { id: 9, from: '12:00', to: '13:00' },
      { id: 10, from: '13:00', to: '14:00' },
    ]
  }
]

const bookings = [
  { dd_mm_yyyy: '24_01_2025', slotId: 7, name: 'cat' },
  { dd_mm_yyyy: '25_01_2025', slotId: 8, name: 'tiger' },
  { dd_mm_yyyy: '25_01_2025', slotId: 9, name: 'cat' },
]

function bookSlot(dd_mm_yyyy: string, slotId: number, name: string) {
  // смотрим не забронили ли уже
  const alreadyBooked = bookings.find(booking => 
    booking.dd_mm_yyyy === dd_mm_yyyy && booking.slotId === slotId
  )

  // смотрим какой день недели это будет 
  const [day, month, year] = dd_mm_yyyy.split("_").map(Number)
  const targetDate = new Date(year, month - 1, day)
  const targetDay = weekDays[targetDate.getDay()]

  // смотрим есть такой слот в этот день в расписании
  const slotInSchedule = scheduleWeek[targetDay as keyof typeof scheduleWeek].find(slot => 
    slot.id === slotId
  )

  // смотрим есть ли изменения в этот день
  const hasScheduleChanges = changesInSchedule.find(change => 
    change.dd_mm_yy === dd_mm_yyyy
  )

  const slotInScheduleChanges = hasScheduleChanges?.slots.find(slot =>
    slot.id === slotId
  )
  
  if(alreadyBooked) return console.log('слот уже занят')
  if(slotInSchedule && hasScheduleChanges) console.log('слот уже не доступен, расписание поменялось')

  if((slotInScheduleChanges && !slotInSchedule) || (!slotInScheduleChanges && slotInSchedule)) {
    console.log('слот добавлен')
    bookings.push({ dd_mm_yyyy, slotId, name })
    return { dd_mm_yyyy, slotId, name }
  }
  return console.log('непредвиденый случай')
}

function getAvailableSlots(start = new Date(), daysCount = 14) {
  return new Array(daysCount).fill(null).map((_, index) => {
    const targetDate = new Date(start.getTime() + (index * inMilliseconds.day))
    const targetDay = weekDays[targetDate.getDay()]
    const slots = scheduleWeek[targetDay as keyof typeof scheduleWeek]
    const dd_mm_yyyy = moment(targetDate).format('DD_MM_YYYY')
    return {
      targetDay,
      dd_mm_yyyy,
      slots: slots.map((slot) => {
        const alreadyBooked = bookings.find(booking => 
          booking.dd_mm_yyyy === dd_mm_yyyy && booking.slotId === slot.id
        )
        if (!alreadyBooked) return slot 
      }).filter(Boolean)
    }
  })
}
console.log(util.inspect(getAvailableSlots(), false, null, true))

bookSlot('25_01_2025', 10, 'GAGI')

console.log(util.inspect(getAvailableSlots(), false, null, true))