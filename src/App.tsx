import { Provider as ReduxProvider } from 'react-redux'

import { TooltipPortal } from 'components/Atomic'
import { ThemeProvider } from 'components/Theme/ThemeContext'
import { ToastPortal } from 'components/Toast'

import { store as reduxStore } from 'store/store'

import { useGlobalRefresh } from 'hooks/useGlobalRefresh'

import DrawerProvider from './hooks/useWalletDrawer'
import Router from './router'

const MainApp = () => {
  useGlobalRefresh()

  return (
    <div className="overflow-x-hidden">
      <div id="headlessui-portal-root" />

      <DrawerProvider>
        <Router />
      </DrawerProvider>

      <TooltipPortal />
      <ToastPortal />
    </div>
  )
}

function App() {
  return (
    <ReduxProvider store={reduxStore}>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </ReduxProvider>
  )
}

export default App
