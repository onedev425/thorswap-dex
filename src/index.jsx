import { StrictMode } from 'react'

import ReactDOM from 'react-dom'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

import './index.css'
import App from './App'

dayjs.extend(duration)

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root'),
)
