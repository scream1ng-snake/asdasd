import { observer } from "mobx-react-lite"
import { FC } from "react"
import { Container } from "react-bootstrap"
import { useStore } from "../../hooks"
import { NoticeBar, NoticeBarProps } from "antd-mobile"
const classes = {
  'success': 'success',
  'danger': 'error',
  'info': 'info',
}
export const Toasts: FC<{ className?: string }> = observer((props) => {
  const { toasts } = useStore()
  if(!toasts.messages.length) return null
  return <Container className={props.className}>
    {toasts.messages.map((msg, index, arr) =>
      <NoticeBar
        key={msg.message}
        color={classes[msg.type] as NoticeBarProps['color']}
        shape='rounded'
        bordered={false}
        icon={null}
        content={msg.message}
        className={index === arr.length - 1 
          ? "mb-0"
          : "mb-3"
        }
      />
    )}
  </Container>
})