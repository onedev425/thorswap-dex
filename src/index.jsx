import { StrictMode } from 'react'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { createRoot } from 'react-dom/client'

import './index.css'

import App from './App'

dayjs.extend(duration)

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
