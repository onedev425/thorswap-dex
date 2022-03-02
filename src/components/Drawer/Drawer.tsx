import { ReactNode, useRef } from 'react'

import useOnClickOutside from 'hooks/useClickOutside'
import { useWalletDrawer } from 'hooks/useWalletDrawer'

type Props = {
  children: ReactNode
}

export const Drawer = ({ children }: Props) => {
  const drawerRef = useRef<HTMLDivElement>(null)
  const { onToggle } = useWalletDrawer()

  useOnClickOutside(drawerRef, onToggle)

  return (
    <div
      ref={drawerRef}
      className="overflow-y-auto animate-slide-left bg-light-bg-secondary dark:bg-dark-bg-secondary h-full fixed right-0 z-10 w-[350px] shadow-inner rounded-l-xl"
    >
      {children}
    </div>
  )
}
