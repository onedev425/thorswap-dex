import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

export const ToggleContext = createContext([false, () => {}])

type Props = {
  children?: ReactNode
}

const DrawerProvider = ({ children }: Props) => {
  const [isOpened, setIsOpened] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isOpened ? 'hidden' : 'unset'
  }, [isOpened])

  const toggle = useCallback(() => {
    setIsOpened((v) => !v)
  }, [])

  return (
    <ToggleContext.Provider value={[isOpened, toggle]}>
      {children}
    </ToggleContext.Provider>
  )
}

export const useToggle = () => {
  const [isOpened, toggle] = useContext(ToggleContext)
  return [isOpened, toggle] as [boolean, () => void]
}

export default DrawerProvider
