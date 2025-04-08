import { observer } from "mobx-react-lite";
import { FC } from "react";
import { Container } from "react-bootstrap";
import { useStore } from "../../hooks";
import Booking from "../../../../../entities/booking.entity";
import { List, NoticeBar } from "antd-mobile";
import { BookForMaster } from "../common/Book";


export const WaitingClients: FC = observer(() => {
  const { auth: { user } } = useStore()
  if (!user) return null

  if (user.role === 'user') return null

  let plannedBookings: Booking[] = []
  let pastBookings: Booking[] = []
  user.books.forEach(book => {
    Date.now() < new Date(book.date).getTime()
      ? plannedBookings.push(book)
      : pastBookings.push(book)
  })
  return <Container className="p-0">
    {!plannedBookings.length
      ? <NoticeBar
        color='info'
        shape='rounded'
        icon={null}
        content={'Ожидающих клиентов нет'}
      />
      : <List style={{ borderRadius:20, overflow: 'hidden' }}>
        {plannedBookings.map(pb => <BookForMaster key={pb.id} record={pb} />)}
      </List>
    }
  </Container>
})