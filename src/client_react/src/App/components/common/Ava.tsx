import { Image, Skeleton } from "antd-mobile"
type AvaProps = {
  src?: string | null
}
const avaStyle = {
  borderRadius: 100,
  border: '2px solid var(--adm-color-text-dark-solid)'
}

const bigAvaStyle = {
  ...avaStyle,
  width: 70,
  height: 70,
}
const smallAvaStyle = {
  ...avaStyle,
  width: 40,
  height: 40,
}

function Big({ src }: AvaProps) {
  return <Image
    src={src || ''}
    width={bigAvaStyle.width}
    height={bigAvaStyle.height}
    style={bigAvaStyle}
    placeholder={<Skeleton animated style={{ ...bigAvaStyle, border: 'none' }} />}
    fallback={<Skeleton style={{ ...bigAvaStyle, border: 'none' }} />}
  />
}
function Small({ src }: AvaProps) {
  return <Image
    src={src || ''}
    width={smallAvaStyle.width}
    height={smallAvaStyle.height}
    style={smallAvaStyle}
    placeholder={<Skeleton animated style={{ ...smallAvaStyle, border: 'none' }} />}
    fallback={<Skeleton style={{ ...smallAvaStyle, border: 'none' }} />}
  />
}

export const Ava = {
  big: Big,
  small: Small
}
