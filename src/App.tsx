import { ToastPortal } from 'components/Toast'
import { TooltipPortal } from 'components/Tooltip'

import Router from './router'

function App() {
  return (
    <div className="dark">
      <div className="bg-light-bg-primary dark:bg-dark-bg-primary">
        <Router />
        <TooltipPortal />
        <ToastPortal />
      </div>
    </div>
  )
}

export default App
