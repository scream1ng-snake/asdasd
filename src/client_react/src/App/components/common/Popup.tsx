import { CenterPopup, Popup } from "antd-mobile";
import { CSSProperties, FC, ReactNode } from "react";
import { useDeviceType } from "../../hooks";
import { Close } from "./Close";
const defaultStyles = {
  mobile: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden'
  },
  other: {
    borderRadius: 20,
    overflow: 'hidden'
  },
}

interface Props {
  visible: boolean
  bodyStyle?: CSSProperties
  onClose?: () => void
  children: ReactNode
  noCloseBtn?: boolean,
  bodyClassName?: string,
  mobileBodyStyle?: CSSProperties,
  desktopBodyStyle?: CSSProperties,
}
const AdaptivePopup: FC<Props> = props => {
  const device = useDeviceType()
  if (device === 'mobile') {
    return <Popup
      closeOnSwipe
      closeOnMaskClick
      showCloseButton={!props.noCloseBtn}
      visible={props.visible}
      bodyStyle={{
        ...defaultStyles.mobile,
        ...props.bodyStyle,
        ...props.mobileBodyStyle
      }}
      onClose={props.onClose}
      maskClassName="d-xs-block d-sm-none"
      bodyClassName={`d-xs-block d-sm-none ${props.bodyClassName || ''}`}
      disableBodyScroll
      closeIcon={<Close />}
    >
      {props.children}
    </Popup>
  } else {
    return <CenterPopup
      maskClassName="d-none d-sm-block"
      bodyClassName={`d-none d-sm-block ${props.bodyClassName || ''}`}
      closeOnMaskClick
      showCloseButton={!props.noCloseBtn}
      visible={props.visible}
      bodyStyle={{
        ...defaultStyles.other,
        ...props.bodyStyle,
        ...props.desktopBodyStyle
      }}
      onClose={props.onClose}
      disableBodyScroll
      getContainer={document.body}
      closeIcon={<Close />}
    >
      {props.children}
    </CenterPopup>
  }
}

export default AdaptivePopup