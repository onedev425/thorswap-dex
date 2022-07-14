import { Provider as ReduxProvider } from 'react-redux'

import { AnnouncementsProvider } from 'components/Announcements/AnnouncementsContext'
import { ThemeProvider } from 'components/Theme/ThemeContext'

import { store as reduxStore } from 'store/store'

import { useGlobalRefresh } from 'hooks/useGlobalRefresh'

import { checkOrigin } from './helpers/checkOrigin'
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
  if (!checkOrigin()) return null

  return (
    <ReduxProvider store={reduxStore}>
      <ThemeProvider>
        <AnnouncementsProvider>
          <MainApp />
        </AnnouncementsProvider>
      </ThemeProvider>
    </ReduxProvider>
  )
}

export default App
