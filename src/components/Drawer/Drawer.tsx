import { ReactNode, useRef } from 'react'

import useOnClickOutside from '../../hooks/useClickOutside'
import { useWalletDrawer } from '../../hooks/useWalletDrawer'

type Props = {
  children: ReactNode
}

export const Drawer = ({ children }: Props) => {
  const drawerRef = useRef<HTMLDivElement>(null)
  const [, toggle] = useWalletDrawer()
  useOnClickOutside(drawerRef, toggle)

  return (
    <div
      ref={drawerRef}
      className="overflow-y-auto animate-slide-left bg-light-bg-secondary dark:bg-dark-bg-secondary h-full fixed right-0 z-10 w-[300px] md:w-[440px] shadow-inner rounded-l-[40px] py-[40px]"
    >
      {children}
    </div>
  )
}
