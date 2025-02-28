import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";
import Wrapper from "../components/layout/Wrapper";
import { Container } from "react-bootstrap";
import { useStore } from "../hooks";
import { AutoCenter, Button, Card, Divider, Image, List, NavBar, NoticeBar, Space } from "antd-mobile";
import { rusWeekDays } from "../utils";
import moment from "moment";
import { User } from "../../../../entities/user.entity";
import { DaySlots } from "../store";
import { Ava, Toasts } from "../components";
import AdaptivePopup from "../components/common/Popup";
import { Slot } from "../../../../entities/schedule.entity";
import { toJS } from "mobx";

export const BookingPage: FC = observer(() => {
  const { slots } = useStore()

  useEffect(() => {
    slots.loadMasters.run()
  }, [])
  return <Wrapper>
    <Container className="pt-3">
      <Toasts className="mb-3" />
      {slots.masters.map(master => {
        const daySlots = slots.mastersAvailableSlots.get(master.id)
        return <MasterSchedule
          key={master.id}
          daySlots={daySlots}
          onChoose={(slot: Slot, date: string) => {
            slots.confirmSlotPopup.watch({ slot, date, master })
          }}
          master={master}
        />
      })}
    </Container>
  </Wrapper>
})

type Props = {
  master: User
  daySlots?: DaySlots[]
  onChoose: (slot: Slot, date: string) => void
}
function MasterSchedule(props: Props) {
  const { master, daySlots, onChoose } = props

  return <Card style={{ borderRadius: 25 }}>
    <ConfirmBookingPopup />
    <AutoCenter>
      <Ava.big src={master.bigImage} />
    </AutoCenter>
    <AutoCenter style={{ fontSize: 20 }}>
      {master.firstName + ' ' + master.lastName}
    </AutoCenter>
    {daySlots && daySlots.length
      ? daySlots.map(daySlot => {
        if (!daySlot.slots.length) return null
        return <div key={daySlot.date}>
          <Divider>
            {rusWeekDays[daySlot.dayOfWeek] + ' ' + moment(daySlot.date).format("DD MM YYYY")}
          </Divider>
          <Space style={{ width: '100%' }} wrap justify='center'>
            {!daySlot.slots.length
              ? 'Пусто'
              : null
            }
            {daySlot.slots.map(slot => {
              return <Button
                key={slot.id}
                shape="rounded"
                fill="outline"
                onClick={() => onChoose(slot, daySlot.date)}
              >
                {slot.from + ' - ' + slot.to}
              </Button>
            })}
          </Space>
        </div>
      })
      : <NoticeBar
        color='info'
        shape='rounded'
        icon={null}
        content={'Мастер еще не создал расписание'}
      />
    }
  </Card>
}

const ConfirmBookingPopup: FC = observer(() => {
  const { slots } = useStore()


  const data = toJS(slots.confirmSlotPopup.content)
  if (!data) return null

  const { master, slot, date } = data

  const onConfirm = () => {
    slots.bookingSlot.run(master.id, slot, date).then(slots.confirmSlotPopup.close)
  }

  const Between: FC<haveChildren> = props =>
    <Space style={{ width: '100%' }} justify='between'>
      {props.children}
    </Space>
  return <AdaptivePopup
    visible={slots.confirmSlotPopup.show}
    onClose={slots.confirmSlotPopup.close}
  >
    <Card title='Подвтердить?' bodyClassName="pt-0">
      <List>
        <List.Item>
          <AutoCenter>
            <Space align='center'>
              <Ava.small src={master.smallImage} />
              <span>{master.firstName + ' ' + master.lastName}</span>
            </Space>
          </AutoCenter>
        </List.Item>
        <List.Item>
          <Between>
            <span>Дата:</span>
            <span>{moment(date).format('DD-MM-YYYY')}</span>
          </Between>
        </List.Item>
        <List.Item>
          <Between>
            <span>окошко:</span>
            <span>{slot.from + ' - ' + slot.to}</span>
          </Between>
        </List.Item>
        <Button 
          loading={slots.bookingSlot.state === 'LOADING'} 
          shape='rounded' 
          className="w-100" 
          color='primary' 
          onClick={onConfirm}
        >
          Записаться
        </Button>
      </List>
    </Card>
  </AdaptivePopup>
})