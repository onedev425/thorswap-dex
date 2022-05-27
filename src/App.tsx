import { Provider as ReduxProvider } from 'react-redux'

import { ThemeProvider } from 'components/Theme/ThemeContext'

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
