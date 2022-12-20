import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ColorModeScript } from '@chakra-ui/react'

import './index.css';

import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <>
    <StrictMode>
      <ColorModeScript />
      <App />
    </StrictMode>
  </>,
);
