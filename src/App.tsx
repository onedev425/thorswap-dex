import { Provider as ReduxProvider } from 'react-redux'

import { ThemeProvider } from 'components/Theme/ThemeContext'
import { ToastPortal } from 'components/Toast'
import { TooltipPortal } from 'components/Tooltip'

import { store as reduxStore } from 'redux/store'

import { useGlobalRefresh } from 'hooks/useGlobalRefresh'

import Router from './router'

const MainApp = () => {
  useGlobalRefresh()

  return (
    <div className="bg-light-bg-primary dark:bg-dark-bg-primary overflow-x-hidden">
      <div id="headlessui-portal-root" />
      <Router />
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
