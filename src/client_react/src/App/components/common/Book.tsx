import { List, Space } from "antd-mobile";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { Ava } from "./Ava";
import { formatDate } from "../../utils";
import Booking from "../../../../../entities/booking.entity";
import { useStore } from "../../hooks";

const Tower: FC<haveChildren> = ({ children }) =>
  <Space style={{ "--gap": '0' }} direction='vertical' align='center'>
    {children}
  </Space>

export const BookForClient: FC<{ record: Booking }> = observer(({ record }) => {
  return <List.Item
    key={record.id}
    clickable={false}
    prefix={<Ava.small src={record.master.bigImage} />}
    description={'Френч 2500 todo'}
    extra={
      <Tower>
        <span>{formatDate(record.date as unknown as string)}</span>
        <span style={{ fontSize: 20 }}>{record.hhmm}</span>
      </Tower>
    }
  >
    {record.master.firstName + ' ' + record.master.lastName}
  </List.Item>
})

export const BookForMaster: FC<{ record: Booking }> = observer(({ record }) => {
  const { admin } = useStore()
  const watch = () => admin.watchBook.watch(record)
  return <List.Item
    key={record.id}
    clickable={false}
    onClick={watch}
    prefix={<Ava.small src={record.client.bigImage} />}
    description={'Френч 2500'}
    extra={
      <Tower>
        <span>{formatDate(record.date as unknown as string)}</span>
        <span style={{ fontSize: 20 }}>{record.hhmm}</span>
      </Tower>
    }
  >
    {record.client.firstName + ' ' + record.client.lastName}
  </List.Item>
})