/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

export const WalletDrawerContext = createContext([
  false,
  (_visible: boolean) => {},
  () => {},
])

type Props = {
  children?: ReactNode
}

const WalletDrawerProvider = ({ children }: Props) => {
  const [isOpened, setIsOpened] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isOpened ? 'hidden' : 'unset'
  }, [isOpened])

  const toggle = useCallback(() => {
    setIsOpened((v) => !v)
  }, [])

  const setIsDrawerVisible = useCallback((visible: boolean) => {
    setIsOpened(visible)
  }, [])

  return (
    <WalletDrawerContext.Provider
      value={[isOpened, setIsDrawerVisible, toggle]}
    >
      {children}
    </WalletDrawerContext.Provider>
  )
}

export const useWalletDrawer = () => {
  const [isVisible, setIsDrawerVisible, onToggle] =
    useContext(WalletDrawerContext)

  return { isVisible, setIsDrawerVisible, onToggle } as {
    isVisible: boolean
    setIsDrawerVisible: (visible: boolean) => void
    onToggle: () => void
  }
}

export default WalletDrawerProvider
