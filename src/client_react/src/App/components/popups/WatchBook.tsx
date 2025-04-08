import { observer } from "mobx-react-lite";
import { FC } from "react";
import AdaptivePopup from "../common/Popup";
import { AutoCenter, Button, Card, List, Space } from "antd-mobile";
import { Ava } from "../common";
import { formatDate } from "../../utils";
import { useStore } from "../../hooks";
import { toJS } from "mobx";

type WatchBookP = {
  show: boolean
  close: () => void
}

const Between: FC<haveChildren> = props =>
  <Space style={{ width: '100%' }} justify='between'>
    {props.children}
  </Space>
export const WatchBookForMaster: FC<WatchBookP> = observer(({ show, close }) => {
  const { admin } = useStore()
  const booking = toJS(admin.watchBook.content)
  return <AdaptivePopup
    visible={Boolean(show && booking)}
    onClose={close}
  >
    {!booking
      ? null
      : <Card title='Подвтердить?' bodyClassName="pt-0">
        <List>
          <List.Item>
            <AutoCenter>
              <Space align='center'>
                <Ava.small src={booking.client.smallImage} />
                <span>{booking.client.firstName + ' ' + booking.client.lastName}</span>
              </Space>
            </AutoCenter>
          </List.Item>
          <List.Item>
            <Between>
              <span>Дата:</span>
              <span>{formatDate(booking.date as unknown as string)}</span>
            </Between>
          </List.Item>
          <List.Item>
            <Between>
              <span>окошко:</span>
              <span>{booking.hhmm}</span>
            </Between>
          </List.Item>
          <List.Item>
            {booking.confirmed 
              ? 'Подтверждено'
              : 'Не подтверждено'
            }
          </List.Item>
          {booking.confirmed
            ? null
            : <Button
              shape='rounded'
              className="w-100"
              color='primary'
              disabled={admin.confirmBooking.state === 'FAILED'}
              loading={admin.confirmBooking.state === 'LOADING'}
              onClick={() => {
                admin.confirmBooking.run({
                  masterId: booking.master.id,
                  bookingId: booking.id
                })
              }}
            >
              Подвтердить
            </Button>
          }

        </List>
      </Card>
    }
  </AdaptivePopup>
})