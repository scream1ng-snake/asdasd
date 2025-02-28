import { observer } from "mobx-react-lite";
import { FC } from "react";
import { Container } from "react-bootstrap";
import { useStore } from "../../hooks";
import Booking from "../../../../../entities/booking.entity";
import { Image, List, NoticeBar, Space } from "antd-mobile";
import { formatDate } from "../../utils";


export const WaitingMasters: FC = observer(() => {
  const { user } = useStore().auth
  if (!user) return null

  if (user.role === 'master') return null

  let plannedBookings: Booking[] = []
  let pastBookings: Booking[] = []
  user.bookings.forEach(book => {
    Date.now() < new Date(book.date).getTime()
      ? plannedBookings.push(book)
      : pastBookings.push(book)
  })
  return <Container>
    {!plannedBookings.length
      ? <NoticeBar
        color='info'
        shape='rounded'
        icon={null}
        content={'Ожидающих записей нет'}
      />
      : <List>
        {plannedBookings.map(pb => {
          return (
            <List.Item
              key={pb.id}
              prefix={
                <Image
                  src={pb.master.bigImage || ''}
                  style={{ borderRadius: 20 }}
                  fit='cover'
                  width={40}
                  height={40}
                />
              }
              description={'Френч 2500'}
              extra={formatDate(pb.date as unknown as string)}
            >
              {pb.master.firstName + ' ' + pb.master.lastName}
            </List.Item>
          )
        })}
      </List>
    }
  </Container>
})