import { CSSProperties, FC, ReactNode } from 'react'
import { themeVars } from '../../theme/theme';
const Wrapper: FC<{ children: ReactNode, styles?: CSSProperties }> = props => 
  <div 
    style={{
      background: themeVars.tgSecondaryBgColor,
      width: '100%',
      height: '100%',
      overflowY: 'scroll',
      ...props.styles
    }}
  >
    {props.children}
  </div>

export default Wrapper;