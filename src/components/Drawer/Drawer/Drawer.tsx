import { ReactNode, useRef } from 'react'

import useOnClickOutside from '../../../hooks/useClickOutside'
import { useToggle } from '../../../hooks/useDrawer'

type Props = {
  children: ReactNode
}

export const Drawer = ({ children }: Props) => {
  const [, setOnOff] = useToggle()
  const drawerRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(drawerRef, () => setOnOff())
  return (
    <div
      ref={drawerRef}
      className="overflow-y-auto animate-slide-left	dark:bg-dark-bg-secondary h-full fixed right-0 z-10 w-[440px] shadow-inner shadow-2xl rounded-l-[40px] py-[40px]"
    >
      {children}
    </div>
  )
}
