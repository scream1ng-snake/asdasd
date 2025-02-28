import { observer } from "mobx-react-lite";
import { CSSProperties, FC, useRef, useState } from "react";
import Wrapper from "../components/layout/Wrapper";
import { Col, Container, Row } from "react-bootstrap";
import { Button, CapsuleTabs, Card, Form, Input, InputRef, List, NoticeBar, Space } from "antd-mobile";
import { useStore } from "../hooks";
import { Toasts } from "../components";
import { rusWeekDays, weekDays } from "../utils";
import AdaptivePopup from "../components/common/Popup";
import { Slot } from "../../../../entities/schedule.entity";
import { v4 } from "uuid";

export const AdminPage: FC = observer(() => {
  const { auth, admin } = useStore()
  if (!auth.user) return <NotAuth />
  if (auth.user.role !== 'master') return <NotMaster />
  return <Wrapper>
    <EditSchedule />
    <Container>
      <Toasts className="mt-3" />
      <CapsuleTabs defaultActiveKey='schedule' className="cfg">
        <CapsuleTabs.Tab title='Расписание' key='schedule'>
          {!auth.user.schedule
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
                    <List>
                      {!auth.user!.schedule![dayOfWeek].length
                        ? <List.Item>Пусто</List.Item>
                        : auth.user!.schedule![dayOfWeek].map(slot =>
                          <List.Item key={slot.id} style={{ textWrap: 'nowrap' }}>
                            {slot.from + " - " + slot.to}
                          </List.Item>
                        )
                      }
                    </List>
                  </Card>
                </Col>
              )}
            </Row>
          }
        </CapsuleTabs.Tab>
        <CapsuleTabs.Tab title='Брони' key='bookings'>
          2
        </CapsuleTabs.Tab>
        <CapsuleTabs.Tab title='Статистика' key='stats'>
          2
        </CapsuleTabs.Tab>
      </CapsuleTabs>
    </Container>
  </Wrapper>
})

function NotAuth() {
  return <Wrapper>
    <Container>
      <NoticeBar
        className="mt-3"
        color='error'
        shape='rounded'
        icon={null}
        content='Не авторизован'
      />
    </Container>
  </Wrapper>
}
function NotMaster() {
  return <Wrapper>
    <Container>
      <NoticeBar
        className="mt-3"
        color='error'
        shape='rounded'
        icon={null}
        content='Вы не можете сюда заходить'
      />
    </Container>
  </Wrapper>
}


const EditSchedule: FC = observer(() => {
  const { admin } = useStore()
  function onAdd(slot: Slot) {
    if (!admin.editingSchedule) return
    if (!admin.selectedDay) return

    admin.editingSchedule[admin.selectedDay].push(slot)
    console.log("Слот создан")
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

  const atata: CSSProperties = {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
  return <AdaptivePopup
    visible={admin.editScheduleDayPopup.show}
    onClose={admin.editScheduleDayPopup.close}
  >
    <Card
      bodyClassName='pt-0'
      title={admin.selectedDay && rusWeekDays[admin.selectedDay]}
    >
      <List>
        {admin.editingSchedule && admin.selectedDay
          ? admin.editingSchedule[admin.selectedDay].map(slot => {
            return <List.Item key={slot.id}>
              <div style={atata}>
                {slot.from + " - " + slot.to}
                <div onClick={() => deleteSlot(slot.id)}>❌</div>
              </div>
            </List.Item>
          })
          : null
        }
        {!admin.editingSchedule![admin.selectedDay!]?.length
          ? <NoticeBar
            color='info'
            shape='rounded'
            icon={null}
            content={'Пусто'}
            className="mt-3 mb-3"
          />
          : null
        }
        <Button
          color='primary'
          onClick={admin.addSlot.open}
          fill='outline'
          className="w-100 mb-3"
          shape='rounded'
        >
          Добавить слот
        </Button>
      </List>
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
var previousFromLength = 0
var previousToLength = 0
const AddSlot: FC<{ confirm: (slot: Slot) => void }> = observer(({ confirm }) => {
  const { admin } = useStore()
  const [form] = Form.useForm<Omit<Slot, 'id'>>()
  const fromRef = useRef<InputRef>(null)
  const toRef = useRef<InputRef>(null)

  // ввод с маской
  function inputFrom(str: string) {
    let value: string = str.replace(/[^\d:]/g, '')
    const parts = value.split(':')
    if (parts[0]) parts[0] = parts[0].slice(0, 2)
    if (parts[1]) parts[1] = parts[1].slice(0, 2)
    if ((value.length === 2) && (value.length > previousFromLength)) {
      previousFromLength = value.length
      form.setFieldValue('from', `${parts.join(':')}:`)
    } else {
      previousFromLength = value.length
      form.setFieldValue('from', parts.join(':'))
    }
    if (str.length === 5) toRef.current?.focus()
  }

  function inputTo(str: string) {
    let value: string = str.replace(/[^\d:]/g, '')
    const parts = value.split(':')

    if (parts[0]) parts[0] = parts[0].slice(0, 2)
    if (parts[1]) parts[1] = parts[1].slice(0, 2)

    if ((value.length === 2) && (value.length > previousToLength)) {
      previousToLength = value.length
      form.setFieldValue('to', `${parts.join(':')}:`)
    } else {
      previousToLength = value.length
      form.setFieldValue('to', parts.join(':'))
    }
  }

  function onClose() {
    admin.addSlot.close()
    form.resetFields()
    previousFromLength = 0
    previousToLength = 0
  }


  function onConfirm() {
    const slot: Slot = {
      id: v4(),
      from: form.getFieldValue('from'),
      to: form.getFieldValue('to')
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
        initialValues={{ from: '', to: '' }}
        onFinish={onConfirm}
        footer={
          <Space style={{ width: '100%' }} justify='end'>
            <Button color='default' onClick={onClose} shape='rounded'>
              Закрыть
            </Button>
            <Button color='primary' onClick={onConfirm} shape='rounded'>
              Создать
            </Button>
          </Space>
        }
      >
        <Form.Item
          name='from'
          label='Начало'
          rules={[
            {
              required: true,
              message: 'Обязательное поле',
              transform: inputFrom
            }
          ]}
        >
          <Input
            type="tel"
            id="from"
            maxLength={5}
            placeholder="00:00"
            ref={fromRef}
            autoFocus
          />
        </Form.Item>
        <Form.Item
          name='to'
          label='Завершение'
          rules={[
            {
              required: true,
              message: 'Обязательное поле',
              transform: inputTo
            }
          ]}
        >
          <Input
            type="tel"
            id="to"
            ref={toRef}
            maxLength={5}
            placeholder="00:00"
          />
        </Form.Item>
      </Form>
    </Card>
  </AdaptivePopup>
})