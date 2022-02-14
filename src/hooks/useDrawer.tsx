import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react'

export const ToggleContext = createContext([false, () => {}])

type Props = {
  children?: ReactNode
}

const DrawerProvider = ({ children }: Props) => {
  const [onOff, setOnOff] = useState(false)

  const toggle = useCallback(() => {
    setOnOff(!onOff)
  }, [setOnOff, onOff])

  return (
    <ToggleContext.Provider value={[onOff, toggle]}>
      {children}
    </ToggleContext.Provider>
  )
}

export const useToggle = () => {
  const [onOff, toggle] = useContext(ToggleContext)
  return [onOff, toggle] as [boolean, () => void]
}

export default DrawerProvider
