import { ThemeProvider } from 'components/Theme/ThemeContext'
import { ToastPortal } from 'components/Toast'
import { TooltipPortal } from 'components/Tooltip'

import Router from './router'

function App() {
  return (
    <ThemeProvider>
      <div className="bg-light-bg-primary dark:bg-dark-bg-primary">
        <Router />
        <TooltipPortal />
        <ToastPortal />
      </div>
    </ThemeProvider>
  )
}

export default App
