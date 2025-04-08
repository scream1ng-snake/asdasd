import { observer } from "mobx-react-lite";
import { FC, useRef, useState } from "react";
import Wrapper from "../components/layout/Wrapper";
import { Col, Container, Row } from "react-bootstrap";
import { Button, CapsuleTabs, Card, Dialog, Empty, Form, Input, InputRef, List, NoticeBar, Space, Toast } from "antd-mobile";
import { useStore } from "../hooks";
import { Toasts } from "../components";
import { rusWeekDays, weekDays } from "../utils";
import AdaptivePopup from "../components/common/Popup";
import { Slot } from "../../../../entities/schedule.entity";
import { v4 } from "uuid";
import { BookForMaster } from "../components/common/Book";
import Booking from "../../../../entities/booking.entity";

export const AdminPage: FC = observer(() => {
  const { auth, admin } = useStore()

  let plannedBookings: Booking[] = []
  let pastBookings: Booking[] = []
  auth.user?.books.forEach(book => {
    Date.now() < new Date(book.date).getTime()
      ? plannedBookings.push(book)
      : pastBookings.push(book)
  })
  return <Wrapper>
    <EditSchedule />
    <Container className="p-0">
      <Toasts className="mt-3" />
      <CapsuleTabs defaultActiveKey='schedule' className="cfg">
        <CapsuleTabs.Tab title='Расписание' key='schedule'>
          {!admin.editingSchedule
            ? <NoticeBar
              color='info'
              shape='rounded'
              icon={null}
              className="pt-2 pb-2"
              style={{ "--height": 'auto' }}
              content='Вы еще не создали расписание'
              extra={
                <Button color='primary' shape='rounded' fill='outline' onClick={admin.createEmptySchedule}>
                  Создать ?
                </Button>
              }
            />
            : <Row>
              {weekDays.map(dayOfWeek =>
                <Col key={dayOfWeek} className="mb-3">
                  <Card
                    title={rusWeekDays[dayOfWeek]}
                    onClick={() => admin.editScheduleDay(dayOfWeek)}
                    bodyClassName="p-0"
                  >
                    {!auth.user!.schedule?.[dayOfWeek].length
                      ? <Empty description='Пусто' />
                      : null
                    }
                    <Space wrap justify='center' className="mt-2 mb-2">
                      {!auth.user!.schedule?.[dayOfWeek].length
                        ? null
                        : auth.user!.schedule![dayOfWeek].map(slot =>
                          <Button
                            key={slot.id}
                            shape='rounded'
                            fill='outline'
                            size='small'
                          >
                            {slot.hhmm}
                          </Button>
                        )
                      }
                    </Space>
                  </Card>
                </Col>
              )}
            </Row>
          }
        </CapsuleTabs.Tab>
        <CapsuleTabs.Tab title='Брони' key='bookings'>
          <List style={{ borderRadius: 20, overflow: 'hidden' }}>
            {plannedBookings.map(pb => <BookForMaster key={pb.id} record={pb} />)}
          </List>
        </CapsuleTabs.Tab>
        <CapsuleTabs.Tab title='Статистика' key='stats'>
          2
        </CapsuleTabs.Tab>
      </CapsuleTabs>
    </Container>
  </Wrapper>
})



const EditSchedule: FC = observer(() => {
  const { admin } = useStore()
  function onAdd(slot: Slot) {
    if (!admin.editingSchedule) return
    if (!admin.selectedDay) return

    admin.editingSchedule[admin.selectedDay].push(slot)
    Toast.show("Слот создан")
  }

  function deleteSlot(slotId: UUID) {
    if (!admin.editingSchedule) return
    if (!admin.selectedDay) return

    const slots = admin.editingSchedule[admin.selectedDay]
    const targetSlot = slots.find(slot => slot.id === slotId)

    if (targetSlot) {
      const index = slots.indexOf(targetSlot)
      if (index >= 0) {
        slots.splice(index, 1)
        console.log("Слот удален")
      }
    }
  }


  return <AdaptivePopup
    visible={admin.editScheduleDayPopup.show}
    onClose={admin.editScheduleDayPopup.close}
  >
    <Card
      bodyClassName='pt-0'
      style={{
        maxHeight: '95vh'
      }}
      title={admin.selectedDay && rusWeekDays[admin.selectedDay]}
    >
      {!admin.editingSchedule?.[admin.selectedDay!]?.length
        ? <NoticeBar
          color='info'
          shape='rounded'
          icon={null}
          content='Пусто'
          className="mt-3"
        />
        : null
      }
      <Space wrap className="mt-2" justify='center'>
        {admin.editingSchedule && admin.selectedDay
          ? admin.editingSchedule[admin.selectedDay].map(slot => {
            return <Button
              key={slot.id}
              shape="rounded"
              fill="outline"
              onClick={() => {
                Dialog.alert({
                  closeOnMaskClick: true,
                  content: 'Удалить окошко?',
                  onConfirm() {
                    deleteSlot(slot.id)
                    Toast.show('Удалено')
                  },
                  confirmText: 'Удалить'
                })
              }}
            >
              {slot.hhmm}
            </Button>
          })
          : null
        }

        <Button
          color='primary'
          onClick={admin.addSlot.open}
          fill='outline'
          shape='rounded'
        >
          Добавить слот
        </Button>
      </Space>

      <Space style={{ width: '100%' }} justify="end" className="mt-3">
        <Button shape='rounded' color='default' onClick={admin.editScheduleDayPopup.close}>
          Закрыть
        </Button>
        <Button shape='rounded' color="primary" onClick={admin.saveSchedule}>
          Сохранить
        </Button>
      </Space>
    </Card>
    <AddSlot confirm={onAdd} />
  </AdaptivePopup>
})
var previousHhmmLength = 0
const AddSlot: FC<{ confirm: (slot: Slot) => void }> = observer(({ confirm }) => {
  const { admin } = useStore()
  const [form] = Form.useForm<Omit<Slot, 'id'>>()
  const fromRef = useRef<InputRef>(null)
  const toRef = useRef<InputRef>(null)
  const [errored, setErrored] = useState(false)

  // ввод с маской
  function inputHhmm(str: string) {
    let value: string = str.replace(/[^\d:]/g, '')
    const parts = value.split(':')
    if (parts[0]) parts[0] = parts[0].slice(0, 2)
    if (parts[1]) parts[1] = parts[1].slice(0, 2)
    if ((value.length === 2) && (value.length > previousHhmmLength)) {
      previousHhmmLength = value.length
      form.setFieldValue('hhmm', `${parts.join(':')}:`)
    } else {
      previousHhmmLength = value.length
      form.setFieldValue('hhmm', parts.join(':'))
    }

    if (str.length === 5) {
      if (admin.editingSchedule?.[admin.selectedDay!].find(slot => slot.hhmm === value)) {
        setErrored(true)
      } else {
        setErrored(false)
      }
    }
  }

  function onClose() {
    admin.addSlot.close()
    form.resetFields()
    previousHhmmLength = 0
  }


  function onConfirm() {
    const slot: Slot = {
      id: v4(),
      hhmm: form.getFieldValue('hhmm')
    }
    confirm(slot)
    onClose()
  }



  return <AdaptivePopup
    visible={admin.addSlot.show}
    onClose={onClose}
  >
    <Card title='Создать окошко' bodyClassName="pt-0">
      <Form
        form={form}
        layout='horizontal'
        initialValues={{ hhmm: '' }}
        onFinish={onConfirm}
      >
        <Form.Item
          name='hhmm'
          label={errored
            ? <span>
              {'Время '}
              <span style={{ color: 'var(--adm-color-danger)' }}>* Слот уже есть</span>
            </span>
            : 'Время'
          }

          rules={[
            {
              required: true,
              message: 'Обязательное поле',
              transform: inputHhmm
            }
          ]}
        >
          <Input
            type="tel"
            id="hhmm"
            maxLength={5}
            placeholder="00:00"
            ref={fromRef}
            autoFocus
          />
        </Form.Item>
      </Form>
      <Space style={{ width: '100%' }} justify='end'>
        <Button color='default' onClick={onClose} shape='rounded'>
          Закрыть
        </Button>
        <Button disabled={errored} color='primary' onClick={onConfirm} shape='rounded'>
          Создать
        </Button>
      </Space>
    </Card>
  </AdaptivePopup>
})