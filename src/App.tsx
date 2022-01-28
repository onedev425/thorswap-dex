import { Button } from 'components/Button'
import { ToastPortal } from 'components/Toast'
import { TooltipPortal } from 'components/Tooltip'

import logo from './logo.svg'

import './App.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Button bgColor="purple" size="small" outline>
          Button Test
        </Button>
        <p className="bg-light-btn-secondary font-primary font-extralight">
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>

      <TooltipPortal />
      <ToastPortal />
    </div>
  )
}

export default App
