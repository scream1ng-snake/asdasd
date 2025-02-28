import { useEffect, useState } from "react";

export const DeviceTypes = {
  desktop: 'desktop',
  tablet: 'tablet',
  mobile: 'mobile' 
} as const
export type DeviceType = typeof DeviceTypes[keyof typeof DeviceTypes]
export const useDeviceType = () => {  
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop')  
  
  const getDeviceType = () => {  
    const width = window.innerWidth;  
    if (width < 768) {  
      setDeviceType('mobile');  
    } else if (width >= 768 && width < 1024) {  
      setDeviceType('tablet');  
    } else {  
      setDeviceType('desktop');  
    }  
  }

  useEffect(() => {
    getDeviceType() 
    window.addEventListener('resize', getDeviceType);  
    return () => window.removeEventListener('resize', getDeviceType);  
  }, [])
  return deviceType
};  