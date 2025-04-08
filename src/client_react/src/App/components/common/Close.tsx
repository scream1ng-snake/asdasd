import { CloseOutline, LeftOutline } from "antd-mobile-icons";
import { CSSProperties, FC } from "react";

type Props = { 
  onClick?: () => any, 
  styles?: CSSProperties, 
  back?: boolean
}
export const Close: FC<Props> = p =>
  <div
    onClick={p?.onClick}
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 36,
      height: 36,
      borderRadius: 100,
      background: 'var(--tg-theme-bg-color)',
      border: '1px solid var(--tg-theme-text-color)',
      ...p.styles 
    }}
  >
    {p.back
      ? <LeftOutline style={{ fontSize: 18 }} />
      : <CloseOutline style={{ fontSize: 18 }} />
    }
  </div>

  