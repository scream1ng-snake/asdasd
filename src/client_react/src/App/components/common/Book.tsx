import { List, Space } from "antd-mobile";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { Ava } from "./Ava";
import { formatDate } from "../../utils";
import Booking from "../../../../../entities/booking.entity";

export const BookForClient: FC<{ record: Booking }> = observer(({ record }) => {
  return <List.Item
    key={record.id}
    prefix={<Ava.small src={record.master.bigImage} />}
    description={'Френч 2500 todo'}
    extra={<Space style={{ "--gap": '0' }} direction='vertical' align='center'>
      <span>{formatDate(record.date as unknown as string)}</span>
      <span style={{ fontSize: 20 }}>{record.hhmm}</span>
    </Space>}
  >
    {record.master.firstName + ' ' + record.master.lastName}
  </List.Item>
})

export const BookForMaster: FC<{ record: Booking }> = observer(({ record }) => {
  return <List.Item
    key={record.id}
    prefix={<Ava.small src={record.client.bigImage} />}
    description={'Френч 2500'}
    extra={<Space style={{ "--gap": '0' }} direction='vertical' align='center'>
      <span>{formatDate(record.date as unknown as string)}</span>
      <span style={{ fontSize: 20 }}>{record.hhmm}</span>
    </Space>}
  >
    {record.client.firstName + ' ' + record.client.lastName}
  </List.Item>
})