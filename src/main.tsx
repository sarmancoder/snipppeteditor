import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import RootComponent from './RootComponent';
import { Routes } from '@generouted/react-router';
// @ts-ignore
import { registerSW } from 'virtual:pwa-register'

registerSW({ immediate: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootComponent>
      <Routes />
    </RootComponent>
  </StrictMode>,
)
