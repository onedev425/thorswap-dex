import { ToastPortal } from 'components/Toast'
import { TooltipPortal } from 'components/Tooltip'

import Router from './router'

function App() {
  return (
    <div className="dark">
      <Router />
      <TooltipPortal />
      <ToastPortal />
    </div>
  )
}

export default App
