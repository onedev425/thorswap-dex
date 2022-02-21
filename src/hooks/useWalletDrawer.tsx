import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

export const WalletDrawerContext = createContext([false, () => {}])

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

  return (
    <WalletDrawerContext.Provider value={[isOpened, toggle]}>
      {children}
    </WalletDrawerContext.Provider>
  )
}

export const useWalletDrawer = () => {
  const [isVisible, toggleVisibility] = useContext(WalletDrawerContext)
  return [isVisible, toggleVisibility] as [boolean, () => void]
}

export default WalletDrawerProvider
